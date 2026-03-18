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
  const stationPrices: Record<string, number[]> = {};

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
        stationPrices[sp.station_name] = stationPrices[sp.station_name] ?? [];
        stationPrices[sp.station_name].push(sp.price);
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

  const stationRanking = Object.entries(stationPrices)
    .map(([station, prices]) => ({
      station,
      avg: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      min: Math.min(...prices),
      count: prices.length
    }))
    .sort((left, right) => left.avg - right.avg);

  const allMin = datedEntries.map((entry) => entry.min_price);
  const allMax = datedEntries.map((entry) => entry.max_price);

  return {
    dayAvgs,
    hourAvgs,
    stationRanking,
    overall: {
      lowest_ever: allMin.length ? Math.min(...allMin) : 0,
      highest_ever: allMax.length ? Math.max(...allMax) : 0,
      avg: allMin.length ? allMin.reduce((sum, value) => sum + value, 0) / allMin.length : 0,
      entries: datedEntries.length
    }
  };
}
