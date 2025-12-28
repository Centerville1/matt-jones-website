import { requireAuth } from '$lib/server/guards.js';
import { getAllPortfolioItems } from '$lib/db/queries/portfolio.js';
import { getAllCategories } from '$lib/db/queries/categories.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  requireAuth(locals);

  const [items, categories] = await Promise.all([
    getAllPortfolioItems(),
    getAllCategories(),
  ]);

  return {
    items,
    categories,
  };
}
