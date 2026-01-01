/**
 * RSS feed for blog posts
 * Allows readers to subscribe and follow new content
 */

import { getPublishedPosts } from '$lib/db/queries/blog-posts.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const baseUrl = url.origin;
	const posts = await getPublishedPosts();

	// Get the 20 most recent posts for the feed
	const recentPosts = posts.slice(0, 20);

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Matt Jones - Blog</title>
    <description>Thoughts, tutorials, and explorations in web development</description>
    <link>${baseUrl}/home/blog</link>
    <atom:link href="${baseUrl}/home/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${recentPosts
	.map(
		(post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.excerpt)}</description>
      <link>${baseUrl}/home/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/home/blog/${post.slug}</guid>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date(post.createdAt).toUTCString()}</pubDate>
      <author>${escapeXml(post.authorName || 'Matt Jones')}</author>${
			post.headerImagePath
				? `
      <enclosure url="${post.headerImagePath}" type="image/jpeg"/>`
				: ''
		}
    </item>`
	)
	.join('\n')}
  </channel>
</rss>`;

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600, must-revalidate'
		}
	});
}

/**
 * Escape XML special characters
 * @param {string} str
 * @returns {string}
 */
function escapeXml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
