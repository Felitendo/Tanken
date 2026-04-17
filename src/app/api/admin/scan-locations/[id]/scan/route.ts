import { NextRequest, NextResponse } from 'next/server';
import { getAdminRequestContext } from '@/lib/admin';
import { getScheduler } from '@/lib/scheduler';

export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  const { id } = await params;
  const result = await getScheduler().scanSingleLocation(id);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? 'Scan fehlgeschlagen.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, stationCount: result.stationCount });
}
