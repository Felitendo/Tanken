import { loadRepoConfig } from '@/config';
import { fetchStationsLive, fetchStationsEControl, fetchPricesByIds } from '@/lib/measure';
import {
  setCachedStations, getAllCachedLocations, countUniqueStations, getAllUniqueStations,
  persistPriceSnapshot, clearAllCache,
  saveKnownStations, loadKnownStationIds,
  updateCachedPrices, getLastDiscoveryTime, setLastDiscoveryTime, bootstrapKnownStationsFromCache,
} from '@/lib/station-cache';
import { generateGermanyGrid, generateAustriaGrid } from '@/lib/grid';

export interface ScanLogEntry {
  time: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warn';
}

export interface CountryScanStatus {
  scanning: boolean;
  mode: 'discovery' | 'price-dump' | null;
  progress: string | null;
  currentPoint: { lat: number; lng: number } | null;
  stationsScanned: number;
  gridPoints: number;
  estimatedEndAt: string | null;
  lastCompletedAt: string | null;
  lastDurationSec: number | null;
  avgCallSec: number | null;
  errors: string[];
  log: ScanLogEntry[];
}

export interface CacheStats {
  gridCells: number;
  totalStations: number;
  oldestScan: string | null;
  newestScan: string | null;
}

export interface SchedulerStatus {
  running: boolean;
  cycleCount: number;
  scanStartedAt: string | null;
  lastCycleDurationSec: number | null;
  nextCycleAt: string | null;
  cache: CacheStats;
  de: CountryScanStatus;
  at: CountryScanStatus;
}

const MAX_ERRORS = 20;
const MAX_LOG = 30;

/** Delay between Tankerkönig list.php calls (DE discovery). 5 Min. laut offizieller Empfehlung. */
const DE_DELAY_MS = 5 * 60_000;
/** Concurrent E-Control requests (AT). No documented rate limit. */
const AT_CONCURRENCY = 5;
/** Small pause between AT batches to avoid hammering. */
const AT_BATCH_DELAY_MS = 500;

/** Delay between prices.php calls during price dump. Start aggressive (1s). */
const PRICE_DUMP_DELAY_MS = 1_000;
/** Max IDs per prices.php call. */
const PRICE_DUMP_BATCH_SIZE = 10;
/** Run discovery scan every N days to find new/closed stations. */
const DISCOVERY_INTERVAL_DAYS = 7;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Cancellable sleep — resolves immediately when cancel() is called. */
function cancellableSleep(ms: number): { promise: Promise<void>; cancel: () => void } {
  let timer: ReturnType<typeof setTimeout>;
  let _cancel: () => void;
  const promise = new Promise<void>(resolve => {
    _cancel = () => { clearTimeout(timer); resolve(); };
    timer = setTimeout(resolve, ms);
  });
  return { promise, cancel: _cancel! };
}

function fmtDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  if (h > 0) return `${h} Std. ${m} Min.`;
  if (m > 0) return `${m} Min. ${s} Sek.`;
  return `${s} Sek.`;
}

// ─── Per-country scan state ─────────────────────────────────────────

class CountryScan {
  scanning = false;
  mode: 'discovery' | 'price-dump' | null = null;
  progress: string | null = null;
  currentPoint: { lat: number; lng: number } | null = null;
  stationsScanned = 0;
  private _uniqueStationIds = new Set<string>();
  gridPoints = 0;
  estimatedEndAt: Date | null = null;
  lastCompletedAt: Date | null = null;
  lastDurationSec: number | null = null;
  callDurations: number[] = [];
  errors: string[] = [];
  log: ScanLogEntry[] = [];

  addStations(stations: { id: string }[]): void {
    for (const s of stations) {
      this._uniqueStationIds.add(s.id);
    }
    this.stationsScanned = this._uniqueStationIds.size;
  }

  addStationCount(count: number): void {
    this.stationsScanned = count;
  }

  addLog(message: string, type: ScanLogEntry['type'] = 'info'): void {
    this.log.push({ time: new Date().toISOString(), message, type });
    if (this.log.length > MAX_LOG) this.log = this.log.slice(-MAX_LOG);
  }

  addError(msg: string): void {
    this.errors.push(`${new Date().toISOString()} ${msg}`);
    if (this.errors.length > MAX_ERRORS) this.errors = this.errors.slice(-MAX_ERRORS);
  }

  resetCycle(): void {
    this.stationsScanned = 0;
    this._uniqueStationIds.clear();
  }

  reset(): void {
    this.scanning = false;
    this.mode = null;
    this.progress = null;
    this.currentPoint = null;
    this.estimatedEndAt = null;
  }

  getStatus(): CountryScanStatus {
    const avg = this.callDurations.length > 0
      ? this.callDurations.reduce((a, b) => a + b, 0) / this.callDurations.length / 1000
      : null;
    return {
      scanning: this.scanning,
      mode: this.mode,
      progress: this.progress,
      currentPoint: this.currentPoint,
      stationsScanned: this.stationsScanned,
      gridPoints: this.gridPoints,
      estimatedEndAt: this.estimatedEndAt?.toISOString() ?? null,
      lastCompletedAt: this.lastCompletedAt?.toISOString() ?? null,
      lastDurationSec: this.lastDurationSec,
      avgCallSec: avg ? Math.round(avg * 10) / 10 : null,
      errors: [...this.errors],
      log: [...this.log],
    };
  }
}

// ─── Scheduler ──────────────────────────────────────────────────────

class ScanScheduler {
  private timer: ReturnType<typeof setInterval> | null = null;
  private _gridTimer: ReturnType<typeof setTimeout> | null = null;
  private _cycleCount = 0;
  private _scanStartedAt: Date | null = null;
  private _lastCycleDurationSec: number | null = null;
  private _nextCycleAt: Date | null = null;
  private _waitingCancel: (() => void) | null = null;

  readonly de = new CountryScan();
  readonly at = new CountryScan();

  start(): void {
    if (this.timer) return;
    this.de.addLog('Scheduler gestartet', 'info');
    this.at.addLog('Scheduler gestartet', 'info');
    console.log('[Scheduler] Starting grid scan scheduler');
    this.timer = setInterval(() => {}, 60_000);
    this._gridTimer = setTimeout(() => this.startGridScan(), 10_000);
  }

  stop(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this._gridTimer) { clearTimeout(this._gridTimer); this._gridTimer = null; }
    this.de.reset();
    this.at.reset();
    this._scanStartedAt = null;
    this._nextCycleAt = null;
    this.de.addLog('Scheduler gestoppt', 'info');
    this.at.addLog('Scheduler gestoppt', 'info');
    console.log('[Scheduler] Stopped');
  }

  restart(): void { this.stop(); this.start(); }
  isRunning(): boolean { return this.timer !== null; }

  /** Cancel the 12:01 wait and trigger a scan cycle immediately. */
  triggerNow(): void {
    if (!this.timer) return;
    if (this._waitingCancel) {
      this.de.addLog('Manueller Scan ausgelöst', 'info');
      this.at.addLog('Manueller Scan ausgelöst', 'info');
      console.log('[Scheduler] Manual trigger — cancelling wait');
      this._waitingCancel();
      this._waitingCancel = null;
    }
  }

  async clearCache(): Promise<void> {
    await clearAllCache();
    this.de.resetCycle();
    this.at.resetCycle();
    this.de.addLog('Cache geleert', 'warn');
    this.at.addLog('Cache geleert', 'warn');
  }

  getStatus(): SchedulerStatus {
    const cachedLocations = getAllCachedLocations();
    let oldestTs = Infinity, newestTs = 0;
    for (const loc of cachedLocations) {
      if (loc.timestamp < oldestTs) oldestTs = loc.timestamp;
      if (loc.timestamp > newestTs) newestTs = loc.timestamp;
    }

    return {
      running: this.timer !== null,
      cycleCount: this._cycleCount,
      scanStartedAt: this._scanStartedAt?.toISOString() ?? null,
      lastCycleDurationSec: this._lastCycleDurationSec,
      nextCycleAt: this._nextCycleAt?.toISOString() ?? null,
      cache: {
        gridCells: cachedLocations.length,
        totalStations: countUniqueStations(),
        oldestScan: oldestTs === Infinity ? null : new Date(oldestTs).toISOString(),
        newestScan: newestTs === 0 ? null : new Date(newestTs).toISOString(),
      },
      de: this.de.getStatus(),
      at: this.at.getStatus(),
    };
  }

  // ─── Main loop ──────────────────────────────────────────────────

  private async startGridScan(): Promise<void> {
    const config = loadRepoConfig();
    const apiKey = config.api_key || process.env.TANKERKOENIG_API_KEY || '';
    const fuelType = config.fuel_type || 'diesel';

    // Bootstrap: if cache has DE stations but known_stations is empty (first deploy),
    // populate known_stations from cache to avoid unnecessary 22h discovery scan.
    if (apiKey) {
      try {
        const bootstrapped = await bootstrapKnownStationsFromCache();
        if (bootstrapped > 0) {
          this.de.addLog(`${bootstrapped.toLocaleString('de-DE')} Stationen aus Cache übernommen — Discovery übersprungen`, 'success');
        }
      } catch (err) {
        console.error('[Scheduler] Bootstrap error:', err instanceof Error ? err.message : err);
      }
    }

    // First cycle: run discovery immediately if needed (no 12:01 wait)
    let firstRun = true;

    while (this.timer) {
      const discovery = apiKey ? await this.needsDiscovery() : false;

      // Wait until 12:01 for price updates (skip wait on first run if discovery needed)
      if (!(firstRun && discovery)) {
        const waitMs = this.msUntilNext1201();
        const waitH = Math.round(waitMs / 3_600_000 * 10) / 10;
        const reason = discovery ? 'Discovery-Scan' : 'Preis-Update';
        this._nextCycleAt = new Date(Date.now() + waitMs);
        this.de.addLog(`Nächster ${reason} um 12:01 Uhr (in ${waitH} Std.)`, 'info');
        this.at.addLog(`Nächster Scan um 12:01 Uhr (in ${waitH} Std.)`, 'info');
        console.log(`[Scheduler] Next ${reason} in ${waitH}h at 12:01`);
        const { promise, cancel } = cancellableSleep(waitMs);
        this._waitingCancel = cancel;
        await promise;
        this._waitingCancel = null;
        if (!this.timer) break;
      }
      firstRun = false;
      this._nextCycleAt = null;

      const cycleStart = Date.now();
      this._scanStartedAt = new Date();
      this._cycleCount++;

      // Run DE and AT in parallel
      const tasks: Promise<void>[] = [];
      if (apiKey) {
        if (discovery) {
          tasks.push(this.runDeDiscoveryCycle(apiKey, fuelType));
        } else {
          tasks.push(this.runDePriceDump(apiKey, fuelType));
        }
      } else {
        this.de.addLog('Kein API-Key — übersprungen', 'warn');
      }
      tasks.push(this.runAtGridCycle(fuelType));

      await Promise.all(tasks);

      const cycleDuration = (Date.now() - cycleStart) / 1000;
      this._lastCycleDurationSec = Math.round(cycleDuration);
      this._scanStartedAt = null;

      // Persist price snapshot for history charts
      try {
        const persisted = await persistPriceSnapshot();
        if (persisted > 0) {
          const pMsg = `${persisted.toLocaleString('de-DE')} Preise in History gespeichert`;
          this.de.addLog(pMsg, 'info');
          this.at.addLog(pMsg, 'info');
        }
      } catch (err) {
        const eMsg = `History-Fehler: ${err instanceof Error ? err.message : String(err)}`;
        this.de.addLog(eMsg, 'error');
        console.error(`[Grid] ${eMsg}`);
      }

      const total = this.de.stationsScanned + this.at.stationsScanned;
      const modeLabel = discovery ? 'Discovery' : 'Preis-Update';
      const msg = `${modeLabel} #${this._cycleCount} fertig: ${total.toLocaleString('de-DE')} Stationen in ${fmtDuration(cycleDuration)}`;
      this.de.addLog(msg, 'success');
      this.at.addLog(msg, 'success');
      console.log(`[Grid] ${msg}`);
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────

  /** Check if a full discovery scan is needed (vs. quick price dump). */
  private async needsDiscovery(): Promise<boolean> {
    // No DE grid cells in cache → need discovery
    const cached = getAllCachedLocations();
    const hasDeCache = cached.some(c => c.locationId.startsWith('grid-'));
    if (!hasDeCache) return true;

    // Cache exists — check if discovery interval has passed
    const lastDiscovery = await getLastDiscoveryTime();
    if (!lastDiscovery) {
      // First deploy with price-dump feature: cache exists from old full scans,
      // but no discovery recorded yet. Treat existing cache as valid discovery.
      this.de.addLog('Erster Start mit Preis-Update-Feature — Cache wird weiterverwendet', 'info');
      await setLastDiscoveryTime(countUniqueStations());
      return false;
    }

    const daysSince = (Date.now() - lastDiscovery.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince >= DISCOVERY_INTERVAL_DAYS;
  }

  /** Calculate ms until next 12:01 (today or tomorrow). */
  private msUntilNext1201(): number {
    const now = new Date();
    const target = new Date(now);
    target.setHours(12, 1, 0, 0);
    if (now >= target) {
      target.setDate(target.getDate() + 1);
    }
    return Math.max(5 * 60_000, target.getTime() - now.getTime());
  }

  // ─── Germany: Discovery (full grid scan, weekly) ────────────────

  private async runDeDiscoveryCycle(apiKey: string, fuelType: string): Promise<void> {
    const grid = generateGermanyGrid();
    const cs = this.de;
    cs.scanning = true;
    cs.mode = 'discovery';
    cs.resetCycle();
    cs.callDurations = [];
    cs.gridPoints = grid.length;
    cs.addLog(`Discovery gestartet: ${grid.length} Punkte (${DE_DELAY_MS / 1000}s Delay)`, 'info');
    console.log(`[Grid-DE] Discovery: ${grid.length} points, fuel: ${fuelType}`);

    const startTime = Date.now();

    try {
      for (let i = 0; i < grid.length; i++) {
        if (!this.timer) break;
        const point = grid[i];
        cs.progress = `${i + 1}/${grid.length}`;
        cs.currentPoint = { lat: point.lat, lng: point.lng };
        cs.estimatedEndAt = new Date(Date.now() + (grid.length - i - 1) * DE_DELAY_MS);

        try {
          const t0 = Date.now();
          const stations = await fetchStationsLive({ apiKey, lat: point.lat, lng: point.lng, radiusKm: 25, fuelType });
          cs.callDurations.push(Date.now() - t0);

          if (stations.length > 0) {
            setCachedStations(point.id, { stations, lat: point.lat, lng: point.lng, radiusKm: 25, fuelType });
            cs.addStations(stations);

            // Save to known_stations for future price dumps
            await saveKnownStations(stations, point.id).catch(err => {
              console.error(`[Grid-DE] Failed to save known stations for ${point.id}:`, err instanceof Error ? err.message : err);
            });
          }
        } catch (err) {
          const msg = `${point.id}: ${err instanceof Error ? err.message : String(err)}`;
          console.error(`[Grid-DE] ${msg}`);
          cs.addError(msg);
          cs.addLog(`Fehler ${point.lat},${point.lng}: ${err instanceof Error ? err.message : String(err)}`, 'error');
        }

        if (i < grid.length - 1 && this.timer) await sleep(DE_DELAY_MS);
      }

      const dur = (Date.now() - startTime) / 1000;
      cs.lastDurationSec = Math.round(dur);
      cs.lastCompletedAt = new Date();

      // Record discovery completion
      await setLastDiscoveryTime(cs.stationsScanned);

      cs.addLog(`Discovery fertig: ${cs.stationsScanned.toLocaleString('de-DE')} Stationen in ${fmtDuration(dur)}`, 'success');
      console.log(`[Grid-DE] Discovery complete: ${cs.stationsScanned} stations`);
    } finally {
      cs.reset();
    }
  }

  // ─── Germany: Price Dump (daily, uses prices.php) ───────────────

  private async runDePriceDump(apiKey: string, fuelType: string): Promise<void> {
    const cs = this.de;
    cs.scanning = true;
    cs.mode = 'price-dump';
    cs.resetCycle();
    cs.callDurations = [];

    let ids = await loadKnownStationIds();

    // Fallback: extract DE station IDs from cache if known_stations is empty
    if (ids.length === 0) {
      const allStations = getAllUniqueStations();
      ids = allStations.filter(s => !s.id.startsWith('at-')).map(s => s.id);
      if (ids.length > 0) {
        cs.addLog(`${ids.length.toLocaleString('de-DE')} Station-IDs aus Cache extrahiert`, 'info');
      }
    }

    if (ids.length === 0) {
      cs.addLog('Keine bekannten Stationen — Discovery nötig', 'warn');
      cs.reset();
      return;
    }

    const totalBatches = Math.ceil(ids.length / PRICE_DUMP_BATCH_SIZE);
    cs.gridPoints = totalBatches;
    cs.addLog(`Preis-Update gestartet: ${ids.length.toLocaleString('de-DE')} Stationen (${totalBatches} Batches × ${PRICE_DUMP_BATCH_SIZE})`, 'info');
    console.log(`[Grid-DE] Price dump: ${ids.length} stations in ${totalBatches} batches, fuel: ${fuelType}`);

    const startTime = Date.now();
    const allPrices = new Map<string, { price: number | null; isOpen: boolean }>();
    let errors = 0;
    let delay = PRICE_DUMP_DELAY_MS;

    try {
      for (let b = 0; b < totalBatches; b++) {
        if (!this.timer) break;
        const batch = ids.slice(b * PRICE_DUMP_BATCH_SIZE, (b + 1) * PRICE_DUMP_BATCH_SIZE);
        cs.progress = `${b + 1}/${totalBatches}`;
        cs.estimatedEndAt = new Date(Date.now() + (totalBatches - b - 1) * delay);

        try {
          const t0 = Date.now();
          const prices = await fetchPricesByIds({ apiKey, ids: batch, fuelType });
          cs.callDurations.push(Date.now() - t0);

          for (const [id, data] of prices) {
            allPrices.set(id, data);
          }

          // Reset delay on success (adaptive rate limiting)
          if (delay > PRICE_DUMP_DELAY_MS) {
            delay = PRICE_DUMP_DELAY_MS;
          }
        } catch (err) {
          errors++;
          const msg = `Batch ${b + 1}: ${err instanceof Error ? err.message : String(err)}`;
          console.error(`[Grid-DE] ${msg}`);
          cs.addError(msg);

          // Back off on errors (double delay, max 30s)
          delay = Math.min(delay * 2, 30_000);
          cs.addLog(`Fehler, Delay erhöht auf ${delay / 1000}s`, 'warn');
        }

        if (b < totalBatches - 1 && this.timer) await sleep(delay);
      }

      // Update in-memory cache with new prices
      const updated = updateCachedPrices(allPrices);

      const dur = (Date.now() - startTime) / 1000;
      cs.lastDurationSec = Math.round(dur);
      cs.lastCompletedAt = new Date();
      cs.addStationCount(allPrices.size);

      const errStr = errors > 0 ? `, ${errors} Fehler` : '';
      cs.addLog(`Preis-Update fertig: ${allPrices.size.toLocaleString('de-DE')} Preise, ${updated.toLocaleString('de-DE')} Cache-Updates in ${fmtDuration(dur)}${errStr}`, 'success');
      console.log(`[Grid-DE] Price dump complete: ${allPrices.size} prices, ${updated} cache updates in ${fmtDuration(dur)}`);
    } finally {
      cs.reset();
    }
  }

  // ─── Austria (batched parallel) ───────────────────────────────

  private async runAtGridCycle(fuelType: string): Promise<void> {
    const grid = generateAustriaGrid();
    const cs = this.at;
    cs.scanning = true;
    cs.mode = 'discovery';
    cs.resetCycle();
    cs.callDurations = [];
    cs.gridPoints = grid.length;
    const totalBatches = Math.ceil(grid.length / AT_CONCURRENCY);
    cs.addLog(`Scan gestartet: ${grid.length} Punkte (${AT_CONCURRENCY}× parallel)`, 'info');
    console.log(`[Grid-AT] Starting: ${grid.length} points in ${totalBatches} batches, fuel: ${fuelType}`);

    const startTime = Date.now();
    let processed = 0;

    try {
      for (let b = 0; b < totalBatches; b++) {
        if (!this.timer) break;
        const batch = grid.slice(b * AT_CONCURRENCY, (b + 1) * AT_CONCURRENCY);
        processed += batch.length;
        cs.progress = `${processed}/${grid.length}`;
        cs.currentPoint = { lat: batch[0].lat, lng: batch[0].lng };
        cs.estimatedEndAt = new Date(Date.now() + (totalBatches - b - 1) * AT_BATCH_DELAY_MS);

        const results = await Promise.allSettled(
          batch.map(async (point) => {
            const t0 = Date.now();
            const stations = await fetchStationsEControl({ lat: point.lat, lng: point.lng, fuelType });
            cs.callDurations.push(Date.now() - t0);
            return { point, stations };
          })
        );

        for (const r of results) {
          if (r.status === 'fulfilled' && r.value.stations.length > 0) {
            const { point, stations } = r.value;
            setCachedStations(point.id, { stations, lat: point.lat, lng: point.lng, radiusKm: 5, fuelType });
            cs.addStations(stations);
          } else if (r.status === 'rejected') {
            const msg = `batch ${b}: ${r.reason instanceof Error ? r.reason.message : String(r.reason)}`;
            console.error(`[Grid-AT] ${msg}`);
            cs.addError(msg);
          }
        }

        if (b < totalBatches - 1 && this.timer) await sleep(AT_BATCH_DELAY_MS);
      }

      const dur = (Date.now() - startTime) / 1000;
      cs.lastDurationSec = Math.round(dur);
      cs.lastCompletedAt = new Date();
      cs.addLog(`Fertig: ${cs.stationsScanned.toLocaleString('de-DE')} Stationen in ${fmtDuration(dur)}`, 'success');
      console.log(`[Grid-AT] Complete: ${cs.stationsScanned} stations`);
    } finally {
      cs.reset();
    }
  }
}

// Singleton with dev hot-reload guard
const globalKey = '__tanken_scheduler' as const;
const g = globalThis as unknown as Record<string, ScanScheduler>;

export function getScheduler(): ScanScheduler {
  if (!g[globalKey]) {
    g[globalKey] = new ScanScheduler();
  }
  return g[globalKey];
}
