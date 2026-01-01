/**
 * Robots.txt endpoint
 * Tells search engine crawlers which pages to index
 */

/**
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ url }) {
  const baseUrl = url.origin;

  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Disallow admin pages from indexing
User-agent: *
Disallow: /admin/

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
