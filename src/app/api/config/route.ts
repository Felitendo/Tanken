import { NextResponse } from 'next/server';
import { runtimeConfig } from '@/lib/server-runtime';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    smtpConfigured: Boolean(runtimeConfig.repoConfig.smtp?.host && runtimeConfig.repoConfig.smtp?.from),
    fuel_type: runtimeConfig.repoConfig.fuel_type,
    radius_km: runtimeConfig.repoConfig.radius_km,
    refresh_interval_minutes: runtimeConfig.repoConfig.refresh_interval_minutes,
    thresholds: runtimeConfig.repoConfig.thresholds,
    auth: {
      provider: 'oidc',
      oidcConfigured: Boolean(runtimeConfig.oidcIssuerUrl && runtimeConfig.oidcClientId && runtimeConfig.oidcClientSecret),
      issuerUrl: runtimeConfig.oidcIssuerUrl,
      clientId: runtimeConfig.oidcClientId,
      oidcName: runtimeConfig.repoConfig.auth.oidc.name || '',
      browserLoginProvider: 'felo-id',
      adminPanelPath: '/admin',
      sessionCookie: runtimeConfig.cookieName,
      notes: {
        oidc:
          runtimeConfig.oidcIssuerUrl && runtimeConfig.oidcClientId && runtimeConfig.oidcClientSecret
            ? null
            : 'OIDC im Admin Panel unter /admin konfigurieren.'
      }
    }
  });
}
