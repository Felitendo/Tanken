import { NextRequest, NextResponse } from 'next/server';
import { buildHistoryStats } from '@/lib/history';
import { readPriceHistoryFromDatabase, readStationPrices, type HistoryCountry } from '@/lib/history-store';

export const runtime = 'nodejs';

function parseCountry(raw: string | null): HistoryCountry | undefined {
  return raw === 'at' || raw === 'de' ? raw : undefined;
}

// Stats are scoped to the last 30 days. Matches the price_history /
// station_prices retention window so we don't surface stale long-tail
// data, and keeps the day/hour buckets representative of recent prices.
const STATS_WINDOW_DAYS = 30;

export async function GET(request: NextRequest) {
  const locationId = request.nextUrl.searchParams.get('location') || undefined;
  const country = parseCountry(request.nextUrl.searchParams.get('country'));
  const [entries, stationData] = await Promise.all([
    readPriceHistoryFromDatabase(locationId, country, STATS_WINDOW_DAYS),
    readStationPrices(locationId, country, STATS_WINDOW_DAYS),
  ]);
  return NextResponse.json(buildHistoryStats(entries, stationData));
}
