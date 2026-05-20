import fs from 'node:fs';
import { HistoryEntry, HistoryStats } from '../types';

function parseCsvLine(line: string): HistoryEntry | null {
  const parts = line.split(',');
  const minPrice = Number.parseFloat(parts[1] ?? '');
  const avgPrice = Number.parseFloat(parts[2] ?? '');
  const maxPrice = Number.parseFloat(parts[3] ?? '');
  const numStations = Number.parseInt(parts[5] ?? '0', 10);

  if (!Number.isFinite(minPrice)) {
    return null;
  }

  return {
    timestamp: parts[0] ?? '',
    min_price: minPrice,
    avg_price: Number.isFinite(avgPrice) ? avgPrice : minPrice,
    max_price: Number.isFinite(maxPrice) ? maxPrice : minPrice,
    station: (parts[4] ?? '').trim(),
    num_stations: Number.isFinite(numStations) ? numStations : 0
  };
}

export function readPriceHistory(filePath: string): HistoryEntry[] {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) {
      return [];
    }

    return raw
      .split(/\r?\n/)
      .slice(1)
      .map(parseCsvLine)
      .filter((entry): entry is HistoryEntry => entry !== null)
      .sort((left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime());
  } catch {
    return [];
  }
}

export interface StationPriceInput {
  timestamp: string;
  station_name: string;
  station_id?: string;
  station_brand?: string;
  price: number;
}

export function buildHistoryStats(entries: HistoryEntry[], stationData?: StationPriceInput[]): HistoryStats {
  const datedEntries = entries
    .map((entry) => ({
      ...entry,
      timestampDate: new Date(entry.timestamp)
    }))
    .filter((entry) => !Number.isNaN(entry.timestampDate.getTime()));

  const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const dayPrices: Record<number, number[]> = {};
  const hourPrices: Record<number, number[]> = {};
  // Grouped by station_id when present (one physical station = one
  // bucket), falling back to station_name. Two stations sharing a
  // display name used to collide; using the id where available
  // separates them properly. stationMeta keeps the display name + id +
  // brand keyed by the same grouping key so the ranking can render
  // and link out correctly.
  const stationPrices: Record<string, number[]> = {};
  const stationMeta: Record<string, { id?: string; brand?: string; name?: string }> = {};

  // Use individual station data for day/hour/station stats if available
  const priceSource = stationData && stationData.length > 0 ? stationData : null;

  if (priceSource) {
    for (const sp of priceSource) {
      const d = new Date(sp.timestamp);
      if (Number.isNaN(d.getTime())) continue;

      const day = d.getDay();
      const hour = d.getHours();

      dayPrices[day] = dayPrices[day] ?? [];
      dayPrices[day].push(sp.price);

      hourPrices[hour] = hourPrices[hour] ?? [];
      hourPrices[hour].push(sp.price);

      if (sp.station_name) {
        const key = sp.station_id || sp.station_name;
        stationPrices[key] = stationPrices[key] ?? [];
        stationPrices[key].push(sp.price);
        const meta = stationMeta[key] || {};
        if (sp.station_id) meta.id = sp.station_id;
        if (sp.station_brand) meta.brand = sp.station_brand;
        meta.name = sp.station_name;
        stationMeta[key] = meta;
      }
    }
  } else {
    // Fallback: use aggregated price_history entries (legacy / no station_prices data)
    for (const entry of datedEntries) {
      const day = entry.timestampDate.getDay();
      const hour = entry.timestampDate.getHours();

      dayPrices[day] = dayPrices[day] ?? [];
      dayPrices[day].push(entry.min_price);

      hourPrices[hour] = hourPrices[hour] ?? [];
      hourPrices[hour].push(entry.min_price);

      if (entry.station) {
        stationPrices[entry.station] = stationPrices[entry.station] ?? [];
        stationPrices[entry.station].push(entry.min_price);
        // No id/brand available on aggregate rows — keep the name only.
        const meta = stationMeta[entry.station] || {};
        meta.name = entry.station;
        stationMeta[entry.station] = meta;
      }
    }
  }

  const dayAvgs = Object.entries(dayPrices)
    .map(([day, prices]) => ({
      day: Number.parseInt(day, 10),
      name: dayNames[Number.parseInt(day, 10)] ?? day,
      avg: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      count: prices.length
    }))
    .sort((left, right) => left.avg - right.avg);

  const hourAvgs = Object.entries(hourPrices)
    .map(([hour, prices]) => ({
      hour: Number.parseInt(hour, 10),
      avg: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      count: prices.length
    }))
    .sort((left, right) => left.avg - right.avg);

  // A station that was sampled just once or twice can land at #1 by
  // pure chance (caught a single dip). Require at least 3 samples so
  // the average is meaningful, but don't filter so aggressively that
  // a fresh location with sparse data shows an empty ranking — if no
  // station meets the threshold, fall back to all of them.
  const STATION_MIN_SAMPLES = 3;
  const stationEntries = Object.entries(stationPrices);
  const passing = stationEntries.filter(([, prices]) => prices.length >= STATION_MIN_SAMPLES);
  const sourceEntries = passing.length > 0 ? passing : stationEntries;

  const stationRanking = sourceEntries
    .map(([key, prices]) => ({
      // Use the human-readable name we stashed, not the bucket key
      // (which may be a station_id).
      station: stationMeta[key]?.name || key,
      avg: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      min: Math.min(...prices),
      count: prices.length,
      id: stationMeta[key]?.id,
      brand: stationMeta[key]?.brand,
    }))
    .sort((left, right) => left.avg - right.avg);

  const allMin = datedEntries.map((entry) => entry.min_price);
  const allMax = datedEntries.map((entry) => entry.max_price);
  const timestamps = datedEntries.map((entry) => entry.timestampDate.getTime());
  const since = timestamps.length ? new Date(Math.min(...timestamps)).toISOString() : null;
  const until = timestamps.length ? new Date(Math.max(...timestamps)).toISOString() : null;

  return {
    dayAvgs,
    hourAvgs,
    stationRanking,
    overall: {
      lowest_ever: allMin.length ? Math.min(...allMin) : 0,
      highest_ever: allMax.length ? Math.max(...allMax) : 0,
      avg: allMin.length ? allMin.reduce((sum, value) => sum + value, 0) / allMin.length : 0,
      entries: datedEntries.length,
      since,
      until
    }
  };
}
