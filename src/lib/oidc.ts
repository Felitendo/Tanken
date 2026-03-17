import crypto from 'node:crypto';
import { RuntimeConfig } from '../types';
import { fetchJson } from './http';

let discoveryCache: { issuer: string; expiresAt: number; value: Record<string, unknown> } | null = null;

export function base64url(input: Buffer): string {
  return input.toString('base64url');
}

export function parseJwtClaims(token: string | undefined): Record<string, unknown> | null {
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function getOidcDiscovery(config: RuntimeConfig): Promise<Record<string, unknown>> {
  if (!config.oidcIssuerUrl) {
    throw new Error('OIDC issuer missing');
  }

  if (discoveryCache && discoveryCache.issuer === config.oidcIssuerUrl && discoveryCache.expiresAt > Date.now()) {
    return discoveryCache.value;
  }

  const url = `${config.oidcIssuerUrl.replace(/\/+$/, '')}/.well-known/openid-configuration`;
  const { status, data } = await fetchJson<Record<string, unknown>>(url);

  if (status >= 400) {
    throw new Error(`OIDC discovery failed with status ${status}`);
  }

  discoveryCache = {
    issuer: config.oidcIssuerUrl,
    expiresAt: Date.now() + 1000 * 60 * 5,
    value: data
  };

  return data;
}

export function createPkcePair(): { state: string; codeVerifier: string; codeChallenge: string } {
  const state = crypto.randomBytes(24).toString('base64url');
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = base64url(crypto.createHash('sha256').update(codeVerifier).digest());
  return {
    state,
    codeVerifier,
    codeChallenge
  };
}
