/**
 * Bio-related database queries
 */

import { db } from '../index.js';
import { bios } from '../schema/index.js';
import { eq } from 'drizzle-orm';

/**
 * Get all bios
 * Returns data in the same format as bios.json:
 * { short: { default: [...] }, mid: { default: [...] }, long: { default: [...] } }
 * @returns {Promise<Record<string, { default: string[] }>>}
 */
export async function getBios() {
  const allBios = await db.select().from(bios).all();

  /** @type {Record<string, { default: string[] }>} */
  const result = {};

  for (const bio of allBios) {
    // Split content by newlines to match original JSON array format
    const paragraphs = bio.content.split('\n').filter((p) => p.trim());
    result[bio.type] = {
      default: paragraphs,
    };
  }

  return result;
}

/**
 * Get a specific bio by type
 * @param {string} type - 'short', 'mid', or 'long'
 */
export async function getBioByType(type) {
  const bio = await db.select().from(bios).where(eq(bios.type, type)).get();

  if (!bio) {
    return null;
  }

  const paragraphs = bio.content.split('\n').filter((p) => p.trim());
  return {
    default: paragraphs,
  };
}
