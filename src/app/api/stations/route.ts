import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runtimeConfig } from '@/lib/server-runtime';
import { findCachedStations, getCachedStationsByLocation } from '@/lib/station-cache';

export const runtime = 'nodejs';

const fuelTypeSchema = z.enum(['diesel', 'e5', 'e10']);

/**
 * Serves station data from the in-memory cache populated by the scheduler.
 * Does NOT call the Tankerkönig API directly — all API calls go through
 * the scheduler's scan cycle to respect rate limits.
 */
export async function GET(request: NextRequest) {
  const lat = Number.parseFloat(request.nextUrl.searchParams.get('lat') ?? '') || 51.1657;
  const lng = Number.parseFloat(request.nextUrl.searchParams.get('lng') ?? '') || 10.4515;
  const fuelCandidate = request.nextUrl.searchParams.get('fuel');
  const fuel = fuelTypeSchema.safeParse(fuelCandidate).success ? fuelCandidate! : runtimeConfig.repoConfig.fuel_type;

  // If a specific location ID is requested, return its cached data
  const locationId = request.nextUrl.searchParams.get('location');
  if (locationId) {
    const cached = getCachedStationsByLocation(locationId);
    if (cached) {
      return NextResponse.json(cached.stations, { headers: { 'X-Cache': 'hit' } });
    }
    return NextResponse.json([], { headers: { 'X-Cache': 'miss' } });
  }

  // Otherwise find the best matching cache entry by proximity
  const cached = findCachedStations(lat, lng, fuel);
  if (cached) {
    return NextResponse.json(cached.stations, { headers: { 'X-Cache': 'hit' } });
  }

  // No cached data available — the scheduler hasn't scanned yet or no locations configured
  return NextResponse.json([], { headers: { 'X-Cache': 'miss' } });
}
