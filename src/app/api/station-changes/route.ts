import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/server-runtime';

export const runtime = 'nodejs';

interface PriceChange {
  at: string;
  from: number;
  to: number;
}

interface StationChanges {
  lastRaise: PriceChange | null;
  lastDrop: PriceChange | null;
  currentPrice: number | null;
}

/**
 * Returns the most recent price raise and drop for a given station within
 * the station_prices retention window (30 days).
 *
 * Asymmetric handling is deliberate: under Germany's 12-Uhr-Regel (April 2026)
 * and the long-standing Austrian rule, raises are restricted to once daily at
 * 12:00, while drops can happen any time. Surfacing both timestamps lets the
 * UI show "Erhöht um 12:03" and "Gesenkt um 19:45" separately.
 */
export async function GET(request: NextRequest) {
  const stationName = request.nextUrl.searchParams.get('station');
  if (!stationName) {
    return NextResponse.json({ error: 'station parameter required' }, { status: 400 });
  }

  // Pull the recent price track for this station. 100 rows is enough to find
  // the last raise and drop even with frequent multi-scan cycles.
  const result = await database.query<{ timestamp: Date; price: number }>(
    `SELECT timestamp, price
     FROM station_prices
     WHERE station_name = $1
     ORDER BY timestamp DESC
     LIMIT 100`,
    [stationName]
  );

  const rows = result.rows.map(r => ({ timestamp: r.timestamp, price: Number(r.price) }));
  const changes: StationChanges = {
    lastRaise: null,
    lastDrop: null,
    currentPrice: rows.length > 0 ? rows[0].price : null,
  };

  // Walk newest → oldest; first strict inequality vs. previous (older) row
  // gives the most recent raise / drop.
  for (let i = 0; i < rows.length - 1; i++) {
    const newer = rows[i];
    const older = rows[i + 1];
    if (changes.lastRaise && changes.lastDrop) break;
    if (newer.price > older.price && !changes.lastRaise) {
      changes.lastRaise = {
        at: newer.timestamp.toISOString(),
        from: older.price,
        to: newer.price,
      };
    } else if (newer.price < older.price && !changes.lastDrop) {
      changes.lastDrop = {
        at: newer.timestamp.toISOString(),
        from: older.price,
        to: newer.price,
      };
    }
  }

  return NextResponse.json(changes);
}
