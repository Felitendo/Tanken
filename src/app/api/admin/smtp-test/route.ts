import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { getAdminRequestContext } from '@/lib/admin';
import { loadRepoConfig } from '@/config';

export const runtime = 'nodejs';

const bodySchema = z.object({
  to: z.string().email()
});

export async function POST(request: NextRequest) {
  const { isAdmin } = await getAdminRequestContext(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin-Login erforderlich.' }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Gültige E-Mail-Adresse erforderlich.' }, { status: 400 });
  }

  const config = loadRepoConfig();
  const smtp = config.smtp;
  if (!smtp?.host || !smtp?.from) {
    return NextResponse.json({ error: 'SMTP ist nicht konfiguriert. Bitte zuerst Host und Absender-Adresse speichern.' }, { status: 400 });
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
      subject: 'Tanken – SMTP Test',
      text: 'Diese E-Mail bestätigt, dass die SMTP-Konfiguration korrekt ist.'
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return NextResponse.json({ error: `SMTP-Fehler: ${msg}` }, { status: 502 });
  }
}
