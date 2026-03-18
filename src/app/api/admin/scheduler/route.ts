import { NextRequest, NextResponse } from 'next/server';
import { getAdminRequestContext } from '@/lib/admin';
import { getScheduler } from '@/lib/scheduler';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  return NextResponse.json(getScheduler().getStatus());
}

export async function POST(request: NextRequest) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const action = body.action as string;
  const scheduler = getScheduler();

  if (action === 'start') {
    scheduler.start();
  } else if (action === 'stop') {
    scheduler.stop();
  } else if (action === 'restart') {
    scheduler.restart();
  } else if (action === 'scan-now') {
    scheduler.scanNow();
  } else {
    return NextResponse.json({ error: 'Ungültige Aktion. Erlaubt: start, stop, restart, scan-now' }, { status: 400 });
  }

  return NextResponse.json({ ok: true, status: scheduler.getStatus() });
}
