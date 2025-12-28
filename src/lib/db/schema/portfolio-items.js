import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { categories } from './categories.js';

/**
 * Portfolio items table - stores work experience, projects, and experiments
 * Replaces: src/routes/home/projects/experiences.json
 *
 * Data flows through Card component with these mappings:
 * - title → title
 * - description → description
 * - startDate → started (parsed to Date)
 * - endDate → ended (parsed to Date or "Present")
 * - url → linkUrl
 * - image → image (from /experiences/ directory)
 */
export const portfolioItems = sqliteTable('portfolio_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Foreign key to categories table
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),

  // Display information
  title: text('title').notNull(),
  description: text('description').notNull(),

  // Dates in MM/DD/YYYY format (nullable - experiments don't have dates)
  startDate: text('start_date'),
  endDate: text('end_date'),

  // Single URL field (can be internal like /home/sphere or external)
  url: text('url'),

  // Image filename (stored in /experiences/ directory)
  image: text('image'),

  // Whether to show in "highlighted" section (only used for experiences category)
  highlight: integer('highlight', { mode: 'boolean' }).notNull().default(false),

  // Manual ordering within category (lower numbers appear first)
  displayOrder: integer('display_order').notNull().default(0),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
