/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  // Don't redirect here - let individual pages handle auth
  // Just pass user info for layout UI
  return {
    user: locals.user,
  };
}
