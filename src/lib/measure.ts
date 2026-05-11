import { database } from '@/lib/server-runtime';
import { fetchJson } from '@/lib/http';
import { FuelType } from '@/types';
import { CachedStation, getAllUniqueStationsForFuel } from '@/lib/station-cache';

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

/**
 * Fetch stations from Tankerkönig API without writing to DB.
 * Used for live/ad-hoc searches when no cached data is nearby.
 * Returns empty array on error (never throws).
 */
export async function fetchStationsLive(params: {
  apiKey: string;
  lat: number;
  lng: number;
  radiusKm: number;
  fuelType: string;
}): Promise<CachedStation[]> {
  const { apiKey, lat, lng, radiusKm, fuelType } = params;
  const url = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${lat}&lng=${lng}&rad=${radiusKm}&sort=price&type=${fuelType}&apikey=${apiKey}`;
  const { data } = await fetchJson<{ ok?: boolean; message?: string; stations?: Record<string, unknown>[] }>(url);
  if (!data.ok) {
    throw new Error(data.message || 'API-Fehler (ok=false)');
  }
  if (!data.stations?.length) return [];
  return mapStations(data.stations);
}

export interface AllFuelPrices {
  isOpen: boolean;
  diesel: number | null;
  e5: number | null;
  e10: number | null;
}

/**
 * Fetch current prices for up to 10 stations by ID via Tankerkönig prices.php.
 *
 * A single call returns all three fuels per station, so this replaces 30 list.php
 * calls (10 stations × 3 fuels) with one — the main lever we have against the
 * undocumented rate limit. Use for periodic price refresh of already-known stations;
 * new stations still require list.php discovery.
 */
export async function fetchAllPricesByIds(params: {
  apiKey: string;
  ids: string[];
}): Promise<Map<string, AllFuelPrices>> {
  const { apiKey, ids } = params;
  if (ids.length === 0 || ids.length > 10) {
    throw new Error(`ids muss 1–10 sein, bekommen: ${ids.length}`);
  }
  const url = `https://creativecommons.tankerkoenig.de/json/prices.php?ids=${ids.join(',')}&apikey=${apiKey}`;
  const { data } = await fetchJson<{
    ok?: boolean;
    message?: string;
    prices?: Record<string, Record<string, unknown>>;
  }>(url);
  if (!data.ok) {
    throw new Error(data.message || 'API-Fehler (ok=false)');
  }
  const result = new Map<string, AllFuelPrices>();
  if (data.prices) {
    const pick = (info: Record<string, unknown>, fuel: string): number | null => {
      const v = info[fuel];
      return typeof v === 'number' && v > 0 ? v : null;
    };
    for (const [id, info] of Object.entries(data.prices)) {
      const isOpen = info.status === 'open';
      result.set(id, {
        isOpen,
        diesel: pick(info, 'diesel'),
        e5: pick(info, 'e5'),
        e10: pick(info, 'e10'),
      });
    }
  }
  return result;
}

// ─── E-Control (Austria) ─────────────────────────────────────────────

interface EControlStation {
  id: number;
  name: string;
  location: {
    address: string;
    postalCode: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  open: boolean;
  distance: number;
  prices: Array<{ fuelType: string; amount: number; label: string }>;
}

/** Map app fuel type to E-Control fuel type code. */
function toEControlFuel(fuelType: string): string {
  switch (fuelType) {
    case 'diesel': return 'DIE';
    case 'e5': return 'SUP';
    case 'e10': return 'SUP';
    default: return 'DIE';
  }
}

/**
 * Fetch stations from E-Control API (Austria). No API key needed.
 * Returns ~10 nearest stations around the given coordinates.
 */
export async function fetchStationsEControl(params: {
  lat: number;
  lng: number;
  fuelType: string;
}): Promise<CachedStation[]> {
  const { lat, lng, fuelType } = params;
  const ecFuel = toEControlFuel(fuelType);
  try {
    const url = `https://api.e-control.at/sprit/1.0/search/gas-stations/by-address?latitude=${lat}&longitude=${lng}&fuelType=${ecFuel}&includeClosed=true`;
    const { data } = await fetchJson<EControlStation[]>(url);
    if (!Array.isArray(data) || !data.length) return [];
    return data.map(s => {
      const price = s.prices?.find(p => p.fuelType === ecFuel);
      return {
        id: `at-${s.id}`,
        name: s.name || '',
        brand: s.name || '',
        street: s.location?.address || '',
        houseNumber: '',
        postCode: s.location?.postalCode || '',
        place: s.location?.city || '',
        lat: s.location?.latitude || 0,
        lng: s.location?.longitude || 0,
        dist: s.distance || 0,
        price: price && price.amount > 0 ? price.amount : null,
        isOpen: Boolean(s.open),
      };
    });
  } catch (err) {
    console.error(`[EC] ${lat},${lng}: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
}

// ─── Tankerkönig (Germany) helpers ───────────────────────────────────

function mapStations(stations: Record<string, unknown>[]): CachedStation[] {
  return stations.map(s => ({
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
}

/**
 * Aggregate already-cached stations into a single price_history row.
 * Used by the scheduler after each scan cycle so the Verlauf chart has
 * fresh data without an extra Tankerkönig roundtrip.
 *
 * Returns true if a row was inserted, false if the location had no open
 * stations with prices (nothing meaningful to record).
 */
export async function recordPriceHistoryFromStations(
  locationId: string,
  stations: CachedStation[],
): Promise<boolean> {
  const open = stations.filter(s => s.isOpen && s.price !== null && s.price > 0);
  if (!open.length) return false;
  const prices = open.map(s => s.price!);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const cheapest = open.reduce((a, b) => (a.price! <= b.price! ? a : b));
  const timestamp = new Date().toISOString();
  await database.query(
    `INSERT INTO price_history (timestamp, min_price, avg_price, max_price, station, num_stations, location_id)
     VALUES ($1::timestamptz, $2, $3, $4, $5, $6, $7)`,
    [timestamp, minPrice, avgPrice, maxPrice, cheapest.name || '', open.length, locationId]
  );
  return true;
}

const AT_AGGREGATE_MIN_INTERVAL_MS = 30 * 60 * 1000;

/**
 * Roll the currently cached open AT stations into a single `at-country`
 * row in price_history — but only if the last such row is older than the
 * throttle. Called from two places: on app boot (after the station cache
 * is restored from DB) and at the end of every scheduler cycle.
 *
 * The throttle matters because deploys restart the process frequently;
 * without it every restart would spam a fresh row. With it, AT picks up
 * roughly one row per 30 min while the service is alive, plus the
 * scheduler's per-cycle write whenever a noon scan actually completes.
 *
 * Returns true if a row was written, false if skipped (throttle hit or
 * empty AT cache).
 */
export async function persistAtAggregateIfStale(): Promise<boolean> {
  const last = await database.query<{ timestamp: Date }>(
    `SELECT timestamp FROM price_history WHERE location_id = 'at-country' ORDER BY timestamp DESC LIMIT 1`
  );
  const lastTs = last.rows[0]?.timestamp ? new Date(last.rows[0].timestamp).getTime() : 0;
  if (Date.now() - lastTs < AT_AGGREGATE_MIN_INTERVAL_MS) return false;

  const atStations: CachedStation[] = [];
  const seen = new Set<string>();
  for (const fuel of ['diesel', 'e5', 'e10'] as const) {
    for (const s of getAllUniqueStationsForFuel(fuel)) {
      if (!s.isOpen || s.price == null || s.price <= 0) continue;
      if (s.lat < 46.3 || s.lat > 49.1 || s.lng < 9.4 || s.lng > 17.2) continue;
      if (seen.has(s.id)) continue;
      seen.add(s.id);
      atStations.push(s);
    }
  }
  if (atStations.length === 0) return false;
  return recordPriceHistoryFromStations('at-country', atStations);
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

  const allStations = mapStations(data.stations);

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
      values.push(`($${idx++}::timestamptz, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++})`);
      params.push(timestamp, locationId || null, s.id || null, s.name, s.brand, s.price, fuelType);
    }
    await database.query(
      `INSERT INTO station_prices (timestamp, location_id, station_id, station_name, station_brand, price, fuel_type) VALUES ${values.join(', ')}`,
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
