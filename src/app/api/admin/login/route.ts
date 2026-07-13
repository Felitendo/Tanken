import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stores } from '@/lib/server-runtime';
import { normalizeUsername, verifyPassword } from '@/lib/local-auth';
import { isKeyedLimited, recordKeyedCall } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1)
});

// Brute-force slowdown: 5 failed attempts per IP per 15 minutes.
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILURES = 5;

function clientKey(request: NextRequest): string {
  const fwd = request.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0].trim() : request.headers.get('x-real-ip')) || 'unknown';
}

export async function POST(request: NextRequest) {
  const adminCount = await stores.userStore.countAdminUsers();
  if (adminCount === 0) {
    return NextResponse.json({ error: 'Admin-Setup fehlt noch.' }, { status: 409 });
  }

  const key = `admin-login:${clientKey(request)}`;
  if (isKeyedLimited(key, LOGIN_MAX_FAILURES, LOGIN_WINDOW_MS)) {
    return NextResponse.json({ error: 'Zu viele Anmeldeversuche. Bitte in ein paar Minuten erneut versuchen.' }, { status: 429 });
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Login-Daten.' }, { status: 400 });
  }

  const usernameLower = normalizeUsername(parsed.data.username);
  const user = await stores.userStore.findLocalUserByUsername(usernameLower);

  if (!user?.localAuth?.passwordHash || !verifyPassword(parsed.data.password, user.localAuth.passwordHash) || !user.roles?.includes('admin')) {
    recordKeyedCall(key, LOGIN_WINDOW_MS);
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
