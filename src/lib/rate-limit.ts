/**
 * Simple sliding-window rate limiter for live Tankerkönig API calls.
 * Prevents excessive API usage when users search distant locations.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CALLS = 8;

const timestamps: number[] = [];

export function canMakeLiveCall(): boolean {
  const now = Date.now();
  while (timestamps.length && timestamps[0] < now - WINDOW_MS) {
    timestamps.shift();
  }
  return timestamps.length < MAX_CALLS;
}

export function recordLiveCall(): void {
  timestamps.push(Date.now());
}

/**
 * Keyed sliding-window counter (e.g. failed admin logins per IP).
 * In-memory — resets on restart, which is fine for brute-force slowdown.
 */
const keyedBuckets = new Map<string, number[]>();

function freshEntries(key: string, windowMs: number): number[] {
  const now = Date.now();
  const entries = (keyedBuckets.get(key) ?? []).filter((t) => t > now - windowMs);
  keyedBuckets.set(key, entries);
  return entries;
}

export function isKeyedLimited(key: string, maxCalls: number, windowMs: number): boolean {
  return freshEntries(key, windowMs).length >= maxCalls;
}

export function recordKeyedCall(key: string, windowMs: number): void {
  const entries = freshEntries(key, windowMs);
  entries.push(Date.now());
  // Opportunistic cleanup so the map can't grow unbounded under scanning.
  if (keyedBuckets.size > 1000) {
    const now = Date.now();
    for (const [k, v] of keyedBuckets) {
      if (!v.length || v[v.length - 1] <= now - windowMs) keyedBuckets.delete(k);
    }
  }
}
