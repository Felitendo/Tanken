/**
 * Station cache with in-memory lookups backed by PostgreSQL persistence.
 * The /api/stations route reads from this instead of calling Tankerkönig directly.
 * On startup, cached data is restored from the database so scans survive restarts.
 */

export interface CachedStation {
  id: string;
  name: string;
  brand: string;
  street: string;
  houseNumber: string;
  postCode: string;
  place: string;
  lat: number;
  lng: number;
  dist: number;
  distApprox?: boolean;
  price: number | null;
  isOpen: boolean;
}

interface LocationCache {
  stations: CachedStation[];
  lat: number;
  lng: number;
  radiusKm: number;
  fuelType: string;
  timestamp: number;
}

const cache = new Map<string, LocationCache>();

const globalKey = '__tanken_station_cache' as const;
const g = globalThis as unknown as Record<string, Map<string, LocationCache>>;

function getCache(): Map<string, LocationCache> {
  if (!g[globalKey]) {
    g[globalKey] = cache;
  }
  return g[globalKey];
}

/** Store station data for a scan location. Called by the scheduler after each scan. */
export function setCachedStations(locationId: string, data: {
  stations: CachedStation[];
  lat: number;
  lng: number;
  radiusKm: number;
  fuelType: string;
}): void {
  const entry: LocationCache = {
    ...data,
    timestamp: Date.now(),
  };
  getCache().set(locationId, entry);
  invalidateUniqueCount();

  schedulePersist(locationId, entry);
}

/** Get cached stations for a specific location ID. */
export function getCachedStationsByLocation(locationId: string): LocationCache | null {
  return getCache().get(locationId) ?? null;
}

/**
 * Find the best matching cached station data for given coordinates.
 * Returns the cache entry whose center is closest to the requested point,
 * as long as the requested point falls within the scan radius.
 */
export function findCachedStations(lat: number, lng: number, fuelType: string): LocationCache | null {
  let best: LocationCache | null = null;
  let bestDist = Infinity;
  let fallback: LocationCache | null = null;
  let fallbackDist = Infinity;

  for (const entry of getCache().values()) {
    const dist = haversineKm(lat, lng, entry.lat, entry.lng);

    // Prefer matching fuel type within radius
    if (entry.fuelType === fuelType && dist <= entry.radiusKm * 1.5 && dist < bestDist) {
      best = entry;
      bestDist = dist;
    }

    // Track closest entry of matching fuel type as fallback (no radius restriction)
    if (entry.fuelType === fuelType && dist < fallbackDist) {
      fallback = entry;
      fallbackDist = dist;
    }
  }

  // If no nearby match, return the closest matching fuel type cache
  // If no fuel type match at all, return the closest cache of any type
  if (best) return best;
  if (fallback) return fallback;

  // Last resort: return any cached data (different fuel type)
  let anyBest: LocationCache | null = null;
  let anyDist = Infinity;
  for (const entry of getCache().values()) {
    const dist = haversineKm(lat, lng, entry.lat, entry.lng);
    if (dist < anyDist) {
      anyBest = entry;
      anyDist = dist;
    }
  }
  return anyBest;
}

/**
 * Strict nearby lookup: only returns a cache entry if the requested point
 * falls within radiusKm * 1.5 of a scanned location with matching fuel type.
 * Returns null if no scanned location is nearby (triggers live API fallback).
 */
export function findNearbyCachedStations(lat: number, lng: number, fuelType: string): LocationCache | null {
  let best: LocationCache | null = null;
  let bestDist = Infinity;

  for (const entry of getCache().values()) {
    if (entry.fuelType !== fuelType) continue;
    const dist = haversineKm(lat, lng, entry.lat, entry.lng);
    if (dist <= entry.radiusKm * 1.5 && dist < bestDist) {
      best = entry;
      bestDist = dist;
    }
  }

  return best;
}

/** Clear all cached stations from memory and database. */
export async function clearAllCache(): Promise<void> {
  getCache().clear();
  invalidateUniqueCount();
  const db = getDb();
  if (db) {
    await db.query('DELETE FROM station_cache').catch(err => {
      console.error('[StationCache] DB clear error:', err instanceof Error ? err.message : err);
    });
  }
  console.log('[StationCache] Cache cleared (memory + database)');
}

/** Get all cached location entries (for debug / status). */
export function getAllCachedLocations(): Array<{ locationId: string; stationCount: number; timestamp: number }> {
  const result: Array<{ locationId: string; stationCount: number; timestamp: number }> = [];
  for (const [id, entry] of getCache()) {
    result.push({ locationId: id, stationCount: entry.stations.length, timestamp: entry.timestamp });
  }
  return result;
}

/**
 * Active "live" cache entries — i.e. on-demand fetches triggered by the
 * "Hier suchen" picker or the DE radius fallback. These are the entries
 * we expose to every client so a manual scan by one user spares the rest
 * a Tankerkönig roundtrip for the next 15 min.
 *
 * Entries are matched by location_id prefix (`de-live-` / `at-live-`)
 * and only returned while still within their TTL window.
 */
export function listActiveLiveScans(ttlMs: number): Array<{
  locationId: string;
  lat: number;
  lng: number;
  fuelType: string;
  stations: CachedStation[];
  createdAt: number;
  expiresAt: number;
}> {
  const now = Date.now();
  const cutoff = now - ttlMs;
  const out: Array<{
    locationId: string;
    lat: number;
    lng: number;
    fuelType: string;
    stations: CachedStation[];
    createdAt: number;
    expiresAt: number;
  }> = [];
  for (const [id, entry] of getCache()) {
    if (!id.startsWith('de-live-') && !id.startsWith('at-live-')) continue;
    if (entry.timestamp < cutoff) continue;
    out.push({
      locationId: id,
      lat: entry.lat,
      lng: entry.lng,
      fuelType: entry.fuelType,
      stations: entry.stations,
      createdAt: entry.timestamp,
      expiresAt: entry.timestamp + ttlMs,
    });
  }
  return out;
}

/** Count unique stations across all cached grid cells (cached for 30s). */
let _uniqueCount = 0;
let _uniqueCountTs = 0;
const UNIQUE_COUNT_TTL = 30_000;

export function countUniqueStations(): number {
  const now = Date.now();
  if (now - _uniqueCountTs < UNIQUE_COUNT_TTL) return _uniqueCount;
  const ids = new Set<string>();
  for (const entry of getCache().values()) {
    for (const s of entry.stations) {
      ids.add(s.id);
    }
  }
  _uniqueCount = ids.size;
  _uniqueCountTs = now;
  return _uniqueCount;
}

/** Invalidate the unique station count cache (called after cache changes). */
function invalidateUniqueCount(): void {
  _uniqueCountTs = 0;
}

/** Get all unique stations across all cached grid cells (newest data wins). */
export function getAllUniqueStations(): CachedStation[] {
  const map = new Map<string, { station: CachedStation; timestamp: number }>();
  for (const entry of getCache().values()) {
    for (const s of entry.stations) {
      const existing = map.get(s.id);
      if (!existing || entry.timestamp > existing.timestamp) {
        map.set(s.id, { station: s, timestamp: entry.timestamp });
      }
    }
  }
  return Array.from(map.values()).map(e => e.station);
}

/**
 * Like getAllUniqueStations, but only considers cache entries whose fuelType
 * matches. Needed by the route planner so a station's `price` reflects the
 * fuel the user actually asked about (a station can sit in multiple fuel
 * caches with different prices).
 */
export function getAllUniqueStationsForFuel(fuelType: string): CachedStation[] {
  const map = new Map<string, { station: CachedStation; timestamp: number }>();
  for (const entry of getCache().values()) {
    if (entry.fuelType !== fuelType) continue;
    for (const s of entry.stations) {
      const existing = map.get(s.id);
      if (!existing || entry.timestamp > existing.timestamp) {
        map.set(s.id, { station: s, timestamp: entry.timestamp });
      }
    }
  }
  return Array.from(map.values()).map(e => e.station);
}


/** Max age for station price history. */
const PRICE_HISTORY_RETENTION_DAYS = 30;

/**
 * Persist a price snapshot of all unique cached stations to station_prices.
 * Called once per scan cycle to build price history for charts.
 * Also cleans up entries older than PRICE_HISTORY_RETENTION_DAYS.
 */
export async function persistPriceSnapshot(): Promise<number> {
  const db = getDb();
  if (!db) return 0;

  // Clean up old history
  await db.query(
    `DELETE FROM station_prices WHERE timestamp < NOW() - ($1::int * INTERVAL '1 day')`,
    [PRICE_HISTORY_RETENTION_DAYS]
  ).catch(err => {
    console.error('[StationCache] History cleanup error:', err instanceof Error ? err.message : err);
  });

  const stations = getAllUniqueStations().filter(s => s.isOpen && s.price != null && s.price > 0);
  if (!stations.length) return 0;

  const timestamp = new Date().toISOString();
  const BATCH_SIZE = 5000; // ~5 params each → well within PG's 65535 param limit
  let written = 0;

  // Tag every snapshot row with a country sentinel so country-scoped history
  // queries can include them. Austrian rows ALWAYS get an `at-…` location_id
  // (matched by `LIKE 'at-%'`); German rows get `de-snapshot`.
  const isAustria = (lat: number, lng: number) =>
    lat >= 46.3 && lat <= 49.1 && lng >= 9.4 && lng <= 17.2;

  for (let i = 0; i < stations.length; i += BATCH_SIZE) {
    const batch = stations.slice(i, i + BATCH_SIZE);
    const values: string[] = [];
    const params: unknown[] = [];
    let idx = 1;
    for (const s of batch) {
      const locationId = isAustria(s.lat, s.lng) ? 'at-snapshot' : 'de-snapshot';
      values.push(`($${idx++}::timestamptz, $${idx++}, $${idx++}, $${idx++}, $${idx++})`);
      params.push(timestamp, locationId, s.name, s.brand, s.price);
    }
    await db.query(
      `INSERT INTO station_prices (timestamp, location_id, station_name, station_brand, price) VALUES ${values.join(', ')}`,
      params
    );
    written += batch.length;
  }

  console.log(`[StationCache] Persisted ${written} station prices to history`);
  return written;
}

/**
 * Find all cached stations within a bounding box.
 * Merges stations from overlapping grid cells and deduplicates by station ID.
 * Returns null if no cached data covers the requested area.
 */
export function findStationsInBounds(
  bounds: { north: number; south: number; east: number; west: number },
  fuelType: string,
): { stations: CachedStation[]; oldestTimestamp: number; newestTimestamp: number } | null {
  const merged = new Map<string, { station: CachedStation; timestamp: number }>();
  let oldest = Infinity;
  let newest = 0;
  let found = false;

  for (const entry of getCache().values()) {
    if (entry.fuelType !== fuelType) continue;
    // Include cache entries whose center + radius overlaps the bounding box
    const margin = entry.radiusKm / 111; // rough degree margin
    if (
      entry.lat + margin < bounds.south ||
      entry.lat - margin > bounds.north ||
      entry.lng + margin < bounds.west ||
      entry.lng - margin > bounds.east
    ) continue;

    found = true;
    if (entry.timestamp < oldest) oldest = entry.timestamp;
    if (entry.timestamp > newest) newest = entry.timestamp;

    for (const s of entry.stations) {
      // Only include stations actually within the viewport
      if (s.lat < bounds.south || s.lat > bounds.north || s.lng < bounds.west || s.lng > bounds.east) continue;
      const existing = merged.get(s.id);
      if (!existing || entry.timestamp > existing.timestamp) {
        merged.set(s.id, { station: s, timestamp: entry.timestamp });
      }
    }
  }

  if (!found) return null;
  return {
    stations: Array.from(merged.values()).map(e => e.station),
    oldestTimestamp: oldest === Infinity ? Date.now() : oldest,
    newestTimestamp: newest || Date.now(),
  };
}

/**
 * Update prices in the in-memory cache for a specific fuel type.
 *
 * Each cache entry holds prices for one fuel — if we applied a diesel price
 * dump to an e5 entry, we'd corrupt the displayed prices. So only entries
 * whose fuelType matches are touched.
 *
 * Returns number of station-entries updated (counting each cache slot
 * separately — one station may live in multiple locations' caches).
 */
export function updateCachedPricesForFuel(
  fuelType: string,
  priceMap: Map<string, { price: number | null; isOpen: boolean }>,
): number {
  let updated = 0;
  const now = Date.now();
  const c = getCache();
  for (const [locationId, entry] of c) {
    if (entry.fuelType !== fuelType) continue;
    let changed = false;
    for (const station of entry.stations) {
      const update = priceMap.get(station.id);
      if (update) {
        station.price = update.price;
        station.isOpen = update.isOpen;
        changed = true;
        updated++;
      }
    }
    if (changed) {
      entry.timestamp = now;
      schedulePersist(locationId, entry);
    }
  }
  invalidateUniqueCount();
  return updated;
}

/**
 * Collect all unique station IDs from DE admin-location caches.
 *
 * DE admin location cache keys are `${loc.id}-${fuel}` where loc.id starts
 * with `loc-` (see location-store.newId). We deliberately exclude:
 *  - AT grid entries (`at-…`)
 *  - Live/ad-hoc entries (`de-live-…`, `at-live-…`)
 *  - History snapshots (`de-snapshot`, `at-snapshot`)
 *
 * Used by the scheduler to feed prices.php batches during periodic refresh.
 */
export function getDeStationIds(): string[] {
  const ids = new Set<string>();
  for (const [locationId, entry] of getCache()) {
    if (!locationId.startsWith('loc-')) continue;
    for (const s of entry.stations) ids.add(s.id);
  }
  return Array.from(ids);
}

// ─── Database persistence ────────────────────────────────────────────

type DbHandle = { query: (text: string, values?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> };
let _db: DbHandle | null = null;

/** Set DB handle explicitly. Called from instrumentation.ts to avoid path-alias issues. */
export function initStationCacheDb(db: DbHandle): void {
  _db = db;
}

function getDb() {
  if (_db) return _db;
  // Fallback: lazy require (may fail if @/ path alias doesn't resolve at runtime)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { database } = require('@/lib/server-runtime');
    _db = database;
  } catch {
    // Caller (instrumentation.ts) should have called initStationCacheDb() already
  }
  return _db;
}

async function persistToDb(locationId: string, entry: LocationCache): Promise<void> {
  const db = getDb();
  if (!db) return;
  await db.query(
    `INSERT INTO station_cache (location_id, lat, lng, radius_km, fuel_type, stations, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, NOW())
     ON CONFLICT (location_id) DO UPDATE SET
       lat = EXCLUDED.lat, lng = EXCLUDED.lng, radius_km = EXCLUDED.radius_km,
       fuel_type = EXCLUDED.fuel_type, stations = EXCLUDED.stations, updated_at = NOW()`,
    [locationId, entry.lat, entry.lng, entry.radiusKm, entry.fuelType, JSON.stringify(entry.stations)]
  );
}

// Serialize DB writes per locationId so two rapid updates can't land out of
// order. Each key holds the tail promise of its write chain; new writes chain
// onto that tail and replace it.
const persistChains = new Map<string, Promise<void>>();

function schedulePersist(locationId: string, entry: LocationCache): void {
  const prev = persistChains.get(locationId) ?? Promise.resolve();
  const next = prev
    .catch(() => undefined)
    .then(() => persistToDb(locationId, entry))
    .catch(err => {
      console.error(`[StationCache] DB persist error for ${locationId}:`, err instanceof Error ? err.message : err);
    })
    .finally(() => {
      if (persistChains.get(locationId) === next) persistChains.delete(locationId);
    });
  persistChains.set(locationId, next);
}

/** Restore all cached stations from the database into memory. Called once at startup. */
export async function restoreCacheFromDb(): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  try {
    const { rows } = await db.query(
      `SELECT location_id, lat, lng, radius_km, fuel_type, stations,
              EXTRACT(EPOCH FROM updated_at) * 1000 AS ts
       FROM station_cache`
    );
    const c = getCache();
    let count = 0;
    for (const row of rows) {
      const stations: CachedStation[] = typeof row.stations === 'string'
        ? JSON.parse(row.stations as string)
        : row.stations as CachedStation[];
      c.set(row.location_id as string, {
        stations,
        lat: row.lat as number,
        lng: row.lng as number,
        radiusKm: row.radius_km as number,
        fuelType: row.fuel_type as string,
        timestamp: Math.round(row.ts as number),
      });
      count += stations.length;
    }
    console.log(`[StationCache] Restored ${rows.length} grid cells (${count} stations) from database`);
    return rows.length;
  } catch (err) {
    console.error('[StationCache] Failed to restore from DB:', err instanceof Error ? err.message : err);
    return 0;
  }
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
