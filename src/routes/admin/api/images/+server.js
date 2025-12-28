import { json, error } from '@sveltejs/kit';
import {
  createImage,
  deleteImage as deleteImageRecord,
} from '$lib/db/queries/images.js';
import {
  uploadImage as uploadImageToBlob,
  deleteImage as deleteImageFromBlob,
} from '$lib/server/storage.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
  // Verify authentication
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  // CSRF protection - verify origin header
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host && !origin.includes(host)) {
    throw error(403, 'Invalid origin');
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      throw error(400, 'No file provided');
    }

    // Upload to Vercel Blob
    const uploadResult = await uploadImageToBlob(file, file.name);

    // Save metadata to database
    const image = await createImage({
      filename: uploadResult.filename,
      originalName: file.name,
      path: uploadResult.url,
      mimeType: uploadResult.mimeType,
      size: uploadResult.size,
    });

    return json({ success: true, image });
  } catch (err) {
    // Type guard for SvelteKit errors
    if (err && typeof err === 'object' && 'status' in err) throw err;
    console.error('Image upload error:', err);
    throw error(500, 'Failed to upload image');
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {
  // Verify authentication
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  // CSRF protection - verify origin header
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host && !origin.includes(host)) {
    throw error(403, 'Invalid origin');
  }

  try {
    const { id, url } = await request.json();

    if (!id || typeof id !== 'number') {
      throw error(400, 'Invalid ID');
    }

    if (!url || typeof url !== 'string') {
      throw error(400, 'Invalid URL');
    }

    // Delete from Vercel Blob first
    await deleteImageFromBlob(url);

    // Then delete from database
    await deleteImageRecord(id);

    return json({ success: true });
  } catch (err) {
    // Type guard for SvelteKit errors
    if (err && typeof err === 'object' && 'status' in err) throw err;
    console.error('Image deletion error:', err);
    throw error(500, 'Failed to delete image');
  }
}
