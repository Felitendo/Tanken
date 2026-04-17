import { loadRepoConfig } from '@/config';
import { fetchStationsEControl, fetchStationsLive } from '@/lib/measure';
import {
  setCachedStations, getAllCachedLocations, countUniqueStations,
  persistPriceSnapshot, clearAllCache,
} from '@/lib/station-cache';
import { generateAustriaGrid } from '@/lib/grid';
import { listScanLocations, recordScanResult, getScanLocation } from '@/lib/location-store';

export interface ScanLogEntry {
  time: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warn';
}

export type DeScanMode = 'location-scan';
export type AtScanMode = 'discovery';

export interface CountryScanStatus {
  scanning: boolean;
  mode: 'location-scan' | 'discovery' | null;
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

/** Concurrent E-Control requests (AT). No documented rate limit. */
const AT_CONCURRENCY = 5;
/** Small pause between AT batches to avoid hammering. */
const AT_BATCH_DELAY_MS = 500;

/** Base delay between list.php calls for admin-curated DE locations. */
const DE_LOC_DELAY_MS = 2_000;
/** Upper cap for adaptive backoff. */
const DE_LOC_MAX_DELAY_MS = 60_000;
/** Retries per location on rate-limit / transient errors. */
const DE_LOC_MAX_RETRIES = 3;

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
  mode: CountryScanStatus['mode'] = null;
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
    console.log('[Scheduler] Starting scan scheduler');
    this.timer = setInterval(() => {}, 60_000);
    this._gridTimer = setTimeout(() => this.startScanLoop(), 10_000);
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

  /** Run a one-off scan for a single admin location. Used by the admin "Jetzt scannen" button. */
  async scanSingleLocation(locationId: string): Promise<{ ok: boolean; stationCount: number; error?: string }> {
    const loc = await getScanLocation(locationId);
    if (!loc) return { ok: false, stationCount: 0, error: 'Standort nicht gefunden' };

    const config = loadRepoConfig();
    const apiKey = config.api_key || process.env.TANKERKOENIG_API_KEY || '';
    if (!apiKey) return { ok: false, stationCount: 0, error: 'Kein API-Key konfiguriert' };

    try {
      const stations = await fetchStationsLive({
        apiKey,
        lat: loc.lat,
        lng: loc.lng,
        radiusKm: loc.radiusKm,
        fuelType: loc.fuelType,
      });
      setCachedStations(loc.id, {
        stations,
        lat: loc.lat,
        lng: loc.lng,
        radiusKm: loc.radiusKm,
        fuelType: loc.fuelType,
      });
      await recordScanResult(loc.id, { stationCount: stations.length, error: null });
      this.de.addLog(`Manueller Scan "${loc.name}": ${stations.length} Stationen`, 'success');
      return { ok: true, stationCount: stations.length };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await recordScanResult(loc.id, { stationCount: 0, error: msg });
      this.de.addLog(`Manueller Scan "${loc.name}" fehlgeschlagen: ${msg}`, 'error');
      return { ok: false, stationCount: 0, error: msg };
    }
  }

  // ─── Main loop ──────────────────────────────────────────────────

  private async startScanLoop(): Promise<void> {
    while (this.timer) {
      // Wait until 12:01
      const waitMs = this.msUntilNext1201();
      const waitH = Math.round(waitMs / 3_600_000 * 10) / 10;
      this._nextCycleAt = new Date(Date.now() + waitMs);
      this.de.addLog(`Nächster Scan um 12:01 Uhr (in ${waitH} Std.)`, 'info');
      this.at.addLog(`Nächster Scan um 12:01 Uhr (in ${waitH} Std.)`, 'info');
      console.log(`[Scheduler] Next scan in ${waitH}h at 12:01`);
      const { promise, cancel } = cancellableSleep(waitMs);
      this._waitingCancel = cancel;
      await promise;
      this._waitingCancel = null;
      if (!this.timer) break;

      this._nextCycleAt = null;
      const cycleStart = Date.now();
      this._scanStartedAt = new Date();
      this._cycleCount++;

      // Reload config per cycle so admin API-key changes take effect without restart
      const config = loadRepoConfig();
      const apiKey = config.api_key || process.env.TANKERKOENIG_API_KEY || '';
      const defaultFuel = config.fuel_type || 'diesel';

      const tasks: Promise<void>[] = [];
      if (apiKey) {
        tasks.push(this.runDeLocationScan(apiKey));
      } else {
        this.de.addLog('Kein API-Key — DE-Scan übersprungen', 'warn');
      }
      tasks.push(this.runAtGridCycle(defaultFuel));

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
        console.error(`[Scheduler] ${eMsg}`);
      }

      const total = this.de.stationsScanned + this.at.stationsScanned;
      const msg = `Scan #${this._cycleCount} fertig: ${total.toLocaleString('de-DE')} Stationen in ${fmtDuration(cycleDuration)}`;
      this.de.addLog(msg, 'success');
      this.at.addLog(msg, 'success');
      console.log(`[Scheduler] ${msg}`);
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────

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

  // ─── Germany: Admin-curated locations (via list.php) ────────────

  private async runDeLocationScan(apiKey: string): Promise<void> {
    const cs = this.de;
    cs.scanning = true;
    cs.mode = 'location-scan';
    cs.resetCycle();
    cs.callDurations = [];

    let locs;
    try {
      locs = await listScanLocations({ enabledOnly: true, country: 'de' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      cs.addError(`Standorte konnten nicht geladen werden: ${msg}`);
      cs.addLog(`Standortliste fehlgeschlagen: ${msg}`, 'error');
      cs.reset();
      return;
    }

    if (locs.length === 0) {
      cs.addLog('Keine aktiven DE-Scan-Standorte — im Admin-Panel hinzufügen', 'warn');
      cs.reset();
      return;
    }

    cs.gridPoints = locs.length;
    cs.addLog(`Standort-Scan gestartet: ${locs.length} Standort${locs.length === 1 ? '' : 'e'}`, 'info');
    console.log(`[DE] Location scan: ${locs.length} locations`);

    const startTime = Date.now();
    let delay = DE_LOC_DELAY_MS;
    let errors = 0;
    let totalStations = 0;

    try {
      for (let i = 0; i < locs.length; i++) {
        if (!this.timer) break;
        const loc = locs[i];
        cs.progress = `${i + 1}/${locs.length}`;
        cs.currentPoint = { lat: loc.lat, lng: loc.lng };
        cs.estimatedEndAt = new Date(Date.now() + (locs.length - i - 1) * delay);

        let attempt = 0;
        let succeeded = false;
        let lastErr: string | null = null;

        while (attempt <= DE_LOC_MAX_RETRIES && this.timer) {
          if (attempt > 0) {
            cs.addLog(`"${loc.name}": Retry ${attempt}/${DE_LOC_MAX_RETRIES} in ${(delay / 1000).toFixed(1)}s`, 'warn');
            await sleep(delay);
            if (!this.timer) break;
          }
          try {
            const t0 = Date.now();
            const stations = await fetchStationsLive({
              apiKey,
              lat: loc.lat,
              lng: loc.lng,
              radiusKm: loc.radiusKm,
              fuelType: loc.fuelType,
            });
            cs.callDurations.push(Date.now() - t0);

            setCachedStations(loc.id, {
              stations,
              lat: loc.lat,
              lng: loc.lng,
              radiusKm: loc.radiusKm,
              fuelType: loc.fuelType,
            });
            cs.addStations(stations);
            totalStations += stations.length;
            await recordScanResult(loc.id, { stationCount: stations.length, error: null });

            // Soft decay — prevent ping-pong against rate limit
            delay = Math.max(DE_LOC_DELAY_MS, Math.round(delay * 0.8));
            succeeded = true;
            cs.addLog(`"${loc.name}": ${stations.length} Stationen`, 'info');
            break;
          } catch (err) {
            lastErr = err instanceof Error ? err.message : String(err);
            const isRateLimit = /\b(503|429)\b|Rate Limit|Service Temporarily/i.test(lastErr);
            delay = Math.min(
              isRateLimit ? Math.max(delay * 3, 10_000) : delay * 2,
              DE_LOC_MAX_DELAY_MS,
            );
            attempt++;
          }
        }

        if (!succeeded && lastErr) {
          errors++;
          const msg = `"${loc.name}" nach ${DE_LOC_MAX_RETRIES} Retries: ${lastErr}`;
          console.error(`[DE] ${msg}`);
          cs.addError(msg);
          cs.addLog(`"${loc.name}" übersprungen, Delay jetzt ${(delay / 1000).toFixed(1)}s`, 'warn');
          await recordScanResult(loc.id, { stationCount: 0, error: lastErr }).catch(() => {});
        }

        if (i < locs.length - 1 && this.timer) await sleep(delay);
      }

      const dur = (Date.now() - startTime) / 1000;
      cs.lastDurationSec = Math.round(dur);
      cs.lastCompletedAt = new Date();

      const errStr = errors > 0 ? `, ${errors} Fehler` : '';
      cs.addLog(`Standort-Scan fertig: ${totalStations.toLocaleString('de-DE')} Stationen aus ${locs.length} Standorten in ${fmtDuration(dur)}${errStr}`, 'success');
      console.log(`[DE] Location scan complete: ${totalStations} stations across ${locs.length} locations in ${fmtDuration(dur)}`);
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
    console.log(`[AT] Starting: ${grid.length} points in ${totalBatches} batches, fuel: ${fuelType}`);

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
            console.error(`[AT] ${msg}`);
            cs.addError(msg);
          }
        }

        if (b < totalBatches - 1 && this.timer) await sleep(AT_BATCH_DELAY_MS);
      }

      const dur = (Date.now() - startTime) / 1000;
      cs.lastDurationSec = Math.round(dur);
      cs.lastCompletedAt = new Date();
      cs.addLog(`Fertig: ${cs.stationsScanned.toLocaleString('de-DE')} Stationen in ${fmtDuration(dur)}`, 'success');
      console.log(`[AT] Complete: ${cs.stationsScanned} stations`);
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
