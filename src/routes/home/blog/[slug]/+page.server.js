/**
 * Individual blog post page server data loader
 */

import { error } from '@sveltejs/kit';
import { getPostBySlug, incrementViewCount, getPostsBySeries } from '$lib/db/queries/blog-posts.js';
import { getTagsForPost } from '$lib/db/queries/blog-tags.js';
import { getSeriesById } from '$lib/db/queries/blog-series.js';
import { renderTiptapJSON } from '$lib/utils/tiptap-renderer.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies }) {
	const post = await getPostBySlug(params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	// Only show published posts to the public
	if (post.status !== 'published') {
		throw error(404, 'Post not found');
	}

	// Check if this browser has already viewed this post
	const viewedCookieName = `viewed_post_${post.id}`;
	const hasViewed = cookies.get(viewedCookieName);

	// Only increment view count for unique browsers
	if (!hasViewed) {
		// Increment view count (fire and forget)
		incrementViewCount(post.id).catch(() => {
			// Ignore errors
		});

		// Set cookie to mark this post as viewed (expires in 24 hours)
		cookies.set(viewedCookieName, 'true', {
			path: '/',
			maxAge: 60 * 60 * 24, // 24 hours in seconds
			httpOnly: true,
			sameSite: 'lax'
		});
	}

	// Load related data and render content with syntax highlighting
	const [tags, series, seriesPosts, renderedContent] = await Promise.all([
		getTagsForPost(post.id),
		post.seriesId ? getSeriesById(post.seriesId) : Promise.resolve(null),
		post.seriesId ? getPostsBySeries(post.seriesId) : Promise.resolve([]),
		renderTiptapJSON(post.content, true) // Enable syntax highlighting
	]);

	return {
		post,
		tags,
		series,
		seriesPosts,
		renderedContent
	};
}
