import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getRequestContext } from '@/lib/request-context';
import {
  countPendingRequestsForUser,
  createLocationRequest,
  listLocationRequests,
} from '@/lib/location-store';

export const runtime = 'nodejs';

const MAX_PENDING_PER_USER = 5;

const createSchema = z.object({
  name: z.string().trim().min(1).max(80),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().min(1).max(25),
  note: z.string().trim().max(500).optional().nullable(),
});

function unauthenticated() {
  return NextResponse.json({ error: 'Anmeldung erforderlich.' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const { user } = await getRequestContext(request);
  if (!user) return unauthenticated();

  const requests = await listLocationRequests({ userId: user.id });
  return NextResponse.json({ requests });
}

export async function POST(request: NextRequest) {
  const { user } = await getRequestContext(request);
  if (!user) return unauthenticated();

  if (user.authProvider !== 'oidc') {
    return NextResponse.json({ error: 'Nur mit FeloID-Anmeldung möglich.' }, { status: 403 });
  }

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Eingabe.', issues: parsed.error.flatten() }, { status: 400 });
  }

  const pending = await countPendingRequestsForUser(user.id);
  if (pending >= MAX_PENDING_PER_USER) {
    return NextResponse.json(
      { error: `Du hast bereits ${MAX_PENDING_PER_USER} offene Anfragen. Bitte warte auf Bearbeitung.` },
      { status: 429 }
    );
  }

  const created = await createLocationRequest(user.id, {
    name: parsed.data.name,
    lat: parsed.data.lat,
    lng: parsed.data.lng,
    radiusKm: parsed.data.radiusKm,
    note: parsed.data.note ?? null,
  });
  return NextResponse.json({ request: created }, { status: 201 });
}
