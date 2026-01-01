/**
 * Sitemap XML endpoint
 * Generates a sitemap for search engines to discover all pages
 * Includes all published blog posts with images
 */

import { getPublishedPosts } from '$lib/db/queries/blog-posts.js';

/**
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ url }) {
  const baseUrl = url.origin;

  // Define all public pages on the site
  const pages = [
    { path: '', priority: 1.0, changefreq: 'weekly' }, // Landing page
    { path: 'home', priority: 0.9, changefreq: 'weekly' }, // Home page
    { path: 'home/blog', priority: 0.9, changefreq: 'daily' }, // Blog listing
    { path: 'home/projects', priority: 0.9, changefreq: 'monthly' }, // Projects page
    { path: 'home/about', priority: 0.7, changefreq: 'monthly' }, // About page
    { path: 'home/architecture', priority: 0.6, changefreq: 'monthly' }, // Architecture page
    { path: 'home/sphere', priority: 0.5, changefreq: 'yearly' }, // CSS Sphere demo
    { path: 'home/firesim', priority: 0.5, changefreq: 'yearly' }, // Fire simulation
    { path: 'home/artwork', priority: 0.6, changefreq: 'yearly' }, // CSS Artwork showcase
  ];

  // Get all published blog posts
  const posts = await getPublishedPosts();

  const lastmod = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}/${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
${posts
  .map((post) => {
    const postLastmod = post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : lastmod;
    return `  <url>
    <loc>${baseUrl}/home/blog/${post.slug}</loc>
    <lastmod>${postLastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${
      post.headerImagePath
        ? `
    <image:image>
      <image:loc>${post.headerImagePath}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
    </image:image>`
        : ''
    }
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
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
