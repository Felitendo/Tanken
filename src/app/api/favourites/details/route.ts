import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@/lib/request-context';
import { runtimeConfig } from '@/lib/server-runtime';
import { getStationsByIds } from '@/lib/station-cache';

export const runtime = 'nodejs';

/**
 * Resolves the logged-in user's favourite station IDs to full station
 * details (name, brand, address, latest known price, coordinates).
 * Stations that aren't in the cache are returned as bare-id stubs so the
 * frontend can still show *something* and offer a remove button.
 */
export async function GET(request: NextRequest) {
  const { user } = await getRequestContext(request);
  if (!user) {
    return NextResponse.json({ error: 'Login erforderlich', loginRequired: true }, { status: 401 });
  }

  const ids = Array.isArray(user.favourites) ? user.favourites : [];
  if (!ids.length) return NextResponse.json({ favourites: [] });

  const fuelParam = request.nextUrl.searchParams.get('fuel');
  const fuel = fuelParam === 'diesel' || fuelParam === 'e5' || fuelParam === 'e10'
    ? fuelParam
    : user.settings?.fuelType || runtimeConfig.repoConfig.fuel_type;

  // Try fuel-scoped first, then fall back to any fuel so we still find the
  // station's address/name even if its current price for the chosen fuel
  // wasn't in the most recent scan.
  const fuelMatched = getStationsByIds(ids, fuel);
  const haveByFuel = new Set(fuelMatched.map(s => s.id));
  const missing = ids.filter(id => !haveByFuel.has(id));
  const anyFuel = missing.length ? getStationsByIds(missing) : [];

  const byId = new Map<string, ReturnType<typeof getStationsByIds>[number]>();
  for (const s of [...fuelMatched, ...anyFuel]) byId.set(s.id, s);

  const ordered = ids.map((id) => {
    const s = byId.get(id);
    if (s) return s;
    // Stub so the UI can still render a row + the remove button.
    return { id, name: '', brand: '', street: '', houseNumber: '', postCode: '', place: '', lat: 0, lng: 0, dist: 0, price: null, isOpen: false };
  });

  return NextResponse.json({ favourites: ordered });
}
