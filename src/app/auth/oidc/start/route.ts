import { NextRequest, NextResponse } from 'next/server';
import { createPkcePair, getOidcDiscovery } from '@/lib/oidc';
import { runtimeConfig, stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  if (!runtimeConfig.oidcIssuerUrl || !runtimeConfig.oidcClientId || !runtimeConfig.oidcClientSecret || !runtimeConfig.oidcRedirectUri) {
    return new NextResponse('OIDC nicht konfiguriert.', { status: 503 });
  }

  const redirectParam = request.nextUrl.searchParams.get('redirect');
  const redirectAfter = redirectParam && redirectParam.startsWith('/') ? redirectParam : '/';
  const discovery = await getOidcDiscovery(runtimeConfig);
  const { state, codeVerifier, codeChallenge } = createPkcePair();

  await stores.oidcStateStore.stashOauthState(state, {
    redirectAfter,
    codeVerifier,
    createdAt: Date.now()
  });

  const params = new URLSearchParams({
    client_id: runtimeConfig.oidcClientId,
    redirect_uri: runtimeConfig.oidcRedirectUri,
    response_type: 'code',
    scope: runtimeConfig.oidcScope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  return NextResponse.redirect(`${String(discovery.authorization_endpoint)}?${params.toString()}`);
}
