import { database } from '@/lib/server-runtime';
import { HistoryEntry } from '@/types';
import { getAllUniqueStationsForFuel } from '@/lib/station-cache';

export type HistoryCountry = 'de' | 'at';

/**
 * SQL fragment + params builder for filtering price_history / station_prices
 * by country. Austrian rows always carry a location_id starting with `at-`
 * (grid points and ad-hoc E-Control caches). Everything else is treated as
 * Germany. Returns clauses that can be combined into a WHERE list.
 */
function countryClause(country: HistoryCountry | undefined, nextParamIndex: number): { sql: string | null; params: string[] } {
  if (!country) return { sql: null, params: [] };
  if (country === 'at') {
    return { sql: `location_id LIKE $${nextParamIndex}`, params: ['at-%'] };
  }
  return { sql: `(location_id IS NOT NULL AND location_id NOT LIKE $${nextParamIndex})`, params: ['at-%'] };
}

type HistoryRow = { timestamp: Date; min_price: number; avg_price: number; max_price: number; station: string | null; num_stations: number | null; location_id: string | null };

function mapRows(rows: HistoryRow[]): HistoryEntry[] {
  return rows.map(row => ({
    timestamp: row.timestamp.toISOString(),
    min_price: Number(row.min_price),
    avg_price: Number(row.avg_price),
    max_price: Number(row.max_price),
    station: row.station || '',
    num_stations: row.num_stations ?? 0,
    location_id: row.location_id || undefined,
  }));
}

export async function readPriceHistoryByStation(stationName: string, stationId?: string, fuelType?: string): Promise<HistoryEntry[]> {
  // Query individual station prices from station_prices table (has ALL stations),
  // not price_history which only stores the cheapest station's name.
  // Prefer station_id (precise — Tankerkönig IDs are unique) so chains like
  // "JET TANKSTELLE" don't conflate rows from different real branches. Falls
  // back to name match when no ID is given (legacy rows have NULL station_id).
  // fuel_type filter is essential: without it, Diesel/E5/E10 rows for the same
  // station at the same timestamp get plotted as three interleaved points,
  // turning the chart into a saw-tooth. Legacy rows with NULL fuel_type are
  // included as a fallback so pre-backfill data still shows up.
  const idClause = stationId ? 'station_id = $1' : 'station_name = $1';
  const fuelClause = fuelType ? ' AND (fuel_type = $2 OR fuel_type IS NULL)' : '';
  const sql = `SELECT timestamp, price, station_name, location_id
       FROM station_prices
       WHERE ${idClause}${fuelClause}
       ORDER BY timestamp ASC`;
  const params: string[] = [stationId ?? stationName];
  if (fuelType) params.push(fuelType);
  const result = await database.query<{
    timestamp: Date;
    price: number;
    station_name: string;
    location_id: string | null;
  }>(sql, params);
  return result.rows.map(row => ({
    timestamp: row.timestamp.toISOString(),
    min_price: Number(row.price),
    avg_price: Number(row.price),
    max_price: Number(row.price),
    station: row.station_name,
    num_stations: 0,
    location_id: row.location_id || undefined,
  }));
}

export async function readPriceHistoryFromDatabase(
  locationId?: string,
  country?: HistoryCountry,
  sinceDays?: number,
): Promise<HistoryEntry[]> {
  const sinceClause = (sinceDays && sinceDays > 0)
    ? `timestamp >= NOW() - INTERVAL '${Math.floor(sinceDays)} days'`
    : '';

  if (locationId) {
    const clauses = ['location_id = $1'];
    if (sinceClause) clauses.push(sinceClause);
    const result = await database.query<HistoryRow>(
      `
        SELECT timestamp, min_price, avg_price, max_price, station, num_stations, location_id
        FROM price_history
        WHERE ${clauses.join(' AND ')}
        ORDER BY timestamp ASC
      `,
      [locationId]
    );
    return mapRows(result.rows);
  }

  const cc = countryClause(country, 1);
  const clauses: string[] = [];
  if (cc.sql) clauses.push(cc.sql);
  if (sinceClause) clauses.push(sinceClause);
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const result = await database.query<HistoryRow>(
    `
      SELECT timestamp, min_price, avg_price, max_price, station, num_stations, location_id
      FROM price_history
      ${where}
      ORDER BY timestamp ASC
    `,
    cc.params
  );
  return mapRows(result.rows);
}

export interface StationPriceRow {
  timestamp: string;
  station_name: string;
  station_brand: string;
  station_id?: string;
  price: number;
  location_id?: string;
}

export async function readStationPrices(
  locationId?: string,
  country?: HistoryCountry,
  sinceDays?: number,
): Promise<StationPriceRow[]> {
  const clauses: string[] = [];
  const params: (string | number)[] = [];
  if (locationId) {
    params.push(locationId);
    clauses.push(`location_id = $${params.length}`);
  } else {
    const cc = countryClause(country, params.length + 1);
    if (cc.sql) { params.push(...cc.params); clauses.push(cc.sql); }
  }
  if (sinceDays && sinceDays > 0) {
    clauses.push(`timestamp >= NOW() - INTERVAL '${Math.floor(sinceDays)} days'`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const result = await database.query<{
    timestamp: Date;
    station_name: string;
    station_brand: string;
    station_id: string | null;
    price: number;
    location_id: string | null;
  }>(
    `SELECT timestamp, station_name, station_brand, station_id, price, location_id
     FROM station_prices ${where}
     ORDER BY timestamp ASC`,
    params
  );
  return result.rows.map(r => ({
    timestamp: r.timestamp.toISOString(),
    station_name: r.station_name,
    station_brand: r.station_brand,
    station_id: r.station_id || undefined,
    price: Number(r.price),
    location_id: r.location_id || undefined,
  }));
}

export interface PriceExtreme {
  station_name: string;
  station_id?: string;
  station_brand?: string;
  price: number;
  timestamp: string;
}

export async function getPriceExtremes(locationId?: string, country?: HistoryCountry): Promise<{ cheapest: PriceExtreme | null; mostExpensive: PriceExtreme | null }> {
  const clauses: string[] = [];
  const params: (string | number)[] = [];
  if (locationId) {
    params.push(locationId);
    clauses.push(`location_id = $${params.length}`);
  } else {
    const cc = countryClause(country, params.length + 1);
    if (cc.sql) { params.push(...cc.params); clauses.push(cc.sql); }
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  type ExtremeRow = {
    station_name: string;
    station_id: string | null;
    station_brand: string | null;
    price: number;
    timestamp: Date;
  };

  const cheapestResult = await database.query<ExtremeRow>(
    `SELECT station_name, station_id, station_brand, price, timestamp FROM station_prices ${where} ORDER BY price ASC LIMIT 1`,
    params
  );

  const expensiveResult = await database.query<ExtremeRow>(
    `SELECT station_name, station_id, station_brand, price, timestamp FROM station_prices ${where} ORDER BY price DESC LIMIT 1`,
    params
  );

  const mapRow = (r: ExtremeRow): PriceExtreme => ({
    station_name: r.station_name,
    station_id: r.station_id || undefined,
    station_brand: r.station_brand || undefined,
    price: Number(r.price),
    timestamp: r.timestamp.toISOString(),
  });

  return {
    cheapest: cheapestResult.rows[0] ? mapRow(cheapestResult.rows[0]) : null,
    mostExpensive: expensiveResult.rows[0] ? mapRow(expensiveResult.rows[0]) : null,
  };
}

export interface PriceBand {
  p10: number;
  p50: number;
  p90: number;
  samples: number;
}

// Need ≥50 stations to make the percentile stable; below that the band
// would wobble too much for a heatmap.
const PRICE_BAND_MIN_SAMPLES = 50;
const PRICE_BAND_CACHE_TTL_MS = 60 * 1000;
const priceBandCache = new Map<string, { value: PriceBand | null; expiresAt: number }>();

// Same bounding box used by persistPriceSnapshot to split AT and DE.
function isInAustria(lat: number, lng: number): boolean {
  return lat >= 46.3 && lat <= 49.1 && lng >= 9.4 && lng <= 17.2;
}

function quantiles(sorted: number[]): { p10: number; p50: number; p90: number } {
  const quantile = (p: number) => {
    const idx = (sorted.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  };
  return { p10: quantile(0.1), p50: quantile(0.5), p90: quantile(0.9) };
}

/**
 * P10/P50/P90 of currently cached open-station prices, split by country and
 * fuel. Kept for callers that still want a national band; the heatmap
 * itself now uses {@link getRegionalPriceBand} so colours track local
 * market spreads instead of the national distribution.
 */
export async function getCountryPriceBand(country: HistoryCountry, fuel: string): Promise<PriceBand | null> {
  const key = `country:${country}:${fuel}`;
  const cached = priceBandCache.get(key);
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.value;

  const wantAustria = country === 'at';
  const prices: number[] = [];
  for (const s of getAllUniqueStationsForFuel(fuel)) {
    if (!s.isOpen || s.price == null || s.price <= 0) continue;
    if (!Number.isFinite(s.lat) || !Number.isFinite(s.lng)) continue;
    if (isInAustria(s.lat, s.lng) !== wantAustria) continue;
    prices.push(s.price);
  }
  prices.sort((a, b) => a - b);

  let band: PriceBand | null = null;
  if (prices.length >= PRICE_BAND_MIN_SAMPLES) {
    const { p10, p50, p90 } = quantiles(prices);
    if (p90 - p10 >= 0.02) band = { p10, p50, p90, samples: prices.length };
  }
  priceBandCache.set(key, { value: band, expiresAt: now + PRICE_BAND_CACHE_TTL_MS });
  return band;
}

// 50 km / 111 ≈ 0.45; round to 0.5° so widely-spaced clients in the same
// rough area share a cache slot but a real city-to-city move invalidates.
const REGIONAL_SNAP_DEG = 0.5;
const REGIONAL_MIN_SAMPLES = 25;
const EARTH_RADIUS_KM = 6371;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * P10/P50/P90 of open-station prices within `radiusKm` of (lat, lng) for
 * `fuel`. Anchor is snapped to {@link REGIONAL_SNAP_DEG} so adjacent map
 * positions hit the same cache slot and colour-jumps between nearby pans
 * are damped. Returns null if fewer than {@link REGIONAL_MIN_SAMPLES}
 * stations fall in the circle — frontend then renders neutral grey.
 */
export async function getRegionalPriceBand(lat: number, lng: number, radiusKm: number, fuel: string): Promise<PriceBand | null> {
  const snapLat = Math.round(lat / REGIONAL_SNAP_DEG) * REGIONAL_SNAP_DEG;
  const snapLng = Math.round(lng / REGIONAL_SNAP_DEG) * REGIONAL_SNAP_DEG;
  const r = Math.round(radiusKm);
  const key = `regional:${snapLat.toFixed(2)}:${snapLng.toFixed(2)}:${r}:${fuel}`;
  const cached = priceBandCache.get(key);
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.value;

  const prices: number[] = [];
  for (const s of getAllUniqueStationsForFuel(fuel)) {
    if (!s.isOpen || s.price == null || s.price <= 0) continue;
    if (!Number.isFinite(s.lat) || !Number.isFinite(s.lng)) continue;
    if (haversineKm(snapLat, snapLng, s.lat, s.lng) > radiusKm) continue;
    prices.push(s.price);
  }
  prices.sort((a, b) => a - b);

  let band: PriceBand | null = null;
  if (prices.length >= REGIONAL_MIN_SAMPLES) {
    const { p10, p50, p90 } = quantiles(prices);
    if (p90 - p10 >= 0.01) band = { p10, p50, p90, samples: prices.length };
  }
  priceBandCache.set(key, { value: band, expiresAt: now + PRICE_BAND_CACHE_TTL_MS });
  return band;
}

export async function getAvailableLocations(country?: HistoryCountry): Promise<string[]> {
  // `*-country` is a sentinel for country-wide aggregate rows (currently only
  // `at-country`, written by the scheduler since AT has no scan_locations).
  // Hide it from the picker so users still see only real locations and the
  // implicit "Alle Standorte" option.
  const clauses: string[] = ["location_id IS NOT NULL", "location_id NOT LIKE '%-country'"];
  const params: (string | number)[] = [];
  const cc = countryClause(country, params.length + 1);
  if (cc.sql) { params.push(...cc.params); clauses.push(cc.sql); }
  const result = await database.query<{ location_id: string }>(
    `SELECT DISTINCT location_id FROM price_history WHERE ${clauses.join(' AND ')} ORDER BY location_id`,
    params
  );
  return result.rows.map(r => r.location_id);
}
