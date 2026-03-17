import { NextRequest, NextResponse } from 'next/server';
import { getAdminRequestContext } from '@/lib/admin';
import { loadRepoConfig } from '@/config';
import { toAdminConfig } from '@/lib/admin-config';
import { stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const adminCount = await stores.userStore.countAdminUsers();
  const { user, isAdmin } = await getAdminRequestContext(request);
  const allowConfig = adminCount === 0 || isAdmin;

  return NextResponse.json({
    bootstrapped: adminCount > 0,
    authenticated: isAdmin,
    user: isAdmin ? stores.userStore.sanitizeUser(user) : null,
    config: allowConfig ? toAdminConfig(loadRepoConfig()) : null
  });
}
