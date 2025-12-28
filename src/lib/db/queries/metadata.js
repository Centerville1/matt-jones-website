/**
 * Site metadata database queries
 */

import { db } from '../index.js';
import { siteMetadata } from '../schema/index.js';
import { eq } from 'drizzle-orm';

/**
 * Get all site metadata as a key-value object
 * @returns {Promise<Record<string, string>>} e.g., { site_title: 'Matt Jones - Portfolio', ... }
 */
export async function getSiteMetadata() {
  const allMetadata = await db.select().from(siteMetadata).all();

  /** @type {Record<string, string>} */
  const result = {};
  for (const meta of allMetadata) {
    result[meta.key] = meta.value;
  }

  return result;
}

/**
 * Get a specific metadata value by key
 * @param {string} key - e.g., 'site_title'
 * @returns {Promise<string | null>}
 */
export async function getMetadataValue(key) {
  const meta = await db
    .select()
    .from(siteMetadata)
    .where(eq(siteMetadata.key, key))
    .get();
  return meta?.value || null;
}
