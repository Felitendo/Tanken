import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getRequestContext } from '@/lib/request-context';
import { runtimeConfig, stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

const fuelTypeSchema = z.enum(['diesel', 'e5', 'e10']);
const themeSchema = z.enum(['auto', 'light', 'dark']);
const settingsSchema = z
  .object({
    fuelType: fuelTypeSchema.optional(),
    radiusKm: z.union([z.number(), z.string()]).optional(),
    activeLocation: z.string().min(1).optional(),
    currentTab: z.string().min(1).optional(),
    theme: themeSchema.optional()
  })
  .partial();

function parseRadius(value: string | number | undefined, fallback: number): number {
  const parsed = Number.parseFloat(String(value ?? fallback));
  return Number.isFinite(parsed) ? Math.max(1, Math.min(25, Math.round(parsed))) : fallback;
}

export async function GET(request: NextRequest) {
  const { user } = await getRequestContext(request);
  const profile = stores.userStore.getEffectiveUserProfile(user);
  return NextResponse.json(profile.settings);
}

export async function POST(request: NextRequest) {
  const { user } = await getRequestContext(request);
  if (!user) {
    return NextResponse.json({ error: 'Login erforderlich', loginRequired: true }, { status: 401 });
  }

  const parsed = settingsSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Settings' }, { status: 400 });
  }

  const nextSettings = { ...user.settings };
  const updates = parsed.data;

  if (updates.fuelType !== undefined) {
    nextSettings.fuelType = updates.fuelType;
  }

  if (updates.radiusKm !== undefined) {
    nextSettings.radiusKm = parseRadius(updates.radiusKm, runtimeConfig.repoConfig.radius_km);
  }

  if (updates.activeLocation) {
    nextSettings.activeLocation = updates.activeLocation;
  }

  if (updates.currentTab) {
    nextSettings.currentTab = updates.currentTab;
  }

  if (updates.theme) {
    nextSettings.theme = updates.theme;
  }

  await stores.userStore.updateUser(user.id, (currentUser) => {
    currentUser.settings = nextSettings;
  });

  const persistedUser = await stores.userStore.getUserById(user.id);

  return NextResponse.json({
    ok: true,
    settings: persistedUser?.settings ?? nextSettings
  });
}
