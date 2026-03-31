import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runtimeConfig } from '@/lib/server-runtime';
import { findCachedStations, findNearbyCachedStations, getCachedStationsByLocation, findStationsInBounds } from '@/lib/station-cache';
import { fetchStationsLive } from '@/lib/measure';
import { canMakeLiveCall, recordLiveCall } from '@/lib/rate-limit';
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
  const lat = Number.parseFloat(request.nextUrl.searchParams.get('lat') ?? '') || 51.1657;
  const lng = Number.parseFloat(request.nextUrl.searchParams.get('lng') ?? '') || 10.4515;
  const fuelCandidate = request.nextUrl.searchParams.get('fuel');
  const fuel = fuelTypeSchema.safeParse(fuelCandidate).success ? fuelCandidate! : runtimeConfig.repoConfig.fuel_type;
  const rad = Math.max(1, Math.min(25, Number.parseFloat(
    request.nextUrl.searchParams.get('rad') ?? ''
  ) || runtimeConfig.repoConfig.radius_km));
  const orsKey = runtimeConfig.orsApiKey;

  // If a specific location ID is requested, return its cached data
  const locationId = request.nextUrl.searchParams.get('location');
  if (locationId) {
    const cached = getCachedStationsByLocation(locationId);
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

  // No nearby scanned data — try live API call with user's radius
  if (runtimeConfig.apiKey && canMakeLiveCall()) {
    recordLiveCall();
    const stations = await fetchStationsLive({
      apiKey: runtimeConfig.apiKey,
      lat,
      lng,
      radiusKm: rad,
      fuelType: fuel,
    });
    if (stations.length > 0) {
      const enriched = await enrichWithDrivingDistances(orsKey, lat, lng, stations);
      return NextResponse.json(enriched, { headers: { 'X-Cache': 'live' } });
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
