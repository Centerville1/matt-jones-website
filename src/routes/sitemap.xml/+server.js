/**
 * Sitemap XML endpoint
 * Generates a sitemap for search engines to discover all pages
 */

/**
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ url }) {
  const baseUrl = url.origin;

  // Define all public pages on the site
  const pages = [
    { path: '', priority: 1.0, changefreq: 'weekly' }, // Landing page
    { path: 'home', priority: 0.9, changefreq: 'weekly' }, // Home page
    { path: 'home/projects', priority: 0.9, changefreq: 'monthly' }, // Projects page
    { path: 'home/about', priority: 0.7, changefreq: 'monthly' }, // About page
    { path: 'home/architecture', priority: 0.6, changefreq: 'monthly' }, // Architecture page
    { path: 'home/sphere', priority: 0.5, changefreq: 'yearly' }, // CSS Sphere demo
    { path: 'home/firesim', priority: 0.5, changefreq: 'yearly' }, // Fire simulation
    { path: 'home/artwork', priority: 0.6, changefreq: 'yearly' }, // CSS Artwork showcase
  ];

  const lastmod = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}
