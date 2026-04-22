import { NextRequest, NextResponse } from 'next/server';
import { listActiveLiveScans } from '@/lib/station-cache';

export const runtime = 'nodejs';

const TTL_MS = 60 * 60 * 1000;

/**
 * Returns the live (manual-scan / on-demand) cache entries that are still
 * inside their 1 h freshness window. Anyone hitting this endpoint can
 * piggy-back on someone else's recent scan and skip a Tankerkönig
 * roundtrip — the data is the same regardless of who triggered it.
 *
 * Optional ?fuel filter scopes the response to one fuel type so the client
 * can ask only for what it currently displays.
 */
export async function GET(request: NextRequest) {
  const fuelParam = request.nextUrl.searchParams.get('fuel');
  const fuel = fuelParam === 'diesel' || fuelParam === 'e5' || fuelParam === 'e10'
    ? fuelParam
    : null;

  let scans = listActiveLiveScans(TTL_MS);
  if (fuel) scans = scans.filter((s) => s.fuelType === fuel);

  return NextResponse.json({ ttlMs: TTL_MS, scans });
}
