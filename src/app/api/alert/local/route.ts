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
  email: z.string().email().optional()
});

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

  const alert = await stores.userStore.writeLocalAlert({
    threshold,
    fuel: parsed.data.fuel || runtimeConfig.repoConfig.fuel_type,
    enabled: parsed.data.enabled !== false,
    channel: parsed.data.channel || 'ntfy',
    ntfyTopic: parsed.data.ntfyTopic || '',
    email: parsed.data.email || '',
    created: new Date().toISOString()
  });

  return NextResponse.json({ ok: true, alert });
}

export async function DELETE() {
  await stores.userStore.deleteLocalAlert();
  return NextResponse.json({ ok: true });
}
