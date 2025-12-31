/**
 * Blog tags database queries
 */

import { db } from '../index.js';
import { blogTags, blogPostTags, blogPosts } from '../schema/index.js';
import { eq, desc, and, sql } from 'drizzle-orm';

/**
 * Get all tags
 * @returns {Promise<BlogTag[]>}
 */
export async function getAllTags() {
  /** @type {BlogTag[]} */
  const tags = await db.select().from(blogTags).orderBy(blogTags.name).all();

  return tags;
}

/**
 * Get tag by slug
 * @param {string} slug
 * @returns {Promise<BlogTag | undefined>}
 */
export async function getTagBySlug(slug) {
  /** @type {BlogTag | undefined} */
  const tag = await db
    .select()
    .from(blogTags)
    .where(eq(blogTags.slug, slug))
    .get();

  return tag;
}

/**
 * Get tag by ID
 * @param {number} id
 * @returns {Promise<BlogTag | undefined>}
 */
export async function getTagById(id) {
  /** @type {BlogTag | undefined} */
  const tag = await db.select().from(blogTags).where(eq(blogTags.id, id)).get();

  return tag;
}

/**
 * Get tags for a specific post
 * @param {number} postId
 * @returns {Promise<BlogTag[]>}
 */
export async function getTagsForPost(postId) {
  const tagIds = await db
    .select({ tagId: blogPostTags.tagId })
    .from(blogPostTags)
    .where(eq(blogPostTags.postId, postId))
    .all();

  if (tagIds.length === 0) return [];

  /** @type {BlogTag[]} */
  const tags = await db
    .select()
    .from(blogTags)
    .where(sql`${blogTags.id} IN (${tagIds.map((t) => t.tagId).join(',')})`)
    .all();

  return tags;
}

/**
 * Get posts by tag slug (published only)
 * @param {string} tagSlug - Tag slug
 * @returns {Promise<BlogPost[]>}
 */
export async function getPostsByTag(tagSlug) {
  const tag = await getTagBySlug(tagSlug);
  if (!tag) return [];

  const postIds = await db
    .select({ postId: blogPostTags.postId })
    .from(blogPostTags)
    .where(eq(blogPostTags.tagId, tag.id))
    .all();

  if (postIds.length === 0) return [];

  /** @type {BlogPost[]} */
  const posts = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.status, 'published'),
        sql`${blogPosts.id} IN (${postIds.map((p) => p.postId).join(',')})`
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .all();

  return posts;
}

/**
 * Create a new tag
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.slug
 * @param {string} [data.description]
 * @returns {Promise<BlogTag>}
 */
export async function createTag(data) {
  const [tag] = await db
    .insert(blogTags)
    .values({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      createdAt: new Date(),
    })
    .returning();

  return tag;
}

/**
 * Update a tag
 * @param {number} id
 * @param {{ name: string, slug: string, description?: string }} data
 * @returns {Promise<BlogTag>}
 */
export async function updateTag(id, data) {
  const [tag] = await db
    .update(blogTags)
    .set({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
    })
    .where(eq(blogTags.id, id))
    .returning();

  return tag;
}

/**
 * Delete a tag
 * @param {number} id
 */
export async function deleteTag(id) {
  await db.delete(blogTags).where(eq(blogTags.id, id));
}

/**
 * Add tags to a post (replaces existing tags)
 * @param {number} postId
 * @param {number[]} tagIds
 */
export async function setTagsForPost(postId, tagIds) {
  // First remove existing tags
  await db.delete(blogPostTags).where(eq(blogPostTags.postId, postId));

  // Then add new tags
  if (tagIds.length > 0) {
    await db.insert(blogPostTags).values(
      tagIds.map((tagId) => ({
        postId,
        tagId,
      }))
    );
  }
}
