import { NextResponse } from 'next/server';
import { runtimeConfig, stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

export async function GET() {
  const adminUsers = await stores.userStore.countAdminUsers();

  return NextResponse.json({
    status: 'ready',
    apiKeyConfigured: Boolean(runtimeConfig.apiKey),
    adminConfigured: adminUsers > 0,
    oidcConfigured: Boolean(runtimeConfig.oidcIssuerUrl && runtimeConfig.oidcClientId && runtimeConfig.oidcClientSecret && runtimeConfig.oidcRedirectUri),
    timestamp: new Date().toISOString()
  });
}
