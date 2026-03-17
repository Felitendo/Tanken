import { NextRequest } from 'next/server';
import { runtimeConfig, stores } from '@/lib/server-runtime';

export async function getRequestContext(request: NextRequest) {
  const session = await stores.sessionStore.getSessionFromCookie(request.cookies.get(runtimeConfig.cookieName)?.value);
  const user = session ? await stores.userStore.getUserById(session.userId) : null;

  return {
    session,
    user
  };
}
