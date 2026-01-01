import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Files table - stores uploaded files (PDFs, documents, etc.)
 * For managing resume, documents, and other downloadable files
 * @typedef {import('./types').FileRecord} FileRecord
 */
export const files = sqliteTable('files', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Storage filename (unique, sanitized)
  filename: text('filename').notNull().unique(),

  // Original uploaded filename (for reference)
  originalName: text('original_name').notNull(),

  // Storage path (Vercel Blob URL)
  path: text('path').notNull(),

  // MIME type (e.g., 'application/pdf', 'application/msword')
  mimeType: text('mime_type').notNull(),

  // File size in bytes
  size: integer('size').notNull(),

  // File category (resume, document, etc.)
  category: text('category'), // resume, cv, document, or null

  // Description for admin reference
  description: text('description'),

  // Display name for download links
  displayName: text('display_name'),

  // Timestamp
  uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).notNull(),
});
