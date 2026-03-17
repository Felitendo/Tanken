import { NextResponse } from 'next/server';
import { buildHistoryStats } from '@/lib/history';
import { readPriceHistoryFromDatabase } from '@/lib/history-store';

export const runtime = 'nodejs';

export async function GET() {
  const entries = await readPriceHistoryFromDatabase();
  return NextResponse.json(buildHistoryStats(entries));
}
