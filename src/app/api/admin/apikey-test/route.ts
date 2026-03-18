import { NextRequest, NextResponse } from 'next/server';
import { getAdminRequestContext } from '@/lib/admin';
import { loadRepoConfig } from '@/config';
import { fetchJson } from '@/lib/http';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const apiKey = typeof body.apiKey === 'string' && body.apiKey.trim()
    ? body.apiKey.trim()
    : loadRepoConfig().api_key;

  if (!apiKey) {
    return NextResponse.json({ error: 'Kein API-Key konfiguriert.' }, { status: 400 });
  }

  // Use a central location in Germany for the test request
  const url = `https://creativecommons.tankerkoenig.de/json/list.php?lat=51.1657&lng=10.4515&rad=5&sort=price&type=diesel&apikey=${apiKey}`;

  try {
    const { data } = await fetchJson<{ ok?: boolean; message?: string; stations?: unknown[] }>(url);
    if (data.ok) {
      return NextResponse.json({ ok: true, stations: (data.stations || []).length });
    }
    return NextResponse.json({ error: data.message || 'API hat einen Fehler zurückgegeben.' }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? `${err.message}${err.cause ? ` (${err.cause})` : ''}` : 'Unbekannter Fehler';
    return NextResponse.json({ error: `API-Fehler: ${msg}` }, { status: 502 });
  }
}
