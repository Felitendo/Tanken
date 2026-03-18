import { database } from '@/lib/server-runtime';
import { fetchJson } from '@/lib/http';
import { FuelType } from '@/types';

interface TankerkoenigStation {
  name?: string;
  price?: number;
  isOpen?: boolean;
}

export interface MeasureResult {
  timestamp: string;
  min_price: number;
  avg_price: number;
  max_price: number;
  station: string;
  num_stations: number;
  location_id?: string;
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

  const { data } = await fetchJson<{ ok?: boolean; message?: string; stations?: TankerkoenigStation[] }>(url);
  if (!data.ok || !data.stations?.length) {
    throw new Error(data.message || 'Keine Stationen gefunden.');
  }

  const open = data.stations.filter(s => s.isOpen && typeof s.price === 'number' && s.price > 0);
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

  return {
    timestamp,
    min_price: minPrice,
    avg_price: avgPrice,
    max_price: maxPrice,
    station: cheapest.name || '',
    num_stations: open.length,
    location_id: locationId,
  };
}
