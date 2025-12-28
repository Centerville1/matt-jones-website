import { timingSafeEqual } from 'crypto';

/**
 * In-memory storage for login attempts rate limiting
 * In production, consider using Redis or database-backed solution
 * @type {Map<string, { count: number, lastAttempt: number }>}
 */
const loginAttempts = new Map();

/**
 * In-memory storage for active sessions
 * @type {Set<string>}
 */
const activeSessions = new Set();

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
 * Create a new session token
 * @returns {string} Session token (UUID)
 */
export function createSession() {
  const sessionId = crypto.randomUUID();
  activeSessions.add(sessionId);
  return sessionId;
}

/**
 * Verify if a session token is valid
 * @param {string} sessionId - Session token to verify
 * @returns {boolean} Whether session is valid
 */
export function verifySession(sessionId) {
  return Boolean(sessionId && activeSessions.has(sessionId));
}

/**
 * Destroy a session
 * @param {string} sessionId - Session token to destroy
 */
export function destroySession(sessionId) {
  if (sessionId) {
    activeSessions.delete(sessionId);
  }
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
