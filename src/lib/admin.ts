import { NextRequest } from 'next/server';
import { UserProfile } from '@/types';
import { getRequestContext } from '@/lib/request-context';

export function isAdminUser(user: UserProfile | null | undefined): boolean {
  return Boolean(user?.roles?.includes('admin'));
}

export async function getAdminRequestContext(request: NextRequest) {
  const context = await getRequestContext(request);

  return {
    ...context,
    isAdmin: isAdminUser(context.user)
  };
}
