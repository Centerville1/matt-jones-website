import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Site metadata table - stores SEO and site-wide settings
 * Key-value store for flexible site configuration
 */
export const siteMetadata = sqliteTable('site_metadata', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Unique key (e.g., 'site_title', 'site_description', 'owner_name', 'owner_email')
  key: text('key').notNull().unique(),

  // The value for this setting
  value: text('value').notNull(),

  // Optional description of what this setting controls
  description: text('description'),

  // Timestamp
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
