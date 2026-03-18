import { NextRequest, NextResponse } from 'next/server';
import { readPriceHistoryFromDatabase, readPriceHistoryByStation, getAvailableLocations, getPriceExtremes } from '@/lib/history-store';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Return list of available location IDs
  const listLocations = request.nextUrl.searchParams.get('locations');
  if (listLocations === 'list') {
    const locations = await getAvailableLocations();
    return NextResponse.json({ locations });
  }

  const station = request.nextUrl.searchParams.get('station');
  const locationId = request.nextUrl.searchParams.get('location') || undefined;

  if (station) {
    const stationEntries = await readPriceHistoryByStation(station);
    if (stationEntries.length >= 2) {
      return NextResponse.json(stationEntries);
    }
    // Fall back to all entries if station has insufficient data
  }

  const [entries, extremes] = await Promise.all([
    readPriceHistoryFromDatabase(locationId),
    getPriceExtremes(locationId),
  ]);
  return NextResponse.json({ entries, extremes });
}
