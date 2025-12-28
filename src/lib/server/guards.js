import { redirect } from '@sveltejs/kit';

/**
 * Require authentication for a route
 * Throws a redirect to login page if user is not authenticated
 *
 * CRITICAL: Call this at the START of every admin +page.server.js load function
 * DO NOT rely on +layout.server.js for auth (doesn't propagate to all routes)
 *
 * @param {App.Locals} locals - SvelteKit locals object
 * @throws {Redirect} Redirects to /admin/login if not authenticated
 *
 * @example
 * // In +page.server.js
 * import { requireAuth } from '$lib/server/guards.js';
 *
 * export async function load({ locals }) {
 *   requireAuth(locals);
 *   // ... rest of load function
 * }
 */
export function requireAuth(locals) {
  if (!locals.user) {
    throw redirect(303, '/admin/login');
  }
}
