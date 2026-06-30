import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runtimeConfig } from '@/lib/server-runtime';
import { getAllUniqueStationsForFuel, haversineKm, type CachedStation } from '@/lib/station-cache';

export const runtime = 'nodejs';

const fuelTypeSchema = z.enum(['diesel', 'e5', 'e10']);

const MAX_RESULTS = 8;

/**
 * Name/brand/place search across ALL cached stations, not just the ones in the
 * client's current viewport. The map search bar uses this so a station can be
 * found anywhere the scanner has data, even if it's off-screen.
 *
 * Tankerkönig/E-Control offer no name search, so the in-memory station cache
 * (every scanned location) is the only source. Public, no auth — same posture
 * as /api/stations.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = (params.get('q') ?? '').trim().toLowerCase();
  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const fuelCandidate = params.get('fuel');
  const fuel = fuelTypeSchema.safeParse(fuelCandidate).success
    ? fuelCandidate!
    : runtimeConfig.repoConfig.fuel_type;

  // Optional user position to turn the stored (scan-centre-relative) distance
  // into a beeline distance the user can actually act on.
  const userLat = Number.parseFloat(params.get('lat') ?? '');
  const userLng = Number.parseFloat(params.get('lng') ?? '');
  const hasUserPos = Number.isFinite(userLat) && Number.isFinite(userLng);

  const stations = getAllUniqueStationsForFuel(fuel)
    .filter((s) => s.price != null && s.price > 0);

  // Scoring mirrors the client's matchStationsByQuery so on- and off-screen
  // hits rank consistently.
  const scored: Array<{ station: CachedStation; score: number; dist: number | null }> = [];
  for (const s of stations) {
    const name = (s.name || '').toLowerCase();
    const brand = (s.brand || '').toLowerCase();
    const street = (s.street || '').toLowerCase();
    const place = (s.place || '').toLowerCase();
    let score = 0;
    if (brand && brand.startsWith(q)) score = 100;
    else if (name && name.startsWith(q)) score = 90;
    else if (brand && brand.includes(q)) score = 80;
    else if (name && name.includes(q)) score = 70;
    else if (street.includes(q)) score = 50;
    else if (place.includes(q)) score = 40;
    if (!score) continue;
    const dist = hasUserPos ? haversineKm(userLat, userLng, s.lat, s.lng) : null;
    scored.push({ station: s, score, dist });
  }

  scored.sort((a, b) => (b.score - a.score) || ((a.station.price ?? Infinity) - (b.station.price ?? Infinity)));

  const results = scored.slice(0, MAX_RESULTS).map(({ station, dist }) => ({
    ...station,
    // Beeline from the user, flagged approximate (no driving distance here).
    dist: dist != null ? dist : station.dist,
    distApprox: dist != null ? true : station.distApprox,
  }));

  return NextResponse.json(results);
}
