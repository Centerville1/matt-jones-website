import { getAllSprites } from '$lib/db/queries/sprites.js';
import { getAllImages } from '$lib/db/queries/images.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const [sprites, images] = await Promise.all([
    getAllSprites(),
    getAllImages(),
  ]);

  return {
    sprites,
    images,
  };
}
