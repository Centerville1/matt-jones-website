/**
 * Blog posts database queries
 */

import { db } from '../index.js';
import { blogPosts } from '../schema/index.js';
import { eq, desc, and, isNotNull, sql } from 'drizzle-orm';

/**
 * Get all published blog posts (for public listing)
 * Sorted by publish date, newest first
 * @returns {Promise<BlogPost[]>}
 */
export async function getPublishedPosts() {
  /** @type {BlogPost[]} */
  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, 'published'))
    .orderBy(desc(blogPosts.publishedAt))
    .all();

  return posts;
}

/**
 * Get featured blog posts (for homepage/blog landing)
 * Returns published posts with featuredOrder set, sorted by featuredOrder
 * @returns {Promise<BlogPost[]>}
 */
export async function getFeaturedPosts() {
  /** @type {BlogPost[]} */
  const posts = await db
    .select()
    .from(blogPosts)
    .where(
      and(eq(blogPosts.status, 'published'), isNotNull(blogPosts.featuredOrder))
    )
    .orderBy(blogPosts.featuredOrder)
    .all();

  return posts;
}

/**
 * Get a single blog post by slug
 * @param {string} slug - URL slug
 * @returns {Promise<BlogPost | undefined>}
 */
export async function getPostBySlug(slug) {
  /** @type {BlogPost | undefined} */
  const post = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .get();

  return post;
}

/**
 * Get a single blog post by ID
 * @param {number} id - Post ID
 * @returns {Promise<BlogPost | undefined>}
 */
export async function getPostById(id) {
  /** @type {BlogPost | undefined} */
  const post = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .get();

  return post;
}

/**
 * Get all blog posts (for admin)
 * Includes both drafts and published posts
 * @returns {Promise<BlogPost[]>}
 */
export async function getAllPosts() {
  /** @type {BlogPost[]} */
  const posts = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt))
    .all();

  return posts;
}

/**
 * Get posts in a series
 * @param {number} seriesId - Series ID
 * @returns {Promise<BlogPost[]>}
 */
export async function getPostsBySeries(seriesId) {
  /** @type {BlogPost[]} */
  const posts = await db
    .select()
    .from(blogPosts)
    .where(
      and(eq(blogPosts.status, 'published'), eq(blogPosts.seriesId, seriesId))
    )
    .orderBy(blogPosts.seriesOrder)
    .all();

  return posts;
}

/**
 * Create a new blog post
 * @param {Object} data - Post data
 * @param {string} data.title
 * @param {string} data.slug
 * @param {string} data.excerpt
 * @param {any} data.content - TipTap JSON
 * @param {string} [data.background] - Background style
 * @param {number} [data.headerImageId]
 * @param {string} [data.status]
 * @param {string} [data.authorName]
 * @param {string} [data.canonicalUrl]
 * @param {number} [data.seriesId]
 * @param {number} [data.seriesOrder]
 * @param {number} [data.featuredOrder]
 * @param {number[]} [data.tagIds] - Array of tag IDs to associate
 * @returns {Promise<BlogPost>}
 */
export async function createPost(data) {
  const now = new Date();

  const [post] = await db
    .insert(blogPosts)
    .values({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      background: data.background || 'blocks',
      headerImageId: data.headerImageId || null,
      status: data.status || 'draft',
      publishedAt: data.status === 'published' ? now : null,
      readTimeMinutes: calculateReadTime(data.content),
      authorName: data.authorName || 'Matt Jones',
      canonicalUrl: data.canonicalUrl || null,
      seriesId: data.seriesId || null,
      seriesOrder: data.seriesOrder || null,
      featuredOrder: data.featuredOrder || null,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  // Handle tag associations if provided
  if (data.tagIds && data.tagIds.length > 0) {
    const { setTagsForPost } = await import('./blog-tags.js');
    await setTagsForPost(post.id, data.tagIds);
  }

  return post;
}

/**
 * Update an existing blog post
 * @param {number} id - Post ID
 * @param {{ title: string, slug: string, excerpt: string, content: any, background?: string, headerImageId?: number, status?: string, authorName?: string, canonicalUrl?: string, seriesId?: number, seriesOrder?: number, featuredOrder?: number, tagIds?: number[] }} data - Post data to update
 * @returns {Promise<BlogPost>}
 */
export async function updatePost(id, data) {
  const existingPost = await getPostById(id);
  const now = new Date();

  // If status is changing from draft to published, set publishedAt
  const publishedAt =
    data.status === 'published' && existingPost?.status === 'draft'
      ? now
      : existingPost?.publishedAt || null;

  const [post] = await db
    .update(blogPosts)
    .set({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      background: data.background || 'blocks',
      headerImageId: data.headerImageId || null,
      status: data.status || 'draft',
      publishedAt,
      readTimeMinutes: calculateReadTime(data.content),
      authorName: data.authorName || 'Matt Jones',
      canonicalUrl: data.canonicalUrl || null,
      seriesId: data.seriesId || null,
      seriesOrder: data.seriesOrder || null,
      featuredOrder: data.featuredOrder || null,
      updatedAt: now,
    })
    .where(eq(blogPosts.id, id))
    .returning();

  // Handle tag associations if provided
  if (data.tagIds !== undefined) {
    const { setTagsForPost } = await import('./blog-tags.js');
    await setTagsForPost(id, data.tagIds);
  }

  return post;
}

/**
 * Delete a blog post
 * @param {number} id - Post ID
 */
export async function deletePost(id) {
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

/**
 * Increment view count for a post
 * @param {number} id - Post ID
 */
export async function incrementViewCount(id) {
  await db
    .update(blogPosts)
    .set({
      viewCount: sql`${blogPosts.viewCount} + 1`,
    })
    .where(eq(blogPosts.id, id));
}

/**
 * Calculate estimated reading time from TipTap JSON content
 * @param {any} content - TipTap JSON
 * @returns {number} Estimated minutes
 */
function calculateReadTime(content) {
  if (!content || !content.content) return 0;

  let wordCount = 0;

  /**
   * @param {any} node
   */
  function countWords(node) {
    if (node.type === 'text' && node.text) {
      wordCount += node.text.split(/\s+/).filter(Boolean).length;
    }
    if (node.content) {
      node.content.forEach(countWords);
    }
  }

  countWords(content);

  // Average reading speed: 200 words per minute
  return Math.ceil(wordCount / 200) || 1;
}

/**
 * Generate a URL-friendly slug from a string
 * @param {string} text
 * @returns {string}
 */
export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}
