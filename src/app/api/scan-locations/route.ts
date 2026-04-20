import { NextResponse } from 'next/server';
import { listScanLocations } from '@/lib/location-store';

export const runtime = 'nodejs';

/**
 * Public list of enabled scan locations — the places we keep historical
 * price data for. Only coarse, non-sensitive fields are exposed.
 */
export async function GET() {
  try {
    const locations = await listScanLocations({ enabledOnly: true });
    const publicList = locations.map((l) => ({
      id: l.id,
      name: l.name,
      country: l.country,
      lat: l.lat,
      lng: l.lng,
      radiusKm: l.radiusKm,
    }));
    return NextResponse.json({ locations: publicList });
  } catch {
    return NextResponse.json({ locations: [] }, { status: 200 });
  }
}
