import { requireAuth } from '$lib/server/guards.js';
import { getBios, updateBio } from '$lib/db/queries/bios.js';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  requireAuth(locals);

  const biosData = await getBios();

  // Convert to object with content as strings (joined by newlines)
  return {
    bios: {
      short: biosData.short?.default.join('\n') || '',
      mid: biosData.mid?.default.join('\n') || '',
      long: biosData.long?.default.join('\n') || '',
    },
  };
}

export const actions = {
  default: async ({ request, locals }) => {
    requireAuth(locals);

    const data = await request.formData();
    const shortContent = data.get('short');
    const midContent = data.get('mid');
    const longContent = data.get('long');

    // Validation
    const errors = {};

    if (!shortContent || typeof shortContent !== 'string' || shortContent.trim() === '') {
      errors.short = 'Short bio is required';
    }

    if (!midContent || typeof midContent !== 'string' || midContent.trim() === '') {
      errors.mid = 'Mid bio is required';
    }

    if (!longContent || typeof longContent !== 'string' || longContent.trim() === '') {
      errors.long = 'Long bio is required';
    }

    if (Object.keys(errors).length > 0) {
      return fail(400, {
        errors,
        data: {
          short: shortContent,
          mid: midContent,
          long: longContent,
        },
      });
    }

    try {
      // Update all three bios
      await Promise.all([
        updateBio('short', /** @type {string} */ (shortContent).trim()),
        updateBio('mid', /** @type {string} */ (midContent).trim()),
        updateBio('long', /** @type {string} */ (longContent).trim()),
      ]);

      return { success: true };
    } catch (err) {
      console.error('Failed to update bios:', err);
      return fail(500, {
        error: 'Failed to update bios',
        data: {
          short: shortContent,
          mid: midContent,
          long: longContent,
        },
      });
    }
  },
};
