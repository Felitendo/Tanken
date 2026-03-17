import { database } from '@/lib/server-runtime';
import { HistoryEntry } from '@/types';

function mapRows(rows: Array<{ timestamp: Date; min_price: number; avg_price: number; max_price: number; station: string | null; num_stations: number | null }>): HistoryEntry[] {
  return rows.map(row => ({
    timestamp: row.timestamp.toISOString(),
    min_price: Number(row.min_price),
    avg_price: Number(row.avg_price),
    max_price: Number(row.max_price),
    station: row.station || '',
    num_stations: row.num_stations ?? 0
  }));
}

type HistoryRow = { timestamp: Date; min_price: number; avg_price: number; max_price: number; station: string | null; num_stations: number | null };

export async function readPriceHistoryByStation(stationName: string): Promise<HistoryEntry[]> {
  const result = await database.query<HistoryRow>(
    `
      SELECT timestamp, min_price, avg_price, max_price, station, num_stations
      FROM price_history
      WHERE station ILIKE $1
      ORDER BY timestamp ASC
    `,
    [`%${stationName}%`]
  );
  return mapRows(result.rows);
}

export async function readPriceHistoryFromDatabase(): Promise<HistoryEntry[]> {
  const result = await database.query<{
    timestamp: Date;
    min_price: number;
    avg_price: number;
    max_price: number;
    station: string | null;
    num_stations: number | null;
  }>(
    `
      SELECT timestamp, min_price, avg_price, max_price, station, num_stations
      FROM price_history
      ORDER BY timestamp ASC
    `
  );

  return mapRows(result.rows);
}
