/**
 * Database type definitions
 * These match the Drizzle schema definitions
 *
 * IMPORTANT: When adding new tables, always:
 * 1. Define the interface here
 * 2. Export it in src/lib/db/types.d.ts
 * 3. Add it to global scope in src/app.d.ts
 * 4. Add @typedef in the schema file for JSDoc compatibility
 */

/**
 * Category - Portfolio item categories (experiences, projects, other)
 * Note: Drizzle ORM with { mode: 'boolean' } converts SQLite integers (0/1) to booleans
 */
export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  order: number;
  hasTab: boolean; // Stored as 0/1 in SQLite, returned as boolean by Drizzle
  createdAt: Date;
  updatedAt: Date;
}

/**
 * PortfolioItem - Work experience, projects, and experiments
 * Note: Drizzle ORM with { mode: 'boolean' } converts SQLite integers (0/1) to booleans
 */
export interface PortfolioItem {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  url: string | null;
  image: string | null;
  highlight: boolean; // Stored as 0/1 in SQLite, returned as boolean by Drizzle
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Bio - Different length biography versions (short, mid, long)
 */
export interface Bio {
  id: number;
  type: 'short' | 'mid' | 'long';
  content: string;
  updatedAt: Date;
}

/**
 * Image - Uploaded images with metadata
 */
export interface Image {
  id: number;
  filename: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  alt: string | null;
  category: string | null; // portfolio, blog, general, or null
  uploadedAt: Date;
}

/**
 * SiteMetadata - Key-value store for site-wide settings
 */
export interface SiteMetadata {
  id: number;
  key: string;
  value: string;
  description: string | null;
  updatedAt: Date;
}

/**
 * BlogPost - Blog posts with rich text content
 */
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: any; // TipTap JSON format
  background: string; // blocks, zigzag, checker, crosses
  headerImageId: number | null;
  status: string; // draft or published
  publishedAt: Date | null;
  readTimeMinutes: number;
  authorName: string;
  canonicalUrl: string | null;
  seriesId: number | null;
  seriesOrder: number | null;
  featuredOrder: number | null;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * BlogSeries - Collections of related blog posts
 */
export interface BlogSeries {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * BlogTag - Tags for categorizing blog posts
 */
export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
}

/**
 * BlogPostTag - Many-to-many join table for posts and tags
 */
export interface BlogPostTag {
  postId: number;
  tagId: number;
}
