/**
 * Blog series database queries
 */

import { db } from '../index.js';
import { blogSeries } from '../schema/index.js';
import { eq, desc } from 'drizzle-orm';

/**
 * Get all series
 * @returns {Promise<BlogSeries[]>}
 */
export async function getAllSeries() {
  /** @type {BlogSeries[]} */
  const series = await db
    .select()
    .from(blogSeries)
    .orderBy(desc(blogSeries.createdAt))
    .all();

  return series;
}

/**
 * Get series by slug
 * @param {string} slug
 * @returns {Promise<BlogSeries | undefined>}
 */
export async function getSeriesBySlug(slug) {
  /** @type {BlogSeries | undefined} */
  const series = await db
    .select()
    .from(blogSeries)
    .where(eq(blogSeries.slug, slug))
    .get();

  return series;
}

/**
 * Get series by ID
 * @param {number} id
 * @returns {Promise<BlogSeries | undefined>}
 */
export async function getSeriesById(id) {
  /** @type {BlogSeries | undefined} */
  const series = await db
    .select()
    .from(blogSeries)
    .where(eq(blogSeries.id, id))
    .get();

  return series;
}

/**
 * Create a new series
 * @param {Object} data
 * @param {string} data.title
 * @param {string} data.slug
 * @param {string} [data.description]
 * @returns {Promise<BlogSeries>}
 */
export async function createSeries(data) {
  const now = new Date();

  const [series] = await db
    .insert(blogSeries)
    .values({
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return series;
}

/**
 * Update a series
 * @param {number} id
 * @param {{ title: string, slug: string, description?: string }} data
 * @returns {Promise<BlogSeries>}
 */
export async function updateSeries(id, data) {
  const [series] = await db
    .update(blogSeries)
    .set({
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      updatedAt: new Date(),
    })
    .where(eq(blogSeries.id, id))
    .returning();

  return series;
}

/**
 * Delete a series
 * @param {number} id
 */
export async function deleteSeries(id) {
  await db.delete(blogSeries).where(eq(blogSeries.id, id));
}
