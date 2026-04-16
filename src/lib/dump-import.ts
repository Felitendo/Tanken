/**
 * Import German gas stations from the official Tankerkönig PostgreSQL dump.
 *
 * Flow:
 * 1. Download `history.dump.gz` (~8 GB) from creativecommons.tankerkoenig.de
 * 2. Decompress the gzip layer
 * 3. Extract the `gas_station` table via `pg_restore --data-only`
 * 4. Parse the COPY output to get station metadata
 * 5. Seed the station cache so daily price dumps can run
 *
 * Requirements:
 * - `pg_restore` must be on PATH (ships with PostgreSQL client tools)
 * - Enough disk space for the download + decompressed dump (~16 GB peak)
 */

import { spawn } from 'child_process';
import { createWriteStream, createReadStream, unlinkSync, existsSync } from 'fs';
import { pipeline } from 'stream/promises';
import { createGunzip } from 'zlib';
import { tmpdir } from 'os';
import { join } from 'path';
import { setCachedStations, type CachedStation } from '@/lib/station-cache';

const DUMP_URL = 'https://creativecommons.tankerkoenig.de/history/history.dump.gz';

export interface ImportStatus {
  phase: 'idle' | 'download' | 'decompress' | 'extract' | 'seed' | 'done' | 'error';
  percent: number;
  detail: string;
  stationsImported: number;
  error: string | null;
}

export interface ImportParams {
  apiKey: string;
  fuelType: string;
  onProgress: (status: ImportStatus) => void;
  shouldAbort: () => boolean;
}

/** Run the full import pipeline. Returns number of stations imported. */
export async function importStationsFromDump(params: ImportParams): Promise<number> {
  const { apiKey, fuelType, onProgress, shouldAbort } = params;
  const tempGz = join(tmpdir(), `tanken-${Date.now()}.gz`);
  const tempDump = join(tmpdir(), `tanken-${Date.now()}.dump`);

  const progress = (phase: ImportStatus['phase'], percent: number, detail: string) => {
    onProgress({ phase, percent, detail, stationsImported: 0, error: null });
  };

  try {
    // ─── 1. Check pg_restore ─────────────────────────────────────
    const pgRestore = await findPgRestore();
    if (!pgRestore) {
      throw new Error(
        'pg_restore nicht gefunden. Bitte PostgreSQL Client-Tools installieren ' +
        '(apt install postgresql-client / brew install libpq / scoop install postgresql).'
      );
    }

    // ─── 2. Download ─────────────────────────────────────────────
    progress('download', 0, 'Starte Download...');
    if (shouldAbort()) throw new Error('Abgebrochen');

    await downloadFile(
      `${DUMP_URL}?apikey=${apiKey}`,
      tempGz,
      (pct, mbDown, mbTotal) => {
        progress('download', pct, `${mbDown.toLocaleString('de-DE')} / ${mbTotal.toLocaleString('de-DE')} MB`);
      },
      shouldAbort,
    );

    // ─── 3. Decompress gzip outer layer ──────────────────────────
    progress('decompress', 0, 'Entpacke Dump (kann einige Minuten dauern)...');
    if (shouldAbort()) throw new Error('Abgebrochen');

    await decompressFile(tempGz, tempDump);
    safeDelete(tempGz);

    // ─── 4. Extract station table via pg_restore ─────────────────
    progress('extract', 0, 'Extrahiere Stationen via pg_restore...');
    if (shouldAbort()) throw new Error('Abgebrochen');

    // First, find the station table name in the dump
    const tableName = await findStationTable(pgRestore, tempDump);
    progress('extract', 20, `Tabelle "${tableName}" gefunden, lese Daten...`);

    const stations = await extractStations(pgRestore, tempDump, tableName);
    safeDelete(tempDump);

    if (stations.length === 0) {
      throw new Error('Keine Stationen im Dump gefunden');
    }

    progress('extract', 80, `${stations.length.toLocaleString('de-DE')} Stationen extrahiert`);

    // ─── 5. Seed station cache ───────────────────────────────────
    progress('seed', 0, 'Befülle Cache...');
    if (shouldAbort()) throw new Error('Abgebrochen');

    const count = seedCache(stations, fuelType, (pct) => {
      progress('seed', pct, `${Math.round(stations.length * pct / 100).toLocaleString('de-DE')} / ${stations.length.toLocaleString('de-DE')}`);
    });

    return count;

  } finally {
    safeDelete(tempGz);
    safeDelete(tempDump);
  }
}

// ─── Download with progress ──────────────────────────────────────────

async function downloadFile(
  url: string,
  dest: string,
  onProgress: (pct: number, mbDown: number, mbTotal: number) => void,
  shouldAbort: () => boolean,
): Promise<void> {
  const controller = new AbortController();
  const response = await fetch(url, { signal: controller.signal });

  if (!response.ok) {
    const hint = await response.text().catch(() => '');
    throw new Error(`Download fehlgeschlagen: HTTP ${response.status} — ${hint.slice(0, 200)}`);
  }

  const total = parseInt(response.headers.get('content-length') || '0', 10);
  const reader = response.body!.getReader();
  const writer = createWriteStream(dest);

  let downloaded = 0;
  let lastReport = 0;

  try {
    while (true) {
      if (shouldAbort()) {
        controller.abort();
        throw new Error('Abgebrochen');
      }

      const { done, value } = await reader.read();
      if (done) break;

      writer.write(Buffer.from(value));
      downloaded += value.length;

      // Report progress at most every 500ms
      const now = Date.now();
      if (now - lastReport > 500 || done) {
        const pct = total > 0 ? Math.round(downloaded / total * 100) : 0;
        onProgress(pct, Math.round(downloaded / 1_048_576), Math.round(total / 1_048_576));
        lastReport = now;
      }
    }
  } finally {
    writer.end();
    // Wait for writer to finish
    await new Promise<void>((resolve) => writer.on('finish', resolve));
  }
}

// ─── Decompress ──────────────────────────────────────────────────────

async function decompressFile(gzPath: string, outPath: string): Promise<void> {
  await pipeline(
    createReadStream(gzPath),
    createGunzip(),
    createWriteStream(outPath),
  );
}

// ─── pg_restore helpers ──────────────────────────────────────────────

/** Find pg_restore binary. Returns path or null. */
async function findPgRestore(): Promise<string | null> {
  // Try common names/locations
  const candidates = ['pg_restore'];

  for (const cmd of candidates) {
    try {
      const ok = await new Promise<boolean>((resolve) => {
        const proc = spawn(cmd, ['--version'], { stdio: 'pipe' });
        proc.on('error', () => resolve(false));
        proc.on('close', (code) => resolve(code === 0));
      });
      if (ok) return cmd;
    } catch {
      continue;
    }
  }
  return null;
}

/** List dump TOC to find the station table name. */
async function findStationTable(pgRestore: string, dumpPath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const proc = spawn(pgRestore, ['--list', dumpPath], { stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';

    proc.stdout.on('data', (data: Buffer) => { output += data.toString(); });
    proc.on('close', (code) => {
      // Look for a TABLE DATA entry containing "gas_station" or "station"
      const lines = output.split('\n');
      for (const line of lines) {
        // TOC format: "123; 1234 56789 TABLE DATA public gas_station owner"
        if (/TABLE DATA.*gas_station/i.test(line)) {
          const match = line.match(/TABLE DATA\s+\S+\s+(\S+)/);
          if (match) { resolve(match[1]); return; }
        }
      }
      // Fallback: try "station" (without "gas_" prefix)
      for (const line of lines) {
        if (/TABLE DATA.*\bstation\b/i.test(line) && !/history|price|info/i.test(line)) {
          const match = line.match(/TABLE DATA\s+\S+\s+(\S+)/);
          if (match) { resolve(match[1]); return; }
        }
      }
      reject(new Error(`Stations-Tabelle nicht im Dump gefunden (pg_restore --list exit ${code})`));
    });
    proc.on('error', (err) => reject(new Error(`pg_restore --list Fehler: ${err.message}`)));
  });
}

/** Extract station data from the dump using pg_restore COPY output. */
async function extractStations(pgRestore: string, dumpPath: string, tableName: string): Promise<CachedStation[]> {
  return new Promise<CachedStation[]>((resolve, reject) => {
    const proc = spawn(pgRestore, [
      '--data-only',
      `--table=${tableName}`,
      '-f', '-',  // Output to stdout
      dumpPath,
    ], { stdio: ['ignore', 'pipe', 'pipe'] });

    const stations: CachedStation[] = [];
    let buffer = '';
    let columns: string[] = [];
    let inCopy = false;

    proc.stdout.on('data', (data: Buffer) => {
      buffer += data.toString();
      let nl: number;
      while ((nl = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, nl).trimEnd();
        buffer = buffer.slice(nl + 1);

        // Detect COPY header: "COPY public.gas_station (col1, col2, ...) FROM stdin;"
        if (line.startsWith('COPY ') && line.includes('FROM stdin')) {
          const colMatch = line.match(/\(([^)]+)\)/);
          if (colMatch) {
            columns = colMatch[1].split(',').map(c => c.trim());
            inCopy = true;
          }
          continue;
        }

        // End of COPY block
        if (line === '\\.' || line === '\\.') {
          inCopy = false;
          continue;
        }

        // Data row (tab-separated)
        if (inCopy && columns.length > 0) {
          const station = parseCopyRow(columns, line);
          if (station) stations.push(station);
        }
      }
    });

    let stderr = '';
    proc.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

    proc.on('close', (code) => {
      // pg_restore may exit non-zero even with warnings; accept if we got stations
      if (stations.length > 0) {
        resolve(stations);
      } else if (code !== 0) {
        reject(new Error(`pg_restore Fehler (exit ${code}): ${stderr.slice(0, 300)}`));
      } else {
        resolve(stations);
      }
    });
    proc.on('error', (err) => reject(new Error(`pg_restore Fehler: ${err.message}`)));
  });
}

/** Parse a single tab-separated COPY row into a CachedStation. */
function parseCopyRow(columns: string[], line: string): CachedStation | null {
  const values = line.split('\t');
  if (values.length < columns.length) return null;

  const get = (name: string): string => {
    const idx = columns.indexOf(name);
    if (idx < 0) return '';
    const val = values[idx];
    return val === '\\N' ? '' : val;  // \N = NULL in COPY format
  };

  const id = get('id');
  const lat = parseFloat(get('lat'));
  const lng = parseFloat(get('lng'));

  // Skip entries without valid coordinates or ID
  if (!id || !isFinite(lat) || !isFinite(lng) || lat === 0 || lng === 0) return null;

  return {
    id,
    name: get('name'),
    brand: get('brand'),
    street: get('street'),
    houseNumber: get('house_number') || get('houseNumber') || get('housenumber'),
    postCode: get('post_code') || get('postCode') || get('postcode'),
    place: get('place') || get('city'),
    lat,
    lng,
    dist: 0,
    price: null,   // Will be filled by daily price dump
    isOpen: false,  // Will be updated by daily price dump
  };
}

// ─── Cache seeding ───────────────────────────────────────────────────

/**
 * Group stations by ~20km grid cells and seed the station cache.
 * This creates cache entries matching the grid layout for efficient lookups.
 */
function seedCache(stations: CachedStation[], fuelType: string, onProgress: (pct: number) => void): number {
  // Group stations by 0.2° lat × 0.3° lng grid cells (~20km)
  const cells = new Map<string, CachedStation[]>();

  for (const s of stations) {
    const cellLat = Math.round(s.lat / 0.2) * 0.2;
    const cellLng = Math.round(s.lng / 0.3) * 0.3;
    const cellId = `de-import-${cellLat.toFixed(1)}-${cellLng.toFixed(1)}`;

    let cell = cells.get(cellId);
    if (!cell) {
      cell = [];
      cells.set(cellId, cell);
    }
    cell.push(s);
  }

  // Write each cell to cache
  let written = 0;
  const total = cells.size;

  for (const [cellId, cellStations] of cells) {
    const avgLat = cellStations.reduce((s, st) => s + st.lat, 0) / cellStations.length;
    const avgLng = cellStations.reduce((s, st) => s + st.lng, 0) / cellStations.length;

    setCachedStations(cellId, {
      stations: cellStations,
      lat: avgLat,
      lng: avgLng,
      radiusKm: 15,
      fuelType,
    });

    written++;
    if (written % 10 === 0 || written === total) {
      onProgress(Math.round(written / total * 100));
    }
  }

  console.log(`[Import] Seeded ${stations.length} stations across ${cells.size} grid cells`);
  return stations.length;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function safeDelete(path: string): void {
  if (existsSync(path)) {
    try { unlinkSync(path); } catch { /* ignore */ }
  }
}
