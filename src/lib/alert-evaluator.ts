/**
 * Background price-alert evaluator.
 *
 * Runs after each scheduler cycle, walks every enabled price alert (per-user
 * + the singleton local alert), checks the cheapest cached station inside the
 * alert's radius, and pushes a notification if it dropped below the threshold.
 *
 * Dedup: each alert remembers `lastNotifiedAt` and `lastNotifiedPrice`. Within
 * NOTIFY_COOLDOWN_HOURS we only re-notify when the new low undercuts the last
 * notified price by at least 1 cent.
 */

import { findStationsInBounds } from '@/lib/station-cache';
import { stores } from '@/lib/server-runtime';
import type { FuelType, PriceAlert, UserProfile } from '@/types';

const NOTIFY_COOLDOWN_HOURS = 6;
const NOTIFY_COOLDOWN_MS = NOTIFY_COOLDOWN_HOURS * 60 * 60 * 1000;
const PRICE_DROP_EPSILON = 0.01; // €/L

interface AlertContext {
  scope: 'user' | 'local';
  userId?: string;
  alert: PriceAlert;
}

interface CheapestHit {
  price: number;
  brand: string;
  name: string;
}

function boundsForRadius(lat: number, lng: number, radiusKm: number) {
  // Rough degree margin — 1° lat ≈ 111 km, lng scales by cos(lat).
  const latMargin = radiusKm / 111;
  const lngMargin = radiusKm / (111 * Math.cos((lat * Math.PI) / 180) || 0.001);
  return {
    south: lat - latMargin,
    north: lat + latMargin,
    west: lng - lngMargin,
    east: lng + lngMargin,
  };
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function findCheapestInRadius(
  lat: number,
  lng: number,
  radiusKm: number,
  fuel: FuelType,
): CheapestHit | null {
  const result = findStationsInBounds(boundsForRadius(lat, lng, radiusKm), fuel);
  if (!result || !result.stations.length) return null;

  let best: CheapestHit | null = null;
  for (const s of result.stations) {
    if (!s.isOpen || s.price == null || s.price <= 0) continue;
    const dist = distanceKm(lat, lng, s.lat, s.lng);
    if (dist > radiusKm) continue;
    if (!best || s.price < best.price) {
      best = { price: s.price, brand: s.brand || '', name: s.name || '' };
    }
  }
  return best;
}

async function sendNotification(alert: PriceAlert, hit: CheapestHit): Promise<boolean> {
  const title = 'Tanken Preisalarm';
  const body = `${hit.brand || hit.name}: ${hit.price.toFixed(3)} € (unter ${alert.threshold.toFixed(3)} €)`;

  if (alert.channel === 'email' && alert.email) {
    try {
      const { sendAlertEmail } = await import('@/lib/email');
      await sendAlertEmail({ to: alert.email, subject: title, body });
      return true;
    } catch (err) {
      console.error('[AlertEval] email send failed:', err instanceof Error ? err.message : err);
      return false;
    }
  }

  if (alert.channel === 'ntfy' && alert.ntfyTopic) {
    try {
      const res = await fetch(`https://ntfy.sh/${encodeURIComponent(alert.ntfyTopic)}`, {
        method: 'POST',
        headers: { Title: title, 'Content-Type': 'text/plain; charset=utf-8' },
        body,
      });
      if (!res.ok) throw new Error(`ntfy ${res.status}`);
      return true;
    } catch (err) {
      console.error('[AlertEval] ntfy send failed:', err instanceof Error ? err.message : err);
      return false;
    }
  }
  return false;
}

function shouldNotify(alert: PriceAlert, currentPrice: number): boolean {
  const lastAt = alert.lastNotifiedAt ? Date.parse(alert.lastNotifiedAt) : 0;
  const lastPrice = typeof alert.lastNotifiedPrice === 'number' ? alert.lastNotifiedPrice : null;
  if (!lastAt) return true;
  const elapsed = Date.now() - lastAt;
  if (elapsed >= NOTIFY_COOLDOWN_MS) return true;
  // Within cooldown — only re-notify if the new low undercuts the last by ≥ 1 cent.
  if (lastPrice != null && currentPrice <= lastPrice - PRICE_DROP_EPSILON) return true;
  return false;
}

async function persistNotification(ctx: AlertContext, currentPrice: number) {
  const stamp = new Date().toISOString();
  if (ctx.scope === 'user' && ctx.userId) {
    await stores.userStore.updateUser(ctx.userId, (u: UserProfile) => {
      if (!u.alerts) u.alerts = {};
      if (!u.alerts.price) return;
      u.alerts.price.lastNotifiedAt = stamp;
      u.alerts.price.lastNotifiedPrice = currentPrice;
    });
  } else if (ctx.scope === 'local') {
    const current = (await stores.userStore.readLocalAlert()) || {};
    await stores.userStore.writeLocalAlert({
      ...current,
      lastNotifiedAt: stamp,
      lastNotifiedPrice: currentPrice,
    });
  }
}

async function evaluateAlert(ctx: AlertContext) {
  const { alert } = ctx;
  if (!alert?.enabled) return;
  if (!Number.isFinite(alert.threshold) || alert.threshold <= 0) return;
  if (!Number.isFinite(alert.lat) || !Number.isFinite(alert.lng)) return;
  const radius = Number.isFinite(alert.radiusKm) && (alert.radiusKm as number) > 0
    ? (alert.radiusKm as number)
    : 25;

  const cheapest = findCheapestInRadius(alert.lat as number, alert.lng as number, radius, alert.fuel);
  if (!cheapest) return;
  if (cheapest.price >= alert.threshold) return;
  if (!shouldNotify(alert, cheapest.price)) return;

  const sent = await sendNotification(alert, cheapest);
  if (sent) {
    await persistNotification(ctx, cheapest.price);
  }
}

export async function evaluatePriceAlerts(): Promise<{ checked: number; notified: number }> {
  const contexts: AlertContext[] = [];

  // User alerts
  try {
    const users = await stores.userStore.listUsersWithEnabledPriceAlerts();
    for (const u of users) {
      const a = u.alerts?.price;
      if (a) contexts.push({ scope: 'user', userId: u.id, alert: a });
    }
  } catch (err) {
    console.error('[AlertEval] failed to list users:', err instanceof Error ? err.message : err);
  }

  // Local (no-login) alert
  try {
    const local = await stores.userStore.readLocalAlert();
    if (local && (local as { enabled?: boolean }).enabled !== false && typeof (local as { threshold?: number }).threshold === 'number') {
      contexts.push({ scope: 'local', alert: local as unknown as PriceAlert });
    }
  } catch { /* ignore */ }

  let notified = 0;
  for (const ctx of contexts) {
    const before = ctx.alert.lastNotifiedAt;
    await evaluateAlert(ctx);
    // Crude success counter: if persistNotification ran, lastNotifiedAt was updated.
    if (ctx.alert.lastNotifiedAt !== before) notified += 1;
  }
  return { checked: contexts.length, notified };
}
