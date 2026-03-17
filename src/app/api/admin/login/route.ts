import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stores } from '@/lib/server-runtime';
import { normalizeUsername, verifyPassword } from '@/lib/local-auth';

export const runtime = 'nodejs';

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const adminCount = await stores.userStore.countAdminUsers();
  if (adminCount === 0) {
    return NextResponse.json({ error: 'Admin-Setup fehlt noch.' }, { status: 409 });
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungueltige Login-Daten.' }, { status: 400 });
  }

  const usernameLower = normalizeUsername(parsed.data.username);
  const user = await stores.userStore.findLocalUserByUsername(usernameLower);

  if (!user?.localAuth?.passwordHash || !verifyPassword(parsed.data.password, user.localAuth.passwordHash) || !user.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Benutzername oder Passwort falsch.' }, { status: 401 });
  }

  const session = await stores.sessionStore.createSession(user.id, 'local');
  const response = NextResponse.json({
    ok: true,
    user: stores.userStore.sanitizeUser(user)
  });

  response.headers.set('Set-Cookie', stores.sessionStore.setSessionCookie(session.id));
  return response;
}
