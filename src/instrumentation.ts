export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { loadRepoConfig } = await import('./config');
    const { getScheduler } = await import('./lib/scheduler');
    const { restoreCacheFromDb } = await import('./lib/station-cache');

    // Restore cached stations from database so they're available immediately
    await restoreCacheFromDb();

    // Always start scheduler — Germany needs API key, Austria works without
    getScheduler().start();
  }
}
