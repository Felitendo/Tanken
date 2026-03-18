export type FuelType = 'diesel' | 'e5' | 'e10';

export interface RepoThresholds {
  good_below_avg_cents: number;
  okay_below_avg_cents: number;
}

export interface RepoOidcConfig {
  issuer_url: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scope: string;
  username_claim: string;
  name: string;
}

export interface RepoSmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

export interface RepoAuthConfig {
  oidc: RepoOidcConfig;
}

export interface RepoConfig {
  api_key: string;
  fuel_type: FuelType;
  radius_km: number;
  thresholds: RepoThresholds;
  auth: RepoAuthConfig;
  smtp?: RepoSmtpConfig;
  session_secret?: string;
}

export interface RuntimeConfig {
  port: number;
  apiKey: string;
  databaseUrl: string;
  cookieName: string;
  sessionSecret: string;
  sessionTtlMs: number;
  oidcIssuerUrl: string;
  oidcClientId: string;
  oidcClientSecret: string;
  oidcRedirectUri: string;
  oidcScope: string;
  isProduction: boolean;
  paths: {
    rootDir: string;
    publicDir: string;
    dataDir: string;
    configDir: string;
    usersFile: string;
    alertsFile: string;
    sessionsFile: string;
    oauthStateFile: string;
    configFile: string;
    exampleConfigFile: string;
    historyFile: string;
  };
  repoConfig: RepoConfig;
}

export interface UserSettings {
  fuelType: FuelType;
  radiusKm: number;
  currentTab: string;
  theme?: 'auto' | 'light' | 'dark';
}

export interface PriceAlert {
  threshold: number;
  fuel: FuelType;
  enabled: boolean;
  channel: 'ntfy' | 'email';
  ntfyTopic?: string;
  email?: string;
  created: string;
  updated?: string;
}

export interface UserProfile {
  id: string;
  authProvider?: string;
  providerId?: string;
  roles?: string[];
  displayName?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  emailVerified?: boolean;
  photoUrl?: string;
  createdAt: string;
  updatedAt?: string;
  settings: UserSettings;
  alerts: {
    price?: PriceAlert;
  };
  localAuth?: {
    usernameLower: string;
    passwordHash: string;
  };
  oidc?: Record<string, unknown>;
}

export interface SanitizedUser {
  id: string;
  authProvider?: string;
  roles?: string[];
  displayName?: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  emailVerified: boolean;
  photoUrl: string;
  preferred_username: string;
  oidc: null | {
    preferred_username: string;
    sub: string;
    email: string;
  };
  settings: UserSettings;
  alerts: UserProfile['alerts'];
}

export interface UsersDb {
  users: Record<string, UserProfile>;
  _legacyAlertsMigrated?: boolean;
}

export interface SessionRecord {
  id: string;
  userId: string;
  authSource: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
}

export interface SessionsDb {
  sessions: Record<string, SessionRecord>;
}

export interface OAuthStateRecord {
  redirectAfter: string;
  codeVerifier: string;
  createdAt: number;
}

export interface OAuthStateDb {
  states: Record<string, OAuthStateRecord>;
}

export interface LegacyAlertRecord {
  threshold: number;
  fuel?: FuelType;
  created?: string;
  enabled?: boolean;
}

export type LegacyAlertsMap = Record<string, LegacyAlertRecord>;

export interface HistoryEntry {
  timestamp: string;
  min_price: number;
  avg_price: number;
  max_price: number;
  station: string;
  num_stations: number;
}

export interface HistoryStats {
  dayAvgs: Array<{ day: number; name: string; avg: number; count: number }>;
  hourAvgs: Array<{ hour: number; avg: number; count: number }>;
  stationRanking: Array<{ station: string; avg: number; min: number; count: number }>;
  overall: {
    lowest_ever: number;
    highest_ever: number;
    avg: number;
    entries: number;
  };
}

export interface PriceHistoryRow {
  timestamp: string;
  min_price: number;
  avg_price: number;
  max_price: number;
  station: string;
  num_stations: number;
}
