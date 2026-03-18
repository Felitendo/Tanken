import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runtimeConfig } from '@/lib/server-runtime';
import { fetchJson } from '@/lib/http';

export const runtime = 'nodejs';

const fuelTypeSchema = z.enum(['diesel', 'e5', 'e10']);

/* ── In-memory response cache ────────────────────────────────── */
interface CacheEntry {
  stations: unknown[];
  timestamp: number;
}

const stationCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 2 * 60 * 1000;      // fresh for 2 min
const STALE_TTL_MS = 15 * 60 * 1000;     // serve stale max 15 min
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;
const FETCH_TIMEOUT_MS = 8000;

function cacheKey(lat: number, lng: number, rad: number, fuel: string) {
  // Round coords to ~1 km grid so nearby requests share cache
  const rLat = Math.round(lat * 100) / 100;
  const rLng = Math.round(lng * 100) / 100;
  return `${rLat},${rLng},${rad},${fuel}`;
}

function getCached(key: string): { entry: CacheEntry; stale: boolean } | null {
  const entry = stationCache.get(key);
  if (!entry) return null;
  const age = Date.now() - entry.timestamp;
  if (age > STALE_TTL_MS) {
    stationCache.delete(key);
    return null;
  }
  return { entry, stale: age > CACHE_TTL_MS };
}

function setCache(key: string, stations: unknown[]) {
  // Evict oldest entries if cache grows too large
  if (stationCache.size > 200) {
    const oldest = stationCache.keys().next().value;
    if (oldest) stationCache.delete(oldest);
  }
  stationCache.set(key, { stations, timestamp: Date.now() });
}

/* ── Fetch with timeout ──────────────────────────────────────── */
async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchJson<{ ok?: boolean; message?: string; stations?: unknown[] }>(
      url, { signal: controller.signal }
    );
  } finally {
    clearTimeout(timer);
  }
}

/* ── Retry wrapper ───────────────────────────────────────────── */
async function fetchStationsWithRetry(url: string): Promise<unknown[]> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { data } = await fetchWithTimeout(url, FETCH_TIMEOUT_MS);
      if (data.ok) return data.stations || [];
      // API returned ok:false (rate-limit, bad key, etc.)
      lastError = new Error(data.message || 'API error');
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Unknown error');
    }

    // Wait before retry (exponential backoff)
    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    }
  }

  throw lastError || new Error('All retries failed');
}

/* ── Route handler ───────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  // Default to geographic center of Germany
  const lat = Number.parseFloat(request.nextUrl.searchParams.get('lat') ?? '') || 51.1657;
  const lng = Number.parseFloat(request.nextUrl.searchParams.get('lng') ?? '') || 10.4515;
  const rad = Number.parseFloat(request.nextUrl.searchParams.get('rad') ?? '') || runtimeConfig.repoConfig.radius_km;
  const fuelCandidate = request.nextUrl.searchParams.get('fuel');
  const fuel = fuelTypeSchema.safeParse(fuelCandidate).success ? fuelCandidate! : runtimeConfig.repoConfig.fuel_type;

  const key = cacheKey(lat, lng, rad, fuel);
  const cached = getCached(key);

  // Return fresh cache immediately (no API call needed)
  if (cached && !cached.stale) {
    return NextResponse.json(cached.entry.stations, {
      headers: { 'X-Cache': 'hit' }
    });
  }

  // Try fetching fresh data
  const url = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${lat}&lng=${lng}&rad=${rad}&sort=price&type=${fuel}&apikey=${runtimeConfig.apiKey}`;

  try {
    const stations = await fetchStationsWithRetry(url);
    setCache(key, stations);
    return NextResponse.json(stations, {
      headers: { 'X-Cache': 'fresh' }
    });
  } catch (error) {
    // API failed after retries — serve stale cache if available
    if (cached) {
      return NextResponse.json(cached.entry.stations, {
        headers: { 'X-Cache': 'stale' }
      });
    }

    // No cache at all — return error
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 502 }
    );
  }
}
