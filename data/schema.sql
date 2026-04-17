CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY,
  value_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  data_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  data_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS oauth_states (
  key TEXT PRIMARY KEY,
  data_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_history (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  min_price DOUBLE PRECISION,
  avg_price DOUBLE PRECISION,
  max_price DOUBLE PRECISION,
  station TEXT,
  num_stations INTEGER
);

CREATE INDEX IF NOT EXISTS idx_price_history_timestamp ON price_history(timestamp DESC);

-- Location-based scanning support
ALTER TABLE price_history ADD COLUMN IF NOT EXISTS location_id TEXT;
CREATE INDEX IF NOT EXISTS idx_price_history_location ON price_history(location_id, timestamp DESC);

-- Per-station price data (populated by scheduler scans)
CREATE TABLE IF NOT EXISTS station_prices (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  location_id TEXT,
  station_name TEXT NOT NULL,
  station_brand TEXT NOT NULL DEFAULT '',
  price DOUBLE PRECISION NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_station_prices_timestamp ON station_prices(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_station_prices_location ON station_prices(location_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_station_prices_name ON station_prices(station_name, timestamp DESC);

-- Persistent station cache (survives restarts, populated by admin scan locations + AT grid)
CREATE TABLE IF NOT EXISTS station_cache (
  location_id TEXT PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  radius_km DOUBLE PRECISION NOT NULL,
  fuel_type TEXT NOT NULL,
  stations JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin-curated scan locations (max 25 km radius — Tankerkönig list.php limit)
CREATE TABLE IF NOT EXISTS scan_locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'de',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  radius_km DOUBLE PRECISION NOT NULL CHECK (radius_km BETWEEN 1 AND 25),
  fuel_type TEXT NOT NULL DEFAULT 'diesel',
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT,
  source_request_id TEXT,
  last_scan_at TIMESTAMPTZ,
  last_scan_station_count INTEGER,
  last_scan_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scan_locations_enabled ON scan_locations(enabled);

-- User-submitted requests for new scan locations
CREATE TABLE IF NOT EXISTS location_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  radius_km DOUBLE PRECISION NOT NULL CHECK (radius_km BETWEEN 1 AND 25),
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','denied')),
  admin_note TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  resulting_location_id TEXT REFERENCES scan_locations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_location_requests_user ON location_requests(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_location_requests_status ON location_requests(status, created_at DESC);

-- Legacy dump-import cleanup (dump-import feature was removed)
DROP TABLE IF EXISTS known_stations;
DELETE FROM station_cache WHERE location_id LIKE 'de-import-%';
