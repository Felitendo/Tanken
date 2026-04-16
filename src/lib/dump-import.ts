/**
 * Import German gas stations and price history from the official Tankerkönig PostgreSQL dump.
 *
 * Flow:
 * 1. Download `history.dump.gz` (~8 GB) from creativecommons.tankerkoenig.de
 * 2. Decompress the gzip layer
 * 3. Parse the PostgreSQL custom dump format in pure TypeScript (no pg_restore needed)
 * 4. Extract the `gas_station` table COPY data → seed station cache
 * 5. Stream `gas_station_information_history` table → import price history
 *
 * Requirements:
 * - Enough disk space for the download + decompressed dump (~16 GB peak)
 */

import { createWriteStream, createReadStream, unlinkSync, existsSync, openSync, readSync, closeSync } from 'fs';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { createGunzip, inflateSync } from 'zlib';
import { tmpdir } from 'os';
import { join } from 'path';
import { setCachedStations, type CachedStation } from '@/lib/station-cache';

const DUMP_URL = 'https://creativecommons.tankerkoenig.de/history/history.dump.gz';

export interface ImportStatus {
  phase: 'idle' | 'download' | 'decompress' | 'extract' | 'seed' | 'prices' | 'done' | 'error';
  percent: number;
  detail: string;
  stationsImported: number;
  pricesImported: number;
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

  let stationsImported = 0;
  let pricesImported = 0;

  const progress = (phase: ImportStatus['phase'], percent: number, detail: string) => {
    onProgress({ phase, percent, detail, stationsImported, pricesImported, error: null });
  };

  try {
    // ─── 1. Download ─────────────────────────────────────────────
    console.log(`[Import] Phase 1/5: Download starten → ${tempGz}`);
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
    console.log('[Import] Phase 1/5: Download abgeschlossen');

    // ─── 2. Decompress gzip outer layer ──────────────────────────
    console.log(`[Import] Phase 2/5: Dekompress ${tempGz} → ${tempDump}`);
    progress('decompress', 0, 'Entpacke Dump (kann einige Minuten dauern)...');
    if (shouldAbort()) throw new Error('Abgebrochen');

    await decompressFile(tempGz, tempDump);
    safeDelete(tempGz);
    console.log('[Import] Phase 2/5: Dekompress abgeschlossen');

    // ─── 3. Extract station table from PostgreSQL custom dump ────
    console.log('[Import] Phase 3/5: pg_dump parsen');
    progress('extract', 0, 'Lese Dump-Verzeichnis...');
    if (shouldAbort()) throw new Error('Abgebrochen');

    const reader = new PgDumpReader(tempDump);
    try {
      reader.parseHeader();
      console.log('[Import] Dump-Header gelesen');

      const tocEntries = reader.parseToc();
      console.log(`[Import] TOC: ${tocEntries.length} Einträge gefunden`);
      // Log all TABLE DATA entries for debugging
      for (const e of tocEntries) {
        if (e.desc === 'TABLE DATA') {
          console.log(`[Import]   TABLE DATA: "${e.tag}" offset=${e.dataOffset} copyStmt=${e.copyStmt ? 'ja' : 'nein'}`);
        }
      }
      progress('extract', 10, `${tocEntries.length} Einträge im Dump, suche Stationen...`);

      // Find the gas_station TABLE DATA entry
      let stationEntry = tocEntries.find(
        e => e.desc === 'TABLE DATA' && /^gas_station$/i.test(e.tag || ''),
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
      console.log(`[Import] Stationstabelle: "${stationEntry.tag}" bei offset ${stationEntry.dataOffset}`);

      if (stationEntry.dataOffset < 0) {
        throw new Error('Kein Daten-Offset für Stations-Tabelle vorhanden');
      }

      // Read and decompress the COPY data
      const copyData = reader.readTableData(stationEntry.dataOffset);
      console.log(`[Import] COPY-Daten gelesen: ${(copyData.length / 1024).toFixed(0)} KB`);
      progress('extract', 60, 'Daten extrahiert, parse Stationen...');

      // Parse columns from COPY statement
      const stations = parseStationsFromCopy(copyData, stationEntry.copyStmt);
      console.log(`[Import] ${stations.length} Stationen geparst`);

      if (stations.length === 0) {
        throw new Error('Keine Stationen im Dump gefunden');
      }

      progress('extract', 80, `${stations.length.toLocaleString('de-DE')} Stationen extrahiert`);

      // ─── 4. Seed station cache ───────────────────────────────────
      console.log('[Import] Phase 4/5: Cache befüllen');
      progress('seed', 0, 'Befülle Cache...');
      if (shouldAbort()) throw new Error('Abgebrochen');

      stationsImported = seedCache(stations, fuelType, (pct) => {
        progress('seed', pct, `${Math.round(stations.length * pct / 100).toLocaleString('de-DE')} / ${stations.length.toLocaleString('de-DE')}`);
      });
      console.log(`[Import] Phase 4/5: Cache befüllt mit ${stationsImported} Stationen`);

      // ─── 5. Import price history ─────────────────────────────────
      console.log('[Import] Phase 5/5: Preishistorie');
      progress('prices', 0, 'Suche Preishistorie im Dump...');
      if (shouldAbort()) throw new Error('Abgebrochen');

      // Find the history table
      const historyEntry = tocEntries.find(
        e => e.desc === 'TABLE DATA' && /gas_station_information_history/i.test(e.tag || ''),
      );

      if (historyEntry && historyEntry.dataOffset >= 0) {
        console.log(`[Import] Preishistorie: "${historyEntry.tag}" bei offset ${historyEntry.dataOffset}`);

        // Build station ID → metadata lookup from parsed stations
        const stationMap = new Map<string, { name: string; brand: string; lat: number; lng: number }>();
        for (const s of stations) {
          stationMap.set(s.id, { name: s.name, brand: s.brand, lat: s.lat, lng: s.lng });
        }

        progress('prices', 5, `Tabelle "${historyEntry.tag}" gefunden, lese Preise...`);

        pricesImported = await importPriceHistory(
          reader,
          historyEntry,
          stationMap,
          fuelType,
          (pct, count) => {
            pricesImported = count;
            progress('prices', 5 + Math.round(pct * 0.95), `${count.toLocaleString('de-DE')} Preise importiert...`);
          },
          shouldAbort,
        );

        progress('prices', 100, `${pricesImported.toLocaleString('de-DE')} Preise importiert`);
      } else {
        console.log('[Import] Keine Preishistorie-Tabelle im Dump gefunden');
        progress('prices', 100, 'Keine Preishistorie im Dump gefunden (übersprungen)');
        console.log('[Import] No gas_station_information_history table found in dump');
      }

      return stationsImported;
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
   * Each block in pg_dump custom format is independently compressed,
   * so we must inflate each block separately.
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

    // Each block is independently zlib-compressed in pg_dump custom format.
    // Decompress each one separately and concatenate the results.
    const decompressedChunks: Buffer[] = [];
    while (true) {
      const blockLen = this.readInt();
      if (blockLen === 0) break;
      const raw = this.readBytes(blockLen);

      if (this.compressed) {
        try {
          decompressedChunks.push(inflateSync(raw));
        } catch {
          // Fallback: treat block as uncompressed
          decompressedChunks.push(raw);
        }
      } else {
        decompressedChunks.push(raw);
      }
    }

    if (decompressedChunks.length === 0) return '';
    return Buffer.concat(decompressedChunks).toString('utf8');
  }

  /**
   * Stream table data line by line via callback.
   * Essential for huge tables (like price history) to avoid loading everything into memory.
   * Returns the total number of lines processed.
   */
  streamTableData(offset: number, onLine: (line: string) => void): number {
    this.pos = offset;

    const blockType = this.readByte();
    this.readInt(); // dump ID

    if (blockType !== 1) {
      throw new Error(`Unerwarteter Block-Typ: ${blockType} (erwartet: 1 = DATA)`);
    }

    let lineCount = 0;
    let remainder = '';

    while (true) {
      const blockLen = this.readInt();
      if (blockLen === 0) break;
      const raw = this.readBytes(blockLen);

      let text: string;
      if (this.compressed) {
        try {
          text = inflateSync(raw).toString('utf8');
        } catch {
          text = raw.toString('utf8');
        }
      } else {
        text = raw.toString('utf8');
      }

      // Process complete lines, carry over incomplete last line
      const combined = remainder + text;
      const lines = combined.split('\n');
      remainder = lines.pop() || ''; // last element may be incomplete

      for (const line of lines) {
        if (line && line !== '\\.' && !line.startsWith('COPY ')) {
          onLine(line);
          lineCount++;
        }
      }
    }

    // Process final remainder
    if (remainder && remainder !== '\\.' && !remainder.startsWith('COPY ')) {
      onLine(remainder);
      lineCount++;
    }

    return lineCount;
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

// ─── Price history import ────────────────────────────────────────────

/** Get database handle (lazy import to avoid circular deps). */
function getDb(): { query: (sql: string, params?: unknown[]) => Promise<{ rows: unknown[] }> } | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@/lib/server-runtime').database;
  } catch {
    return null;
  }
}

/**
 * Stream the gas_station_information_history table from the dump and write
 * price entries to the station_prices table.
 *
 * The history table typically has columns:
 *   id, stid (station UUID), e5, e10, diesel, date, changed
 *
 * We filter by the configured fuel type and only import the last 30 days.
 */
async function importPriceHistory(
  reader: PgDumpReader,
  entry: TocEntry,
  stationMap: Map<string, { name: string; brand: string; lat: number; lng: number }>,
  fuelType: string,
  onProgress: (pct: number, count: number) => void,
  shouldAbort: () => boolean,
): Promise<number> {
  const db = getDb();
  if (!db) {
    console.log('[Import] No database available, skipping price history import');
    return 0;
  }

  // Parse column names from COPY statement
  let columns: string[] = [];
  if (entry.copyStmt) {
    const colMatch = entry.copyStmt.match(/\(([^)]+)\)/);
    if (colMatch) {
      columns = colMatch[1].split(',').map(c => c.trim());
    }
  }

  if (columns.length === 0) {
    console.log('[Import] Could not parse columns from history table COPY statement');
    return 0;
  }

  // Map fuel type to column name in the dump
  const fuelColumn = fuelType === 'e5' ? 'e5' : fuelType === 'e10' ? 'e10' : 'diesel';
  const fuelIdx = columns.indexOf(fuelColumn);
  const stidIdx = columns.indexOf('stid');
  const dateIdx = columns.indexOf('date');
  const changedIdx = columns.indexOf('changed');

  if (fuelIdx < 0 || stidIdx < 0) {
    console.log(`[Import] Missing columns in history table: fuelIdx=${fuelIdx} stidIdx=${stidIdx} columns=${columns.join(',')}`);
    return 0;
  }

  // Only import prices from the last 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString();

  // Collect rows in batches for efficient DB inserts
  const BATCH_SIZE = 5000;
  let batch: { timestamp: string; name: string; brand: string; price: number; locationId: string }[] = [];
  let totalInserted = 0;
  let rowsRead = 0;
  let lastProgress = 0;

  const flushBatch = async () => {
    if (batch.length === 0) return;

    const values: string[] = [];
    const params: unknown[] = [];
    let idx = 1;
    for (const row of batch) {
      values.push(`($${idx++}::timestamptz, $${idx++}, $${idx++}, $${idx++}, $${idx++})`);
      params.push(row.timestamp, row.locationId, row.name, row.brand, row.price);
    }
    await db.query(
      `INSERT INTO station_prices (timestamp, location_id, station_name, station_brand, price) VALUES ${values.join(', ')}`,
      params,
    );
    totalInserted += batch.length;
    batch = [];
  };

  // Stream the history table line by line
  reader.streamTableData(entry.dataOffset, (line) => {
    rowsRead++;

    const values = line.split('\t');
    if (values.length <= Math.max(fuelIdx, stidIdx)) return;

    const stid = values[stidIdx];
    const priceStr = values[fuelIdx];
    const station = stationMap.get(stid);

    // Skip: unknown station, NULL price, or zero price
    if (!station || priceStr === '\\N' || !priceStr) return;
    const price = parseFloat(priceStr);
    if (!isFinite(price) || price <= 0) return;

    // Use 'changed' timestamp if available, else 'date'
    const tsStr = changedIdx >= 0 && values[changedIdx] !== '\\N'
      ? values[changedIdx]
      : dateIdx >= 0 && values[dateIdx] !== '\\N'
        ? values[dateIdx]
        : null;
    if (!tsStr) return;

    // Only import recent prices
    if (tsStr < cutoffStr) return;

    // Compute location_id using same grid as seedCache
    const cellLat = Math.round(station.lat / 0.2) * 0.2;
    const cellLng = Math.round(station.lng / 0.3) * 0.3;
    const locationId = `de-import-${cellLat.toFixed(1)}-${cellLng.toFixed(1)}`;

    batch.push({
      timestamp: tsStr,
      name: station.name,
      brand: station.brand,
      price,
      locationId,
    });
  });

  // Flush remaining in batches (streamTableData is sync, so we flush after)
  // Re-batch the collected rows and insert asynchronously
  const allRows = batch;
  batch = [];

  for (let i = 0; i < allRows.length; i += BATCH_SIZE) {
    if (shouldAbort()) throw new Error('Abgebrochen');

    batch = allRows.slice(i, i + BATCH_SIZE);
    await flushBatch();

    const pct = Math.round((i + BATCH_SIZE) / allRows.length * 100);
    if (pct > lastProgress) {
      onProgress(Math.min(pct, 100), totalInserted);
      lastProgress = pct;
    }
  }

  console.log(`[Import] Imported ${totalInserted} price entries from ${rowsRead} history rows (${fuelColumn}, last 30 days)`);
  return totalInserted;
}

// ─── Download with progress ──────────────────────────────────────────

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3_000;

/**
 * Download a large file with resume support.
 * Uses HTTP Range headers to resume after connection drops ("terminated" errors).
 */
async function downloadFile(
  url: string,
  dest: string,
  onProgress: (pct: number, mbDown: number, mbTotal: number) => void,
  shouldAbort: () => boolean,
): Promise<void> {
  // First request to get total size
  const headResp = await fetch(url, { method: 'HEAD' });
  const total = parseInt(headResp.headers.get('content-length') || '0', 10);
  const supportsRange = headResp.headers.get('accept-ranges') === 'bytes';

  let downloaded = 0;
  let retries = 0;
  let lastReport = 0;

  while (true) {
    if (shouldAbort()) throw new Error('Abgebrochen');

    const headers: Record<string, string> = {};
    if (downloaded > 0 && supportsRange) {
      headers['Range'] = `bytes=${downloaded}-`;
    }

    let response: Response;
    try {
      const controller = new AbortController();
      // Abort after 60s of no data (stalled connection)
      const timeoutId = setTimeout(() => controller.abort(), 60_000);

      response = await fetch(url, { signal: controller.signal, headers });
      clearTimeout(timeoutId);

      // 416 = Range Not Satisfiable → file already complete
      if (response.status === 416) break;

      if (!response.ok && response.status !== 206) {
        const hint = await response.text().catch(() => '');
        throw new Error(`Download fehlgeschlagen: HTTP ${response.status} — ${hint.slice(0, 200)}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'Abgebrochen') throw err;

      retries++;
      if (retries > MAX_RETRIES) {
        throw new Error(`Download nach ${MAX_RETRIES} Versuchen fehlgeschlagen: ${msg}`);
      }
      console.log(`[Import] Download interrupted at ${Math.round(downloaded / 1_048_576)} MB, retry ${retries}/${MAX_RETRIES}: ${msg}`);
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      continue;
    }

    // Stream this chunk to disk
    try {
      const writer = createWriteStream(dest, { flags: downloaded > 0 ? 'r+' : 'w', start: downloaded });
      const webStream = response.body!;

      const nodeReadable = new Readable({
        async read() {
          try {
            if (shouldAbort()) {
              this.destroy(new Error('Abgebrochen'));
              return;
            }
            const reader = (this as Readable & { _webReader?: ReadableStreamDefaultReader<Uint8Array> })._webReader
              ??= webStream.getReader();
            const { done, value } = await reader.read();
            if (done) { this.push(null); return; }

            const buf = Buffer.from(value);
            downloaded += buf.length;
            retries = 0; // Reset retry count on successful data

            const now = Date.now();
            if (now - lastReport > 500) {
              const pct = total > 0 ? Math.round(downloaded / total * 100) : 0;
              onProgress(pct, Math.round(downloaded / 1_048_576), Math.round(total / 1_048_576));
              lastReport = now;
            }

            this.push(buf);
          } catch (err) {
            this.destroy(err instanceof Error ? err : new Error(String(err)));
          }
        },
      });

      await pipeline(nodeReadable, writer);

      // Download complete
      break;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'Abgebrochen') throw err;

      // Connection dropped mid-stream — retry with resume
      if (!supportsRange) {
        throw new Error(`Download abgebrochen und Server unterstützt kein Resume: ${msg}`);
      }

      retries++;
      if (retries > MAX_RETRIES) {
        throw new Error(`Download nach ${MAX_RETRIES} Versuchen fehlgeschlagen: ${msg}`);
      }
      console.log(`[Import] Download interrupted at ${Math.round(downloaded / 1_048_576)} MB, retry ${retries}/${MAX_RETRIES}: ${msg}`);
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
    }
  }

  // Final progress report
  const pct = total > 0 ? Math.round(downloaded / total * 100) : 100;
  onProgress(pct, Math.round(downloaded / 1_048_576), Math.round(total / 1_048_576));
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
