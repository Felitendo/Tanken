import { NextRequest, NextResponse } from 'next/server';
import { getAdminRequestContext } from '@/lib/admin';
import { runtimeConfig } from '@/lib/server-runtime';
import { measureLocation } from '@/lib/measure';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const apiKey = runtimeConfig.apiKey;

  if (!apiKey) {
    return NextResponse.json({ error: 'Kein API-Key konfiguriert.' }, { status: 400 });
  }

  // If location_id is provided, look up the location from config
  const locationId = body.location_id as string | undefined;
  let lat = Number(body.lat) || 51.1657;
  let lng = Number(body.lng) || 10.4515;
  let rad = runtimeConfig.repoConfig.radius_km;
  let fuel = runtimeConfig.repoConfig.fuel_type;

  if (locationId) {
    const locations = runtimeConfig.repoConfig.locations ?? [];
    const loc = locations.find(l => l.id === locationId);
    if (loc) {
      lat = loc.lat;
      lng = loc.lng;
      rad = loc.radius_km;
      fuel = loc.fuel_type;
    }
  }

  try {
    const entry = await measureLocation({
      apiKey,
      lat,
      lng,
      radius: rad,
      fuelType: fuel,
      locationId,
    });

    return NextResponse.json({ ok: true, entry });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return NextResponse.json({ error: `Messung fehlgeschlagen: ${msg}` }, { status: 502 });
  }
}
