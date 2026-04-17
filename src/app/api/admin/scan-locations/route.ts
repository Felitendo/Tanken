import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminRequestContext } from '@/lib/admin';
import { createScanLocation, listScanLocations } from '@/lib/location-store';

export const runtime = 'nodejs';

const fuelSchema = z.enum(['diesel', 'e5', 'e10']);
const countrySchema = z.enum(['de', 'at']);

const createSchema = z.object({
  name: z.string().trim().min(1).max(80),
  country: countrySchema.optional(),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().min(1).max(25),
  fuelType: fuelSchema.optional(),
  enabled: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  const locations = await listScanLocations();
  return NextResponse.json({ locations });
}

export async function POST(request: NextRequest) {
  const { isAdmin, user } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Eingabe.', issues: parsed.error.flatten() }, { status: 400 });
  }

  const location = await createScanLocation(parsed.data, user?.id ?? null);
  return NextResponse.json({ location }, { status: 201 });
}
