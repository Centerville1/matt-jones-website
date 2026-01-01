/**
 * File-related database queries
 */

import { db } from '../index.js';
import { files } from '../schema/index.js';
import { eq, desc } from 'drizzle-orm';

/**
 * Get all files
 * @returns {Promise<FileRecord[]>}
 */
export async function getAllFiles() {
  /** @type {FileRecord[]} */
  const allFiles = /** @type {FileRecord[]} */ (
    await db.select().from(files).orderBy(desc(files.uploadedAt)).all()
  );
  return allFiles;
}

/**
 * Get files by category (e.g., 'resume')
 * @param {string} category - File category
 * @returns {Promise<FileRecord[]>}
 */
export async function getFilesByCategory(category) {
  /** @type {FileRecord[]} */
  const categoryFiles = /** @type {FileRecord[]} */ (
    await db
      .select()
      .from(files)
      .where(eq(files.category, category))
      .orderBy(desc(files.uploadedAt))
      .all()
  );
  return categoryFiles;
}

/**
 * Get the most recent resume file
 * @returns {Promise<FileRecord | undefined>}
 */
export async function getLatestResume() {
  /** @type {FileRecord | undefined} */
  const resume = /** @type {FileRecord | undefined} */ (
    await db
      .select()
      .from(files)
      .where(eq(files.category, 'resume'))
      .orderBy(desc(files.uploadedAt))
      .limit(1)
      .get()
  );
  return resume;
}

/**
 * Get a single file by ID
 * @param {number} id - File ID
 * @returns {Promise<FileRecord | undefined>}
 */
export async function getFileById(id) {
  /** @type {FileRecord | undefined} */
  const file = /** @type {FileRecord | undefined} */ (
    await db.select().from(files).where(eq(files.id, id)).get()
  );
  return file;
}

/**
 * Create a new file record
 * @param {{ filename: string, originalName: string, path: string, mimeType: string, size: number, category?: string, description?: string, displayName?: string }} data - File metadata
 * @returns {Promise<FileRecord>} Created file with ID
 */
export async function createFile(data) {
  const now = new Date();

  const [file] = await db
    .insert(files)
    .values({
      filename: data.filename,
      originalName: data.originalName,
      path: data.path,
      mimeType: data.mimeType,
      size: data.size,
      category: data.category || null,
      description: data.description || null,
      displayName: data.displayName || null,
      uploadedAt: now,
    })
    .returning();

  return /** @type {FileRecord} */ (file);
}

/**
 * Update file metadata
 * @param {number} id - File ID
 * @param {{ category?: string, description?: string, displayName?: string }} data - Fields to update
 * @returns {Promise<void>}
 */
export async function updateFile(id, data) {
  await db.update(files).set(data).where(eq(files.id, id));
}

/**
 * Delete a file record
 * @param {number} id - File ID
 * @returns {Promise<void>}
 */
export async function deleteFile(id) {
  await db.delete(files).where(eq(files.id, id));
}
