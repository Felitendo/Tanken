import nodemailer from 'nodemailer';
import { loadRepoConfig } from '@/config';

export async function sendAlertEmail(opts: { to: string; subject: string; body: string }): Promise<void> {
  const config = loadRepoConfig();
  const smtp = config.smtp;
  if (!smtp?.host || !smtp?.from) {
    throw new Error('SMTP not configured');
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
  });

  await transporter.sendMail({
    from: smtp.from,
    to: opts.to,
    subject: opts.subject,
    text: opts.body,
  });
}
