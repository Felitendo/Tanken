import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { loadRepoConfig } from '@/config';

export const runtime = 'nodejs';

const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const parsed = emailSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'to, subject and body required' }, { status: 400 });
  }

  const config = loadRepoConfig();
  const smtp = config.smtp;
  if (!smtp?.host || !smtp?.from) {
    return NextResponse.json({ error: 'SMTP not configured' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined
  });

  try {
    await transporter.sendMail({
      from: smtp.from,
      to: parsed.data.to,
      subject: parsed.data.subject,
      text: parsed.data.body
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json({ error: `SMTP error: ${msg}` }, { status: 502 });
  }
}
