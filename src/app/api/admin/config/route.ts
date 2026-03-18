import { NextRequest, NextResponse } from 'next/server';
import { getAdminRequestContext } from '@/lib/admin';
import { adminConfigSchema, fromAdminConfig, toAdminConfig } from '@/lib/admin-config';
import { loadRepoConfig, saveRepoConfig } from '@/config';
import { getScheduler } from '@/lib/scheduler';

export const runtime = 'nodejs';

function forbidden() {
  return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return forbidden();
  }

  return NextResponse.json({
    config: toAdminConfig(loadRepoConfig())
  });
}

export async function PUT(request: NextRequest) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return forbidden();
  }

  const parsed = adminConfigSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungueltige Konfiguration.' }, { status: 400 });
  }

  const nextConfig = fromAdminConfig(parsed.data);
  saveRepoConfig(nextConfig);

  // Restart or stop scheduler based on new config
  const scheduler = getScheduler();
  if (nextConfig.api_key && (nextConfig.locations ?? []).length > 0) {
    scheduler.restart();
  } else {
    scheduler.stop();
  }

  return NextResponse.json({
    ok: true,
    config: toAdminConfig(nextConfig)
  });
}
