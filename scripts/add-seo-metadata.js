/**
 * Add additional SEO-related metadata to the database
 */

import 'dotenv/config';
import { db } from '../src/lib/db/index.js';
import { siteMetadata } from '../src/lib/db/schema/index.js';

const now = new Date();

const newMetadataEntries = [
  {
    key: 'site_url',
    value: 'https://matt-jones-portfolio.vercel.app',
    description: 'Primary site URL',
  },
  {
    key: 'social_preview_image',
    value: '/logo.png',
    description: 'Default Open Graph/Twitter Card image',
  },
  {
    key: 'github_url',
    value: 'https://github.com/Centerville1',
    description: 'GitHub profile URL',
  },
  {
    key: 'linkedin_url',
    value: 'https://www.linkedin.com/in/matt-jones-a7b389292/',
    description: 'LinkedIn profile URL',
  },
];

console.log('🔧 Adding SEO metadata to database...\n');

for (const meta of newMetadataEntries) {
  try {
    await db
      .insert(siteMetadata)
      .values({
        key: meta.key,
        value: meta.value,
        description: meta.description,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: siteMetadata.key,
        set: {
          value: meta.value,
          description: meta.description,
          updatedAt: now,
        },
      })
      .run();
    console.log(`  ✓ ${meta.key}: ${meta.value}`);
  } catch (error) {
    console.error(`  ✗ Failed to add ${meta.key}:`, error.message);
  }
}

console.log('\n✅ Metadata update complete!');
