import { redirect } from '@sveltejs/kit';
import { cookieOptions } from '$lib/server/wings-auth.js';

export function GET({ cookies }) {
  cookies.delete('wings-session', { path: '/wings' });
  throw redirect(303, '/wings');
}
