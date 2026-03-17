import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'tanken-api',
    runtime: 'nextjs',
    timestamp: new Date().toISOString()
  });
}
