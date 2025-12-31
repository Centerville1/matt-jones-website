import { requireAuth } from '$lib/server/guards.js';
import {
  getPostById,
  updatePost,
  generateSlug,
} from '$lib/db/queries/blog-posts.js';
import { getTagsForPost, getAllTags } from '$lib/db/queries/blog-tags.js';
import { getAllSeries } from '$lib/db/queries/blog-series.js';
import { getAllImages } from '$lib/db/queries/images.js';
import { error, fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
  requireAuth(locals);

  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    throw error(400, 'Invalid ID');
  }

  const [post, postTags, tags, series, images] = await Promise.all([
    getPostById(id),
    getTagsForPost(id),
    getAllTags(),
    getAllSeries(),
    getAllImages(),
  ]);

  if (!post) {
    throw error(404, 'Blog post not found');
  }

  return {
    post,
    postTags,
    tags,
    series,
    images,
  };
}

export const actions = {
  default: async ({ request, locals, params }) => {
    requireAuth(locals);

    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      throw error(400, 'Invalid ID');
    }

    const data = await request.formData();

    // Get form values
    const title = data.get('title');
    const slug = data.get('slug');
    const excerpt = data.get('excerpt');
    const content = data.get('content');
    const background = data.get('background');
    const headerImageId = data.get('headerImageId');
    const status = data.get('status');
    const authorName = data.get('authorName');
    const canonicalUrl = data.get('canonicalUrl');
    const seriesId = data.get('seriesId');
    const seriesOrder = data.get('seriesOrder');
    const featuredOrder = data.get('featuredOrder');
    const tagIds = data.get('tagIds');

    // Validation
    const errors = {};

    if (!title || typeof title !== 'string' || title.trim() === '') {
      errors.title = 'Title is required';
    }

    if (!excerpt || typeof excerpt !== 'string' || excerpt.trim() === '') {
      errors.excerpt = 'Excerpt is required';
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      errors.content = 'Content is required';
    }

    if (Object.keys(errors).length > 0) {
      return fail(400, {
        errors,
        data: {
          title,
          slug,
          excerpt,
          content,
          background,
          headerImageId,
          status,
          authorName,
          canonicalUrl,
          seriesId,
          seriesOrder,
          featuredOrder,
          tagIds,
        },
      });
    }

    try {
      // Parse content JSON
      let contentJson;
      try {
        contentJson = JSON.parse(/** @type {string} */ (content));
      } catch (e) {
        return fail(400, {
          errors: { content: 'Invalid content format' },
          data: {
            title,
            slug,
            excerpt,
            content,
            background,
            headerImageId,
            status,
            authorName,
            canonicalUrl,
            seriesId,
            seriesOrder,
            featuredOrder,
            tagIds,
          },
        });
      }

      // Generate slug if not provided or empty
      const finalSlug =
        slug && typeof slug === 'string' && slug.trim() !== ''
          ? slug.trim()
          : generateSlug(/** @type {string} */ (title).trim());

      // Parse tag IDs
      const tagIdArray =
        tagIds && typeof tagIds === 'string' && tagIds.trim() !== ''
          ? tagIds.split(',').map((id) => parseInt(id.trim(), 10))
          : [];

      await updatePost(id, {
        title: /** @type {string} */ (title).trim(),
        slug: finalSlug,
        excerpt: /** @type {string} */ (excerpt).trim(),
        content: contentJson,
        background:
          background && typeof background === 'string'
            ? background
            : 'blocks',
        headerImageId:
          headerImageId && typeof headerImageId === 'string'
            ? parseInt(headerImageId, 10)
            : undefined,
        status:
          status && typeof status === 'string' ? status : 'draft',
        authorName:
          authorName && typeof authorName === 'string' && authorName.trim() !== ''
            ? authorName.trim()
            : 'Matt Jones',
        canonicalUrl:
          canonicalUrl && typeof canonicalUrl === 'string' && canonicalUrl.trim() !== ''
            ? canonicalUrl.trim()
            : undefined,
        seriesId:
          seriesId && typeof seriesId === 'string'
            ? parseInt(seriesId, 10)
            : undefined,
        seriesOrder:
          seriesOrder && typeof seriesOrder === 'string'
            ? parseInt(seriesOrder, 10)
            : undefined,
        featuredOrder:
          featuredOrder && typeof featuredOrder === 'string'
            ? parseInt(featuredOrder, 10)
            : undefined,
        tagIds: tagIdArray,
      });

      return { success: true };
    } catch (err) {
      return fail(500, {
        error: 'Failed to update blog post',
        data: {
          title,
          slug,
          excerpt,
          content,
          background,
          headerImageId,
          status,
          authorName,
          canonicalUrl,
          seriesId,
          seriesOrder,
          featuredOrder,
          tagIds,
        },
      });
    }
  },
};
