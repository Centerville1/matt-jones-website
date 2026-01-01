import { put, del } from '@vercel/blob';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const BLOB_READ_WRITE_TOKEN = env.BLOB_READ_WRITE_TOKEN;

/**
 * Allowed image MIME types
 */
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

/**
 * Allowed document MIME types
 */
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'text/plain',
];

/**
 * Maximum file size (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validate image file type and size
 * @param {File} file - File to validate
 * @throws {Error} If validation fails
 */
function validateImageFile(file) {
  if (!file) {
    throw error(400, 'No file provided');
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw error(
      400,
      `Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw error(400, 'File size exceeds 5MB limit');
  }
}

/**
 * Validate document file type and size
 * @param {File} file - File to validate
 * @throws {Error} If validation fails
 */
function validateDocumentFile(file) {
  if (!file) {
    throw error(400, 'No file provided');
  }

  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    throw error(
      400,
      `Invalid document type. Allowed types: PDF, DOC, DOCX, TXT`,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw error(400, 'File size exceeds 5MB limit');
  }
}

/**
 * Sanitize filename by removing special characters
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(filename) {
  // Remove path traversal attempts
  const basename = filename.split('/').pop()?.split('\\').pop() || 'upload';

  // Replace spaces and special chars with hyphens
  return basename.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
}

/**
 * Upload an image to Vercel Blob storage
 * @param {File} file - Image file to upload
 * @param {string} originalFilename - Original filename
 * @returns {Promise<{url: string, filename: string, path: string, size: number, mimeType: string}>}
 */
export async function uploadImage(file, originalFilename) {
  // Validate file
  validateImageFile(file);

  // Sanitize filename
  const sanitizedName = sanitizeFilename(originalFilename);

  try {
    // Upload to Vercel Blob
    const blob = await put(sanitizedName, file, {
      access: 'public',
      addRandomSuffix: true, // Prevents filename collisions
      token: BLOB_READ_WRITE_TOKEN,
    });

    return {
      url: blob.url,
      filename: blob.pathname.split('/').pop() || sanitizedName,
      path: blob.pathname,
      size: file.size,
      mimeType: file.type,
    };
  } catch (err) {
    console.error('Vercel Blob upload error:', err);
    throw error(500, 'Failed to upload image');
  }
}

/**
 * Delete an image from Vercel Blob storage
 * @param {string} url - Blob URL to delete
 */
export async function deleteImage(url) {
  if (!url) {
    return;
  }

  try {
    await del(url, {
      token: BLOB_READ_WRITE_TOKEN,
    });
  } catch (err) {
    console.error('Vercel Blob delete error:', err);
    throw error(500, 'Failed to delete image');
  }
}

/**
 * Upload a document to Vercel Blob storage
 * @param {File} file - Document file to upload
 * @param {string} originalFilename - Original filename
 * @returns {Promise<{url: string, filename: string, path: string, size: number, mimeType: string}>}
 */
export async function uploadDocument(file, originalFilename) {
  // Validate file
  validateDocumentFile(file);

  // Sanitize filename
  const sanitizedName = sanitizeFilename(originalFilename);

  try {
    // Upload to Vercel Blob
    const blob = await put(sanitizedName, file, {
      access: 'public',
      addRandomSuffix: true, // Prevents filename collisions
      token: BLOB_READ_WRITE_TOKEN,
    });

    return {
      url: blob.url,
      filename: blob.pathname.split('/').pop() || sanitizedName,
      path: blob.pathname,
      size: file.size,
      mimeType: file.type,
    };
  } catch (err) {
    console.error('Vercel Blob upload error:', err);
    throw error(500, 'Failed to upload document');
  }
}

/**
 * Delete a document from Vercel Blob storage
 * @param {string} url - Blob URL to delete
 */
export async function deleteDocument(url) {
  if (!url) {
    return;
  }

  try {
    await del(url, {
      token: BLOB_READ_WRITE_TOKEN,
    });
  } catch (err) {
    console.error('Vercel Blob delete error:', err);
    throw error(500, 'Failed to delete document');
  }
}
