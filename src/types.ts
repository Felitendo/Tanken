export type FuelType = 'diesel' | 'e5' | 'e10';

export interface RepoThresholds {
  good_below_avg_cents: number;
  okay_below_avg_cents: number;
}

export interface RepoOidcConfig {
  issuer_url: string;
  client_id: string;
  client_secret: string;
  scope: string;
  username_claim: string;
  picture_claim: string;
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

export type ScanCountry = 'de' | 'at';

export interface ScanLocation {
  id: string;
  name: string;
  country: ScanCountry;
  lat: number;
  lng: number;
  radiusKm: number;
  fuelType: FuelType;
  enabled: boolean;
  createdBy: string | null;
  sourceRequestId: string | null;
  lastScanAt: string | null;
  lastScanStationCount: number | null;
  lastScanError: string | null;
  createdAt: string;
  updatedAt: string;
}

export type LocationRequestStatus = 'pending' | 'approved' | 'denied';

export interface LocationRequest {
  id: string;
  userId: string;
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
  note: string | null;
  status: LocationRequestStatus;
  adminNote: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  resultingLocationId: string | null;
  createdAt: string;
}

export interface LocationRequestWithUser extends LocationRequest {
  user: {
    id: string;
    displayName: string | null;
    email: string | null;
    photoUrl: string | null;
    authProvider: string | null;
  };
}

export interface RepoConfig {
  api_key: string;
  ors_api_key?: string;
  fuel_type: FuelType;
  radius_km: number;
  refresh_interval_minutes: number;
  thresholds: RepoThresholds;
  auth: RepoAuthConfig;
  smtp?: RepoSmtpConfig;
  session_secret?: string;
  session_ttl_days?: number;
}

export interface RuntimeConfig {
  port: number;
  apiKey: string;
  orsApiKey: string;
  databaseUrl: string;
  cookieName: string;
  sessionSecret: string;
  sessionTtlMs: number;
  oidcIssuerUrl: string;
  oidcClientId: string;
  oidcClientSecret: string;
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
  activeLocation?: string;
  lang?: string;
  contributorsOpen?: boolean;
  /** Default range for the per-station price chart: 1 = 24 h, 7 = 7 days. */
  historyDefaultDays?: 1 | 7;
}

export interface PriceAlert {
  threshold: number;
  fuel: FuelType;
  enabled: boolean;
  channel: 'ntfy' | 'email';
  ntfyTopic?: string;
  email?: string;
  /** Centre of the area the background evaluator monitors. */
  lat?: number;
  lng?: number;
  /** Radius around (lat, lng) to scan, in km. Defaults to 25 km when missing. */
  radiusKm?: number;
  /** Last notification metadata — used by the evaluator to dedupe alerts. */
  lastNotifiedAt?: string;
  lastNotifiedPrice?: number;
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
  favourites?: string[];
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
  favourites: string[];
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
  location_id?: string;
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
  location_id?: string;
}
