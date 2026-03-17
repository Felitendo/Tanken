import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@/lib/request-context';
import { stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { session } = await getRequestContext(request);
  if (session?.id) {
    await stores.sessionStore.destroySession(session.id);
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set('Set-Cookie', stores.sessionStore.clearSessionCookie());
  return response;
}
