import { timingSafeEqual, createHmac } from 'crypto';
import { env } from '$env/dynamic/private';

/**
 * In-memory storage for login attempts rate limiting
 * In production, consider using Redis or database-backed solution
 * @type {Map<string, { count: number, lastAttempt: number }>}
 */
const loginAttempts = new Map();

/**
 * Get or generate a secret key for signing sessions
 * @returns {string} Secret key
 */
function getSecretKey() {
  const secret = env.SESSION_SECRET || env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error('SESSION_SECRET or ADMIN_PASSWORD must be set in environment variables');
  }
  return secret;
}

/**
 * Create a signed session token with timestamp
 * @returns {string} Signed session token
 */
export function createSession() {
  const timestamp = Date.now();
  const sessionData = JSON.stringify({ timestamp, authenticated: true });
  const signature = createHmac('sha256', getSecretKey())
    .update(sessionData)
    .digest('hex');

  return `${Buffer.from(sessionData).toString('base64')}.${signature}`;
}

/**
 * Verify if a session token is valid and not expired
 * @param {string} sessionToken - Session token to verify
 * @returns {boolean} Whether session is valid
 */
export function verifySession(sessionToken) {
  if (!sessionToken || typeof sessionToken !== 'string') {
    return false;
  }

  try {
    const [dataB64, signature] = sessionToken.split('.');
    if (!dataB64 || !signature) {
      return false;
    }

    // Verify signature
    const expectedSignature = createHmac('sha256', getSecretKey())
      .update(Buffer.from(dataB64, 'base64').toString())
      .digest('hex');

    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return false;
    }

    // Verify timestamp (7 days max)
    const sessionData = JSON.parse(Buffer.from(dataB64, 'base64').toString());
    const age = Date.now() - sessionData.timestamp;
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    if (age > maxAge) {
      return false;
    }

    return sessionData.authenticated === true;
  } catch {
    return false;
  }
}

/**
 * Constant-time password comparison to prevent timing attacks
 * @param {string} provided - User-provided password
 * @param {string} actual - Actual password from environment
 * @returns {boolean} Whether passwords match
 */
export function verifyPassword(provided, actual) {
  if (!provided || !actual) {
    return false;
  }

  // Convert to buffers for constant-time comparison
  const providedBuf = Buffer.from(provided, 'utf-8');
  const actualBuf = Buffer.from(actual, 'utf-8');

  // Prevent length-based timing attacks
  if (providedBuf.length !== actualBuf.length) {
    return false;
  }

  return timingSafeEqual(providedBuf, actualBuf);
}

/**
 * Check if IP has exceeded login attempt rate limit
 * @param {string} ip - Client IP address
 * @returns {boolean} Whether request is allowed (true) or rate limited (false)
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }

  // Reset after 15 minutes
  if (now - attempt.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }

  // Max 5 attempts per 15 minutes
  if (attempt.count >= 5) {
    return false;
  }

  attempt.count++;
  attempt.lastAttempt = now;
  return true;
}

/**
 * Cookie options for session management
 */
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: /** @type {const} */ ('strict'),
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/admin',
};
