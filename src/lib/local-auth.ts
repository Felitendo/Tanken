import crypto from 'node:crypto';

const SCRYPT_PREFIX = 'scrypt';

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${SCRYPT_PREFIX}$${salt}$${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split('$');
  if (scheme !== SCRYPT_PREFIX || !salt || !hash) {
    return false;
  }

  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  if (derived.length !== hash.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(derived), Buffer.from(hash));
}
