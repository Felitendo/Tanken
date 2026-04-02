import { loadRepoConfig } from '@/config';
import { fetchStationsLive, fetchStationsEControl } from '@/lib/measure';
import { setCachedStations, getAllCachedLocations, clearAllCache } from '@/lib/station-cache';
import { generateGermanyGrid, generateAustriaGrid, AT_GRID_POINT_COUNT } from '@/lib/grid';

export interface GridScanStatus {
  scanning: boolean;
  progress: string | null;
  lastFullScanAt: string | null;
  totalStationsCached: number;
  cycleCount: number;
}

export interface ScanTiming {
  scanStartedAt: string | null;
  estimatedEndAt: string | null;
  lastCycleDurationSec: number | null;
  avgCallDurationSec: number | null;
}

export interface CacheStats {
  gridCells: number;
  totalStations: number;
  oldestScan: string | null;
  newestScan: string | null;
}

export interface ScanLogEntry {
  time: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warn';
}

export interface SchedulerStatus {
  running: boolean;
  scanning: boolean;
  scanProgress: string | null;
  errors: string[];
  grid: GridScanStatus;
  cache: CacheStats;
  timing: ScanTiming;
  log: ScanLogEntry[];
  currentPoint: { lat: number; lng: number; country: string } | null;
}

const MAX_ERRORS = 20;
const MAX_LOG = 50;

// ─── Timing constants ───────────────────────────────────────────────
/** Delay between Tankerkönig calls (DE). 6s = 10 req/min, their stated limit. */
const DE_DELAY_MS = 6_000;
/** Concurrent E-Control requests (AT). No documented rate limit. */
const AT_CONCURRENCY = 5;
/** Small pause between AT batches to avoid hammering. */
const AT_BATCH_DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class ScanScheduler {
  private timer: ReturnType<typeof setInterval> | null = null;
  private _gridScanning = false;
  private _gridProgress: string | null = null;
  private _gridLastFullScanAt: Date | null = null;
  private _gridTotalStations = 0;
  private _gridCycleCount = 0;
  private _gridTimer: ReturnType<typeof setTimeout> | null = null;
  private recentErrors: string[] = [];

  // Timing
  private _scanStartedAt: Date | null = null;
  private _estimatedEndAt: Date | null = null;
  private _lastCycleDurationSec: number | null = null;
  private _callDurations: number[] = [];
  private _currentPoint: { lat: number; lng: number; country: string } | null = null;

  // Log
  private _log: ScanLogEntry[] = [];

  start(): void {
    if (this.timer) return;
    this.addLog('Scheduler gestartet', 'info');
    console.log('[Scheduler] Starting grid scan scheduler');
    this.timer = setInterval(() => {}, 60_000);
    this._gridTimer = setTimeout(() => this.startGridScan(), 10_000);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this._gridTimer) {
      clearTimeout(this._gridTimer);
      this._gridTimer = null;
    }
    this._gridScanning = false;
    this._gridProgress = null;
    this._currentPoint = null;
    this._scanStartedAt = null;
    this._estimatedEndAt = null;
    this.addLog('Scheduler gestoppt', 'info');
    console.log('[Scheduler] Stopped');
  }

  restart(): void {
    this.stop();
    this.start();
  }

  isRunning(): boolean {
    return this.timer !== null;
  }

  async clearCache(): Promise<void> {
    await clearAllCache();
    this._gridTotalStations = 0;
    this.addLog('Cache geleert (Speicher + Datenbank)', 'warn');
  }

  getStatus(): SchedulerStatus {
    const cachedLocations = getAllCachedLocations();
    let totalStations = 0;
    let oldestTs = Infinity;
    let newestTs = 0;
    for (const loc of cachedLocations) {
      totalStations += loc.stationCount;
      if (loc.timestamp < oldestTs) oldestTs = loc.timestamp;
      if (loc.timestamp > newestTs) newestTs = loc.timestamp;
    }

    const avgCall = this._callDurations.length > 0
      ? this._callDurations.reduce((a, b) => a + b, 0) / this._callDurations.length / 1000
      : null;

    return {
      running: this.timer !== null,
      scanning: this._gridScanning,
      scanProgress: this._gridProgress,
      errors: [...this.recentErrors],
      grid: {
        scanning: this._gridScanning,
        progress: this._gridProgress,
        lastFullScanAt: this._gridLastFullScanAt?.toISOString() ?? null,
        totalStationsCached: this._gridTotalStations,
        cycleCount: this._gridCycleCount,
      },
      cache: {
        gridCells: cachedLocations.length,
        totalStations,
        oldestScan: oldestTs === Infinity ? null : new Date(oldestTs).toISOString(),
        newestScan: newestTs === 0 ? null : new Date(newestTs).toISOString(),
      },
      timing: {
        scanStartedAt: this._scanStartedAt?.toISOString() ?? null,
        estimatedEndAt: this._estimatedEndAt?.toISOString() ?? null,
        lastCycleDurationSec: this._lastCycleDurationSec,
        avgCallDurationSec: avgCall ? Math.round(avgCall * 10) / 10 : null,
      },
      log: [...this._log],
      currentPoint: this._currentPoint,
    };
  }

  private addLog(message: string, type: ScanLogEntry['type'] = 'info'): void {
    this._log.push({ time: new Date().toISOString(), message, type });
    if (this._log.length > MAX_LOG) {
      this._log = this._log.slice(-MAX_LOG);
    }
  }

  private async startGridScan(): Promise<void> {
    const config = loadRepoConfig();
    const apiKey = config.api_key || process.env.TANKERKOENIG_API_KEY || '';
    const fuelType = config.fuel_type || 'diesel';

    while (this.timer) {
      this._gridTotalStations = 0;
      const cycleStart = Date.now();
      this._scanStartedAt = new Date();
      this._callDurations = [];
      this.addLog(`Scan-Zyklus #${this._gridCycleCount + 1} gestartet (Kraftstoff: ${fuelType})`, 'info');

      if (apiKey) {
        await this.runDeGridCycle(apiKey, fuelType);
      } else {
        this.addLog('Kein Tankerkönig API-Key — Deutschland-Scan übersprungen', 'warn');
      }

      if (this.timer) {
        await this.runAtGridCycle(fuelType);
      }

      const cycleDuration = (Date.now() - cycleStart) / 1000;
      this._lastCycleDurationSec = Math.round(cycleDuration);
      this._gridLastFullScanAt = new Date();
      this._gridCycleCount++;
      this._scanStartedAt = null;
      this._estimatedEndAt = null;
      this._currentPoint = null;

      this.addLog(
        `Zyklus #${this._gridCycleCount} abgeschlossen: ${this._gridTotalStations.toLocaleString('de-DE')} Stationen in ${this.fmtDuration(cycleDuration)}`,
        'success'
      );
      console.log(`[Grid] Full scan cycle complete: ${this._gridTotalStations} total station entries`);

      if (this.timer) {
        this.addLog('Warte 5 Minuten bis zum nächsten Zyklus...', 'info');
        await sleep(5 * 60_000);
      }
    }
  }

  private async runDeGridCycle(apiKey: string, fuelType: string): Promise<void> {
    const grid = generateGermanyGrid();
    this._gridScanning = true;
    this.addLog(`Deutschland-Scan: ${grid.length} Grid-Punkte (${DE_DELAY_MS / 1000}s Delay)`, 'info');
    console.log(`[Grid-DE] Starting Germany scan: ${grid.length} points, fuel type: ${fuelType}`);

    let scannedStations = 0;

    try {
      for (let i = 0; i < grid.length; i++) {
        if (!this.timer) break;
        const point = grid[i];
        this._gridProgress = `DE ${i + 1}/${grid.length}`;
        this._currentPoint = { lat: point.lat, lng: point.lng, country: 'DE' };

        // ETA: remaining DE points at DE_DELAY_MS + AT phase estimate
        const remainingDe = grid.length - i - 1;
        const atBatches = Math.ceil(AT_GRID_POINT_COUNT / AT_CONCURRENCY);
        const remainingMs = remainingDe * DE_DELAY_MS + atBatches * AT_BATCH_DELAY_MS;
        this._estimatedEndAt = new Date(Date.now() + remainingMs);

        try {
          const callStart = Date.now();
          const stations = await fetchStationsLive({
            apiKey,
            lat: point.lat,
            lng: point.lng,
            radiusKm: 25,
            fuelType,
          });
          this._callDurations.push(Date.now() - callStart);

          if (stations.length > 0) {
            setCachedStations(point.id, {
              stations,
              lat: point.lat,
              lng: point.lng,
              radiusKm: 25,
              fuelType,
            });
            this._gridTotalStations += stations.length;
            scannedStations += stations.length;
          }
        } catch (err) {
          const msg = `[Grid-DE] ${point.id}: ${err instanceof Error ? err.message : String(err)}`;
          console.error(msg);
          this.addError(msg);
          this.addLog(`Fehler bei ${point.lat},${point.lng}: ${err instanceof Error ? err.message : String(err)}`, 'error');
        }

        if (i < grid.length - 1 && this.timer) {
          await sleep(DE_DELAY_MS);
        }
      }

      this.addLog(`Deutschland fertig: ${scannedStations.toLocaleString('de-DE')} Stationen von ${grid.length} Punkten`, 'success');
      console.log(`[Grid-DE] Germany scan complete`);
    } finally {
      this._gridScanning = false;
      this._gridProgress = null;
    }
  }

  private async runAtGridCycle(fuelType: string): Promise<void> {
    const grid = generateAustriaGrid();
    this._gridScanning = true;
    const totalBatches = Math.ceil(grid.length / AT_CONCURRENCY);
    this.addLog(`Österreich-Scan: ${grid.length} Grid-Punkte (${AT_CONCURRENCY}× parallel)`, 'info');
    console.log(`[Grid-AT] Starting Austria scan: ${grid.length} points in ${totalBatches} batches, fuel type: ${fuelType}`);

    let scannedStations = 0;
    let processed = 0;

    try {
      for (let b = 0; b < totalBatches; b++) {
        if (!this.timer) break;
        const batchStart = b * AT_CONCURRENCY;
        const batch = grid.slice(batchStart, batchStart + AT_CONCURRENCY);
        processed += batch.length;
        this._gridProgress = `AT ${processed}/${grid.length}`;
        this._currentPoint = { lat: batch[0].lat, lng: batch[0].lng, country: 'AT' };

        // ETA: remaining batches
        const remainingBatches = totalBatches - b - 1;
        this._estimatedEndAt = new Date(Date.now() + remainingBatches * AT_BATCH_DELAY_MS);

        // Fire all requests in this batch concurrently
        const results = await Promise.allSettled(
          batch.map(async (point) => {
            const callStart = Date.now();
            const stations = await fetchStationsEControl({
              lat: point.lat,
              lng: point.lng,
              fuelType,
            });
            this._callDurations.push(Date.now() - callStart);
            return { point, stations };
          })
        );

        for (const result of results) {
          if (result.status === 'fulfilled') {
            const { point, stations } = result.value;
            if (stations.length > 0) {
              setCachedStations(point.id, {
                stations,
                lat: point.lat,
                lng: point.lng,
                radiusKm: 5,
                fuelType,
              });
              this._gridTotalStations += stations.length;
              scannedStations += stations.length;
            }
          } else {
            const msg = `[Grid-AT] batch ${b}: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`;
            console.error(msg);
            this.addError(msg);
          }
        }

        if (b < totalBatches - 1 && this.timer) {
          await sleep(AT_BATCH_DELAY_MS);
        }
      }

      this.addLog(`Österreich fertig: ${scannedStations.toLocaleString('de-DE')} Stationen von ${grid.length} Punkten`, 'success');
      console.log(`[Grid-AT] Austria scan complete`);
    } finally {
      this._gridScanning = false;
      this._gridProgress = null;
    }
  }

  private fmtDuration(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.round(totalSeconds % 60);
    if (h > 0) return `${h} Std. ${m} Min.`;
    if (m > 0) return `${m} Min. ${s} Sek.`;
    return `${s} Sek.`;
  }

  private addError(msg: string): void {
    this.recentErrors.push(`${new Date().toISOString()} ${msg}`);
    if (this.recentErrors.length > MAX_ERRORS) {
      this.recentErrors = this.recentErrors.slice(-MAX_ERRORS);
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
