import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getRequestContext } from '@/lib/request-context';
import { stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

const MAX_FAVOURITES = 50;

const stationIdSchema = z.object({
  stationId: z.string().uuid()
});

export async function GET(request: NextRequest) {
  const { user } = await getRequestContext(request);
  if (!user) {
    return NextResponse.json({ error: 'Login erforderlich', loginRequired: true }, { status: 401 });
  }

  return NextResponse.json({ favourites: user.favourites || [] });
}

export async function POST(request: NextRequest) {
  const { user } = await getRequestContext(request);
  if (!user) {
    return NextResponse.json({ error: 'Login erforderlich', loginRequired: true }, { status: 401 });
  }

  const parsed = stationIdSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Station-ID' }, { status: 400 });
  }

  const { stationId } = parsed.data;
  const current = user.favourites || [];

  if (current.includes(stationId)) {
    return NextResponse.json({ favourites: current });
  }

  if (current.length >= MAX_FAVOURITES) {
    return NextResponse.json({ error: `Maximal ${MAX_FAVOURITES} Favoriten erlaubt` }, { status: 400 });
  }

  const updated = [...current, stationId];
  await stores.userStore.updateUser(user.id, (u) => {
    u.favourites = updated;
  });

  return NextResponse.json({ favourites: updated });
}

export async function DELETE(request: NextRequest) {
  const { user } = await getRequestContext(request);
  if (!user) {
    return NextResponse.json({ error: 'Login erforderlich', loginRequired: true }, { status: 401 });
  }

  const parsed = stationIdSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Station-ID' }, { status: 400 });
  }

  const { stationId } = parsed.data;
  const updated = (user.favourites || []).filter((id: string) => id !== stationId);
  await stores.userStore.updateUser(user.id, (u) => {
    u.favourites = updated;
  });

  return NextResponse.json({ favourites: updated });
}
