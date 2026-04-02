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

  // Persist to database asynchronously (fire-and-forget)
  persistToDb(locationId, entry).catch(err => {
    console.error(`[StationCache] DB persist error for ${locationId}:`, err instanceof Error ? err.message : err);
  });
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

// ─── Database persistence ────────────────────────────────────────────

let _db: { query: (text: string, values?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> } | null = null;
let _dbResolved = false;

function getDb() {
  if (_dbResolved) return _db;
  _dbResolved = true;
  try {
    // Dynamic import to avoid circular dependency — server-runtime creates the db singleton
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { database } = require('@/lib/server-runtime');
    _db = database;
  } catch {
    _db = null;
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
