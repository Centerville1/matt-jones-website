import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { images } from './images.js';
import { blogSeries } from './blog-series.js';

/**
 * Blog posts table - stores blog content with rich text editing
 * @typedef {import('./types').BlogPost} BlogPost
 */
export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Post identification
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(), // URL-friendly (e.g., 'my-first-blog-post')

  // Content
  excerpt: text('excerpt').notNull(), // Short summary for listings and SEO
  content: text('content', { mode: 'json' }).notNull(), // TipTap JSON format

  // Page styling
  background: text('background').notNull().default('blocks'), // blocks, zigzag, checker, crosses

  // Header image (optional)
  headerImageId: integer('header_image_id').references(() => images.id),

  // Publishing workflow
  status: text('status').notNull().default('draft'), // draft or published
  publishedAt: integer('published_at', { mode: 'timestamp' }), // When post went live

  // Metadata
  readTimeMinutes: integer('read_time_minutes').notNull().default(0), // Calculated reading time
  authorName: text('author_name').notNull().default('Matt Jones'), // Future-proof for multi-author
  canonicalUrl: text('canonical_url'), // For cross-posting (e.g., to Medium/Dev.to)

  // Series organization (optional)
  seriesId: integer('series_id').references(() => blogSeries.id),
  seriesOrder: integer('series_order'), // Position within series (1, 2, 3...)

  // Featured/pinned posts
  featuredOrder: integer('featured_order'), // null = not featured, lower numbers = higher priority

  // Engagement
  viewCount: integer('view_count').notNull().default(0),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
