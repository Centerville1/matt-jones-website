import { sqliteTable, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { blogPosts } from './blog-posts.js';
import { blogTags } from './blog-tags.js';

/**
 * Blog post tags join table - many-to-many relationship between posts and tags
 * Allows posts to have multiple tags and tags to be used on multiple posts
 * @typedef {import('./types').BlogPostTag} BlogPostTag
 */
export const blogPostTags = sqliteTable(
  'blog_post_tags',
  {
    postId: integer('post_id')
      .notNull()
      .references(() => blogPosts.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => blogTags.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.tagId] }),
  })
);
