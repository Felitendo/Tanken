import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@/lib/request-context';
import { stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

export async function GET(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  const { user } = await getRequestContext(request);
  const { userId } = await context.params;

  if (user && userId === user.id) {
    return NextResponse.json(user.alerts?.price || null);
  }

  return NextResponse.json(await stores.userStore.readLegacyAlert(userId));
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  const { user } = await getRequestContext(request);
  const { userId } = await context.params;

  if (user && userId === user.id) {
    await stores.userStore.updateUser(user.id, (currentUser) => {
      currentUser.alerts = currentUser.alerts || {};
      delete currentUser.alerts.price;
    });
    return NextResponse.json({ ok: true });
  }

  await stores.userStore.deleteLegacyAlert(userId);
  return NextResponse.json({ ok: true, legacy: true });
}
