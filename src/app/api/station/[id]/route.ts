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

// Server-side cache for detail.php responses. Opening hours barely
// change, so a long TTL means we hit Tankerkönig at most once per
// station per week instead of once per popup-open.
interface DetailCacheEntry { detail: unknown; expiresAt: number }
const DETAIL_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const detailCacheKey = '__tanken_detail_cache' as const;
const globalDetail = globalThis as unknown as Record<string, Map<string, DetailCacheEntry>>;
function detailCache(): Map<string, DetailCacheEntry> {
  if (!globalDetail[detailCacheKey]) globalDetail[detailCacheKey] = new Map();
  return globalDetail[detailCacheKey];
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Cache-first for everything: the scheduler already keeps the scan
    // cache fresh with address, lat/lng, isOpen and price. The only
    // thing detail.php adds is opening hours — and those change so
    // rarely that we only need them once per station per week.
    const fromCache = buildFromCache(id);

    // Austrian stations: Tankerkönig's detail.php doesn't know `at-…`
    // ids. The scan cache is the only source of truth.
    if (id.startsWith('at-')) {
      if (!fromCache) {
        return NextResponse.json({ error: 'Station not in cache' }, { status: 404 });
      }
      return NextResponse.json(fromCache);
    }

    // German stations: prefer the scan cache. Opening hours come from
    // the long-lived detail cache. If we have neither yet, call
    // detail.php exactly once for this station and cache it for a week.
    const cachedDetail = detailCache().get(id);
    const haveFreshDetail = cachedDetail && cachedDetail.expiresAt > Date.now();

    if (fromCache && haveFreshDetail) {
      const d = cachedDetail.detail as { openingTimes?: unknown; wholeDay?: unknown };
      return NextResponse.json({
        ...fromCache,
        openingTimes: d.openingTimes ?? null,
        wholeDay: Boolean(d.wholeDay),
      });
    }

    if (runtimeConfig.apiKey && !haveFreshDetail) {
      try {
        const url = `https://creativecommons.tankerkoenig.de/json/detail.php?id=${id}&apikey=${runtimeConfig.apiKey}`;
        const { data } = await fetchJson<{ ok?: boolean; message?: string; station?: unknown }>(url);
        if (data.ok && data.station) {
          detailCache().set(id, { detail: data.station, expiresAt: Date.now() + DETAIL_TTL_MS });
          // Scan cache wins for live fields (price, isOpen) because the
          // scheduler refreshes it on every cycle. detail.php is only
          // used to enrich with opening hours.
          if (fromCache) {
            const d = data.station as { openingTimes?: unknown; wholeDay?: unknown };
            return NextResponse.json({
              ...fromCache,
              openingTimes: d.openingTimes ?? null,
              wholeDay: Boolean(d.wholeDay),
            });
          }
          return NextResponse.json(data.station);
        }
      } catch {
        /* fall through */
      }
    }

    // detail.php unreachable but we still have scan-cache data — serve
    // it without opening hours.
    if (fromCache) return NextResponse.json(fromCache);

    // Stale-but-cached detail beats nothing if everything else failed.
    if (cachedDetail) return NextResponse.json(cachedDetail.detail);

    return NextResponse.json({ error: 'Station not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
