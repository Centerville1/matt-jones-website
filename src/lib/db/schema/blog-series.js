import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Blog series table - groups related blog posts into collections
 * (e.g., "Building a SvelteKit Blog" Parts 1-3)
 * @typedef {import('./types').BlogSeries} BlogSeries
 */
export const blogSeries = sqliteTable('blog_series', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Series identification
  title: text('title').notNull(), // e.g., "Building a SvelteKit Blog"
  slug: text('slug').notNull().unique(), // URL-friendly

  // Description
  description: text('description'), // Optional overview of the series

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
