import { database } from '@/lib/server-runtime';
import { HistoryEntry } from '@/types';

export type HistoryCountry = 'de' | 'at';

/**
 * SQL fragment + params builder for filtering price_history / station_prices
 * by country. Austrian rows always carry a location_id starting with `at-`
 * (grid points and ad-hoc E-Control caches). Everything else is treated as
 * Germany. Returns clauses that can be combined into a WHERE list.
 */
function countryClause(country: HistoryCountry | undefined, nextParamIndex: number): { sql: string | null; params: string[] } {
  if (!country) return { sql: null, params: [] };
  if (country === 'at') {
    return { sql: `location_id LIKE $${nextParamIndex}`, params: ['at-%'] };
  }
  return { sql: `(location_id IS NOT NULL AND location_id NOT LIKE $${nextParamIndex})`, params: ['at-%'] };
}

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
  // Query individual station prices from station_prices table (has ALL stations),
  // not price_history which only stores the cheapest station's name.
  // Uses exact match to leverage idx_station_prices_name index.
  const result = await database.query<{
    timestamp: Date;
    price: number;
    station_name: string;
    location_id: string | null;
  }>(
    `
      SELECT timestamp, price, station_name, location_id
      FROM station_prices
      WHERE station_name = $1
      ORDER BY timestamp ASC
    `,
    [stationName]
  );
  return result.rows.map(row => ({
    timestamp: row.timestamp.toISOString(),
    min_price: Number(row.price),
    avg_price: Number(row.price),
    max_price: Number(row.price),
    station: row.station_name,
    num_stations: 0,
    location_id: row.location_id || undefined,
  }));
}

export async function readPriceHistoryFromDatabase(locationId?: string, country?: HistoryCountry): Promise<HistoryEntry[]> {
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

  const cc = countryClause(country, 1);
  const where = cc.sql ? `WHERE ${cc.sql}` : '';
  const result = await database.query<HistoryRow>(
    `
      SELECT timestamp, min_price, avg_price, max_price, station, num_stations, location_id
      FROM price_history
      ${where}
      ORDER BY timestamp ASC
    `,
    cc.params
  );
  return mapRows(result.rows);
}

export interface StationPriceRow {
  timestamp: string;
  station_name: string;
  station_brand: string;
  price: number;
  location_id?: string;
}

export async function readStationPrices(locationId?: string, country?: HistoryCountry): Promise<StationPriceRow[]> {
  const clauses: string[] = [];
  const params: (string | number)[] = [];
  if (locationId) {
    params.push(locationId);
    clauses.push(`location_id = $${params.length}`);
  } else {
    const cc = countryClause(country, params.length + 1);
    if (cc.sql) { params.push(...cc.params); clauses.push(cc.sql); }
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const result = await database.query<{
    timestamp: Date;
    station_name: string;
    station_brand: string;
    price: number;
    location_id: string | null;
  }>(
    `SELECT timestamp, station_name, station_brand, price, location_id
     FROM station_prices ${where}
     ORDER BY timestamp ASC`,
    params
  );
  return result.rows.map(r => ({
    timestamp: r.timestamp.toISOString(),
    station_name: r.station_name,
    station_brand: r.station_brand,
    price: Number(r.price),
    location_id: r.location_id || undefined,
  }));
}

export interface PriceExtreme {
  station_name: string;
  price: number;
  timestamp: string;
}

export async function getPriceExtremes(locationId?: string, country?: HistoryCountry): Promise<{ cheapest: PriceExtreme | null; mostExpensive: PriceExtreme | null }> {
  const clauses: string[] = [];
  const params: (string | number)[] = [];
  if (locationId) {
    params.push(locationId);
    clauses.push(`location_id = $${params.length}`);
  } else {
    const cc = countryClause(country, params.length + 1);
    if (cc.sql) { params.push(...cc.params); clauses.push(cc.sql); }
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const cheapestResult = await database.query<{ station_name: string; price: number; timestamp: Date }>(
    `SELECT station_name, price, timestamp FROM station_prices ${where} ORDER BY price ASC LIMIT 1`,
    params
  );

  const expensiveResult = await database.query<{ station_name: string; price: number; timestamp: Date }>(
    `SELECT station_name, price, timestamp FROM station_prices ${where} ORDER BY price DESC LIMIT 1`,
    params
  );

  const mapRow = (r: { station_name: string; price: number; timestamp: Date }): PriceExtreme => ({
    station_name: r.station_name,
    price: Number(r.price),
    timestamp: r.timestamp.toISOString(),
  });

  return {
    cheapest: cheapestResult.rows[0] ? mapRow(cheapestResult.rows[0]) : null,
    mostExpensive: expensiveResult.rows[0] ? mapRow(expensiveResult.rows[0]) : null,
  };
}

export async function getAvailableLocations(country?: HistoryCountry): Promise<string[]> {
  const clauses: string[] = ['location_id IS NOT NULL'];
  const params: (string | number)[] = [];
  const cc = countryClause(country, params.length + 1);
  if (cc.sql) { params.push(...cc.params); clauses.push(cc.sql); }
  const result = await database.query<{ location_id: string }>(
    `SELECT DISTINCT location_id FROM price_history WHERE ${clauses.join(' AND ')} ORDER BY location_id`,
    params
  );
  return result.rows.map(r => r.location_id);
}
