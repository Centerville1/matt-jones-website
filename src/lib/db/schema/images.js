import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Images table - stores uploaded images with metadata
 * For managing portfolio images, blog images, etc.
 */
export const images = sqliteTable('images', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Storage filename (unique, sanitized)
  filename: text('filename').notNull().unique(),

  // Original uploaded filename (for reference)
  originalName: text('original_name').notNull(),

  // Storage path (e.g., '/static/uploads/' or cloud URL)
  path: text('path').notNull(),

  // MIME type (e.g., 'image/jpeg', 'image/png')
  mimeType: text('mime_type').notNull(),

  // File size in bytes
  size: integer('size').notNull(),

  // Alt text for accessibility
  alt: text('alt'),

  // Timestamp
  uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).notNull(),
});
