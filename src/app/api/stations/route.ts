import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runtimeConfig } from '@/lib/server-runtime';
import { findCachedStations, findNearbyCachedStations, getCachedStationsByLocation, findStationsInBounds, setCachedStations } from '@/lib/station-cache';
import { fetchStationsLive, fetchStationsEControl } from '@/lib/measure';
import { canMakeLiveCall, recordLiveCall } from '@/lib/rate-limit';
import { getScheduler } from '@/lib/scheduler';
import { enrichWithDrivingDistances } from '@/lib/ors';

export const runtime = 'nodejs';

const fuelTypeSchema = z.enum(['diesel', 'e5', 'e10']);

/**
 * Serves station data with a hybrid approach:
 * 1. If near a scanned location → cached data
 * 2. If far from scanned locations → live Tankerkönig API call with user's radius
 * 3. Fallback → closest cached data available
 *
 * When an ORS API key is configured, beeline distances are replaced with
 * actual driving distances via the OpenRouteService Matrix API (single request).
 */
export async function GET(request: NextRequest) {
  const rawLat = Number.parseFloat(request.nextUrl.searchParams.get('lat') ?? '');
  const rawLng = Number.parseFloat(request.nextUrl.searchParams.get('lng') ?? '');
  const lat = Number.isFinite(rawLat) && rawLat >= -90 && rawLat <= 90 ? rawLat : 51.1657;
  const lng = Number.isFinite(rawLng) && rawLng >= -180 && rawLng <= 180 ? rawLng : 10.4515;
  const fuelCandidate = request.nextUrl.searchParams.get('fuel');
  const fuel = fuelTypeSchema.safeParse(fuelCandidate).success ? fuelCandidate! : runtimeConfig.repoConfig.fuel_type;
  const rad = 25;
  const orsKey = runtimeConfig.orsApiKey;

  // If a specific location ID is requested, return its cached data.
  // DE scan caches stations per fuel (key `${loc.id}-${fuel}`); fall back to
  // the un-suffixed key so pre-multi-fuel cache entries still resolve.
  const locationId = request.nextUrl.searchParams.get('location');
  if (locationId) {
    const cached = getCachedStationsByLocation(`${locationId}-${fuel}`)
      ?? getCachedStationsByLocation(locationId);
    if (cached) {
      return NextResponse.json(cached.stations, { headers: { 'X-Cache': 'hit' } });
    }
    return NextResponse.json([], { headers: { 'X-Cache': 'miss' } });
  }

  // If bounds are provided, return all cached stations within the viewport
  const boundsParam = request.nextUrl.searchParams.get('bounds');
  if (boundsParam) {
    const parts = boundsParam.split(',').map(Number);
    if (parts.length === 4 && parts.every(n => !isNaN(n))) {
      const [south, west, north, east] = parts;
      const result = findStationsInBounds({ south, west, north, east }, fuel);
      if (result && result.stations.length > 0) {
        return NextResponse.json(result.stations, {
          headers: {
            'X-Cache': 'grid',
            'X-Data-Timestamp': new Date(result.oldestTimestamp).toISOString(),
            'X-Data-Age': String(Math.round((Date.now() - result.oldestTimestamp) / 1000)),
          },
        });
      }
      return NextResponse.json([], { headers: { 'X-Cache': 'miss' } });
    }
  }

  // Try strict nearby cache (user is within range of a scanned location)
  const nearby = findNearbyCachedStations(lat, lng, fuel);
  if (nearby) {
    const enriched = await enrichWithDrivingDistances(orsKey, lat, lng, nearby.stations);
    return NextResponse.json(enriched, {
      headers: {
        'X-Cache': 'hit',
        'X-Data-Timestamp': new Date(nearby.timestamp).toISOString(),
        'X-Data-Age': String(Math.round((Date.now() - nearby.timestamp) / 1000)),
      },
    });
  }

  // No nearby scanned data — try live API call with user's radius.
  // The AT bounding box also covers parts of southern Germany (Munich, Ulm,
  // Augsburg, Lindau), so we optimistically try E-Control first when inside
  // the box and fall through to Tankerkönig if it returns nothing.
  const maybeAustria = lat >= 46.3 && lat <= 49.1 && lng >= 9.4 && lng <= 17.2;
  if (maybeAustria) {
    const stations = await fetchStationsEControl({ lat, lng, fuelType: fuel });
    if (stations.length > 0) {
      const cacheId = `at-live-${lat.toFixed(2)}-${lng.toFixed(2)}`;
      setCachedStations(cacheId, { stations, lat, lng, radiusKm: rad, fuelType: fuel });
      const enriched = await enrichWithDrivingDistances(orsKey, lat, lng, stations);
      return NextResponse.json(enriched, { headers: { 'X-Cache': 'live-at' } });
    }
    // E-Control returned nothing → coordinates are likely in southern Germany.
    // Fall through to the Tankerkönig path below.
  }
  if (runtimeConfig.apiKey && canMakeLiveCall() && !getScheduler().de.scanning) {
    // Tankerkönig API (Germany) — skip when scanner is active to avoid 503 rate limits
    recordLiveCall();
    try {
      const stations = await fetchStationsLive({
        apiKey: runtimeConfig.apiKey,
        lat,
        lng,
        radiusKm: rad,
        fuelType: fuel,
      });
      if (stations.length > 0) {
        // Cache for future lookups and daily price updates
        const cacheId = `de-live-${lat.toFixed(2)}-${lng.toFixed(2)}`;
        setCachedStations(cacheId, { stations, lat, lng, radiusKm: rad, fuelType: fuel });
        const enriched = await enrichWithDrivingDistances(orsKey, lat, lng, stations);
        return NextResponse.json(enriched, { headers: { 'X-Cache': 'live' } });
      }
    } catch (err) {
      console.warn(`[stations] Tankerkönig live fetch failed for ${lat.toFixed(4)},${lng.toFixed(4)}: ${err instanceof Error ? err.message : err}`);
    }
  }

  // Fallback: return best available cached data (aggressive match)
  const fallback = findCachedStations(lat, lng, fuel);
  if (fallback) {
    const enriched = await enrichWithDrivingDistances(orsKey, lat, lng, fallback.stations);
    return NextResponse.json(enriched, { headers: { 'X-Cache': 'fallback' } });
  }

  return NextResponse.json([], { headers: { 'X-Cache': 'miss' } });
}
