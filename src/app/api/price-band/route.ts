import { NextRequest, NextResponse } from 'next/server';
import { getCountryPriceBand } from '@/lib/history-store';

export const runtime = 'nodejs';

const ALLOWED_FUELS = new Set(['diesel', 'e5', 'e10']);

export async function GET(request: NextRequest) {
  const fuel = request.nextUrl.searchParams.get('fuel') || 'diesel';
  if (!ALLOWED_FUELS.has(fuel)) {
    return NextResponse.json({ error: 'invalid fuel' }, { status: 400 });
  }
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
