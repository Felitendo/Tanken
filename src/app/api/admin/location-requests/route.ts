import { NextRequest, NextResponse } from 'next/server';
import { getAdminRequestContext } from '@/lib/admin';
import { listLocationRequestsWithUser } from '@/lib/location-store';
import type { LocationRequestStatus } from '@/types';

export const runtime = 'nodejs';

const STATUSES: Array<LocationRequestStatus | 'all'> = ['pending', 'approved', 'denied', 'all'];

export async function GET(request: NextRequest) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  const url = new URL(request.url);
  const statusParam = url.searchParams.get('status');
  const status: LocationRequestStatus | 'all' = STATUSES.includes((statusParam ?? 'pending') as LocationRequestStatus | 'all')
    ? ((statusParam ?? 'pending') as LocationRequestStatus | 'all')
    : 'pending';

  const requests = await listLocationRequestsWithUser({ status });
  return NextResponse.json({ requests });
}
