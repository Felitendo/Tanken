/**
 * Import German gas stations from the official Tankerkönig PostgreSQL dump.
 *
 * Flow:
 * 1. Download `history.dump.gz` (~8 GB) from creativecommons.tankerkoenig.de
 * 2. Decompress the gzip layer
 * 3. Parse the PostgreSQL custom dump format in pure TypeScript (no pg_restore needed)
 * 4. Extract the `gas_station` table COPY data
 * 5. Seed the station cache so daily price dumps can run
 *
 * Requirements:
 * - Enough disk space for the download + decompressed dump (~16 GB peak)
 */

import { createWriteStream, createReadStream, unlinkSync, existsSync, openSync, readSync, closeSync } from 'fs';
import { pipeline } from 'stream/promises';
import { createGunzip, inflateSync } from 'zlib';
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
    // ─── 1. Download ─────────────────────────────────────────────
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

    // ─── 2. Decompress gzip outer layer ──────────────────────────
    progress('decompress', 0, 'Entpacke Dump (kann einige Minuten dauern)...');
    if (shouldAbort()) throw new Error('Abgebrochen');

    await decompressFile(tempGz, tempDump);
    safeDelete(tempGz);

    // ─── 3. Extract station table from PostgreSQL custom dump ────
    progress('extract', 0, 'Lese Dump-Verzeichnis...');
    if (shouldAbort()) throw new Error('Abgebrochen');

    const reader = new PgDumpReader(tempDump);
    try {
      reader.parseHeader();

      const tocEntries = reader.parseToc();
      progress('extract', 10, `${tocEntries.length} Einträge im Dump, suche Stationen...`);

      // Find the gas_station TABLE DATA entry
      let stationEntry = tocEntries.find(
        e => e.desc === 'TABLE DATA' && /gas_station/i.test(e.tag || ''),
      );
      if (!stationEntry) {
        stationEntry = tocEntries.find(
          e => e.desc === 'TABLE DATA' && /\bstation\b/i.test(e.tag || '') && !/history|price|info/i.test(e.tag || ''),
        );
      }
      if (!stationEntry) {
        throw new Error('Stations-Tabelle nicht im Dump gefunden');
      }

      progress('extract', 20, `Tabelle "${stationEntry.tag}" gefunden, lese Daten...`);

      if (stationEntry.dataOffset < 0) {
        throw new Error('Kein Daten-Offset für Stations-Tabelle vorhanden');
      }

      // Read and decompress the COPY data
      const copyData = reader.readTableData(stationEntry.dataOffset);
      progress('extract', 60, 'Daten extrahiert, parse Stationen...');

      // Parse columns from COPY statement
      const stations = parseStationsFromCopy(copyData, stationEntry.copyStmt);

      if (stations.length === 0) {
        throw new Error('Keine Stationen im Dump gefunden');
      }

      progress('extract', 80, `${stations.length.toLocaleString('de-DE')} Stationen extrahiert`);

      // ─── 4. Seed station cache ───────────────────────────────────
      progress('seed', 0, 'Befülle Cache...');
      if (shouldAbort()) throw new Error('Abgebrochen');

      const count = seedCache(stations, fuelType, (pct) => {
        progress('seed', pct, `${Math.round(stations.length * pct / 100).toLocaleString('de-DE')} / ${stations.length.toLocaleString('de-DE')}`);
      });

      return count;
    } finally {
      reader.close();
    }
  } finally {
    safeDelete(tempGz);
    safeDelete(tempDump);
  }
}

// ─── PostgreSQL Custom Dump Reader ──────────────────────────────────

function makeVersion(maj: number, min: number, rev: number): number {
  return maj * 65536 + min * 256 + rev;
}

const K_VERS_1_2  = makeVersion(1, 2, 0);
const K_VERS_1_3  = makeVersion(1, 3, 0);
const K_VERS_1_4  = makeVersion(1, 4, 0);
const K_VERS_1_5  = makeVersion(1, 5, 0);
const K_VERS_1_6  = makeVersion(1, 6, 0);
const K_VERS_1_7  = makeVersion(1, 7, 0);
const K_VERS_1_8  = makeVersion(1, 8, 0);
const K_VERS_1_9  = makeVersion(1, 9, 0);
const K_VERS_1_10 = makeVersion(1, 10, 0);
const K_VERS_1_11 = makeVersion(1, 11, 0);
const K_VERS_1_13 = makeVersion(1, 13, 0);
const K_VERS_1_14 = makeVersion(1, 14, 0);
const K_VERS_1_15 = makeVersion(1, 15, 0);
const K_VERS_1_16 = makeVersion(1, 16, 0);

interface TocEntry {
  tag: string | null;
  desc: string | null;
  copyStmt: string | null;
  dataOffset: number;
}

class PgDumpReader {
  private fd: number;
  private pos = 0;
  private intSize = 4;
  private offSize = 8;
  private version = 0;
  private compressed = false;

  constructor(filePath: string) {
    this.fd = openSync(filePath, 'r');
  }

  close(): void {
    closeSync(this.fd);
  }

  private readBytes(n: number): Buffer {
    const buf = Buffer.alloc(n);
    const bytesRead = readSync(this.fd, buf, 0, n, this.pos);
    this.pos += bytesRead;
    if (bytesRead < n) throw new Error(`Unerwartetes Dateiende bei Position ${this.pos}`);
    return buf;
  }

  private readByte(): number {
    return this.readBytes(1)[0];
  }

  /** Read a pg_dump integer: 1 sign byte + intSize bytes (little-endian). */
  private readInt(): number {
    const sign = this.readByte();
    const bytes = this.readBytes(this.intSize);
    let val = 0;
    for (let i = 0; i < this.intSize; i++) {
      val += bytes[i] * (1 << (i * 8));
    }
    return sign ? -val : val;
  }

  /** Read a pg_dump string: int length + bytes. Returns null for length < 0. */
  private readStr(): string | null {
    const len = this.readInt();
    if (len < 0) return null;
    if (len === 0) return '';
    return this.readBytes(len).toString('utf8');
  }

  /** Read a pg_dump offset: 1 flag byte + offSize bytes (little-endian). Returns -1 if unset. */
  private readOffset(): number {
    const flag = this.readByte();
    const bytes = this.readBytes(this.offSize);
    // flag 2 = K_OFFSET_POS_SET, flag 1 = K_OFFSET_POS_NOT_SET
    if (flag !== 2) return -1;
    let offset = 0;
    for (let i = 0; i < Math.min(this.offSize, 6); i++) {
      offset += bytes[i] * Math.pow(256, i);
    }
    return offset;
  }

  /** Parse the dump file header. Must be called first. */
  parseHeader(): void {
    const magic = this.readBytes(5).toString('ascii');
    if (magic !== 'PGDMP') throw new Error('Keine PostgreSQL-Dump-Datei');

    const vmaj = this.readByte();
    const vmin = this.readByte();
    let vrev = 0;
    if (vmaj > 1 || (vmaj === 1 && vmin > 0)) {
      vrev = this.readByte();
    }
    this.version = makeVersion(vmaj, vmin, vrev);

    this.intSize = this.readByte();
    if (this.version >= K_VERS_1_7) {
      this.offSize = this.readByte();
    } else {
      this.offSize = this.intSize;
    }

    const format = this.readByte();
    if (format !== 1) throw new Error(`Dump-Format ${format} nicht unterstützt (nur custom=1)`);

    // Compression
    if (this.version >= K_VERS_1_15) {
      const algo = this.readInt();
      this.readInt(); // level
      this.compressed = algo !== 0;
    } else if (this.version >= K_VERS_1_2) {
      const level = this.readInt();
      this.compressed = level !== 0;
    } else {
      this.compressed = true; // default gzip
    }

    // Timestamp (v1.4+)
    if (this.version >= K_VERS_1_4) {
      for (let i = 0; i < 6; i++) this.readInt();
      this.readStr(); // dbname
    }

    // Server/dump version strings (v1.10+)
    if (this.version >= K_VERS_1_10) {
      this.readStr(); // server version
      this.readStr(); // pg_dump version
    }
  }

  /** Parse the Table of Contents. Must be called after parseHeader(). */
  parseToc(): TocEntry[] {
    const count = this.readInt();
    const entries: TocEntry[] = [];

    for (let i = 0; i < count; i++) {
      this.readInt(); // dumpId
      if (this.version >= K_VERS_1_8) this.readInt(); // hadDumper
      this.readStr(); // tableOid
      this.readStr(); // oid

      const tag = this.readStr();
      const desc = this.readStr();

      if (this.version >= K_VERS_1_11) this.readInt(); // section
      this.readStr(); // defn
      this.readStr(); // dropStmt

      const copyStmt = this.version >= K_VERS_1_3 ? this.readStr() : null;

      if (this.version >= K_VERS_1_6) this.readStr(); // namespace
      if (this.version >= K_VERS_1_10) this.readStr(); // tablespace
      if (this.version >= K_VERS_1_14) this.readStr(); // tableam

      this.readStr(); // owner

      // withOids (v1.9 to v1.15)
      if (this.version >= K_VERS_1_9 && this.version < K_VERS_1_16) {
        this.readStr();
      }

      // Dependencies
      if (this.version >= K_VERS_1_5) {
        if (this.version >= K_VERS_1_13) {
          const nDeps = this.readInt();
          for (let k = 0; k < nDeps; k++) this.readStr();
        } else {
          while (this.readStr() !== null) { /* skip deps */ }
        }
      }

      // Custom format extra TOC data: dataState (int) + offset
      this.readInt(); // dataState
      const dataOffset = this.version >= K_VERS_1_7 ? this.readOffset() : -1;

      entries.push({ tag, desc, copyStmt, dataOffset });
    }

    return entries;
  }

  /**
   * Read and decompress table data at the given file offset.
   * Returns the raw COPY text output.
   */
  readTableData(offset: number): string {
    this.pos = offset;

    // Block header: type byte (1 = BLK_DATA) + dump ID (int)
    const blockType = this.readByte();
    this.readInt(); // dump ID

    if (blockType !== 1) {
      throw new Error(`Unerwarteter Block-Typ: ${blockType} (erwartet: 1 = DATA)`);
    }

    // Read all data blocks. Together they form one zlib stream (if compressed).
    const rawChunks: Buffer[] = [];
    while (true) {
      const blockLen = this.readInt();
      if (blockLen === 0) break;
      rawChunks.push(this.readBytes(blockLen));
    }

    if (rawChunks.length === 0) return '';

    const rawData = Buffer.concat(rawChunks);

    if (this.compressed) {
      try {
        return inflateSync(rawData).toString('utf8');
      } catch {
        // Fallback: try treating as uncompressed
        return rawData.toString('utf8');
      }
    }

    return rawData.toString('utf8');
  }
}

// ─── COPY data parsing ──────────────────────────────────────────────

/** Parse the COPY text data into CachedStation objects. */
function parseStationsFromCopy(copyData: string, copyStmt: string | null): CachedStation[] {
  // Try to extract column names from the COPY statement
  // Format: "COPY public.gas_station (col1, col2, ...) FROM stdin;\n"
  let columns: string[] = [];
  if (copyStmt) {
    const colMatch = copyStmt.match(/\(([^)]+)\)/);
    if (colMatch) {
      columns = colMatch[1].split(',').map(c => c.trim());
    }
  }

  const stations: CachedStation[] = [];
  const lines = copyData.split('\n');

  for (const line of lines) {
    // Skip empty lines and COPY/end markers
    if (!line || line === '\\.' || line.startsWith('COPY ')) continue;

    // If we didn't get columns from copyStmt, try parsing from inline COPY header
    if (columns.length === 0 && line.startsWith('COPY ') && line.includes('FROM stdin')) {
      const colMatch = line.match(/\(([^)]+)\)/);
      if (colMatch) {
        columns = colMatch[1].split(',').map(c => c.trim());
      }
      continue;
    }

    if (columns.length === 0) continue;

    const station = parseCopyRow(columns, line);
    if (station) stations.push(station);
  }

  return stations;
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
