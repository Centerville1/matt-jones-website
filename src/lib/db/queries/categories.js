/**
 * Category-related database queries
 */

import { db } from '../index.js';
import { categories } from '../schema/index.js';

/**
 * Get all categories
 * @returns {Promise<Array<object>>}
 */
export async function getAllCategories() {
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.order)
    .all();
  return allCategories;
}
