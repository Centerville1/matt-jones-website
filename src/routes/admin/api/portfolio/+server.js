import { json, error } from '@sveltejs/kit';
import { deletePortfolioItem } from '$lib/db/queries/portfolio.js';

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {
  // Verify authentication
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  // CSRF protection - verify origin header
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host && !origin.includes(host)) {
    throw error(403, 'Invalid origin');
  }

  try {
    const { id } = await request.json();

    if (!id || typeof id !== 'number') {
      throw error(400, 'Invalid ID');
    }

    await deletePortfolioItem(id);

    return json({ success: true });
  } catch (err) {
    // Type guard for SvelteKit errors
    if (err && typeof err === 'object' && 'status' in err) throw err;
    throw error(500, 'Failed to delete portfolio item');
  }
}
