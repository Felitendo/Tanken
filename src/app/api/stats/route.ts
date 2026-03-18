import { NextRequest, NextResponse } from 'next/server';
import { buildHistoryStats } from '@/lib/history';
import { readPriceHistoryFromDatabase, readStationPrices } from '@/lib/history-store';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const locationId = request.nextUrl.searchParams.get('location') || undefined;
  const [entries, stationData] = await Promise.all([
    readPriceHistoryFromDatabase(locationId),
    readStationPrices(locationId),
  ]);
  return NextResponse.json(buildHistoryStats(entries, stationData));
}
