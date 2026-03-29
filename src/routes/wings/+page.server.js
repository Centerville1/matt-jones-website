import { fail, redirect } from '@sveltejs/kit';
import {
  verifyPassword,
  checkRateLimit,
  createSession,
  cookieOptions,
} from '$lib/server/wings-auth.js';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  if (locals.wingsUser) {
    throw redirect(303, '/wings/order');
  }
  return {};
}

export const actions = {
  default: async ({ request, cookies, getClientAddress }) => {
    const ip = getClientAddress();

    if (!checkRateLimit(ip)) {
      return fail(429, { error: 'Too many attempts. Try again in 15 minutes.' });
    }

    const data = await request.formData();
    const password = data.get('password');

    if (!password || typeof password !== 'string') {
      return fail(400, { error: 'Password is required' });
    }

    const WINGS_PASSWORD = env.WINGS_PASSWORD;
    if (!WINGS_PASSWORD) {
      return fail(500, { error: 'Server configuration error' });
    }

    if (!verifyPassword(password, WINGS_PASSWORD)) {
      return fail(401, { error: 'Wrong password' });
    }

    cookies.set('wings-session', createSession(), cookieOptions);
    throw redirect(303, '/wings/order');
  },
};
