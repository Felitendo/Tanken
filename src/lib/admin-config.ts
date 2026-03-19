import crypto from 'node:crypto';
import { z } from 'zod';
import { RepoConfig } from '@/types';
import { loadRepoConfig, normalizeRepoConfig } from '@/config';

export const adminConfigSchema = z.object({
  apiKey: z.string().default(''),
  fuelType: z.enum(['diesel', 'e5', 'e10']).default('diesel'),
  radiusKm: z.coerce.number().min(1).max(25).default(10),
  refreshIntervalMinutes: z.coerce.number().min(1).default(60),
  sessionSecret: z.string().optional().default(''),
  thresholds: z.object({
    goodBelowAvgCents: z.coerce.number().default(3),
    okayBelowAvgCents: z.coerce.number().default(1)
  }),
  oidc: z.object({
    issuerUrl: z.string().default(''),
    clientId: z.string().default(''),
    clientSecret: z.string().default(''),
    scope: z.string().default('openid profile email'),
    usernameClaim: z.string().default('preferred_username'),
    pictureClaim: z.string().default('picture'),
    name: z.string().default('')
  }),
  smtp: z.object({
    host: z.string().default(''),
    port: z.coerce.number().min(1).max(65535).default(587),
    secure: z.boolean().default(false),
    user: z.string().default(''),
    pass: z.string().default(''),
    from: z.string().default('')
  }),
  locations: z.array(z.object({
    id: z.string(),
    name: z.string(),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    radiusKm: z.coerce.number().min(1).max(25).default(10),
    fuelType: z.enum(['diesel', 'e5', 'e10']).default('diesel'),
  })).default([])
});

export type AdminConfigInput = z.infer<typeof adminConfigSchema>;

function createSessionSecret() {
  return crypto.randomBytes(32).toString('hex');
}

export function toAdminConfig(config: RepoConfig): AdminConfigInput {
  return {
    apiKey: config.api_key,
    fuelType: config.fuel_type,
    radiusKm: config.radius_km,
    refreshIntervalMinutes: config.refresh_interval_minutes,
    sessionSecret: config.session_secret || '',
    thresholds: {
      goodBelowAvgCents: config.thresholds.good_below_avg_cents,
      okayBelowAvgCents: config.thresholds.okay_below_avg_cents
    },
    oidc: {
      issuerUrl: config.auth.oidc.issuer_url,
      clientId: config.auth.oidc.client_id,
      clientSecret: config.auth.oidc.client_secret,
      scope: config.auth.oidc.scope,
      usernameClaim: config.auth.oidc.username_claim || 'preferred_username',
      pictureClaim: config.auth.oidc.picture_claim || 'picture',
      name: config.auth.oidc.name || ''
    },
    smtp: {
      host: config.smtp?.host || '',
      port: config.smtp?.port || 587,
      secure: config.smtp?.secure || false,
      user: config.smtp?.user || '',
      pass: config.smtp?.pass || '',
      from: config.smtp?.from || ''
    },
    locations: (config.locations ?? []).map(loc => ({
      id: loc.id,
      name: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      radiusKm: loc.radius_km,
      fuelType: loc.fuel_type,
    }))
  };
}

export function fromAdminConfig(input: AdminConfigInput, current: RepoConfig = loadRepoConfig()): RepoConfig {
  return normalizeRepoConfig(
    {
      api_key: input.apiKey,
      fuel_type: input.fuelType,
      radius_km: input.radiusKm,
      refresh_interval_minutes: input.refreshIntervalMinutes,
      session_secret: input.sessionSecret || current.session_secret || createSessionSecret(),
      thresholds: {
        good_below_avg_cents: input.thresholds.goodBelowAvgCents,
        okay_below_avg_cents: input.thresholds.okayBelowAvgCents
      },
      auth: {
        oidc: {
          issuer_url: input.oidc.issuerUrl,
          client_id: input.oidc.clientId,
          client_secret: input.oidc.clientSecret,
          scope: input.oidc.scope,
          username_claim: input.oidc.usernameClaim || 'preferred_username',
          picture_claim: input.oidc.pictureClaim || 'picture',
          name: input.oidc.name || ''
        }
      },
      smtp: {
        host: input.smtp.host,
        port: input.smtp.port,
        secure: input.smtp.secure,
        user: input.smtp.user,
        pass: input.smtp.pass,
        from: input.smtp.from
      },
      locations: input.locations.map(loc => ({
        id: loc.id,
        name: loc.name,
        lat: loc.lat,
        lng: loc.lng,
        radius_km: loc.radiusKm,
        fuel_type: loc.fuelType as 'diesel' | 'e5' | 'e10',
      }))
    },
    current
  );
}
