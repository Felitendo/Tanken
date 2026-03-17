import { NextRequest, NextResponse } from 'next/server';
import { readPriceHistoryFromDatabase, readPriceHistoryByStation } from '@/lib/history-store';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const station = request.nextUrl.searchParams.get('station');

  if (station) {
    const stationEntries = await readPriceHistoryByStation(station);
    if (stationEntries.length >= 2) {
      return NextResponse.json(stationEntries);
    }
    // Fall back to all entries if station has insufficient data
  }

  const entries = await readPriceHistoryFromDatabase();
  if (!entries.length) {
    return NextResponse.json({ error: 'Could not read price history' }, { status: 500 });
  }

  return NextResponse.json(entries);
}
