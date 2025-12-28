import { requireAuth } from '$lib/server/guards.js';
import { getAllImages, createImage } from '$lib/db/queries/images.js';
import { uploadImage } from '$lib/server/storage.js';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  requireAuth(locals);

  const images = await getAllImages();

  return {
    images,
  };
}

export const actions = {
  default: async ({ request, locals }) => {
    requireAuth(locals);

    const data = await request.formData();
    const file = data.get('file');

    if (!file || !(file instanceof File)) {
      return fail(400, { error: 'No file uploaded' });
    }

    if (file.size === 0) {
      return fail(400, { error: 'File is empty' });
    }

    try {
      // Upload to Vercel Blob
      const uploadResult = await uploadImage(file, file.name);

      // Store metadata in database
      await createImage({
        filename: uploadResult.filename,
        originalName: file.name,
        path: uploadResult.url,
        mimeType: uploadResult.mimeType,
        size: uploadResult.size,
      });

      return { success: true };
    } catch (err) {
      console.error('Image upload error:', err);

      // Check if it's a SvelteKit error with status/body
      if (err && typeof err === 'object' && 'status' in err) {
        const errorBody =
          'body' in err && err.body && typeof err.body === 'object'
            ? err.body
            : {};
        const errorMessage =
          'message' in errorBody && typeof errorBody.message === 'string'
            ? errorBody.message
            : 'Failed to upload image';
        const status = typeof err.status === 'number' ? err.status : 500;
        return fail(status, { error: errorMessage });
      }

      return fail(500, { error: 'Failed to upload image' });
    }
  },
};
