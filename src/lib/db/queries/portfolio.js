/**
 * Portfolio-related database queries
 */

import { db } from '../index.js';
import { categories, portfolioItems } from '../schema/index.js';
import { eq } from 'drizzle-orm';

/**
 * Get all portfolio items grouped by category
 * Returns data in the same format as experiences.json:
 * { experiences: [...], projects: [...], other: [...] }
 * @returns {Promise<Record<string, Array<{title: string, description: string, startDate: string | null, endDate: string | null, url: string, image: string, highlight: boolean}>>>}
 */
export async function getPortfolioData() {
  // Get all categories
  const allCategories = await db.select().from(categories).all();

  // Get all portfolio items
  const allItems = await db.select().from(portfolioItems).all();

  // Transform to match original JSON structure
  /** @type {Record<string, Array<{title: string, description: string, startDate: string | null, endDate: string | null, url: string, image: string, highlight: boolean}>>} */
  const result = {};

  for (const category of allCategories) {
    const items = allItems
      .filter((item) => item.categoryId === category.id)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((item) => ({
        title: item.title,
        description: item.description,
        startDate: item.startDate,
        endDate: item.endDate,
        url: item.url || '',
        image: item.image || '',
        highlight: Boolean(item.highlight),
      }));

    result[category.slug] = items;
  }

  return result;
}

/**
 * Get portfolio items for a specific category
 * @param {string} categorySlug - 'experiences', 'projects', or 'other'
 */
export async function getPortfolioItemsByCategory(categorySlug) {
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .get();

  if (!category) {
    return [];
  }

  const items = await db
    .select()
    .from(portfolioItems)
    .where(eq(portfolioItems.categoryId, category.id))
    .orderBy(portfolioItems.displayOrder)
    .all();

  return items.map((item) => ({
    title: item.title,
    description: item.description,
    startDate: item.startDate,
    endDate: item.endDate,
    url: item.url || '',
    image: item.image || '',
    highlight: Boolean(item.highlight),
  }));
}
