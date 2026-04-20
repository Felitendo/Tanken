import { NextRequest, NextResponse } from 'next/server';
import { readPriceHistoryFromDatabase, readPriceHistoryByStation, getAvailableLocations, getPriceExtremes, type HistoryCountry } from '@/lib/history-store';

export const runtime = 'nodejs';

function parseCountry(raw: string | null): HistoryCountry | undefined {
  return raw === 'at' || raw === 'de' ? raw : undefined;
}

export async function GET(request: NextRequest) {
  const country = parseCountry(request.nextUrl.searchParams.get('country'));

  // Return list of available location IDs (optionally country-scoped)
  const listLocations = request.nextUrl.searchParams.get('locations');
  if (listLocations === 'list') {
    const locations = await getAvailableLocations(country);
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
    readPriceHistoryFromDatabase(locationId, country),
    getPriceExtremes(locationId, country),
  ]);
  return NextResponse.json({ entries, extremes });
}
