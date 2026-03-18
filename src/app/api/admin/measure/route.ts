import { NextRequest, NextResponse } from 'next/server';
import { getAdminRequestContext } from '@/lib/admin';
import { runtimeConfig, database } from '@/lib/server-runtime';
import { fetchJson } from '@/lib/http';

export const runtime = 'nodejs';

interface TankerkoenigStation {
  name?: string;
  price?: number;
  isOpen?: boolean;
}

export async function POST(request: NextRequest) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const lat = Number(body.lat) || 51.1657;
  const lng = Number(body.lng) || 10.4515;
  const rad = runtimeConfig.repoConfig.radius_km;
  const fuel = runtimeConfig.repoConfig.fuel_type;
  const apiKey = runtimeConfig.apiKey;

  if (!apiKey) {
    return NextResponse.json({ error: 'Kein API-Key konfiguriert.' }, { status: 400 });
  }

  const url = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${lat}&lng=${lng}&rad=${rad}&sort=price&type=${fuel}&apikey=${apiKey}`;

  try {
    const { data } = await fetchJson<{ ok?: boolean; message?: string; stations?: TankerkoenigStation[] }>(url);
    if (!data.ok || !data.stations?.length) {
      return NextResponse.json({ error: data.message || 'Keine Stationen gefunden.' }, { status: 502 });
    }

    const open = data.stations.filter(s => s.isOpen && typeof s.price === 'number' && s.price > 0);
    if (!open.length) {
      return NextResponse.json({ error: 'Keine offenen Tankstellen mit Preisen gefunden.' }, { status: 404 });
    }

    const prices = open.map(s => s.price!);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const cheapest = open.reduce((a, b) => (a.price! <= b.price! ? a : b));

    const timestamp = new Date().toISOString();

    await database.query(
      `INSERT INTO price_history (timestamp, min_price, avg_price, max_price, station, num_stations)
       VALUES ($1::timestamptz, $2, $3, $4, $5, $6)`,
      [timestamp, minPrice, avgPrice, maxPrice, cheapest.name || '', open.length]
    );

    return NextResponse.json({
      ok: true,
      entry: { timestamp, min_price: minPrice, avg_price: avgPrice, max_price: maxPrice, station: cheapest.name || '', num_stations: open.length }
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return NextResponse.json({ error: `Messung fehlgeschlagen: ${msg}` }, { status: 502 });
  }
}
