/**
 * OpenRouteService Matrix API client for computing driving distances
 * from a user's position to multiple petrol stations in a single request.
 * Falls back to beeline distances (marked with distApprox) on any error.
 *
 * Free tier: 2000 requests/day, 40/minute — more than enough for this app.
 * Get a key at https://openrouteservice.org/dev/#/signup
 */

import { CachedStation } from '@/lib/station-cache';

const ORS_BASE = 'https://api.openrouteservice.org/v2/matrix/driving-car';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const COORD_PRECISION = 3; // round to ~111 m grid

interface DistanceCacheEntry {
  distances: Map<string, number>; // stationId -> km
  timestamp: number;
}

const globalKey = '__tanken_ors_cache' as const;
const g = globalThis as unknown as Record<string, Map<string, DistanceCacheEntry>>;

function getCache(): Map<string, DistanceCacheEntry> {
  if (!g[globalKey]) g[globalKey] = new Map();
  return g[globalKey];
}

function evictStale(): void {
  const now = Date.now();
  for (const [key, entry] of getCache()) {
    if (now - entry.timestamp > CACHE_TTL_MS) getCache().delete(key);
  }
}

function cacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(COORD_PRECISION)},${lng.toFixed(COORD_PRECISION)}`;
}

interface OrsMatrixResponse {
  distances?: number[][]; // meters; source→destination distances
}

/**
 * Replace beeline `dist` on each station with the actual driving distance
 * from the ORS Matrix API. Returns stations unchanged (with distApprox) on error.
 */
export async function enrichWithDrivingDistances(
  orsApiKey: string,
  userLat: number,
  userLng: number,
  stations: CachedStation[],
): Promise<CachedStation[]> {
  if (!stations.length) return stations;
  if (!orsApiKey) return stations.map(s => ({ ...s, distApprox: true }));

  evictStale();

  const key = cacheKey(userLat, userLng);
  const cached = getCache().get(key);
  if (cached) {
    return stations.map(s => {
      const km = cached.distances.get(s.id);
      return km != null
        ? { ...s, dist: km, distApprox: false }
        : { ...s, distApprox: true };
    });
  }

  try {
    // ORS uses [lng, lat] coordinate order.
    // First location is the user (source), rest are stations (destinations).
    const locations = [
      [userLng, userLat],
      ...stations.map(s => [s.lng, s.lat]),
    ];

    const response = await fetch(ORS_BASE, {
      method: 'POST',
      headers: {
        'Authorization': orsApiKey,
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        locations,
        sources: [0],
        destinations: stations.map((_, i) => i + 1),
        metrics: ['distance'],
        units: 'km',
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn(`[ORS] Matrix API responded ${response.status}`);
      return stations.map(s => ({ ...s, distApprox: true }));
    }

    const data: OrsMatrixResponse = await response.json();
    const row = data.distances?.[0]; // single source row

    if (!row) {
      return stations.map(s => ({ ...s, distApprox: true }));
    }

    const distMap = new Map<string, number>();
    const enriched = stations.map((s, i) => {
      const km = row[i];
      if (km != null && km >= 0) {
        distMap.set(s.id, km);
        return { ...s, dist: km, distApprox: false };
      }
      distMap.set(s.id, s.dist);
      return { ...s, distApprox: true };
    });

    getCache().set(key, { distances: distMap, timestamp: Date.now() });
    return enriched;
  } catch (e) {
    console.warn('[ORS] Driving distance lookup failed, using beeline:', (e as Error).message);
    return stations.map(s => ({ ...s, distApprox: true }));
  }
}
