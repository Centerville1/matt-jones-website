import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Bios table - stores different length bio versions
 * Replaces: src/routes/home/bios.json
 * @typedef {import('./types').Bio} Bio
 */
export const bios = sqliteTable('bios', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Bio type: 'short', 'mid', or 'long'
  type: text('type').notNull().unique(),

  // The bio content (markdown or plain text)
  content: text('content').notNull(),

  // Timestamp
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
