export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { loadRepoConfig } = await import('./config');
    const { getScheduler } = await import('./lib/scheduler');
    const config = loadRepoConfig();
    if (config.api_key) {
      getScheduler().start();
    }
  }
}
