import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Categories table - stores portfolio item categories
 * Initially: 'work', 'projects', 'experiments'
 * Allows for future expansion without schema changes
 * @typedef {import('./types').Category} Category
 */
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // URL-friendly slug (e.g., 'work', 'projects', 'experiments')
  slug: text('slug').notNull().unique(),

  // Display name (e.g., 'Work Experience', 'Personal Projects', 'Experiments')
  name: text('name').notNull(),

  // Optional description for the category
  description: text('description'),

  // Display order on the site (lower numbers appear first)
  order: integer('order').notNull().default(0),

  // Whether this category should display with tabs (like current projects page)
  hasTab: integer('has_tab', { mode: 'boolean' }).notNull().default(false),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
