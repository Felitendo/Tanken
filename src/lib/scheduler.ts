import { loadRepoConfig } from '@/config';
import { measureLocation } from '@/lib/measure';
import { setCachedStations } from '@/lib/station-cache';

export interface LocationScanInfo {
  timestamp: string;
  stationCount: number;
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
  errors: string[];
}

const MAX_ERRORS = 20;

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
  private recentErrors: string[] = [];

  start(): void {
    if (this.timer) return;
    console.log('[Scheduler] Starting scan scheduler (tick every 60s)');
    this.timer = setInterval(() => this.tick(), 60_000);
    this.tick();
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('[Scheduler] Stopped');
    }
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

    return {
      running: this.timer !== null,
      scanning: this._scanning,
      currentLocation: this._currentLocation,
      scanProgress: this._scanProgress,
      lastCycleAt: this.lastCycleAt?.toISOString() ?? null,
      nextCycleAt,
      cycleCount: this._cycleCount,
      locationScans: { ...this.locationScans },
      errors: [...this.recentErrors],
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
          this.locationScans[loc.id] = {
            timestamp: new Date().toISOString(),
            stationCount: result.rawStations.length,
          };
        } catch (err) {
          const msg = `"${loc.name}": ${err instanceof Error ? err.message : String(err)}`;
          console.error(`[Scheduler] ${msg}`);
          this.addError(msg);
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
