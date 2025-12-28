import { requireAuth } from '$lib/server/guards.js';
import { getAllCategories } from '$lib/db/queries/categories.js';
import {
  getPortfolioItemById,
  updatePortfolioItem,
} from '$lib/db/queries/portfolio.js';
import { getAllImages } from '$lib/db/queries/images.js';
import { error, fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
  requireAuth(locals);

  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    throw error(400, 'Invalid ID');
  }

  const [item, categories, images] = await Promise.all([
    getPortfolioItemById(id),
    getAllCategories(),
    getAllImages(),
  ]);

  if (!item) {
    throw error(404, 'Portfolio item not found');
  }

  return {
    item,
    categories,
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
    const description = data.get('description');
    const categoryId = data.get('categoryId');
    const startDate = data.get('startDate');
    const endDate = data.get('endDate');
    const url = data.get('url');
    const image = data.get('image');
    const highlight = data.get('highlight') === 'on';
    const displayOrder = data.get('displayOrder');

    // Validation
    const errors = {};

    if (!title || typeof title !== 'string' || title.trim() === '') {
      errors.title = 'Title is required';
    }

    if (
      !description ||
      typeof description !== 'string' ||
      description.trim() === ''
    ) {
      errors.description = 'Description is required';
    }

    if (!categoryId || typeof categoryId !== 'string') {
      errors.categoryId = 'Category is required';
    }

    if (Object.keys(errors).length > 0) {
      return fail(400, {
        errors,
        data: {
          title,
          description,
          categoryId,
          startDate,
          endDate,
          url,
          image,
          highlight,
          displayOrder,
        },
      });
    }

    try {
      // Get existing item to preserve displayOrder if not provided
      const existingItem = await getPortfolioItemById(id);

      await updatePortfolioItem(id, {
        categoryId: parseInt(/** @type {string} */ (categoryId), 10),
        title: /** @type {string} */ (title).trim(),
        description: /** @type {string} */ (description).trim(),
        startDate:
          startDate && typeof startDate === 'string' && startDate.trim() !== ''
            ? startDate.trim()
            : undefined,
        endDate:
          endDate && typeof endDate === 'string' && endDate.trim() !== ''
            ? endDate.trim()
            : undefined,
        url:
          url && typeof url === 'string' && url.trim() !== ''
            ? url.trim()
            : undefined,
        image:
          image && typeof image === 'string' && image.trim() !== ''
            ? image.trim()
            : undefined,
        highlight,
        displayOrder:
          displayOrder && typeof displayOrder === 'string'
            ? parseInt(displayOrder, 10)
            : existingItem?.displayOrder || 0,
      });

      return { success: true };
    } catch (err) {
      return fail(500, {
        error: 'Failed to update portfolio item',
        data: {
          title,
          description,
          categoryId,
          startDate,
          endDate,
          url,
          image,
          highlight,
          displayOrder,
        },
      });
    }
  },
};
