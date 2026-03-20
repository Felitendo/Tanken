/**
 * In-memory cache of raw station data populated by the scheduler.
 * The /api/stations route reads from this instead of calling Tankerkönig directly.
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
  getCache().set(locationId, {
    ...data,
    timestamp: Date.now(),
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

/** Get all cached location entries (for debug / status). */
export function getAllCachedLocations(): Array<{ locationId: string; stationCount: number; timestamp: number }> {
  const result: Array<{ locationId: string; stationCount: number; timestamp: number }> = [];
  for (const [id, entry] of getCache()) {
    result.push({ locationId: id, stationCount: entry.stations.length, timestamp: entry.timestamp });
  }
  return result;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
