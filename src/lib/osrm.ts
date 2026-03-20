/**
 * OSRM table API client for computing driving distances
 * from a user's position to multiple petrol stations in a single request.
 * Falls back to beeline distances on any error.
 */

import { CachedStation } from '@/lib/station-cache';
import { fetchJson } from '@/lib/http';

const OSRM_BASE = 'https://router.project-osrm.org';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const COORD_PRECISION = 3; // round to ~111m grid

interface DistanceCacheEntry {
  distances: Map<string, number>; // stationId -> km
  timestamp: number;
}

const globalKey = '__tanken_osrm_cache' as const;
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

interface OsrmTableResponse {
  code?: string;
  distances?: (number | null)[][];
}

/**
 * Replace beeline `dist` on each station with the actual driving distance
 * from the OSRM table API. Returns stations unchanged on error.
 */
export async function enrichWithDrivingDistances(
  userLat: number,
  userLng: number,
  stations: CachedStation[],
): Promise<CachedStation[]> {
  if (!stations.length) return stations;

  evictStale();

  const key = cacheKey(userLat, userLng);
  const cached = getCache().get(key);
  if (cached) {
    return stations.map(s => ({
      ...s,
      dist: cached.distances.get(s.id) ?? s.dist,
    }));
  }

  try {
    // OSRM uses lng,lat order. First coordinate is the source (user).
    const coords = [`${userLng},${userLat}`, ...stations.map(s => `${s.lng},${s.lat}`)].join(';');
    const url = `${OSRM_BASE}/table/v1/driving/${coords}?sources=0&annotations=distance`;

    const { data } = await fetchJson<OsrmTableResponse>(url, {
      signal: AbortSignal.timeout(5000),
    });

    if (data.code !== 'Ok' || !data.distances?.[0]) {
      return stations.map(s => ({ ...s, distApprox: true }));
    }

    const row = data.distances[0]; // distances from source to each destination (meters)
    const distMap = new Map<string, number>();

    const enriched = stations.map((s, i) => {
      const meters = row[i + 1]; // +1 because index 0 is source-to-source
      if (meters != null) {
        const km = meters / 1000;
        distMap.set(s.id, km);
        return { ...s, dist: km, distApprox: false };
      }
      distMap.set(s.id, s.dist);
      return { ...s, distApprox: true };
    });

    getCache().set(key, { distances: distMap, timestamp: Date.now() });

    return enriched;
  } catch (e) {
    console.warn('[OSRM] Driving distance lookup failed, using beeline:', (e as Error).message);
    return stations.map(s => ({ ...s, distApprox: true }));
  }
}
