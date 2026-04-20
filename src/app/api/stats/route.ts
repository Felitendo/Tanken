import { NextRequest, NextResponse } from 'next/server';
import { buildHistoryStats } from '@/lib/history';
import { readPriceHistoryFromDatabase, readStationPrices, type HistoryCountry } from '@/lib/history-store';

export const runtime = 'nodejs';

function parseCountry(raw: string | null): HistoryCountry | undefined {
  return raw === 'at' || raw === 'de' ? raw : undefined;
}

export async function GET(request: NextRequest) {
  const locationId = request.nextUrl.searchParams.get('location') || undefined;
  const country = parseCountry(request.nextUrl.searchParams.get('country'));
  const [entries, stationData] = await Promise.all([
    readPriceHistoryFromDatabase(locationId, country),
    readStationPrices(locationId, country),
  ]);
  return NextResponse.json(buildHistoryStats(entries, stationData));
}
