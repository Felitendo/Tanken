export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getScheduler } = await import('./lib/scheduler');
    const { restoreCacheFromDb, initStationCacheDb } = await import('./lib/station-cache');
    const { persistAtAggregateIfStale } = await import('./lib/measure');
    const { database } = await import('./lib/server-runtime');

    // Pass DB handle directly — require('@/lib/server-runtime') may fail at runtime
    initStationCacheDb(database);

    // Restore cached stations from database so they're available immediately
    await restoreCacheFromDb();

    // Frequent redeploys would leave AT history empty between scheduler
    // cycles, since AT's price_history row is only written at cycle end.
    // The throttled fallback ensures every boot tops up AT data when the
    // last row is older than ~30 min, so the Verlauf chart stays useful
    // even when the noon cycle hasn't fired.
    persistAtAggregateIfStale().catch(err => {
      console.error('[Boot] AT aggregate fallback failed:', err instanceof Error ? err.message : err);
    });

    // Always start scheduler — Germany needs API key, Austria works without
    getScheduler().start();
  }
}
