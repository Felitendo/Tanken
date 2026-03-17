import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@/lib/request-context';
import { runtimeConfig, stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { user } = await getRequestContext(request);
  const sanitizedUser = stores.userStore.sanitizeUser(user);

  return NextResponse.json({
    authenticated: Boolean(sanitizedUser),
    user: sanitizedUser,
    auth: {
      provider: 'oidc',
      configured: Boolean(runtimeConfig.oidcIssuerUrl && runtimeConfig.oidcClientId && runtimeConfig.oidcClientSecret && runtimeConfig.oidcRedirectUri),
      adminPanelPath: '/admin'
    }
  });
}
