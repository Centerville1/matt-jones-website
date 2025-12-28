import { requireAuth } from '$lib/server/guards.js';
import { db } from '$lib/db/index.js';
import { portfolioItems } from '$lib/db/schema/index.js';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
  requireAuth(locals);

  const { updates } = await request.json();

  if (!Array.isArray(updates)) {
    throw error(400, 'Invalid request: updates must be an array');
  }

  try {
    // Update each item's display order
    for (const update of updates) {
      if (
        typeof update.id !== 'number' ||
        typeof update.displayOrder !== 'number'
      ) {
        throw error(400, 'Invalid update format');
      }

      await db
        .update(portfolioItems)
        .set({ displayOrder: update.displayOrder })
        .where(eq(portfolioItems.id, update.id))
        .run();
    }

    return json({ success: true });
  } catch (err) {
    console.error('Failed to reorder items:', err);
    throw error(500, 'Failed to reorder items');
  }
}
