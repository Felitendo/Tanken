import { database } from '@/lib/server-runtime';
import { HistoryEntry } from '@/types';

type HistoryRow = { timestamp: Date; min_price: number; avg_price: number; max_price: number; station: string | null; num_stations: number | null; location_id: string | null };

function mapRows(rows: HistoryRow[]): HistoryEntry[] {
  return rows.map(row => ({
    timestamp: row.timestamp.toISOString(),
    min_price: Number(row.min_price),
    avg_price: Number(row.avg_price),
    max_price: Number(row.max_price),
    station: row.station || '',
    num_stations: row.num_stations ?? 0,
    location_id: row.location_id || undefined,
  }));
}

export async function readPriceHistoryByStation(stationName: string): Promise<HistoryEntry[]> {
  const result = await database.query<HistoryRow>(
    `
      SELECT timestamp, min_price, avg_price, max_price, station, num_stations, location_id
      FROM price_history
      WHERE station ILIKE $1
      ORDER BY timestamp ASC
    `,
    [`%${stationName}%`]
  );
  return mapRows(result.rows);
}

export async function readPriceHistoryFromDatabase(locationId?: string): Promise<HistoryEntry[]> {
  if (locationId) {
    const result = await database.query<HistoryRow>(
      `
        SELECT timestamp, min_price, avg_price, max_price, station, num_stations, location_id
        FROM price_history
        WHERE location_id = $1
        ORDER BY timestamp ASC
      `,
      [locationId]
    );
    return mapRows(result.rows);
  }

  const result = await database.query<HistoryRow>(
    `
      SELECT timestamp, min_price, avg_price, max_price, station, num_stations, location_id
      FROM price_history
      ORDER BY timestamp ASC
    `
  );
  return mapRows(result.rows);
}

export async function getAvailableLocations(): Promise<string[]> {
  const result = await database.query<{ location_id: string }>(
    `SELECT DISTINCT location_id FROM price_history WHERE location_id IS NOT NULL ORDER BY location_id`
  );
  return result.rows.map(r => r.location_id);
}
