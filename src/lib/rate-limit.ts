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
