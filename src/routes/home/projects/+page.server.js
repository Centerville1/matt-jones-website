import { getPortfolioData } from '$lib/db/queries/portfolio.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  return {
    experiences: await getPortfolioData(),
  };
}
