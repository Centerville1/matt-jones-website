/**
 * Global database type definitions
 *
 * These types are automatically available throughout the application.
 * Import from '$lib/db/types' or use globally without imports.
 */

// Re-export all database types from schema type definitions
export type {
  Category,
  PortfolioItem,
  Bio,
  Image,
  SiteMetadata,
  BlogPost,
  BlogSeries,
  BlogTag,
  BlogPostTag,
  ContactSubmission,
  FileRecord,
} from './schema/types';
