import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runtimeConfig, stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

const alertSchema = z.object({
  threshold: z.union([z.number(), z.string()]),
  fuel: z.enum(['diesel', 'e5', 'e10']).optional(),
  enabled: z.boolean().optional(),
  channel: z.enum(['ntfy', 'email']).optional(),
  ntfyTopic: z.string().optional(),
  email: z.string().email().optional(),
  lat: z.union([z.number(), z.string()]).optional(),
  lng: z.union([z.number(), z.string()]).optional(),
  radiusKm: z.union([z.number(), z.string()]).optional()
});

function toFiniteNumber(v: unknown): number | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  const n = typeof v === 'number' ? v : Number.parseFloat(String(v));
  return Number.isFinite(n) ? n : undefined;
}

export async function GET() {
  return NextResponse.json(await stores.userStore.readLocalAlert());
}

export async function POST(request: NextRequest) {
  const parsed = alertSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'threshold required' }, { status: 400 });
  }

  const threshold = Number.parseFloat(String(parsed.data.threshold));
  if (!Number.isFinite(threshold)) {
    return NextResponse.json({ error: 'threshold required' }, { status: 400 });
  }

  const lat = toFiniteNumber(parsed.data.lat);
  const lng = toFiniteNumber(parsed.data.lng);
  const radiusKm = toFiniteNumber(parsed.data.radiusKm) ?? 25;
  const existing = (await stores.userStore.readLocalAlert()) || {};

  const alert = await stores.userStore.writeLocalAlert({
    threshold,
    fuel: parsed.data.fuel || runtimeConfig.repoConfig.fuel_type,
    enabled: parsed.data.enabled !== false,
    channel: parsed.data.channel || 'ntfy',
    ntfyTopic: parsed.data.ntfyTopic || '',
    email: parsed.data.email || '',
    ...(Number.isFinite(lat) && Number.isFinite(lng)
      ? { lat, lng, radiusKm }
      : (typeof existing.lat === 'number' && typeof existing.lng === 'number'
          ? { lat: existing.lat, lng: existing.lng, radiusKm: typeof existing.radiusKm === 'number' ? existing.radiusKm : 25 }
          : {})),
    // New threshold/area resets the dedupe state.
    lastNotifiedAt: undefined,
    lastNotifiedPrice: undefined,
    created: typeof existing.created === 'string' ? existing.created : new Date().toISOString(),
    updated: new Date().toISOString()
  });

  return NextResponse.json({ ok: true, alert });
}

export async function DELETE() {
  await stores.userStore.deleteLocalAlert();
  return NextResponse.json({ ok: true });
}
