/**
 * Type definitions for admin interface
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
  highlight: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioItemWithCategory extends PortfolioItem {
  categorySlug: string | null;
  categoryName: string | null;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  order: number;
  hasTab: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  id: number;
  filename: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  alt: string | null;
  uploadedAt: Date;
}
