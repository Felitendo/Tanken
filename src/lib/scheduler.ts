import { loadRepoConfig } from '@/config';
import { measureLocation, fetchStationsLive } from '@/lib/measure';
import { setCachedStations, getAllCachedLocations } from '@/lib/station-cache';
import { generateGermanyGrid, GRID_POINT_COUNT } from '@/lib/grid';

export interface LocationScanInfo {
  timestamp: string;
  stationCount: number;
  openCount: number;
  minPrice: number | null;
  avgPrice: number | null;
  maxPrice: number | null;
  cheapestStation: string | null;
}

export interface ScanLogEntry {
  timestamp: string;
  locationId: string;
  locationName: string;
  stationCount: number;
  openCount: number;
  minPrice: number | null;
  avgPrice: number | null;
  maxPrice: number | null;
  cheapestStation: string | null;
  error?: string;
}

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
  currentLocation: string | null;
  scanProgress: string | null;
  lastCycleAt: string | null;
  nextCycleAt: string | null;
  cycleCount: number;
  locationScans: Record<string, LocationScanInfo>;
  scanLog: ScanLogEntry[];
  errors: string[];
  grid: GridScanStatus;
  cache: CacheStats;
}

const MAX_ERRORS = 20;
const MAX_SCAN_LOG = 50;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class ScanScheduler {
  private timer: ReturnType<typeof setInterval> | null = null;
  private _scanning = false;
  private _currentLocation: string | null = null;
  private _scanProgress: string | null = null;
  private lastCycleAt: Date | null = null;
  private _cycleCount = 0;
  private locationScans: Record<string, LocationScanInfo> = {};
  private _scanLog: ScanLogEntry[] = [];
  private recentErrors: string[] = [];

  // Grid scan state
  private _gridScanning = false;
  private _gridProgress: string | null = null;
  private _gridLastFullScanAt: Date | null = null;
  private _gridTotalStations = 0;
  private _gridCycleCount = 0;
  private _gridTimer: ReturnType<typeof setTimeout> | null = null;

  start(): void {
    if (this.timer) return;
    console.log('[Scheduler] Starting scan scheduler (tick every 60s)');
    this.timer = setInterval(() => this.tick(), 60_000);
    this.tick();
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

  /** Trigger an immediate scan cycle, regardless of interval timer. */
  scanNow(): void {
    if (this._scanning) return;

    const config = loadRepoConfig();
    const locations = config.locations ?? [];
    const apiKey = config.api_key || process.env.TANKERKOENIG_API_KEY || '';

    if (!apiKey || locations.length === 0) return;

    this.runCycle(apiKey, locations).catch(err => {
      this.addError(`Cycle error: ${err instanceof Error ? err.message : String(err)}`);
    });
  }

  getStatus(): SchedulerStatus {
    const config = loadRepoConfig();
    const intervalMs = (config.refresh_interval_minutes ?? 60) * 60_000;
    let nextCycleAt: string | null = null;

    if (this.timer && this.lastCycleAt) {
      nextCycleAt = new Date(this.lastCycleAt.getTime() + intervalMs).toISOString();
    } else if (this.timer) {
      nextCycleAt = new Date().toISOString();
    }

    // Compute cache stats
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
      scanning: this._scanning,
      currentLocation: this._currentLocation,
      scanProgress: this._scanProgress,
      lastCycleAt: this.lastCycleAt?.toISOString() ?? null,
      nextCycleAt,
      cycleCount: this._cycleCount,
      locationScans: { ...this.locationScans },
      scanLog: [...this._scanLog],
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

  private tick(): void {
    if (this._scanning) return;

    const config = loadRepoConfig();
    const intervalMs = (config.refresh_interval_minutes ?? 60) * 60_000;
    const locations = config.locations ?? [];
    const apiKey = config.api_key || process.env.TANKERKOENIG_API_KEY || '';

    if (!apiKey || locations.length === 0) return;

    if (this.lastCycleAt && (Date.now() - this.lastCycleAt.getTime()) < intervalMs) {
      return;
    }

    this.runCycle(apiKey, locations).catch(err => {
      this.addError(`Cycle error: ${err instanceof Error ? err.message : String(err)}`);
    });
  }

  private async runCycle(apiKey: string, locations: Array<{ id: string; name: string; lat: number; lng: number; radius_km: number; fuel_type: 'diesel' | 'e5' | 'e10' }>): Promise<void> {
    this._scanning = true;
    console.log(`[Scheduler] Starting scan cycle for ${locations.length} location(s)`);

    try {
      for (let i = 0; i < locations.length; i++) {
        const loc = locations[i];
        this._currentLocation = loc.name;
        this._scanProgress = `${i + 1}/${locations.length}`;
        try {
          console.log(`[Scheduler] Scanning "${loc.name}" (${i + 1}/${locations.length})`);
          const result = await measureLocation({
            apiKey,
            lat: loc.lat,
            lng: loc.lng,
            radius: loc.radius_km,
            fuelType: loc.fuel_type,
            locationId: loc.id,
          });
          // Cache raw station data so /api/stations can serve it
          setCachedStations(loc.id, {
            stations: result.rawStations,
            lat: loc.lat,
            lng: loc.lng,
            radiusKm: loc.radius_km,
            fuelType: loc.fuel_type,
          });
          const openCount = result.rawStations.filter(s => s.isOpen && s.price !== null && s.price > 0).length;
          const scanInfo: LocationScanInfo = {
            timestamp: new Date().toISOString(),
            stationCount: result.rawStations.length,
            openCount,
            minPrice: result.min_price,
            avgPrice: result.avg_price,
            maxPrice: result.max_price,
            cheapestStation: result.station || null,
          };
          this.locationScans[loc.id] = scanInfo;
          this.addScanLog({
            ...scanInfo,
            locationId: loc.id,
            locationName: loc.name,
          });
          console.log(`[Scheduler] "${loc.name}": ${openCount}/${result.rawStations.length} offen, Min ${result.min_price.toFixed(3)}€, Avg ${result.avg_price.toFixed(3)}€, Max ${result.max_price.toFixed(3)}€, Günstigste: ${result.station}`);
        } catch (err) {
          const msg = `"${loc.name}": ${err instanceof Error ? err.message : String(err)}`;
          console.error(`[Scheduler] ${msg}`);
          this.addError(msg);
          this.addScanLog({
            timestamp: new Date().toISOString(),
            locationId: loc.id,
            locationName: loc.name,
            stationCount: 0,
            openCount: 0,
            minPrice: null,
            avgPrice: null,
            maxPrice: null,
            cheapestStation: null,
            error: err instanceof Error ? err.message : String(err),
          });
        }

        // Wait at least 60 seconds between API calls (rate limit protection)
        if (i < locations.length - 1) {
          await sleep(60_000);
        }
      }

      this.lastCycleAt = new Date();
      this._cycleCount++;
      console.log('[Scheduler] Scan cycle complete');
    } finally {
      this._scanning = false;
      this._currentLocation = null;
      this._scanProgress = null;
    }
  }

  private async startGridScan(): Promise<void> {
    const config = loadRepoConfig();
    const apiKey = config.api_key || process.env.TANKERKOENIG_API_KEY || '';
    const fuelType = config.fuel_type || 'diesel';
    if (!apiKey) {
      console.log('[Grid] No API key configured, skipping grid scan');
      return;
    }

    // Run grid scan continuously
    while (this.timer) {
      await this.runGridCycle(apiKey, fuelType);
      // Wait 5 minutes between full cycles
      if (this.timer) await sleep(5 * 60_000);
    }
  }

  private async runGridCycle(apiKey: string, fuelType: string): Promise<void> {
    const grid = generateGermanyGrid();
    this._gridScanning = true;
    this._gridTotalStations = 0;
    console.log(`[Grid] Starting grid scan: ${grid.length} points, fuel type: ${fuelType}`);

    try {
      for (let i = 0; i < grid.length; i++) {
        if (!this.timer) break; // Stop if scheduler was stopped
        const point = grid[i];
        this._gridProgress = `${i + 1}/${grid.length}`;

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
          const msg = `[Grid] ${point.id}: ${err instanceof Error ? err.message : String(err)}`;
          console.error(msg);
          this.addError(msg);
        }

        // Wait 12 seconds between API calls to avoid rate limiting
        if (i < grid.length - 1 && this.timer) {
          await sleep(12_000);
        }
      }

      this._gridLastFullScanAt = new Date();
      this._gridCycleCount++;
      console.log(`[Grid] Grid scan complete: ${this._gridTotalStations} total station entries cached`);
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

  private addScanLog(entry: ScanLogEntry): void {
    this._scanLog.push(entry);
    if (this._scanLog.length > MAX_SCAN_LOG) {
      this._scanLog = this._scanLog.slice(-MAX_SCAN_LOG);
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
