import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getRequestContext } from '@/lib/request-context';
import { stores } from '@/lib/server-runtime';

export const runtime = 'nodejs';

const fuelTypeSchema = z.enum(['diesel', 'e5', 'e10']);
const themeSchema = z.enum(['auto', 'light', 'dark']);
const historyDaysSchema = z.union([z.literal(1), z.literal(7)]);
const settingsSchema = z
  .object({
    fuelType: fuelTypeSchema.optional(),
    currentTab: z.string().min(1).optional(),
    theme: themeSchema.optional(),
    activeLocation: z.string().min(1).optional(),
    lang: z.string().min(1).max(10).optional(),
    contributorsOpen: z.boolean().optional(),
    historyDefaultDays: historyDaysSchema.optional()
  })
  .partial();

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

  const nextSettings = { ...user.settings, radiusKm: 25 };
  const updates = parsed.data;

  if (updates.fuelType !== undefined) {
    nextSettings.fuelType = updates.fuelType;
  }

  if (updates.currentTab) {
    nextSettings.currentTab = updates.currentTab;
  }

  if (updates.theme) {
    nextSettings.theme = updates.theme;
  }

  if (updates.activeLocation) {
    nextSettings.activeLocation = updates.activeLocation;
  }

  if (updates.lang) {
    nextSettings.lang = updates.lang;
  }

  if (typeof updates.contributorsOpen === 'boolean') {
    nextSettings.contributorsOpen = updates.contributorsOpen;
  }

  if (updates.historyDefaultDays === 1 || updates.historyDefaultDays === 7) {
    nextSettings.historyDefaultDays = updates.historyDefaultDays;
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
