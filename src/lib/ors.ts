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
const ORS_DIRECTIONS_BASE = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const ROUTE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
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

// ─── Directions API (route geometry) ──────────────────────────────────

export interface RouteGeometry {
  /** [lng, lat] pairs in GeoJSON order. */
  coordinates: [number, number][];
  distanceKm: number;
  durationMin: number;
}

interface RouteCacheEntry {
  route: RouteGeometry;
  timestamp: number;
}

const routeCacheKey = '__tanken_ors_route_cache' as const;
const rg = globalThis as unknown as Record<string, Map<string, RouteCacheEntry>>;

function getRouteCache(): Map<string, RouteCacheEntry> {
  if (!rg[routeCacheKey]) rg[routeCacheKey] = new Map();
  return rg[routeCacheKey];
}

function routeCacheKeyFor(
  start: { lat: number; lng: number },
  dest: { lat: number; lng: number },
): string {
  return `${start.lat.toFixed(COORD_PRECISION)},${start.lng.toFixed(COORD_PRECISION)}→${dest.lat.toFixed(COORD_PRECISION)},${dest.lng.toFixed(COORD_PRECISION)}`;
}

function evictStaleRoutes(): void {
  const now = Date.now();
  for (const [key, entry] of getRouteCache()) {
    if (now - entry.timestamp > ROUTE_CACHE_TTL_MS) getRouteCache().delete(key);
  }
}

interface OrsDirectionsResponse {
  features?: Array<{
    geometry?: { coordinates?: [number, number][] };
    properties?: { summary?: { distance?: number; duration?: number } };
  }>;
}

/**
 * Fetch a driving route (polyline + summary) from ORS Directions API.
 * Returns null on any error so the caller can decide how to surface it.
 */
export async function fetchRoute(
  orsApiKey: string,
  start: { lat: number; lng: number },
  dest: { lat: number; lng: number },
): Promise<RouteGeometry | null> {
  if (!orsApiKey) return null;

  evictStaleRoutes();
  const key = routeCacheKeyFor(start, dest);
  const cached = getRouteCache().get(key);
  if (cached) return cached.route;

  try {
    const response = await fetch(ORS_DIRECTIONS_BASE, {
      method: 'POST',
      headers: {
        'Authorization': orsApiKey,
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json, application/geo+json',
      },
      body: JSON.stringify({
        coordinates: [[start.lng, start.lat], [dest.lng, dest.lat]],
        instructions: false,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn(`[ORS] Directions API responded ${response.status}`);
      return null;
    }

    const data: OrsDirectionsResponse = await response.json();
    const feat = data.features?.[0];
    const coords = feat?.geometry?.coordinates;
    const summary = feat?.properties?.summary;
    if (!coords || !coords.length || !summary) return null;

    const route: RouteGeometry = {
      coordinates: coords,
      distanceKm: (summary.distance ?? 0) / 1000,
      durationMin: (summary.duration ?? 0) / 60,
    };
    getRouteCache().set(key, { route, timestamp: Date.now() });
    return route;
  } catch (e) {
    console.warn('[ORS] Directions lookup failed:', (e as Error).message);
    return null;
  }
}
