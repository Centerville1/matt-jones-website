import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Blog tags table - taxonomy for categorizing blog posts
 * (e.g., 'svelte', 'web-dev', 'tutorial')
 * @typedef {import('./types').BlogTag} BlogTag
 */
export const blogTags = sqliteTable('blog_tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Tag identification
  name: text('name').notNull().unique(), // e.g., 'svelte', 'web-dev'
  slug: text('slug').notNull().unique(), // URL-friendly

  // Description
  description: text('description'), // Optional tag description

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
