import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fromAdminConfig, adminConfigSchema, toAdminConfig } from '@/lib/admin-config';
import { hashPassword, normalizeUsername } from '@/lib/local-auth';
import { saveRepoConfig } from '@/config';
import { stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

const bootstrapSchema = z.object({
  username: z.string().trim().min(3).max(64),
  password: z.string().min(8).max(256),
  config: adminConfigSchema
});

export async function POST(request: NextRequest) {
  const adminCount = await stores.userStore.countAdminUsers();
  if (adminCount > 0) {
    return NextResponse.json({ error: 'Setup bereits abgeschlossen.' }, { status: 409 });
  }

  const parsed = bootstrapSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Setup-Daten.' }, { status: 400 });
  }

  const username = parsed.data.username.trim();
  const usernameLower = normalizeUsername(username);
  const existingUser = await stores.userStore.findLocalUserByUsername(usernameLower);
  if (existingUser) {
    return NextResponse.json({ error: 'Benutzername bereits vorhanden.' }, { status: 409 });
  }

  const nextConfig = fromAdminConfig(parsed.data.config);
  saveRepoConfig(nextConfig);

  const user = await stores.userStore.upsertUser(`local:${usernameLower}`, {
    authProvider: 'local',
    providerId: usernameLower,
    username,
    displayName: username,
    roles: ['admin'],
    localAuth: {
      usernameLower,
      passwordHash: hashPassword(parsed.data.password)
    }
  });

  const session = await stores.sessionStore.createSession(user.id, 'local');
  const response = NextResponse.json({
    ok: true,
    user: stores.userStore.sanitizeUser(user),
    config: toAdminConfig(nextConfig)
  });

  response.headers.set('Set-Cookie', stores.sessionStore.setSessionCookie(session.id));
  return response;
}
