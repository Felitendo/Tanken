import fs from 'node:fs';
import { Pool, PoolClient, QueryResultRow } from 'pg';
import { RuntimeConfig } from '@/types';
import { loadJson } from '@/lib/files';
import { LegacyAlertsMap, OAuthStateDb, SessionsDb, UsersDb } from '@/types';

type DatabaseHandle = ReturnType<typeof createDatabaseInternal>;
let cachedDatabase: DatabaseHandle | null = null;

export function createDatabase(config: RuntimeConfig) {
  if (cachedDatabase) {
    return cachedDatabase;
  }

  cachedDatabase = createDatabaseInternal(config);
  return cachedDatabase;
}

function createDatabaseInternal(config: RuntimeConfig) {
  const pool = new Pool({
    connectionString: config.databaseUrl,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  let initPromise: Promise<void> | null = null;

  async function query<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []) {
    await ensureInitialized();
    return pool.query<T>(text, values);
  }

  async function ensureInitialized() {
    if (!initPromise) {
      initPromise = initialize().catch((error) => {
        initPromise = null;
        throw error;
      });
    }
    return initPromise;
  }

  async function initialize() {
    const client = await pool.connect();
    try {
      const schemaSql = fs.readFileSync(`${config.paths.dataDir}/schema.sql`, 'utf8');
      await client.query(schemaSql);
      await migrateLegacyData(client);
    } finally {
      client.release();
    }
  }

  async function migrateLegacyData(client: PoolClient) {
    const usersCount = Number((await client.query('SELECT COUNT(*)::int AS count FROM users')).rows[0]?.count ?? 0);
    const sessionsCount = Number((await client.query('SELECT COUNT(*)::int AS count FROM sessions')).rows[0]?.count ?? 0);
    const oauthCount = Number((await client.query('SELECT COUNT(*)::int AS count FROM oauth_states')).rows[0]?.count ?? 0);
    const historyCount = Number((await client.query('SELECT COUNT(*)::int AS count FROM price_history')).rows[0]?.count ?? 0);

    if (usersCount === 0) {
      const usersDb = loadJson<UsersDb>(config.paths.usersFile, { users: {} });
      const alerts = loadJson<LegacyAlertsMap>(config.paths.alertsFile, {});
      for (const [userId, user] of Object.entries(usersDb.users)) {
        const legacyAlert = alerts[userId];
        if (legacyAlert?.threshold && !user.alerts?.price) {
          user.alerts = user.alerts || {};
          user.alerts.price = {
            threshold: Number.parseFloat(String(legacyAlert.threshold)),
            fuel: legacyAlert.fuel === 'e5' || legacyAlert.fuel === 'e10' ? legacyAlert.fuel : config.repoConfig.fuel_type,
            enabled: legacyAlert.enabled !== false,
            channel: 'ntfy',
            created: legacyAlert.created || new Date().toISOString(),
            updated: legacyAlert.created || new Date().toISOString()
          };
        }

        await client.query(
          `
            INSERT INTO users (id, data_json, created_at, updated_at)
            VALUES ($1, $2::jsonb, COALESCE(($2::jsonb->>'createdAt')::timestamptz, NOW()), COALESCE(($2::jsonb->>'updatedAt')::timestamptz, NOW()))
            ON CONFLICT (id) DO UPDATE SET data_json = EXCLUDED.data_json, updated_at = EXCLUDED.updated_at
          `,
          [userId, JSON.stringify(user)]
        );
      }

      if (alerts.local) {
        await client.query(
          `
            INSERT INTO app_meta (key, value_json, updated_at)
            VALUES ('local_alert', $1::jsonb, NOW())
            ON CONFLICT (key) DO UPDATE SET value_json = EXCLUDED.value_json, updated_at = NOW()
          `,
          [JSON.stringify(alerts.local)]
        );
      }
    }

    if (sessionsCount === 0) {
      const sessionsDb = loadJson<SessionsDb>(config.paths.sessionsFile, { sessions: {} });
      for (const [sessionId, session] of Object.entries(sessionsDb.sessions)) {
        await client.query(
          `
            INSERT INTO sessions (id, data_json, created_at, updated_at)
            VALUES ($1, $2::jsonb, NOW(), NOW())
            ON CONFLICT (id) DO UPDATE SET data_json = EXCLUDED.data_json, updated_at = NOW()
          `,
          [sessionId, JSON.stringify(session)]
        );
      }
    }

    if (oauthCount === 0) {
      const oauthStateDb = loadJson<OAuthStateDb>(config.paths.oauthStateFile, { states: {} });
      for (const [key, state] of Object.entries(oauthStateDb.states)) {
        await client.query(
          `
            INSERT INTO oauth_states (key, data_json, created_at, updated_at)
            VALUES ($1, $2::jsonb, NOW(), NOW())
            ON CONFLICT (key) DO UPDATE SET data_json = EXCLUDED.data_json, updated_at = NOW()
          `,
          [key, JSON.stringify(state)]
        );
      }
    }

    // History is populated by the scheduled price fetcher — no seed data
  }

  return {
    pool,
    query,
    ensureInitialized
  };
}
