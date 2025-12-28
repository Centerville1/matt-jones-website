import { requireAuth } from '$lib/server/guards.js';
import { db } from '$lib/db/index.js';
import { portfolioItems } from '$lib/db/schema/portfolio-items.js';
import { images } from '$lib/db/schema/images.js';
import { categories } from '$lib/db/schema/categories.js';
import { count } from 'drizzle-orm';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  // Require authentication
  requireAuth(locals);

  // Get counts for dashboard stats
  const [portfolioCount] = await db
    .select({ count: count() })
    .from(portfolioItems);
  const [imageCount] = await db.select({ count: count() }).from(images);
  const [categoryCount] = await db.select({ count: count() }).from(categories);

  return {
    stats: {
      portfolioCount: portfolioCount.count,
      imageCount: imageCount.count,
      categoryCount: categoryCount.count,
    },
  };
}
