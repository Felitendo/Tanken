import { NextRequest, NextResponse } from 'next/server';
import { getCountryPriceBand, getRegionalPriceBand } from '@/lib/history-store';

export const runtime = 'nodejs';

const ALLOWED_FUELS = new Set(['diesel', 'e5', 'e10']);
const DEFAULT_RADIUS_KM = 100;
const MAX_RADIUS_KM = 300;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const fuel = params.get('fuel') || 'diesel';
  if (!ALLOWED_FUELS.has(fuel)) {
    return NextResponse.json({ error: 'invalid fuel' }, { status: 400 });
  }

  const latRaw = params.get('lat');
  const lngRaw = params.get('lng');
  const lat = latRaw != null ? Number(latRaw) : NaN;
  const lng = lngRaw != null ? Number(lngRaw) : NaN;

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    const radiusRaw = Number(params.get('radius'));
    const radius = Number.isFinite(radiusRaw) && radiusRaw > 0
      ? Math.min(radiusRaw, MAX_RADIUS_KM)
      : DEFAULT_RADIUS_KM;
    const band = await getRegionalPriceBand(lat, lng, radius, fuel);
    return NextResponse.json({
      fuel,
      band: band ? { p10: band.p10, p50: band.p50, p90: band.p90, samples: band.samples } : null,
      radiusKm: radius,
      generatedAt: new Date().toISOString(),
    });
  }

  // Legacy country-wide response — retained so old in-flight clients keep
  // colouring stations after a deploy until they refresh.
  const [at, de] = await Promise.all([
    getCountryPriceBand('at', fuel),
    getCountryPriceBand('de', fuel),
  ]);
  return NextResponse.json({
    fuel,
    at: at ? { p10: at.p10, p50: at.p50, p90: at.p90 } : null,
    de: de ? { p10: de.p10, p50: de.p50, p90: de.p90 } : null,
    generatedAt: new Date().toISOString(),
  });
}
