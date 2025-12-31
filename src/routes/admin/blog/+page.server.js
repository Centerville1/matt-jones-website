import { requireAuth } from '$lib/server/guards.js';
import { getAllPosts } from '$lib/db/queries/blog-posts.js';
import { getAllTags, getTagsForPost } from '$lib/db/queries/blog-tags.js';
import { getAllSeries } from '$lib/db/queries/blog-series.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  requireAuth(locals);

  const [posts, tags, series] = await Promise.all([
    getAllPosts(),
    getAllTags(),
    getAllSeries(),
  ]);

  // Fetch tags for each post
  const postsWithTags = await Promise.all(
    posts.map(async (post) => {
      const postTags = await getTagsForPost(post.id);
      return { ...post, tags: postTags };
    })
  );

  return {
    posts: postsWithTags,
    tags,
    series,
  };
}
