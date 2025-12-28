import { fail, redirect } from '@sveltejs/kit';
import {
  verifyPassword,
  checkRateLimit,
  createSession,
  cookieOptions,
} from '$lib/server/auth.js';
import { env } from '$env/dynamic/private';

const ADMIN_PASSWORD = env.ADMIN_PASSWORD;

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  // If already logged in, redirect to admin dashboard
  if (locals.user) {
    throw redirect(303, '/admin');
  }

  return {};
}

export const actions = {
  default: async ({ request, cookies, getClientAddress }) => {
    const ip = getClientAddress();

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return fail(429, {
        error: 'Too many login attempts. Please try again in 15 minutes.',
      });
    }

    const data = await request.formData();
    const password = data.get('password');

    if (!password || typeof password !== 'string') {
      return fail(400, { error: 'Password is required' });
    }

    // Verify password using timing-safe comparison
    if (!verifyPassword(password, ADMIN_PASSWORD)) {
      return fail(401, { error: 'Invalid password' });
    }

    // Create session
    const sessionId = createSession();

    // Set session cookie
    cookies.set('session', sessionId, cookieOptions);

    // Redirect to admin dashboard
    throw redirect(303, '/admin');
  },
};
