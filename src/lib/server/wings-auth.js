import { timingSafeEqual, createHmac } from 'crypto';
import { env } from '$env/dynamic/private';

/** @type {Map<string, { count: number, lastAttempt: number }>} */
const loginAttempts = new Map();

function getSecretKey() {
  const secret = env.WINGS_SESSION_SECRET || env.WINGS_PASSWORD;
  if (!secret) throw new Error('WINGS_SESSION_SECRET or WINGS_PASSWORD must be set');
  return secret;
}

export function createSession() {
  const timestamp = Date.now();
  const data = JSON.stringify({ timestamp, authenticated: true });
  const sig = createHmac('sha256', getSecretKey()).update(data).digest('hex');
  return `${Buffer.from(data).toString('base64')}.${sig}`;
}

export function verifySession(token) {
  if (!token || typeof token !== 'string') return false;
  try {
    const [dataB64, sig] = token.split('.');
    if (!dataB64 || !sig) return false;
    const expected = createHmac('sha256', getSecretKey())
      .update(Buffer.from(dataB64, 'base64').toString())
      .digest('hex');
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
    const data = JSON.parse(Buffer.from(dataB64, 'base64').toString());
    if (Date.now() - data.timestamp > 7 * 24 * 60 * 60 * 1000) return false;
    return data.authenticated === true;
  } catch {
    return false;
  }
}

export function verifyPassword(provided, actual) {
  if (!provided || !actual) return false;
  const a = Buffer.from(provided, 'utf-8');
  const b = Buffer.from(actual, 'utf-8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function checkRateLimit(ip) {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (!attempt) { loginAttempts.set(ip, { count: 1, lastAttempt: now }); return true; }
  if (now - attempt.lastAttempt > 15 * 60 * 1000) { loginAttempts.set(ip, { count: 1, lastAttempt: now }); return true; }
  if (attempt.count >= 5) return false;
  attempt.count++;
  attempt.lastAttempt = now;
  return true;
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: /** @type {const} */ ('strict'),
  maxAge: 60 * 60 * 24 * 7,
  path: '/wings',
};
