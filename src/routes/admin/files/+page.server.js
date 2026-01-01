import { requireAuth } from '$lib/server/guards.js';
import { getAllFiles, createFile, deleteFile } from '$lib/db/queries/files.js';
import { uploadDocument, deleteDocument } from '$lib/server/storage.js';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  requireAuth(locals);

  const files = await getAllFiles();

  return {
    files,
  };
}

export const actions = {
  upload: async ({ request, locals }) => {
    requireAuth(locals);

    const data = await request.formData();
    const file = data.get('file');
    const category = /** @type {string | null} */ (data.get('category'));
    const displayName = /** @type {string | null} */ (data.get('displayName'));
    const description = /** @type {string | null} */ (data.get('description'));

    if (!file || !(file instanceof File)) {
      return fail(400, { error: 'No file uploaded' });
    }

    if (file.size === 0) {
      return fail(400, { error: 'File is empty' });
    }

    try {
      // Upload to Vercel Blob
      const uploadResult = await uploadDocument(file, file.name);

      // Store metadata in database
      await createFile({
        filename: uploadResult.filename,
        originalName: file.name,
        path: uploadResult.url,
        mimeType: uploadResult.mimeType,
        size: uploadResult.size,
        category: category || undefined,
        displayName: displayName || undefined,
        description: description || undefined,
      });

      return { success: true };
    } catch (err) {
      console.error('File upload error:', err);

      // Check if it's a SvelteKit error with status/body
      if (err && typeof err === 'object' && 'status' in err) {
        const errorBody =
          'body' in err && err.body && typeof err.body === 'object'
            ? err.body
            : {};
        const errorMessage =
          'message' in errorBody && typeof errorBody.message === 'string'
            ? errorBody.message
            : 'Failed to upload file';
        const status = typeof err.status === 'number' ? err.status : 500;
        return fail(status, { error: errorMessage });
      }

      return fail(500, { error: 'Failed to upload file' });
    }
  },

  delete: async ({ request, locals }) => {
    requireAuth(locals);

    const data = await request.formData();
    const id = parseInt(/** @type {string} */ (data.get('id')) || '');
    const url = /** @type {string} */ (data.get('url'));

    if (!id || !url) {
      return fail(400, { error: 'Missing file ID or URL' });
    }

    try {
      // Delete from Vercel Blob
      await deleteDocument(url);

      // Delete from database
      await deleteFile(id);

      return { success: true };
    } catch (err) {
      console.error('File delete error:', err);
      return fail(500, { error: 'Failed to delete file' });
    }
  },
};
