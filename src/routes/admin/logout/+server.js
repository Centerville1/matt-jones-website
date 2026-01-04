import { redirect } from '@sveltejs/kit';
import { cookieOptions } from '$lib/server/auth.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
  // Delete session cookie (stateless sessions don't need server-side cleanup)
  cookies.delete('session', { path: cookieOptions.path });

  // Redirect to login
  throw redirect(303, '/admin/login');
}
