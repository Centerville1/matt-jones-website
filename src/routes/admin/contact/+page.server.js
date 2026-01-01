import { requireAuth } from '$lib/server/guards.js';
import {
  getAllContactSubmissions,
  updateContactSubmissionStatus,
  updateContactSubmissionNotes,
  deleteContactSubmission,
} from '$lib/db/queries/contact-submissions.js';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  requireAuth(locals);

  const submissions = await getAllContactSubmissions();

  return {
    submissions,
  };
}

export const actions = {
  updateStatus: async ({ request, locals }) => {
    requireAuth(locals);

    const data = await request.formData();
    const id = parseInt(/** @type {string} */ (data.get('id')) || '');
    const status = /** @type {string} */ (data.get('status'));

    if (!id || !status) {
      return fail(400, { error: 'Missing submission ID or status' });
    }

    if (!['unread', 'read', 'archived'].includes(status)) {
      return fail(400, { error: 'Invalid status' });
    }

    try {
      await updateContactSubmissionStatus(id, status);
      return { success: true };
    } catch (err) {
      console.error('Status update error:', err);
      return fail(500, { error: 'Failed to update status' });
    }
  },

  updateNotes: async ({ request, locals }) => {
    requireAuth(locals);

    const data = await request.formData();
    const id = parseInt(/** @type {string} */ (data.get('id')) || '');
    const notes = /** @type {string} */ (data.get('notes') || '');

    if (!id) {
      return fail(400, { error: 'Missing submission ID' });
    }

    try {
      await updateContactSubmissionNotes(id, notes);
      return { success: true };
    } catch (err) {
      console.error('Notes update error:', err);
      return fail(500, { error: 'Failed to update notes' });
    }
  },

  delete: async ({ request, locals }) => {
    requireAuth(locals);

    const data = await request.formData();
    const id = parseInt(/** @type {string} */ (data.get('id')) || '');

    if (!id) {
      return fail(400, { error: 'Missing submission ID' });
    }

    try {
      await deleteContactSubmission(id);
      return { success: true };
    } catch (err) {
      console.error('Delete error:', err);
      return fail(500, { error: 'Failed to delete submission' });
    }
  },
};
