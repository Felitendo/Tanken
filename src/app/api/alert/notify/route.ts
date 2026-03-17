import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const notifySchema = z.object({
  topic: z.string().min(1),
  title: z.string().optional(),
  message: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const parsed = notifySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'topic and message required' }, { status: 400 });
  }

  const { topic, title, message } = parsed.data;
  const ntfyUrl = `https://ntfy.sh/${encodeURIComponent(topic)}`;

  try {
    const res = await fetch(ntfyUrl, {
      method: 'POST',
      headers: {
        ...(title ? { Title: title } : {}),
        'Content-Type': 'text/plain; charset=utf-8'
      },
      body: message
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return NextResponse.json({ error: `ntfy error: ${res.status}`, details: text }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json({ error: `ntfy unreachable: ${msg}` }, { status: 502 });
  }
}
