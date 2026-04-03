import { loadRepoConfig } from '@/config';
import { fetchStationsLive, fetchStationsEControl } from '@/lib/measure';
import { setCachedStations, getAllCachedLocations, countUniqueStations, persistPriceSnapshot, clearAllCache } from '@/lib/station-cache';
import { generateGermanyGrid, generateAustriaGrid } from '@/lib/grid';

export interface ScanLogEntry {
  time: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warn';
}

export interface CountryScanStatus {
  scanning: boolean;
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
  cache: CacheStats;
  de: CountryScanStatus;
  at: CountryScanStatus;
}

const MAX_ERRORS = 20;
const MAX_LOG = 30;

/** Delay between Tankerkönig calls (DE). 5 Min. laut offizieller Empfehlung. */
const DE_DELAY_MS = 5 * 60_000;
/** Concurrent E-Control requests (AT). No documented rate limit. */
const AT_CONCURRENCY = 5;
/** Small pause between AT batches to avoid hammering. */
const AT_BATCH_DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
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
    this.de.addLog('Scheduler gestoppt', 'info');
    this.at.addLog('Scheduler gestoppt', 'info');
    console.log('[Scheduler] Stopped');
  }

  restart(): void { this.stop(); this.start(); }
  isRunning(): boolean { return this.timer !== null; }

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

    while (this.timer) {
      const cycleStart = Date.now();
      this._scanStartedAt = new Date();
      this._cycleCount++;

      // Run DE and AT in parallel
      const tasks: Promise<void>[] = [];
      if (apiKey) {
        tasks.push(this.runDeGridCycle(apiKey, fuelType));
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
      const msg = `Zyklus #${this._cycleCount} fertig: ${total.toLocaleString('de-DE')} Stationen in ${fmtDuration(cycleDuration)}`;
      this.de.addLog(msg, 'success');
      this.at.addLog(msg, 'success');
      console.log(`[Grid] ${msg}`);

      // Seit April 2026 dürfen Tankstellen nur noch 1× täglich um 12 Uhr Preise ändern.
      // → Nächsten Zyklus so planen, dass er rechtzeitig nach 12 Uhr fertig ist.
      if (this.timer) {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // Mitternacht → Start, fertig bis ~22:30
        const waitMs = Math.max(5 * 60_000, tomorrow.getTime() - now.getTime());
        const waitH = Math.round(waitMs / 3_600_000 * 10) / 10;
        this.de.addLog(`Nächster Zyklus in ${waitH} Std. (1× täglich)`, 'info');
        this.at.addLog(`Nächster Zyklus in ${waitH} Std. (1× täglich)`, 'info');
        await sleep(waitMs);
      }
    }
  }

  // ─── Germany (sequential, rate-limited) ───────────────────────

  private async runDeGridCycle(apiKey: string, fuelType: string): Promise<void> {
    const grid = generateGermanyGrid();
    const cs = this.de;
    cs.scanning = true;
    cs.resetCycle();
    cs.callDurations = [];
    cs.gridPoints = grid.length;
    cs.addLog(`Scan gestartet: ${grid.length} Punkte (${DE_DELAY_MS / 1000}s Delay)`, 'info');
    console.log(`[Grid-DE] Starting: ${grid.length} points, fuel: ${fuelType}`);

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
      cs.addLog(`Fertig: ${cs.stationsScanned.toLocaleString('de-DE')} Stationen in ${fmtDuration(dur)}`, 'success');
      console.log(`[Grid-DE] Complete: ${cs.stationsScanned} stations`);
    } finally {
      cs.reset();
    }
  }

  // ─── Austria (batched parallel) ───────────────────────────────

  private async runAtGridCycle(fuelType: string): Promise<void> {
    const grid = generateAustriaGrid();
    const cs = this.at;
    cs.scanning = true;
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

  private addError(msg: string): void {
    this.de.addError(msg);
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
