import { loadRepoConfig } from '@/config';
import { fetchStationsLive, fetchStationsEControl } from '@/lib/measure';
import { setCachedStations, getAllCachedLocations } from '@/lib/station-cache';
import { generateGermanyGrid, generateAustriaGrid } from '@/lib/grid';

export interface GridScanStatus {
  scanning: boolean;
  progress: string | null;
  lastFullScanAt: string | null;
  totalStationsCached: number;
  cycleCount: number;
}

export interface CacheStats {
  gridCells: number;
  totalStations: number;
  oldestScan: string | null;
  newestScan: string | null;
}

export interface SchedulerStatus {
  running: boolean;
  scanning: boolean;
  scanProgress: string | null;
  errors: string[];
  grid: GridScanStatus;
  cache: CacheStats;
}

const MAX_ERRORS = 20;

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

  start(): void {
    if (this.timer) return;
    console.log('[Scheduler] Starting grid scan scheduler');
    // Use a keep-alive interval so this.timer is truthy while scanning runs
    this.timer = setInterval(() => {}, 60_000);
    // Start grid scan after a short delay
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
    console.log('[Scheduler] Stopped');
  }

  restart(): void {
    this.stop();
    this.start();
  }

  isRunning(): boolean {
    return this.timer !== null;
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
    };
  }

  private async startGridScan(): Promise<void> {
    const config = loadRepoConfig();
    const apiKey = config.api_key || process.env.TANKERKOENIG_API_KEY || '';
    const fuelType = config.fuel_type || 'diesel';

    // Run grid scan continuously
    while (this.timer) {
      this._gridTotalStations = 0;
      // Germany scan (requires API key)
      if (apiKey) {
        await this.runDeGridCycle(apiKey, fuelType);
      }
      // Austria scan (no API key needed)
      if (this.timer) {
        await this.runAtGridCycle(fuelType);
      }

      this._gridLastFullScanAt = new Date();
      this._gridCycleCount++;
      console.log(`[Grid] Full scan cycle complete: ${this._gridTotalStations} total station entries`);

      // Wait 5 minutes between full cycles
      if (this.timer) await sleep(5 * 60_000);
    }
  }

  private async runDeGridCycle(apiKey: string, fuelType: string): Promise<void> {
    const grid = generateGermanyGrid();
    this._gridScanning = true;
    console.log(`[Grid-DE] Starting Germany scan: ${grid.length} points, fuel type: ${fuelType}`);

    try {
      for (let i = 0; i < grid.length; i++) {
        if (!this.timer) break;
        const point = grid[i];
        this._gridProgress = `DE ${i + 1}/${grid.length}`;

        try {
          const stations = await fetchStationsLive({
            apiKey,
            lat: point.lat,
            lng: point.lng,
            radiusKm: 25,
            fuelType,
          });

          if (stations.length > 0) {
            setCachedStations(point.id, {
              stations,
              lat: point.lat,
              lng: point.lng,
              radiusKm: 25,
              fuelType,
            });
            this._gridTotalStations += stations.length;
          }
        } catch (err) {
          const msg = `[Grid-DE] ${point.id}: ${err instanceof Error ? err.message : String(err)}`;
          console.error(msg);
          this.addError(msg);
        }

        // Wait 12 seconds between API calls to avoid rate limiting
        if (i < grid.length - 1 && this.timer) {
          await sleep(12_000);
        }
      }

      console.log(`[Grid-DE] Germany scan complete`);
    } finally {
      this._gridScanning = false;
      this._gridProgress = null;
    }
  }

  private async runAtGridCycle(fuelType: string): Promise<void> {
    const grid = generateAustriaGrid();
    this._gridScanning = true;
    console.log(`[Grid-AT] Starting Austria scan: ${grid.length} points, fuel type: ${fuelType}`);

    try {
      for (let i = 0; i < grid.length; i++) {
        if (!this.timer) break;
        const point = grid[i];
        this._gridProgress = `AT ${i + 1}/${grid.length}`;

        try {
          const stations = await fetchStationsEControl({
            lat: point.lat,
            lng: point.lng,
            fuelType,
          });

          if (stations.length > 0) {
            setCachedStations(point.id, {
              stations,
              lat: point.lat,
              lng: point.lng,
              radiusKm: 5,
              fuelType,
            });
            this._gridTotalStations += stations.length;
          }
        } catch (err) {
          const msg = `[Grid-AT] ${point.id}: ${err instanceof Error ? err.message : String(err)}`;
          console.error(msg);
          this.addError(msg);
        }

        // Wait 2 seconds between E-Control API calls
        if (i < grid.length - 1 && this.timer) {
          await sleep(2_000);
        }
      }

      console.log(`[Grid-AT] Austria scan complete`);
    } finally {
      this._gridScanning = false;
      this._gridProgress = null;
    }
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
