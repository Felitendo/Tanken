import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getRequestContext } from '@/lib/request-context';
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

export async function GET(request: NextRequest) {
  const { user } = await getRequestContext(request);
  const profile = stores.userStore.getEffectiveUserProfile(user);
  return NextResponse.json(profile.alerts.price || null);
}

export async function POST(request: NextRequest) {
  const { user } = await getRequestContext(request);
  if (!user) {
    return NextResponse.json({ error: 'Login erforderlich', loginRequired: true }, { status: 401 });
  }

  const parsed = alertSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'threshold required' }, { status: 400 });
  }

  const threshold = Number.parseFloat(String(parsed.data.threshold));
  if (!Number.isFinite(threshold)) {
    return NextResponse.json({ error: 'threshold required' }, { status: 400 });
  }

  const lat = toFiniteNumber(parsed.data.lat) ?? user.alerts?.price?.lat;
  const lng = toFiniteNumber(parsed.data.lng) ?? user.alerts?.price?.lng;
  const radiusKm = toFiniteNumber(parsed.data.radiusKm) ?? user.alerts?.price?.radiusKm ?? 25;

  const alert = {
    threshold,
    fuel: parsed.data.fuel || user.settings.fuelType || runtimeConfig.repoConfig.fuel_type,
    enabled: parsed.data.enabled !== false,
    channel: parsed.data.channel || user.alerts?.price?.channel || 'ntfy',
    ntfyTopic: parsed.data.ntfyTopic || user.alerts?.price?.ntfyTopic || '',
    email: parsed.data.email || user.alerts?.price?.email || '',
    ...(Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng, radiusKm } : {}),
    // New threshold/area resets the dedupe state — the next eval can fire fresh.
    lastNotifiedAt: undefined,
    lastNotifiedPrice: undefined,
    created: user.alerts?.price?.created || new Date().toISOString(),
    updated: new Date().toISOString()
  };

  await stores.userStore.updateUser(user.id, (currentUser) => {
    currentUser.alerts = currentUser.alerts || {};
    currentUser.alerts.price = alert;
  });

  return NextResponse.json({
    ok: true,
    alert,
    message: `Alarm gesetzt: Benachrichtigung unter ${alert.threshold}€`
  });
}

export async function DELETE(request: NextRequest) {
  const { user } = await getRequestContext(request);
  if (!user) {
    return NextResponse.json({ error: 'Login erforderlich', loginRequired: true }, { status: 401 });
  }

  await stores.userStore.updateUser(user.id, (currentUser) => {
    currentUser.alerts = currentUser.alerts || {};
    delete currentUser.alerts.price;
  });

  return NextResponse.json({ ok: true });
}
