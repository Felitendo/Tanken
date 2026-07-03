// Captures reference screenshots of the live PWA at iPhone dimensions.
// These are the design ground truth the Compose app is compared against.
//
//   node pwa-screens.mjs [--states map,history] [--themes dark,light] [--base https://tanken.felo.gg]
//
// Output: ../design-refs/pwa/<state>-<theme>.png

import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = opt('--base', 'https://tanken.felo.gg');
const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'design-refs', 'pwa');

// Each state = a tab path plus optional extra in-page steps to reach deeper UI.
const ALL_STATES = {
  map: { path: '/map', settleMs: 9000 },
  'map-list': {
    path: '/map',
    settleMs: 9000,
    async steps(page) {
      // Open the station list panel if a toggle exists.
      const toggle = page.locator('#station-list-toggle, .list-toggle, [data-action="toggle-list"]').first();
      if (await toggle.count()) await toggle.click();
      await page.waitForTimeout(1500);
    },
  },
  history: { path: '/history', settleMs: 5000 },
  stats: { path: '/stats', settleMs: 5000 },
  settings: { path: '/settings', settleMs: 4000 },
};

const states = (opt('--states', Object.keys(ALL_STATES).join(','))).split(',').filter(Boolean);
const themes = (opt('--themes', 'dark,light')).split(',').filter(Boolean);

// Outbound HTTPS must go through the environment's proxy when one is configured. The proxy
// re-terminates TLS and its stack resets on Chromium's large TLS1.3 ClientHello (post-quantum
// key share), so cap the browser->proxy leg at TLS1.2; certificate verification stays on via
// the proxy CA in the NSS store. Background networking is disabled because the proxy is
// CONNECT-only and Chromium's plain-HTTP Google pings would poison the connection pool.
const proxyServer = process.env.HTTPS_PROXY || process.env.https_proxy;
// The full chromium binary honours --ssl-version-max; the default headless_shell does not,
// so pin the executable when it is present (Claude Code remote environments preinstall it).
const chromiumExe = '/opt/pw-browsers/chromium';
const browser = await chromium.launch(
  proxyServer
    ? {
        proxy: { server: proxyServer },
        executablePath: existsSync(chromiumExe) ? chromiumExe : undefined,
        args: ['--ssl-version-max=tls1.2', '--disable-background-networking'],
      }
    : {},
);
for (const theme of themes) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    colorScheme: theme === 'dark' ? 'dark' : 'light',
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    geolocation: { latitude: 52.52, longitude: 13.405 },
    permissions: ['geolocation'],
  });
  // Suppress the PWA install popup before any page script runs.
  await context.addInitScript(() => {
    try {
      localStorage.setItem('pwa_popup_dismissed', '1');
    } catch {}
  });
  for (const name of states) {
    const state = ALL_STATES[name];
    if (!state) {
      console.error(`unknown state: ${name}`);
      continue;
    }
    const page = await context.newPage();
    try {
      await page.goto(BASE + state.path, { waitUntil: 'domcontentloaded', timeout: 45000 });
      // Safety net in case the popup slips through anyway.
      await page.addStyleTag({ content: '#pwa-popup { display: none !important; }' });
      await page.waitForTimeout(state.settleMs);
      if (state.steps) await state.steps(page);
      const file = path.join(OUT_DIR, `${name}-${theme}.png`);
      await page.screenshot({ path: file });
      console.log(`WROTE ${file}`);
    } catch (err) {
      console.error(`FAILED ${name}-${theme}: ${err.message}`);
    } finally {
      await page.close();
    }
  }
  await context.close();
}
await browser.close();
