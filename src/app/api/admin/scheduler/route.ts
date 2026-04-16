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
  } else if (action === 'clearCache') {
    await scheduler.clearCache();
  } else if (action === 'triggerNow') {
    scheduler.triggerNow();
  } else if (action === 'gridDiscoveryDe') {
    const started = scheduler.triggerDeGridDiscovery();
    if (!started) {
      return NextResponse.json(
        { error: 'Grid-Discovery konnte nicht gestartet werden (läuft bereits oder kein API-Key).' },
        { status: 409 },
      );
    }
  } else if (action === 'abortGridDiscoveryDe') {
    scheduler.abortDeGridDiscovery();
  } else {
    return NextResponse.json({ error: 'Ungültige Aktion. Erlaubt: start, stop, restart, clearCache, triggerNow, gridDiscoveryDe, abortGridDiscoveryDe' }, { status: 400 });
  }

  return NextResponse.json({ ok: true, status: scheduler.getStatus() });
}
