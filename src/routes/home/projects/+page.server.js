import { getPortfolioData } from '$lib/db/queries/portfolio.js';
import { getAllCategories } from '$lib/db/queries/categories.js';

/**
 * @returns {Promise<{
 *   experiences: PortfolioItem[],
 *   categories: Category[]
 * }>}
 */
/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const allCategories = await getAllCategories();

  return {
    experiences: await getPortfolioData(),
    categories: allCategories.filter((cat) => cat.hasTab),
  };
}
