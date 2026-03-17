import { NextResponse } from 'next/server';
import { runtimeConfig } from '@/lib/server-runtime';
import { fetchJson } from '@/lib/http';

export const runtime = 'nodejs';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const url = `https://creativecommons.tankerkoenig.de/json/detail.php?id=${id}&apikey=${runtimeConfig.apiKey}`;
    const { data } = await fetchJson<{ ok?: boolean; message?: string; station?: unknown }>(url);

    if (!data.ok) {
      return NextResponse.json({ error: data.message || 'API error' }, { status: 500 });
    }

    return NextResponse.json(data.station);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
