// Generates an AltStore source JSON from the repo's GitHub releases.
//
// Two apps are emitted (when their releases exist):
//   • "Tanken"     (bundle gg.felo.tanken)     ← latest `app-v*` stable release
//   • "Tanken Dev" (bundle gg.felo.tanken.dev) ← rolling `dev` release
//
// Asset metadata (size, download URL) is read straight from the GitHub API via the `gh` CLI, so the
// script only needs `GH_REPO` (owner/repo) + `GH_TOKEN` in the environment.
//
// Usage: node generate-source.mjs [outPath]
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const repo = process.env.GH_REPO;
if (!repo) {
  console.error('GH_REPO (owner/repo) is required');
  process.exit(1);
}
const baseVersion = process.env.APP_VERSION || '0.1.0';
const iconURL = process.env.ICON_URL || `https://raw.githubusercontent.com/${repo}/main/public/icons/icon-512.png`;
const outPath = process.argv[2] || 'source.json';

const releases = JSON.parse(execSync(`gh api "repos/${repo}/releases?per_page=100" --paginate`, { encoding: 'utf8' }));

function ipaAsset(rel) {
  if (!rel) return null;
  const a = (rel.assets || []).find((x) => x.name.toLowerCase().endsWith('.ipa'));
  return a ? { url: a.browser_download_url, size: a.size, updated: a.updated_at } : null;
}
const dateOnly = (iso) => (iso || new Date().toISOString()).slice(0, 10);
function stamp(iso) {
  const d = new Date(iso || Date.now());
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}`;
}

function appEntry(bundleId, name, desc, version, date, ipa) {
  return {
    name,
    bundleIdentifier: bundleId,
    developerName: 'Felitendo',
    subtitle: 'Tankstellenpreise für Deutschland & Österreich',
    localizedDescription: desc,
    iconURL,
    tintColor: '007AFF',
    category: 'navigation',
    screenshotURLs: [],
    versions: [
      { version, date, localizedDescription: desc, downloadURL: ipa.url, size: ipa.size, minOSVersion: '16.0' },
    ],
    // Legacy top-level fields for older AltStore clients.
    version,
    versionDate: date,
    versionDescription: desc,
    downloadURL: ipa.url,
    size: ipa.size,
  };
}

const apps = [];

// Stable: newest app-v* release with an IPA.
const stableRel = releases
  .filter((r) => /^app-v\d+\.\d+(\.\d+)?$/.test(r.tag_name) && !r.draft)
  .sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at))[0];
const stableIpa = ipaAsset(stableRel);
if (stableIpa) {
  apps.push(appEntry(
    'gg.felo.tanken',
    'Tanken',
    'Tankstellenpreise für Deutschland & Österreich – die native Tanken Companion App.',
    stableRel.tag_name.replace(/^app-v/, ''),
    dateOnly(stableRel.published_at),
    stableIpa,
  ));
}

// Dev: rolling `dev` release.
const devRel = releases.find((r) => r.tag_name === 'dev');
const devIpa = ipaAsset(devRel);
if (devIpa) {
  apps.push(appEntry(
    'gg.felo.tanken.dev',
    'Tanken Dev',
    'Automatischer Build des main-Branches – neueste Features, evtl. instabil.',
    `${baseVersion}-dev.${stamp(devIpa.updated)}`,
    dateOnly(devRel.published_at),
    devIpa,
  ));
}

const source = {
  name: 'Tanken',
  identifier: 'gg.felo.tanken.altstore',
  subtitle: 'Tankstellenpreise – Companion App',
  iconURL,
  website: 'https://tanken.felo.gg',
  tintColor: '007AFF',
  apps,
  news: [],
};

writeFileSync(outPath, JSON.stringify(source, null, 2));
console.error(`Wrote ${outPath} with ${apps.length} app(s): ${apps.map((a) => a.bundleIdentifier).join(', ') || 'none'}`);
