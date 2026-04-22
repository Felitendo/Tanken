import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runtimeConfig } from '@/lib/server-runtime';
import { getRequestContext } from '@/lib/request-context';
import { fetchRoute } from '@/lib/ors';
import { getAllUniqueStationsForFuel } from '@/lib/station-cache';
import { filterStationsAlongRoute } from '@/lib/route-corridor';
import { fillRouteCorridorGaps } from '@/lib/route-gap-fill';

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

  // Fill coverage gaps along the route before filtering — DE is only scanned
  // at admin-curated locations, so a long cross-country route typically hits
  // un-scanned stretches that would otherwise show an empty corridor.
  const gapFill = await fillRouteCorridorGaps({
    apiKey: runtimeConfig.apiKey,
    polyline: route.coordinates,
    fuelType: fuel,
  }).catch((err) => {
    console.error('[route] gap fill failed:', err instanceof Error ? err.message : err);
    return null;
  });

  const candidates = getAllUniqueStationsForFuel(fuel)
    .filter(s => s.isOpen && typeof s.price === 'number' && s.price > 0);

  const stations = filterStationsAlongRoute(candidates, route.coordinates, bufferKm);

  return NextResponse.json({
    route: {
      coordinates: route.coordinates,
      distanceKm: route.distanceKm,
      durationMin: route.durationMin,
    },
    stations,
    bufferKm,
    corridorFill: gapFill,
  });
}
