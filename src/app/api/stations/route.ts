import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runtimeConfig } from '@/lib/server-runtime';
import { findCachedStations, findNearbyCachedStations, getCachedStationsByLocation } from '@/lib/station-cache';
import { fetchStationsLive } from '@/lib/measure';
import { canMakeLiveCall, recordLiveCall } from '@/lib/rate-limit';
import { enrichWithDrivingDistances } from '@/lib/osrm';

export const runtime = 'nodejs';

const fuelTypeSchema = z.enum(['diesel', 'e5', 'e10']);

/**
 * Serves station data with a hybrid approach:
 * 1. If near a scanned location → cached data
 * 2. If far from scanned locations → live Tankerkönig API call with user's radius
 * 3. Fallback → closest cached data available
 */
export async function GET(request: NextRequest) {
  const lat = Number.parseFloat(request.nextUrl.searchParams.get('lat') ?? '') || 51.1657;
  const lng = Number.parseFloat(request.nextUrl.searchParams.get('lng') ?? '') || 10.4515;
  const fuelCandidate = request.nextUrl.searchParams.get('fuel');
  const fuel = fuelTypeSchema.safeParse(fuelCandidate).success ? fuelCandidate! : runtimeConfig.repoConfig.fuel_type;
  const rad = Math.max(1, Math.min(25, Number.parseFloat(
    request.nextUrl.searchParams.get('rad') ?? ''
  ) || runtimeConfig.repoConfig.radius_km));

  // If a specific location ID is requested, return its cached data
  const locationId = request.nextUrl.searchParams.get('location');
  if (locationId) {
    const cached = getCachedStationsByLocation(locationId);
    if (cached) {
      return NextResponse.json(cached.stations, { headers: { 'X-Cache': 'hit' } });
    }
    return NextResponse.json([], { headers: { 'X-Cache': 'miss' } });
  }

  // Try strict nearby cache (user is within range of a scanned location)
  const nearby = findNearbyCachedStations(lat, lng, fuel);
  if (nearby) {
    const enriched = await enrichWithDrivingDistances(lat, lng, nearby.stations);
    return NextResponse.json(enriched, { headers: { 'X-Cache': 'hit' } });
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
      const enriched = await enrichWithDrivingDistances(lat, lng, stations);
      return NextResponse.json(enriched, { headers: { 'X-Cache': 'live' } });
    }
  }

  // Fallback: return best available cached data (aggressive match)
  const fallback = findCachedStations(lat, lng, fuel);
  if (fallback) {
    const enriched = await enrichWithDrivingDistances(lat, lng, fallback.stations);
    return NextResponse.json(enriched, { headers: { 'X-Cache': 'fallback' } });
  }

  return NextResponse.json([], { headers: { 'X-Cache': 'miss' } });
}
