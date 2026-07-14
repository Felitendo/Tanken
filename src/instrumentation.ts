export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getScheduler } = await import('./lib/scheduler');
    const { restoreCacheFromDb, initStationCacheDb } = await import('./lib/station-cache');
    const { persistAtAggregateIfStale } = await import('./lib/measure');
    const { database, runtimeConfig } = await import('./lib/server-runtime');
    const { restoreRepoConfigFromDb } = await import('./lib/config-store');

    // Self-heal config/config.json from its database mirror BEFORE the
    // scheduler starts. Containers redeployed without a /app/config
    // volume would otherwise boot unconfigured (no API key → no scans →
    // history stops accumulating) until someone re-runs the wizard.
    await restoreRepoConfigFromDb(runtimeConfig.paths.configFile).catch(err => {
      console.error('[Boot] config restore failed:', err instanceof Error ? err.message : err);
    });

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
