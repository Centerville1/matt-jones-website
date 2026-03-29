import { verifySession } from '$lib/server/auth.js';
import { verifySession as verifyWingsSession } from '$lib/server/wings-auth.js';

/**
 * @type {import('@sveltejs/kit').Handle}
 */
export async function handle({ event, resolve }) {
  // Admin session
  const sessionId = event.cookies.get('session');
  if (sessionId && verifySession(sessionId)) {
    event.locals.user = { authenticated: true };
  } else {
    event.locals.user = null;
  }

  // Wings session
  const wingsSessionId = event.cookies.get('wings-session');
  if (wingsSessionId && verifyWingsSession(wingsSessionId)) {
    event.locals.wingsUser = { authenticated: true };
  } else {
    event.locals.wingsUser = null;
  }

  return resolve(event);
}
