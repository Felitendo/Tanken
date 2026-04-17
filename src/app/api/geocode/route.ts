import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@/lib/request-context';

export const runtime = 'nodejs';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'Tanken/1.0 (https://github.com/ftrepoxyz/Tanken)';

// Nominatim policy: max 1 req/sec. Serialise calls globally.
let lastCallAt = 0;
const MIN_INTERVAL_MS = 1100;

async function throttle() {
  const now = Date.now();
  const wait = lastCallAt + MIN_INTERVAL_MS - now;
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  lastCallAt = Date.now();
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export async function GET(request: NextRequest) {
  const { user } = await getRequestContext(request);
  if (!user) {
    return NextResponse.json({ error: 'Anmeldung erforderlich.' }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const q = params.get('q')?.trim() ?? '';
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }
  const langParam = params.get('lang');
  const lang = langParam === 'en' ? 'en' : 'de';

  await throttle();

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '5');
  url.searchParams.set('accept-language', lang);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Nominatim: ${res.status}` }, { status: 502 });
    }
    const data = (await res.json()) as NominatimResult[];
    const results = data.map((r) => ({
      name: r.display_name,
      lat: Number(r.lat),
      lng: Number(r.lon),
    })).filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lng));
    return NextResponse.json({ results });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Geocoding fehlgeschlagen: ${msg}` }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
