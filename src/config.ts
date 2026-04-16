import fs from 'node:fs';
import path from 'node:path';
import { FuelType, RepoAuthConfig, RepoConfig, RepoOidcConfig, RepoSmtpConfig, RuntimeConfig, ScanLocation } from './types';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const CONFIG_DIR = path.join(ROOT_DIR, 'config');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const EXAMPLE_CONFIG_FILE = path.join(ROOT_DIR, 'config.example.json');

const DEFAULT_REPO_CONFIG: RepoConfig = {
  api_key: '',
  fuel_type: 'diesel',
  radius_km: 10,
  refresh_interval_minutes: 60,
  thresholds: {
    good_below_avg_cents: 3,
    okay_below_avg_cents: 1
  },
  auth: {
    oidc: {
      issuer_url: '',
      client_id: '',
      client_secret: '',
      scope: 'openid profile email',
      username_claim: 'preferred_username',
      picture_claim: 'picture',
      name: ''
    }
  },
  smtp: {
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    from: ''
  }
};

function loadJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

function normalizeFuelType(value: unknown): FuelType {
  return value === 'e5' || value === 'e10' ? value : 'diesel';
}

function normalizeNumber(value: unknown, fallback: number): number {
  const parsed = Number.parseFloat(String(value ?? fallback));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeOidcConfig(value: Partial<RepoOidcConfig> | undefined, fallback: RepoOidcConfig): RepoOidcConfig {
  return {
    issuer_url: String(value?.issuer_url ?? fallback.issuer_url ?? ''),
    client_id: String(value?.client_id ?? fallback.client_id ?? ''),
    client_secret: String(value?.client_secret ?? fallback.client_secret ?? ''),
    scope: String(value?.scope ?? fallback.scope ?? DEFAULT_REPO_CONFIG.auth.oidc.scope),
    username_claim: String(value?.username_claim ?? fallback.username_claim ?? DEFAULT_REPO_CONFIG.auth.oidc.username_claim),
    picture_claim: String(value?.picture_claim ?? fallback.picture_claim ?? DEFAULT_REPO_CONFIG.auth.oidc.picture_claim),
    name: String(value?.name ?? fallback.name ?? DEFAULT_REPO_CONFIG.auth.oidc.name)
  };
}

function normalizeAuthConfig(value: Partial<RepoAuthConfig> | undefined, fallback: RepoAuthConfig): RepoAuthConfig {
  return {
    oidc: normalizeOidcConfig(value?.oidc, fallback.oidc)
  };
}

function normalizeLocations(value: unknown): ScanLocation[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((loc): loc is Record<string, unknown> => loc !== null && typeof loc === 'object' && typeof loc.id === 'string' && loc.id.length > 0)
    .map((loc) => ({
      id: String(loc.id),
      name: String(loc.name ?? ''),
      lat: Number(loc.lat) || 0,
      lng: Number(loc.lng) || 0,
      radius_km: Math.max(1, Math.min(25, Math.round(Number(loc.radius_km) || 10))),
      fuel_type: normalizeFuelType(loc.fuel_type),
    }));
}

function normalizeSmtpConfig(value: Partial<RepoSmtpConfig> | undefined, fallback: RepoSmtpConfig): RepoSmtpConfig {
  return {
    host: String(value?.host ?? fallback.host ?? ''),
    port: Math.max(1, Math.min(65535, Math.round(normalizeNumber(value?.port, fallback.port ?? 587)))),
    secure: typeof value?.secure === 'boolean' ? value.secure : (fallback.secure ?? false),
    user: String(value?.user ?? fallback.user ?? ''),
    pass: String(value?.pass ?? fallback.pass ?? ''),
    from: String(value?.from ?? fallback.from ?? '')
  };
}

export function normalizeRepoConfig(value: Partial<RepoConfig>, fallback: RepoConfig = DEFAULT_REPO_CONFIG): RepoConfig {
  return {
    ...DEFAULT_REPO_CONFIG,
    ...fallback,
    ...value,
    api_key: String(value.api_key ?? fallback.api_key ?? DEFAULT_REPO_CONFIG.api_key),
    ors_api_key: String(value.ors_api_key ?? fallback.ors_api_key ?? ''),
    fuel_type: normalizeFuelType(value.fuel_type ?? fallback.fuel_type ?? DEFAULT_REPO_CONFIG.fuel_type),
    radius_km: Math.max(1, Math.min(25, Math.round(normalizeNumber(value.radius_km, fallback.radius_km ?? DEFAULT_REPO_CONFIG.radius_km)))),
    refresh_interval_minutes: Math.max(1, Math.round(normalizeNumber(value.refresh_interval_minutes, fallback.refresh_interval_minutes ?? DEFAULT_REPO_CONFIG.refresh_interval_minutes))),
    thresholds: {
      good_below_avg_cents: Math.round(
        normalizeNumber(value.thresholds?.good_below_avg_cents, fallback.thresholds?.good_below_avg_cents ?? DEFAULT_REPO_CONFIG.thresholds.good_below_avg_cents)
      ),
      okay_below_avg_cents: Math.round(
        normalizeNumber(value.thresholds?.okay_below_avg_cents, fallback.thresholds?.okay_below_avg_cents ?? DEFAULT_REPO_CONFIG.thresholds.okay_below_avg_cents)
      )
    },
    auth: normalizeAuthConfig(value.auth, fallback.auth ?? DEFAULT_REPO_CONFIG.auth),
    smtp: normalizeSmtpConfig(value.smtp, fallback.smtp ?? DEFAULT_REPO_CONFIG.smtp!),
    session_secret: String(value.session_secret ?? fallback.session_secret ?? ''),
    session_ttl_days: Math.max(1, Math.min(365, Math.round(
      normalizeNumber(value.session_ttl_days, fallback.session_ttl_days ?? 90)
    ))),
    locations: normalizeLocations(value.locations ?? fallback.locations ?? [])
  };
}

export function loadRepoConfig(): RepoConfig {
  const exampleConfig = loadJsonFile<Partial<RepoConfig>>(EXAMPLE_CONFIG_FILE, DEFAULT_REPO_CONFIG);
  const fileConfig = loadJsonFile<Partial<RepoConfig>>(CONFIG_FILE, {});
  const baseConfig = normalizeRepoConfig(exampleConfig, DEFAULT_REPO_CONFIG);

  return normalizeRepoConfig(fileConfig, baseConfig);
}

export function saveRepoConfig(value: Partial<RepoConfig>): RepoConfig {
  const current = loadRepoConfig();
  const next = normalizeRepoConfig(value, current);
  fs.mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
  fs.writeFileSync(CONFIG_FILE, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  return next;
}

function parsePort(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function loadRuntimeConfig(): RuntimeConfig {
  const repoConfig = loadRepoConfig();
  const oidcConfig = repoConfig.auth.oidc;

  return {
    port: parsePort(process.env.PORT, 3847),
    apiKey: repoConfig.api_key || process.env.TANKERKOENIG_API_KEY || '',
    orsApiKey: repoConfig.ors_api_key || process.env.ORS_API_KEY || '',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tanken',
    cookieName: 'tank_session',
    sessionSecret: (() => {
      const secret = repoConfig.session_secret || process.env.TANKEN_SESSION_SECRET || process.env.SESSION_SECRET || 'CHANGE_ME_TANKEN_SESSION_SECRET';
      if (process.env.NODE_ENV === 'production' && (secret === 'CHANGE_ME_TANKEN_SESSION_SECRET' || secret === 'CHANGE_ME_LONG_RANDOM_SECRET')) {
        console.warn('[Config] ⚠ Using default session secret in production — set TANKEN_SESSION_SECRET or session_secret in config.json');
      }
      return secret;
    })(),
    sessionTtlMs: 1000 * 60 * 60 * 24 * (repoConfig.session_ttl_days ?? 90),
    oidcIssuerUrl: oidcConfig.issuer_url || process.env.OIDC_ISSUER_URL || '',
    oidcClientId: oidcConfig.client_id || process.env.OIDC_CLIENT_ID || '',
    oidcClientSecret: oidcConfig.client_secret || process.env.OIDC_CLIENT_SECRET || '',
    oidcScope: oidcConfig.scope || process.env.OIDC_SCOPE || 'openid profile email',
    isProduction: process.env.NODE_ENV === 'production',
    paths: {
      rootDir: ROOT_DIR,
      publicDir: PUBLIC_DIR,
      dataDir: DATA_DIR,
      configDir: CONFIG_DIR,
      usersFile: path.join(DATA_DIR, 'users.json'),
      alertsFile: path.join(DATA_DIR, 'alerts.json'),
      sessionsFile: path.join(DATA_DIR, 'sessions.json'),
      oauthStateFile: path.join(DATA_DIR, 'oauth-state.json'),
      configFile: CONFIG_FILE,
      exampleConfigFile: EXAMPLE_CONFIG_FILE,
      historyFile: path.join(DATA_DIR, 'price_history.csv')
    },
    repoConfig
  };
}
