import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminRequestContext } from '@/lib/admin';
import { approveLocationRequest, denyLocationRequest } from '@/lib/location-store';

export const runtime = 'nodejs';

const actionSchema = z.object({
  action: z.enum(['approve', 'deny']),
  note: z.string().trim().max(1000).optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { isAdmin, user } = await getAdminRequestContext(request);
  if (!isAdmin || !user) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Eingabe.', issues: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;

  if (parsed.data.action === 'approve') {
    const result = await approveLocationRequest(id, user.id, { note: parsed.data.note });
    if (!result) {
      return NextResponse.json({ error: 'Anfrage nicht gefunden oder bereits bearbeitet.' }, { status: 404 });
    }
    return NextResponse.json({ request: result.request, location: result.location });
  }

  const note = parsed.data.note?.trim();
  if (!note) {
    return NextResponse.json({ error: 'Begründung erforderlich.' }, { status: 400 });
  }
  const denied = await denyLocationRequest(id, user.id, { note });
  if (!denied) {
    return NextResponse.json({ error: 'Anfrage nicht gefunden oder bereits bearbeitet.' }, { status: 404 });
  }
  return NextResponse.json({ request: denied });
}
