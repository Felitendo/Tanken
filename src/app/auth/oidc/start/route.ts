import { NextRequest, NextResponse } from 'next/server';
import { createPkcePair, getOidcDiscovery } from '@/lib/oidc';
import { runtimeConfig, stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  if (!runtimeConfig.oidcIssuerUrl || !runtimeConfig.oidcClientId || !runtimeConfig.oidcClientSecret) {
    return new NextResponse('OIDC nicht konfiguriert.', { status: 503 });
  }

  const redirectParam = request.nextUrl.searchParams.get('redirect');
  const redirectAfter = redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//') ? redirectParam : '/';

  // Native-app login: companion apps pass `mode=app` + an `app_redirect` custom-scheme URL. The
  // callback then redirects there with the signed session token instead of setting a cookie.
  const appRedirectParam = request.nextUrl.searchParams.get('app_redirect');
  const appRedirect = request.nextUrl.searchParams.get('mode') === 'app' &&
    appRedirectParam && /^tanken:\/\//.test(appRedirectParam)
    ? appRedirectParam
    : undefined;

  const discovery = await getOidcDiscovery(runtimeConfig);
  const { state, codeVerifier, codeChallenge } = createPkcePair();

  await stores.oidcStateStore.stashOauthState(state, {
    redirectAfter,
    codeVerifier,
    createdAt: Date.now(),
    ...(appRedirect ? { appRedirect } : {})
  });

  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host;
  const redirectUri = `${proto}://${host}/auth/oidc/callback`;
  const params = new URLSearchParams({
    client_id: runtimeConfig.oidcClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: runtimeConfig.oidcScope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  return NextResponse.redirect(`${String(discovery.authorization_endpoint)}?${params.toString()}`);
}
