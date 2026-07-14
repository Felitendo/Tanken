import fs from 'node:fs';
import { loadRepoConfig, saveRepoConfig } from '@/config';
import { database } from '@/lib/server-runtime';
import { RepoConfig } from '@/types';

/**
 * Durable mirror of config/config.json in the database (app_meta).
 *
 * The config file holds everything the admin wizard sets up (API key,
 * SMTP, OIDC, session secret, scan times). Deployments that don't mount
 * a volume on /app/config lose that file on every redeploy — the app
 * then "forgets" its setup, scans stop, and history stops accumulating.
 * Mirroring the config into Postgres (which every deployment already
 * has to persist) lets a freshly recreated container restore it on boot.
 *
 * The DB holds the same secrets as the file it mirrors, so this does not
 * change the security posture of the deployment.
 */
const META_KEY = 'repo_config';

async function upsertBackup(config: RepoConfig): Promise<void> {
  await database.query(
    `
      INSERT INTO app_meta (key, value_json, updated_at)
      VALUES ($1, $2::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET value_json = EXCLUDED.value_json, updated_at = NOW()
    `,
    [META_KEY, JSON.stringify(config)]
  );
}

/** Save the config to disk and mirror it into the database. */
export async function saveRepoConfigDurable(value: Partial<RepoConfig>): Promise<RepoConfig> {
  const next = saveRepoConfig(value);
  try {
    await upsertBackup(next);
  } catch (err) {
    // The file write already succeeded — a failed mirror must not fail
    // the admin request. The next boot/save will retry.
    console.error('[Config] database mirror failed:', err instanceof Error ? err.message : err);
  }
  return next;
}

/**
 * Boot-time healing: if config.json is missing but a database mirror
 * exists, rewrite the file from the mirror. If the file exists, refresh
 * the mirror instead (covers installs that predate the mirror).
 */
export async function restoreRepoConfigFromDb(configFilePath: string): Promise<void> {
  if (fs.existsSync(configFilePath)) {
    await upsertBackup(loadRepoConfig());
    return;
  }

  const result = await database.query<{ value_json: Partial<RepoConfig> }>(
    'SELECT value_json FROM app_meta WHERE key = $1',
    [META_KEY]
  );
  const backup = result.rows[0]?.value_json;
  if (backup && typeof backup === 'object') {
    saveRepoConfig(backup);
    console.log('[Boot] config/config.json missing — restored from database mirror');
  }
}
