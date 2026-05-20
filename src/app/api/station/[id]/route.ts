import { NextResponse } from 'next/server';
import { runtimeConfig } from '@/lib/server-runtime';
import { fetchJson } from '@/lib/http';
import { findCachedStationById, getAllUniqueStationsForFuel } from '@/lib/station-cache';

export const runtime = 'nodejs';

interface DetailResponse {
  id: string;
  name: string;
  brand: string;
  street: string;
  houseNumber: string;
  postCode: string | number;
  place: string;
  lat: number | null;
  lng: number | null;
  isOpen: boolean;
  e5: number | null;
  e10: number | null;
  diesel: number | null;
  openingTimes: Array<{ text: string; start: string; end: string }> | null;
  wholeDay: boolean;
  overrides?: unknown;
}

/**
 * Build the response shape (matching Tankerkönig detail.php) from our
 * in-memory scan cache. Used as the primary source for AT and as the
 * fallback when detail.php fails for DE.
 */
function buildFromCache(id: string): DetailResponse | null {
  const cached = findCachedStationById(id);
  if (!cached) return null;
  const { station } = cached;
  const priceFor = (fuel: string): number | null => {
    if (cached.fuelType === fuel && typeof station.price === 'number' && station.price > 0) {
      return station.price;
    }
    const hit = getAllUniqueStationsForFuel(fuel).find((s) => s.id === id);
    return hit && typeof hit.price === 'number' && hit.price > 0 ? hit.price : null;
  };
  return {
    id: station.id,
    name: station.name,
    brand: station.brand,
    street: station.street,
    houseNumber: station.houseNumber,
    postCode: station.postCode,
    place: station.place,
    lat: station.lat,
    lng: station.lng,
    isOpen: station.isOpen,
    e5: priceFor('e5'),
    e10: priceFor('e10'),
    diesel: priceFor('diesel'),
    openingTimes: null,
    wholeDay: false,
  };
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Austrian stations carry an `at-…` id that Tankerkönig's detail.php
    // does not understand. The scan cache is the only source of truth.
    if (id.startsWith('at-')) {
      const fromCache = buildFromCache(id);
      if (!fromCache) {
        return NextResponse.json({ error: 'Station not in cache' }, { status: 404 });
      }
      return NextResponse.json(fromCache);
    }

    // German stations: try detail.php first (richest data — opening
    // hours, fresh isOpen). If that fails (missing api key, rate limit,
    // 404 from Tankerkönig), fall back to the in-memory cache so the
    // Stats/Verlauf popup still gets address, lat/lng, brand, isOpen.
    if (runtimeConfig.apiKey) {
      try {
        const url = `https://creativecommons.tankerkoenig.de/json/detail.php?id=${id}&apikey=${runtimeConfig.apiKey}`;
        const { data } = await fetchJson<{ ok?: boolean; message?: string; station?: unknown }>(url);
        if (data.ok && data.station) {
          return NextResponse.json(data.station);
        }
      } catch {
        /* fall through to cache */
      }
    }

    const fromCache = buildFromCache(id);
    if (fromCache) {
      return NextResponse.json(fromCache);
    }
    return NextResponse.json({ error: 'Station not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
