import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@/lib/request-context';
import { stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
}

// Legacy per-user alert endpoints. The current client uses /api/alert
// (session-based) and /api/alert/local; these /:userId variants exist only
// for backwards compat. Both methods require the caller to own the id —
// previously they fell through to readLegacyAlert/deleteLegacyAlert for any
// userId, which read/deleted alerts from the same users.data_json column
// (an IDOR allowing anyone to enumerate or wipe other users' alerts).

export async function GET(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  const { user } = await getRequestContext(request);
  const { userId } = await context.params;

  if (!user || userId !== user.id) return unauthorized();
  return NextResponse.json(user.alerts?.price || null);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  const { user } = await getRequestContext(request);
  const { userId } = await context.params;

  if (!user || userId !== user.id) return unauthorized();

  await stores.userStore.updateUser(user.id, (currentUser) => {
    currentUser.alerts = currentUser.alerts || {};
    delete currentUser.alerts.price;
  });
  return NextResponse.json({ ok: true });
}
