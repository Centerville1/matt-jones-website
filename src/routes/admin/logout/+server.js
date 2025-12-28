import { redirect } from '@sveltejs/kit';
import { destroySession, cookieOptions } from '$lib/server/auth.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
  const sessionId = cookies.get('session');

  // Destroy session if exists
  if (sessionId) {
    destroySession(sessionId);
  }

  // Delete cookie
  cookies.delete('session', { path: cookieOptions.path });

  // Redirect to login
  throw redirect(303, '/admin/login');
}
