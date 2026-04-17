import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminRequestContext } from '@/lib/admin';
import { deleteScanLocation, getScanLocation, updateScanLocation } from '@/lib/location-store';

export const runtime = 'nodejs';

const fuelSchema = z.enum(['diesel', 'e5', 'e10']);
const countrySchema = z.enum(['de', 'at']);

const patchSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  country: countrySchema.optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().min(1).max(25).optional(),
  fuelType: fuelSchema.optional(),
  enabled: z.boolean().optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  const { id } = await params;
  const location = await getScanLocation(id);
  if (!location) {
    return NextResponse.json({ error: 'Standort nicht gefunden.' }, { status: 404 });
  }
  return NextResponse.json({ location });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Eingabe.', issues: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  const location = await updateScanLocation(id, parsed.data);
  if (!location) {
    return NextResponse.json({ error: 'Standort nicht gefunden.' }, { status: 404 });
  }
  return NextResponse.json({ location });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deleteScanLocation(id);
  if (!ok) {
    return NextResponse.json({ error: 'Standort nicht gefunden.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
