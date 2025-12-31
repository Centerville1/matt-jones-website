/**
 * Blog listing page server data loader
 */

import { getPublishedPosts, getFeaturedPosts, getPostsBySeries } from '$lib/db/queries/blog-posts.js';
import { getAllTags, getPostsByTag, getTagBySlug } from '$lib/db/queries/blog-tags.js';
import { getAllSeries, getSeriesBySlug } from '$lib/db/queries/blog-series.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const tagSlug = url.searchParams.get('tag');
	const seriesSlug = url.searchParams.get('series');

	// Load all tags and series for filters
	const [allTags, allSeries, featuredPosts] = await Promise.all([
		getAllTags(),
		getAllSeries(),
		getFeaturedPosts()
	]);

	/** @type {BlogPost[]} */
	let posts = [];
	/** @type {BlogTag | null} */
	let selectedTag = null;
	/** @type {BlogSeries | null} */
	let selectedSeries = null;

	// Filter posts based on query params
	if (tagSlug) {
		const [tag, tagPosts] = await Promise.all([
			getTagBySlug(tagSlug),
			getPostsByTag(tagSlug)
		]);
		selectedTag = tag || null;
		posts = tagPosts;
	} else if (seriesSlug) {
		const series = await getSeriesBySlug(seriesSlug);
		selectedSeries = series || null;
		if (selectedSeries) {
			posts = await getPostsBySeries(selectedSeries.id);
		}
	} else {
		posts = await getPublishedPosts();
	}

	return {
		posts,
		featuredPosts: tagSlug || seriesSlug ? [] : featuredPosts, // Only show featured posts on main page
		tags: allTags,
		series: allSeries,
		selectedTag,
		selectedSeries
	};
}
