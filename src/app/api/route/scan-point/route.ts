import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runtimeConfig } from '@/lib/server-runtime';
import { getRequestContext } from '@/lib/request-context';
import { setCachedStations, type CachedStation } from '@/lib/station-cache';
import { fetchStationsEControl, fetchStationsLive } from '@/lib/measure';
import { canMakeLiveCall, recordLiveCall } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const bodySchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  fuel: z.enum(['diesel', 'e5', 'e10']),
});

/** AT bbox also covers parts of southern Bavaria — if E-Control returns
 * nothing we fall through to Tankerkönig, same as /api/stations. */
function inAtBbox(lat: number, lng: number): boolean {
  return lat >= 46.3 && lat <= 49.1 && lng >= 9.4 && lng <= 17.2;
}

const LIVE_CALL_RADIUS_KM = 25;

/**
 * Single live scan at one route scan point. Called by the client once per
 * scan marker, with a client-side 30 s cooldown between calls — keeping the
 * UI responsive while staying well under Tankerkönig's soft rate limit.
 *
 * Cache writes go to the same `de-live-*` / `at-live-*` entries as the
 * "Hier suchen" button, so a second user planning a similar route hits the
 * warm cache.
 */
export async function POST(request: NextRequest) {
  const { user } = await getRequestContext(request);
  if (!user) {
    return NextResponse.json({ error: 'Anmeldung erforderlich.' }, { status: 401 });
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
  const { lat, lng, fuel } = parsed.data;

  let stations: CachedStation[] = [];
  let prefix: 'at-live' | 'de-live' | null = null;

  if (inAtBbox(lat, lng)) {
    stations = await fetchStationsEControl({ lat, lng, fuelType: fuel }).catch(() => [] as CachedStation[]);
    if (stations.length > 0) prefix = 'at-live';
  }

  // Empty AT response or outside AT → try Tankerkönig.
  if (stations.length === 0 && runtimeConfig.apiKey) {
    if (!canMakeLiveCall()) {
      return NextResponse.json(
        { ok: false, rateLimited: true, stationsFound: 0 },
        { status: 429 },
      );
    }
    recordLiveCall();
    try {
      stations = await fetchStationsLive({
        apiKey: runtimeConfig.apiKey,
        lat,
        lng,
        radiusKm: LIVE_CALL_RADIUS_KM,
        fuelType: fuel,
      });
      if (stations.length > 0) prefix = 'de-live';
    } catch (err) {
      return NextResponse.json(
        { ok: false, stationsFound: 0, error: err instanceof Error ? err.message : 'scan fehlgeschlagen' },
        { status: 502 },
      );
    }
  }

  if (stations.length === 0 || !prefix) {
    return NextResponse.json({ ok: true, stationsFound: 0 });
  }

  const cacheId = `${prefix}-${lat.toFixed(2)}-${lng.toFixed(2)}`;
  setCachedStations(cacheId, {
    stations,
    lat,
    lng,
    radiusKm: LIVE_CALL_RADIUS_KM,
    fuelType: fuel,
  });

  return NextResponse.json({ ok: true, stationsFound: stations.length });
}
