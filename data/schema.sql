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
