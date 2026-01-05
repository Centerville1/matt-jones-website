import {
  getSpriteById,
  createSprite,
  updateSprite,
  deleteSprite,
} from '$lib/db/queries/sprites.js';
import { getAllImages } from '$lib/db/queries/images.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const images = await getAllImages();

  // If id is 'new', return empty sprite data
  if (params.id === 'new') {
    return {
      sprite: null,
      images,
      isNew: true,
    };
  }

  // Otherwise, fetch existing sprite
  const sprite = await getSpriteById(params.id);

  if (!sprite) {
    throw error(404, 'Sprite not found');
  }

  return {
    sprite,
    images,
    isNew: false,
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  save: async ({ request, params }) => {
    const formData = await request.formData();
    const spriteDataString = formData.get('spriteData');
    const spriteData = JSON.parse(
      typeof spriteDataString === 'string' ? spriteDataString : '{}',
    );

    if (params.id === 'new') {
      // Create new sprite
      await createSprite(spriteData);
      return { success: true, id: spriteData.id };
    } else {
      // Update existing sprite
      await updateSprite(params.id, spriteData);
      return { success: true, id: params.id };
    }
  },

  delete: async ({ params }) => {
    if (params.id !== 'new') {
      await deleteSprite(params.id);
    }
    return { success: true, deleted: true };
  },
};
