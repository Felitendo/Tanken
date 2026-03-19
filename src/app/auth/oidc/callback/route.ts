import { NextRequest, NextResponse } from 'next/server';
import { fetchJson } from '@/lib/http';
import { getOidcDiscovery, parseJwtClaims } from '@/lib/oidc';
import { runtimeConfig, stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');

    if (!code || !state) {
      return new NextResponse('OIDC callback unvollständig.', { status: 400 });
    }

    const saved = await stores.oidcStateStore.consumeOauthState(state);
    if (!saved) {
      return new NextResponse('OIDC state ungültig oder abgelaufen.', { status: 400 });
    }

    const discovery = await getOidcDiscovery(runtimeConfig);
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host;
    const redirectUri = `${proto}://${host}/auth/oidc/callback`;
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: runtimeConfig.oidcClientId,
      client_secret: runtimeConfig.oidcClientSecret,
      code_verifier: saved.codeVerifier
    });

    const tokenResponse = await fetchJson<{
      access_token?: string;
      id_token?: string;
    }>(String(discovery.token_endpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (tokenResponse.status >= 400 || !tokenResponse.data.access_token) {
      return new NextResponse('OIDC Token-Tausch fehlgeschlagen.', { status: 400 });
    }

    let claims: Record<string, unknown> = {};
    if (discovery.userinfo_endpoint) {
      const userInfo = await fetchJson<Record<string, unknown>>(String(discovery.userinfo_endpoint), {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`
        }
      });
      claims = userInfo.data || {};
    }

    const idClaims = parseJwtClaims(tokenResponse.data.id_token) || {};
    const merged = { ...idClaims, ...claims };
    const subject = String(merged.sub ?? idClaims.sub ?? '');

    if (!subject) {
      return new NextResponse('OIDC claims ohne sub.', { status: 400 });
    }

    const usernameClaim = runtimeConfig.repoConfig.auth.oidc.username_claim || 'preferred_username';
    const usernameValue = String(merged[usernameClaim] ?? merged.preferred_username ?? '');
    const pictureClaim = runtimeConfig.repoConfig.auth.oidc.picture_claim || 'picture';
    const pictureValue = String(merged[pictureClaim] ?? merged.picture ?? '');

    const user = await stores.userStore.upsertUser(`oidc:${subject}`, {
      authProvider: 'oidc',
      providerId: subject,
      displayName: usernameValue || String(merged.name ?? merged.email ?? 'Felo ID'),
      firstName: String(merged.given_name ?? ''),
      lastName: String(merged.family_name ?? ''),
      username: usernameValue,
      email: String(merged.email ?? ''),
      emailVerified: Boolean(merged.email_verified),
      photoUrl: pictureValue,
      oidc: merged
    });

    const session = await stores.sessionStore.createSession(user.id, 'oidc');
    const origin = `${proto}://${host}`;
    const response = NextResponse.redirect(new URL(saved.redirectAfter || '/', origin));
    response.headers.set('Set-Cookie', stores.sessionStore.setSessionCookie(session.id));
    return response;
  } catch {
    return new NextResponse('OIDC Callback kaputt.', { status: 500 });
  }
}
