/**
 * Image-related database queries
 */

import { db } from '../index.js';
import { images } from '../schema/index.js';
import { eq } from 'drizzle-orm';

/**
 * Get all images
 * @returns {Promise<Array<object>>}
 */
export async function getAllImages() {
  const allImages = await db.select().from(images).all();
  return allImages;
}

/**
 * Get a single image by ID
 * @param {number} id - Image ID
 * @returns {Promise<object | undefined>}
 */
export async function getImageById(id) {
  const image = await db.select().from(images).where(eq(images.id, id)).get();
  return image;
}

/**
 * Create a new image record
 * @param {{ filename: string, originalName: string, path: string, mimeType: string, size: number, alt?: string }} data - Image metadata
 * @returns {Promise<object>} Created image with ID
 */
export async function createImage(data) {
  const now = new Date();

  const [image] = await db
    .insert(images)
    .values({
      filename: data.filename,
      originalName: data.originalName,
      path: data.path,
      mimeType: data.mimeType,
      size: data.size,
      alt: data.alt || null,
      uploadedAt: now,
    })
    .returning();

  return image;
}

/**
 * Delete an image record
 * @param {number} id - Image ID
 */
export async function deleteImage(id) {
  await db.delete(images).where(eq(images.id, id));
}
