import crypto from 'node:crypto';
import { createDatabase } from '@/lib/db';
import { RuntimeConfig, FuelType, OAuthStateRecord, PriceAlert, SanitizedUser, SessionRecord, UserProfile, UserSettings } from '@/types';

export interface UserStore {
  defaultSettings(): UserSettings;
  getUserById(userId: string | null | undefined): Promise<UserProfile | null>;
  findLocalUserByUsername(username: string): Promise<UserProfile | null>;
  countAdminUsers(): Promise<number>;
  upsertUser(userId: string, profile: Partial<UserProfile>): Promise<UserProfile>;
  updateUser(userId: string, updater: (user: UserProfile) => void): Promise<UserProfile | null>;
  getEffectiveUserProfile(user: UserProfile | null): { id: null; settings: UserSettings; alerts: UserProfile['alerts'] } | UserProfile;
  sanitizeUser(user: UserProfile | null): SanitizedUser | null;
  readLegacyAlert(userId: string): Promise<PriceAlert | null>;
  deleteLegacyAlert(userId: string): Promise<void>;
  readLocalAlert(): Promise<Record<string, unknown> | null>;
  writeLocalAlert(alert: Record<string, unknown>): Promise<Record<string, unknown>>;
  deleteLocalAlert(): Promise<void>;
}

export interface SessionStore {
  createSession(userId: string, authSource: string): Promise<SessionRecord>;
  destroySession(sessionId: string): Promise<void>;
  getSessionFromCookie(rawCookie: string | undefined): Promise<SessionRecord | null>;
  setSessionCookie(sessionId: string): string;
  clearSessionCookie(): string;
}

export interface OidcStateStore {
  stashOauthState(key: string, payload: OAuthStateRecord): Promise<void>;
  consumeOauthState(key: string): Promise<OAuthStateRecord | null>;
}

export function createStores(config: RuntimeConfig): {
  userStore: UserStore;
  sessionStore: SessionStore;
  oidcStateStore: OidcStateStore;
} {
  const db = createDatabase(config);

  const defaultSettings = (): UserSettings => ({
    fuelType: config.repoConfig.fuel_type,
    radiusKm: config.repoConfig.radius_km,
    activeLocation: Object.keys(config.repoConfig.locations)[0] ?? '',
    currentTab: 'map'
  });

  const userStore: UserStore = {
    defaultSettings,
    async getUserById(userId) {
      if (!userId) {
        return null;
      }

      const result = await db.query<{ data_json: UserProfile }>('SELECT data_json FROM users WHERE id = $1', [userId]);
      return result.rows[0]?.data_json ?? null;
    },
    async findLocalUserByUsername(username) {
      const normalized = username.trim().toLowerCase();
      if (!normalized) {
        return null;
      }

      const result = await db.query<{ data_json: UserProfile }>(
        `
          SELECT data_json
          FROM users
          WHERE data_json->>'authProvider' = 'local'
            AND data_json->'localAuth'->>'usernameLower' = $1
          LIMIT 1
        `,
        [normalized]
      );

      return result.rows[0]?.data_json ?? null;
    },
    async countAdminUsers() {
      const result = await db.query<{ count: number }>(
        `
          SELECT COUNT(*)::int AS count
          FROM users
          WHERE COALESCE(data_json->'roles', '[]'::jsonb) ? 'admin'
        `
      );

      return Number(result.rows[0]?.count ?? 0);
    },
    async upsertUser(userId, profile) {
      const existing = (await this.getUserById(userId)) ?? {
        id: userId,
        createdAt: new Date().toISOString(),
        settings: defaultSettings(),
        alerts: {}
      };

      const nextUser: UserProfile = {
        ...existing,
        ...profile,
        id: userId,
        settings: {
          ...defaultSettings(),
          ...(existing.settings ?? {}),
          ...(profile.settings ?? {})
        },
        alerts: {
          ...(existing.alerts ?? {}),
          ...(profile.alerts ?? {})
        },
        updatedAt: new Date().toISOString()
      };

      await db.query(
        `
          INSERT INTO users (id, data_json, created_at, updated_at)
          VALUES ($1, $2::jsonb, COALESCE(($2::jsonb->>'createdAt')::timestamptz, NOW()), COALESCE(($2::jsonb->>'updatedAt')::timestamptz, NOW()))
          ON CONFLICT (id) DO UPDATE SET data_json = EXCLUDED.data_json, updated_at = EXCLUDED.updated_at
        `,
        [userId, JSON.stringify(nextUser)]
      );

      return nextUser;
    },
    async updateUser(userId, updater) {
      const user = await this.getUserById(userId);
      if (!user) {
        return null;
      }

      updater(user);
      user.updatedAt = new Date().toISOString();
      await this.upsertUser(userId, user);
      return user;
    },
    getEffectiveUserProfile(user) {
      if (user) {
        return user;
      }

      return {
        id: null,
        settings: defaultSettings(),
        alerts: {}
      };
    },
    sanitizeUser(user) {
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        authProvider: user.authProvider,
        roles: user.roles || [],
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username || '',
        email: user.email || '',
        emailVerified: Boolean(user.emailVerified),
        photoUrl: user.photoUrl || '',
        preferred_username: user.username || '',
        oidc: user.oidc
          ? {
              preferred_username: String(user.oidc.preferred_username ?? ''),
              sub: String(user.oidc.sub ?? ''),
              email: String(user.oidc.email ?? '')
            }
          : null,
        settings: user.settings || defaultSettings(),
        alerts: user.alerts || {}
      };
    },
    async readLegacyAlert(userId) {
      const user = await this.getUserById(userId);
      return user?.alerts?.price ?? null;
    },
    async deleteLegacyAlert(userId) {
      await this.updateUser(userId, (user) => {
        user.alerts = user.alerts || {};
        delete user.alerts.price;
      });
    },
    async readLocalAlert() {
      const result = await db.query<{ value_json: Record<string, unknown> }>("SELECT value_json FROM app_meta WHERE key = 'local_alert'");
      return result.rows[0]?.value_json ?? null;
    },
    async writeLocalAlert(alert) {
      await db.query(
        `
          INSERT INTO app_meta (key, value_json, updated_at)
          VALUES ('local_alert', $1::jsonb, NOW())
          ON CONFLICT (key) DO UPDATE SET value_json = EXCLUDED.value_json, updated_at = NOW()
        `,
        [JSON.stringify(alert)]
      );
      return alert;
    },
    async deleteLocalAlert() {
      await db.query("DELETE FROM app_meta WHERE key = 'local_alert'");
    }
  };

  const signValue = (value: string): string =>
    crypto.createHmac('sha256', config.sessionSecret).update(value).digest('hex');

  const encodeSignedCookie = (sessionId: string): string => `${sessionId}.${signValue(sessionId)}`;

  const decodeSignedCookie = (raw: string | undefined): string | null => {
    if (!raw || !raw.includes('.')) {
      return null;
    }

    const dot = raw.lastIndexOf('.');
    const sessionId = raw.slice(0, dot);
    const signature = raw.slice(dot + 1);
    const expected = signValue(sessionId);

    if (signature.length !== expected.length) {
      return null;
    }

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) ? sessionId : null;
  };

  const sessionStore: SessionStore = {
    async createSession(userId, authSource) {
      const session: SessionRecord = {
        id: crypto.randomBytes(24).toString('base64url'),
        userId,
        authSource,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        expiresAt: Date.now() + config.sessionTtlMs
      };

      await db.query(
        `
          INSERT INTO sessions (id, data_json, created_at, updated_at)
          VALUES ($1, $2::jsonb, NOW(), NOW())
          ON CONFLICT (id) DO UPDATE SET data_json = EXCLUDED.data_json, updated_at = NOW()
        `,
        [session.id, JSON.stringify(session)]
      );

      return session;
    },
    async destroySession(sessionId) {
      await db.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
    },
    async getSessionFromCookie(rawCookie) {
      const id = decodeSignedCookie(rawCookie);
      if (!id) {
        return null;
      }

      const result = await db.query<{ data_json: SessionRecord }>('SELECT data_json FROM sessions WHERE id = $1', [id]);
      const session = result.rows[0]?.data_json ?? null;
      if (!session) {
        return null;
      }

      if (!session.expiresAt || session.expiresAt < Date.now()) {
        await this.destroySession(id);
        return null;
      }

      session.updatedAt = Date.now();
      session.expiresAt = Date.now() + config.sessionTtlMs;

      await db.query('UPDATE sessions SET data_json = $2::jsonb, updated_at = NOW() WHERE id = $1', [id, JSON.stringify(session)]);
      return session;
    },
    setSessionCookie(sessionId) {
      const parts = [
        `${config.cookieName}=${encodeURIComponent(encodeSignedCookie(sessionId))}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        `Max-Age=${Math.floor(config.sessionTtlMs / 1000)}`
      ];

      if (config.isProduction) {
        parts.push('Secure');
      }

      return parts.join('; ');
    },
    clearSessionCookie() {
      return `${config.cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
    }
  };

  const oidcStateStore: OidcStateStore = {
    async stashOauthState(key, payload) {
      await db.query(
        `
          INSERT INTO oauth_states (key, data_json, created_at, updated_at)
          VALUES ($1, $2::jsonb, NOW(), NOW())
          ON CONFLICT (key) DO UPDATE SET data_json = EXCLUDED.data_json, updated_at = NOW()
        `,
        [key, JSON.stringify(payload)]
      );

      await db.query(
        `
          DELETE FROM oauth_states
          WHERE COALESCE((data_json->>'createdAt')::bigint, 0) < $1
        `,
        [Date.now() - 1000 * 60 * 15]
      );
    },
    async consumeOauthState(key) {
      const result = await db.query<{ data_json: OAuthStateRecord }>('SELECT data_json FROM oauth_states WHERE key = $1', [key]);
      const value = result.rows[0]?.data_json ?? null;
      await db.query('DELETE FROM oauth_states WHERE key = $1', [key]);
      return value;
    }
  };

  return {
    userStore,
    sessionStore,
    oidcStateStore
  };
}

export function normalizeFuel(value: string): FuelType {
  return value === 'e5' || value === 'e10' ? value : 'diesel';
}
