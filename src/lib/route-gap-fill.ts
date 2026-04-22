/**
 * On-demand corridor fill for route searches.
 *
 * German coverage is built from admin-curated scan locations, which means a
 * Hamburg→Munich route typically crosses long un-scanned stretches. When the
 * user plans a route, we sample the polyline every ~40 km, identify gaps,
 * and issue live API calls (E-Control in AT, Tankerkönig list.php in DE) to
 * fill them. Results land in the standard `*-live-*` cache entries so a
 * second user planning the same route hits the cache.
 *
 * Budget-limited: hard cap of MAX_GAPS per request plus the global
 * canMakeLiveCall sliding window. For long routes we only fill the first few
 * gaps — still better than showing an empty corridor.
 */

import { samplePolylineByDistance } from '@/lib/route-corridor';
import {
  findNearbyCachedStations,
  setCachedStations,
  type CachedStation,
} from '@/lib/station-cache';
import { fetchStationsEControl, fetchStationsLive } from '@/lib/measure';
import { canMakeLiveCall, recordLiveCall } from '@/lib/rate-limit';

/** Sample spacing along the route. ~40 km ≈ half a 25-km scan radius. */
const SAMPLE_SPACING_KM = 40;

/** Radius used for live list.php / E-Control calls at each gap. */
const LIVE_CALL_RADIUS_KM = 25;

/**
 * Hard cap on live calls per route request. Keeps long routes from draining
 * the shared live-call budget (canMakeLiveCall allows 8 per 10 min globally).
 */
const MAX_GAPS_PER_REQUEST = 5;

/**
 * AT bounding box (also clips parts of southern Bavaria — we try E-Control
 * first there and fall through to Tankerkönig if the response is empty,
 * matching /api/stations behavior).
 */
function inAtBbox(lat: number, lng: number): boolean {
  return lat >= 46.3 && lat <= 49.1 && lng >= 9.4 && lng <= 17.2;
}

export interface RouteGapFillResult {
  sampledPoints: number;
  gapsIdentified: number;
  gapsFilled: number;
  rateLimited: boolean;
}

export async function fillRouteCorridorGaps(params: {
  apiKey: string | null;
  polyline: [number, number][];
  fuelType: string;
}): Promise<RouteGapFillResult> {
  const { apiKey, polyline, fuelType } = params;

  const samples = samplePolylineByDistance(polyline, SAMPLE_SPACING_KM);

  const gaps: [number, number][] = [];
  for (const [lng, lat] of samples) {
    if (findNearbyCachedStations(lat, lng, fuelType)) continue;
    gaps.push([lng, lat]);
    if (gaps.length >= MAX_GAPS_PER_REQUEST) break;
  }

  const result: RouteGapFillResult = {
    sampledPoints: samples.length,
    gapsIdentified: gaps.length,
    gapsFilled: 0,
    rateLimited: false,
  };
  if (gaps.length === 0) return result;

  // Sequential to keep memory of rate-limit state consistent across gaps.
  // Worst case 5 gaps × ~2 s = ~10 s — acceptable for a user-triggered action.
  for (const [lng, lat] of gaps) {
    let stations: CachedStation[] = [];
    let prefix: 'at-live' | 'de-live' | null = null;

    if (inAtBbox(lat, lng)) {
      stations = await fetchStationsEControl({ lat, lng, fuelType }).catch(() => [] as CachedStation[]);
      prefix = 'at-live';
    }

    // Not AT (or AT returned empty → southern Bavaria) → try Tankerkönig.
    if (stations.length === 0 && apiKey) {
      if (!canMakeLiveCall()) {
        result.rateLimited = true;
        continue;
      }
      recordLiveCall();
      try {
        stations = await fetchStationsLive({
          apiKey,
          lat,
          lng,
          radiusKm: LIVE_CALL_RADIUS_KM,
          fuelType,
        });
        prefix = 'de-live';
      } catch {
        stations = [];
      }
    }

    if (stations.length === 0 || !prefix) continue;

    const cacheId = `${prefix}-${lat.toFixed(2)}-${lng.toFixed(2)}`;
    setCachedStations(cacheId, {
      stations,
      lat,
      lng,
      radiusKm: LIVE_CALL_RADIUS_KM,
      fuelType,
    });
    result.gapsFilled++;
  }

  return result;
}
