/**
 * Migration script to import JSON data into Turso database
 * Run with: node scripts/migrate-json-to-db.js
 *
 * Make sure you have TURSO_DATABASE_URL and TURSO_AUTH_TOKEN set in your .env file
 */

import 'dotenv/config';
import { db } from '../src/lib/db/index.js';
import {
  categories,
  portfolioItems,
  bios,
  siteMetadata,
} from '../src/lib/db/schema/index.js';
import experiencesData from '../src/routes/home/projects/experiences.json' with { type: 'json' };
import biosData from '../src/routes/home/bios.json' with { type: 'json' };

async function main() {
  const now = new Date();

  console.log('🚀 Starting data migration...\n');

  // 1. Migrate categories
  console.log('📁 Creating categories...');
  const categoryMapping = {};

  const categoriesToCreate = [
    {
      slug: 'experiences',
      name: 'My Experience',
      description: 'Work experience, leadership roles, and teaching positions',
      order: 1,
      hasTab: true,
    },
    {
      slug: 'projects',
      name: 'Projects',
      description: 'Personal and academic web development projects',
      order: 0,
      hasTab: true,
    },
    {
      slug: 'other',
      name: 'Creations',
      description: 'Web experiments, CSS art, and interactive demos',
      order: 2,
      hasTab: true,
    },
  ];

  for (const cat of categoriesToCreate) {
    const result = await db
      .insert(categories)
      .values({
        ...cat,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: categories.id })
      .get();

    categoryMapping[cat.slug] = result.id;
    console.log(`  ✓ Created category: ${cat.name} (id: ${result.id})`);
  }

  // 2. Migrate portfolio items
  console.log('\n💼 Migrating portfolio items...');

  let totalItems = 0;

  // Migrate experiences
  for (const [index, item] of experiencesData.experiences.entries()) {
    await db
      .insert(portfolioItems)
      .values({
        categoryId: categoryMapping.experiences,
        title: item.title,
        description: item.description,
        startDate: item.startDate || null,
        endDate: item.endDate || null,
        url: item.url || null,
        image: item.image || null,
        highlight: item.highlight || false,
        displayOrder: index,
        createdAt: now,
        updatedAt: now,
      })
      .run();
    totalItems++;
  }
  console.log(`  ✓ Migrated ${experiencesData.experiences.length} experiences`);

  // Migrate projects
  for (const [index, item] of experiencesData.projects.entries()) {
    await db
      .insert(portfolioItems)
      .values({
        categoryId: categoryMapping.projects,
        title: item.title,
        description: item.description,
        startDate: item.startDate || null,
        endDate: item.endDate || null,
        url: item.url || null,
        image: item.image || null,
        highlight: false,
        displayOrder: index,
        createdAt: now,
        updatedAt: now,
      })
      .run();
    totalItems++;
  }
  console.log(`  ✓ Migrated ${experiencesData.projects.length} projects`);

  // Migrate other/experiments
  for (const [index, item] of experiencesData.other.entries()) {
    await db
      .insert(portfolioItems)
      .values({
        categoryId: categoryMapping.other,
        title: item.title,
        description: item.description,
        startDate: item.startDate || null,
        endDate: item.endDate || null,
        url: item.url || null,
        image: item.image || null,
        highlight: item.highlight || false,
        displayOrder: index,
        createdAt: now,
        updatedAt: now,
      })
      .run();
    totalItems++;
  }
  console.log(
    `  ✓ Migrated ${experiencesData.other.length} experiments/creations`,
  );

  // 3. Migrate bios
  console.log('\n📝 Migrating bios...');

  const bioTypes = ['short', 'mid', 'long'];
  for (const type of bioTypes) {
    const bioContent = biosData[type]?.default?.join('\n') || '';

    await db
      .insert(bios)
      .values({
        type,
        content: bioContent,
        updatedAt: now,
      })
      .run();

    console.log(`  ✓ Migrated ${type} bio (${bioContent.length} chars)`);
  }

  // 4. Add initial site metadata
  console.log('\n⚙️  Creating site metadata...');

  const metadataEntries = [
    {
      key: 'site_title',
      value: 'Matt Jones - Portfolio',
      description: 'Main site title shown in browser tab',
    },
    {
      key: 'site_description',
      value:
        'Personal portfolio website showcasing web development projects and experience',
      description: 'SEO meta description',
    },
    {
      key: 'owner_name',
      value: 'Matt Jones',
      description: 'Site owner name',
    },
    {
      key: 'owner_email',
      value: 'matt.jones3054@gmail.com',
      description: 'Contact email',
    },
  ];

  for (const meta of metadataEntries) {
    await db
      .insert(siteMetadata)
      .values({
        ...meta,
        updatedAt: now,
      })
      .run();

    console.log(`  ✓ Created metadata: ${meta.key}`);
  }

  console.log('\n✨ Migration complete!');
  console.log(`\nSummary:`);
  console.log(`  • ${Object.keys(categoryMapping).length} categories`);
  console.log(`  • ${totalItems} portfolio items`);
  console.log(`  • ${bioTypes.length} bios`);
  console.log(`  • ${metadataEntries.length} metadata entries`);
}

main().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
