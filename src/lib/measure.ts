import { database } from '@/lib/server-runtime';
import { fetchJson } from '@/lib/http';
import { FuelType } from '@/types';
import { CachedStation } from '@/lib/station-cache';

export interface MeasureResult {
  timestamp: string;
  min_price: number;
  avg_price: number;
  max_price: number;
  station: string;
  num_stations: number;
  location_id?: string;
  /** Raw station list from Tankerkönig (for caching). */
  rawStations: CachedStation[];
}

export async function measureLocation(params: {
  apiKey: string;
  lat: number;
  lng: number;
  radius: number;
  fuelType: FuelType;
  locationId?: string;
}): Promise<MeasureResult> {
  const { apiKey, lat, lng, radius, fuelType, locationId } = params;

  const url = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${lat}&lng=${lng}&rad=${radius}&sort=price&type=${fuelType}&apikey=${apiKey}`;

  const { data } = await fetchJson<{ ok?: boolean; message?: string; stations?: Record<string, unknown>[] }>(url);
  if (!data.ok || !data.stations?.length) {
    throw new Error(data.message || 'Keine Stationen gefunden.');
  }

  // Map raw API response to CachedStation format
  const allStations: CachedStation[] = data.stations.map(s => ({
    id: String(s.id ?? ''),
    name: String(s.name ?? ''),
    brand: String(s.brand ?? ''),
    street: String(s.street ?? ''),
    houseNumber: String(s.houseNumber ?? s.house_number ?? ''),
    postCode: String(s.postCode ?? s.post_code ?? ''),
    place: String(s.place ?? ''),
    lat: Number(s.lat) || 0,
    lng: Number(s.lng) || 0,
    dist: Number(s.dist) || 0,
    price: typeof s.price === 'number' && s.price > 0 ? s.price : null,
    isOpen: Boolean(s.isOpen),
  }));

  const open = allStations.filter(s => s.isOpen && s.price !== null && s.price > 0);
  if (!open.length) {
    throw new Error('Keine offenen Tankstellen mit Preisen gefunden.');
  }

  const prices = open.map(s => s.price!);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const cheapest = open.reduce((a, b) => (a.price! <= b.price! ? a : b));

  const timestamp = new Date().toISOString();

  await database.query(
    `INSERT INTO price_history (timestamp, min_price, avg_price, max_price, station, num_stations, location_id)
     VALUES ($1::timestamptz, $2, $3, $4, $5, $6, $7)`,
    [timestamp, minPrice, avgPrice, maxPrice, cheapest.name || '', open.length, locationId || null]
  );

  // Store individual station prices for rankings and detailed stats
  if (open.length > 0) {
    const values: string[] = [];
    const params: unknown[] = [];
    let idx = 1;
    for (const s of open) {
      values.push(`($${idx++}::timestamptz, $${idx++}, $${idx++}, $${idx++}, $${idx++})`);
      params.push(timestamp, locationId || null, s.name, s.brand, s.price);
    }
    await database.query(
      `INSERT INTO station_prices (timestamp, location_id, station_name, station_brand, price) VALUES ${values.join(', ')}`,
      params
    );
  }

  return {
    timestamp,
    min_price: minPrice,
    avg_price: avgPrice,
    max_price: maxPrice,
    station: cheapest.name || '',
    num_stations: open.length,
    location_id: locationId,
    rawStations: allStations,
  };
}
