import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runtimeConfig } from '@/lib/server-runtime';
import { getRequestContext } from '@/lib/request-context';
import { fetchRoute } from '@/lib/ors';
import { getAllUniqueStationsForFuel } from '@/lib/station-cache';
import { computeRouteScanPoints, filterStationsAlongRoute } from '@/lib/route-corridor';

export const runtime = 'nodejs';

const bodySchema = z.object({
  startLat: z.number().min(-90).max(90),
  startLng: z.number().min(-180).max(180),
  destLat: z.number().min(-90).max(90),
  destLng: z.number().min(-180).max(180),
  fuel: z.enum(['diesel', 'e5', 'e10']),
  bufferKm: z.number().min(0.5).max(20).optional(),
});

/**
 * Compute a driving route and return stations within a corridor around it.
 *
 * Coverage gaps along the route are NOT filled here — the client gets a list
 * of scan points (0–3 depending on route length) and drives the fills itself
 * via /api/route/scan-point, with a user-visible 30s cooldown between calls.
 * After each scan the client re-posts to this endpoint to get the updated
 * corridor from the now-warmer cache.
 *
 * Requires a configured ORS API key; there's no beeline fallback, per product
 * decision — a "route" without a real polyline would mislead the user.
 */
export async function POST(request: NextRequest) {
  const { user } = await getRequestContext(request);
  if (!user) {
    return NextResponse.json({ error: 'Anmeldung erforderlich.' }, { status: 401 });
  }

  const orsKey = runtimeConfig.orsApiKey;
  if (!orsKey) {
    return NextResponse.json(
      { error: 'Routenplanung nicht konfiguriert — bitte Admin um einen ORS API Key bitten.' },
      { status: 503 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Parameter.' }, { status: 400 });
  }
  const { startLat, startLng, destLat, destLng, fuel, bufferKm = 3 } = parsed.data;

  const route = await fetchRoute(orsKey, { lat: startLat, lng: startLng }, { lat: destLat, lng: destLng });
  if (!route) {
    return NextResponse.json(
      { error: 'Route konnte nicht berechnet werden.' },
      { status: 502 },
    );
  }

  const candidates = getAllUniqueStationsForFuel(fuel)
    .filter(s => s.isOpen && typeof s.price === 'number' && s.price > 0);

  const stations = filterStationsAlongRoute(candidates, route.coordinates, bufferKm);
  const scanPoints = computeRouteScanPoints(route.coordinates, route.distanceKm);

  return NextResponse.json({
    route: {
      coordinates: route.coordinates,
      distanceKm: route.distanceKm,
      durationMin: route.durationMin,
    },
    stations,
    bufferKm,
    scanPoints,
  });
}
