import { getSiteMetadata } from '$lib/db/queries/metadata.js';

/**
 * Load site metadata for all pages
 * This runs on the server and provides data to all routes
 */
export async function load() {
  const metadata = await getSiteMetadata();

  return {
    siteMetadata: metadata,
  };
}
