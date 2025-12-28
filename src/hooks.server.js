import { verifySession } from '$lib/server/auth.js';

/**
 * @type {import('@sveltejs/kit').Handle}
 */
export async function handle({ event, resolve }) {
  // Check for session cookie
  const sessionId = event.cookies.get('session');

  // Verify session and attach user to locals if valid
  if (sessionId && verifySession(sessionId)) {
    event.locals.user = { authenticated: true };
  } else {
    event.locals.user = null;
  }

  return resolve(event);
}
