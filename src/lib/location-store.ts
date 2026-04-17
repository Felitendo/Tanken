import crypto from 'node:crypto';
import { database } from '@/lib/server-runtime';
import type {
  FuelType,
  LocationRequest,
  LocationRequestStatus,
  LocationRequestWithUser,
  ScanCountry,
  ScanLocation,
  UserProfile,
} from '@/types';

interface ScanLocationRow {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  radius_km: number;
  fuel_type: string;
  enabled: boolean;
  created_by: string | null;
  source_request_id: string | null;
  last_scan_at: Date | string | null;
  last_scan_station_count: number | null;
  last_scan_error: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

interface LocationRequestRow {
  id: string;
  user_id: string;
  name: string;
  lat: number;
  lng: number;
  radius_km: number;
  note: string | null;
  status: string;
  admin_note: string | null;
  reviewed_by: string | null;
  reviewed_at: Date | string | null;
  resulting_location_id: string | null;
  created_at: Date | string;
}

function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function rowToLocation(row: ScanLocationRow): ScanLocation {
  return {
    id: row.id,
    name: row.name,
    country: (row.country === 'at' ? 'at' : 'de') as ScanCountry,
    lat: Number(row.lat),
    lng: Number(row.lng),
    radiusKm: Number(row.radius_km),
    fuelType: (row.fuel_type === 'e5' || row.fuel_type === 'e10' ? row.fuel_type : 'diesel') as FuelType,
    enabled: Boolean(row.enabled),
    createdBy: row.created_by,
    sourceRequestId: row.source_request_id,
    lastScanAt: toIso(row.last_scan_at),
    lastScanStationCount: row.last_scan_station_count,
    lastScanError: row.last_scan_error,
    createdAt: toIso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: toIso(row.updated_at) ?? new Date(0).toISOString(),
  };
}

function rowToRequest(row: LocationRequestRow): LocationRequest {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    lat: Number(row.lat),
    lng: Number(row.lng),
    radiusKm: Number(row.radius_km),
    note: row.note,
    status: (row.status === 'approved' || row.status === 'denied' ? row.status : 'pending') as LocationRequestStatus,
    adminNote: row.admin_note,
    reviewedBy: row.reviewed_by,
    reviewedAt: toIso(row.reviewed_at),
    resultingLocationId: row.resulting_location_id,
    createdAt: toIso(row.created_at) ?? new Date(0).toISOString(),
  };
}

function newId(prefix: 'loc' | 'req'): string {
  return `${prefix}-${crypto.randomBytes(8).toString('hex')}`;
}

function clampRadius(value: number): number {
  if (!Number.isFinite(value)) return 10;
  return Math.max(1, Math.min(25, Math.round(value * 10) / 10));
}

export interface ScanLocationInput {
  name: string;
  country?: ScanCountry;
  lat: number;
  lng: number;
  radiusKm: number;
  fuelType?: FuelType;
  enabled?: boolean;
  sourceRequestId?: string | null;
}

export interface ScanLocationPatch {
  name?: string;
  country?: ScanCountry;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  fuelType?: FuelType;
  enabled?: boolean;
}

export interface LocationRequestInput {
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
  note?: string | null;
}

export async function listScanLocations(opts?: { enabledOnly?: boolean; country?: ScanCountry }): Promise<ScanLocation[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];
  if (opts?.enabledOnly) conditions.push('enabled = TRUE');
  if (opts?.country) {
    values.push(opts.country);
    conditions.push(`country = $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await database.query<ScanLocationRow>(
    `SELECT * FROM scan_locations ${where} ORDER BY created_at ASC`,
    values
  );
  return result.rows.map(rowToLocation);
}

export async function getScanLocation(id: string): Promise<ScanLocation | null> {
  const result = await database.query<ScanLocationRow>('SELECT * FROM scan_locations WHERE id = $1', [id]);
  return result.rows[0] ? rowToLocation(result.rows[0]) : null;
}

export async function createScanLocation(input: ScanLocationInput, createdBy: string | null): Promise<ScanLocation> {
  const id = newId('loc');
  const country: ScanCountry = input.country ?? 'de';
  const fuelType: FuelType = input.fuelType ?? 'diesel';
  const radiusKm = clampRadius(input.radiusKm);
  const result = await database.query<ScanLocationRow>(
    `INSERT INTO scan_locations (
       id, name, country, lat, lng, radius_km, fuel_type, enabled,
       created_by, source_request_id
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      id,
      input.name.trim(),
      country,
      input.lat,
      input.lng,
      radiusKm,
      fuelType,
      input.enabled ?? true,
      createdBy,
      input.sourceRequestId ?? null,
    ]
  );
  return rowToLocation(result.rows[0]);
}

export async function updateScanLocation(id: string, patch: ScanLocationPatch): Promise<ScanLocation | null> {
  const sets: string[] = [];
  const values: unknown[] = [];
  function add(col: string, val: unknown) {
    values.push(val);
    sets.push(`${col} = $${values.length}`);
  }
  if (patch.name !== undefined) add('name', patch.name.trim());
  if (patch.country !== undefined) add('country', patch.country);
  if (patch.lat !== undefined) add('lat', patch.lat);
  if (patch.lng !== undefined) add('lng', patch.lng);
  if (patch.radiusKm !== undefined) add('radius_km', clampRadius(patch.radiusKm));
  if (patch.fuelType !== undefined) add('fuel_type', patch.fuelType);
  if (patch.enabled !== undefined) add('enabled', patch.enabled);
  if (sets.length === 0) return getScanLocation(id);
  sets.push('updated_at = NOW()');
  values.push(id);
  const result = await database.query<ScanLocationRow>(
    `UPDATE scan_locations SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return result.rows[0] ? rowToLocation(result.rows[0]) : null;
}

export async function deleteScanLocation(id: string): Promise<boolean> {
  const result = await database.query('DELETE FROM scan_locations WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function recordScanResult(
  id: string,
  opts: { stationCount: number; error?: string | null }
): Promise<void> {
  await database.query(
    `UPDATE scan_locations
       SET last_scan_at = NOW(),
           last_scan_station_count = $2,
           last_scan_error = $3,
           updated_at = NOW()
     WHERE id = $1`,
    [id, opts.stationCount, opts.error ?? null]
  );
}

export async function listLocationRequests(filter?: {
  status?: LocationRequestStatus | 'all';
  userId?: string;
}): Promise<LocationRequest[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];
  if (filter?.status && filter.status !== 'all') {
    values.push(filter.status);
    conditions.push(`status = $${values.length}`);
  }
  if (filter?.userId) {
    values.push(filter.userId);
    conditions.push(`user_id = $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await database.query<LocationRequestRow>(
    `SELECT * FROM location_requests ${where} ORDER BY created_at DESC`,
    values
  );
  return result.rows.map(rowToRequest);
}

export async function listLocationRequestsWithUser(filter?: {
  status?: LocationRequestStatus | 'all';
}): Promise<LocationRequestWithUser[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];
  if (filter?.status && filter.status !== 'all') {
    values.push(filter.status);
    conditions.push(`r.status = $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await database.query<LocationRequestRow & { user_data: UserProfile | null }>(
    `SELECT r.*, u.data_json AS user_data
       FROM location_requests r
       LEFT JOIN users u ON u.id = r.user_id
     ${where}
     ORDER BY r.created_at DESC`,
    values
  );
  return result.rows.map((row) => {
    const base = rowToRequest(row);
    const u = row.user_data;
    return {
      ...base,
      user: {
        id: row.user_id,
        displayName: u?.displayName ?? u?.username ?? null,
        email: u?.email ?? null,
        photoUrl: u?.photoUrl ?? null,
        authProvider: u?.authProvider ?? null,
      },
    };
  });
}

export async function getLocationRequest(id: string): Promise<LocationRequest | null> {
  const result = await database.query<LocationRequestRow>(
    'SELECT * FROM location_requests WHERE id = $1',
    [id]
  );
  return result.rows[0] ? rowToRequest(result.rows[0]) : null;
}

export async function countPendingRequestsForUser(userId: string): Promise<number> {
  const result = await database.query<{ count: number }>(
    `SELECT COUNT(*)::int AS count FROM location_requests WHERE user_id = $1 AND status = 'pending'`,
    [userId]
  );
  return result.rows[0]?.count ?? 0;
}

export async function createLocationRequest(userId: string, input: LocationRequestInput): Promise<LocationRequest> {
  const id = newId('req');
  const result = await database.query<LocationRequestRow>(
    `INSERT INTO location_requests (id, user_id, name, lat, lng, radius_km, note)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [id, userId, input.name.trim(), input.lat, input.lng, clampRadius(input.radiusKm), input.note?.trim() || null]
  );
  return rowToRequest(result.rows[0]);
}

export async function approveLocationRequest(
  id: string,
  adminUserId: string,
  opts?: { note?: string }
): Promise<{ request: LocationRequest; location: ScanLocation } | null> {
  const client = await database.pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query<LocationRequestRow>(
      `SELECT * FROM location_requests WHERE id = $1 FOR UPDATE`,
      [id]
    );
    const row = existing.rows[0];
    if (!row) {
      await client.query('ROLLBACK');
      return null;
    }
    if (row.status !== 'pending') {
      await client.query('ROLLBACK');
      const current = rowToRequest(row);
      const loc = current.resultingLocationId ? await getScanLocation(current.resultingLocationId) : null;
      if (loc) return { request: current, location: loc };
      return null;
    }

    const locId = newId('loc');
    const radiusKm = clampRadius(Number(row.radius_km));
    const locResult = await client.query<ScanLocationRow>(
      `INSERT INTO scan_locations (
         id, name, country, lat, lng, radius_km, fuel_type, enabled,
         created_by, source_request_id
       ) VALUES ($1,$2,'de',$3,$4,$5,'diesel',TRUE,$6,$7)
       RETURNING *`,
      [locId, row.name, row.lat, row.lng, radiusKm, adminUserId, row.id]
    );

    const reqResult = await client.query<LocationRequestRow>(
      `UPDATE location_requests
          SET status = 'approved',
              admin_note = $2,
              reviewed_by = $3,
              reviewed_at = NOW(),
              resulting_location_id = $4
        WHERE id = $1
        RETURNING *`,
      [id, opts?.note ?? null, adminUserId, locId]
    );

    await client.query('COMMIT');
    return {
      request: rowToRequest(reqResult.rows[0]),
      location: rowToLocation(locResult.rows[0]),
    };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

export async function denyLocationRequest(
  id: string,
  adminUserId: string,
  opts: { note: string }
): Promise<LocationRequest | null> {
  const result = await database.query<LocationRequestRow>(
    `UPDATE location_requests
        SET status = 'denied',
            admin_note = $2,
            reviewed_by = $3,
            reviewed_at = NOW()
      WHERE id = $1 AND status = 'pending'
      RETURNING *`,
    [id, opts.note, adminUserId]
  );
  return result.rows[0] ? rowToRequest(result.rows[0]) : null;
}
