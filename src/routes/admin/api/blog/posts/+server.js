import { json } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/guards.js';
import { deletePost } from '$lib/db/queries/blog-posts.js';

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {
  requireAuth(locals);

  try {
    const { id } = await request.json();

    if (!id) {
      return json({ error: 'Post ID is required' }, { status: 400 });
    }

    await deletePost(id);

    return json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
