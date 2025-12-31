// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type {
  Category,
  PortfolioItem,
  Bio,
  Image,
  SiteMetadata,
  BlogPost,
  BlogSeries,
  BlogTag,
  BlogPostTag,
} from '$lib/db/types';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: { authenticated: boolean } | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  // Make database types globally available
  // These can be used in any file without importing
  type Category = import('$lib/db/types').Category;
  type PortfolioItem = import('$lib/db/types').PortfolioItem;
  type Bio = import('$lib/db/types').Bio;
  type Image = import('$lib/db/types').Image;
  type SiteMetadata = import('$lib/db/types').SiteMetadata;
  type BlogPost = import('$lib/db/types').BlogPost;
  type BlogSeries = import('$lib/db/types').BlogSeries;
  type BlogTag = import('$lib/db/types').BlogTag;
  type BlogPostTag = import('$lib/db/types').BlogPostTag;
}

export {};
