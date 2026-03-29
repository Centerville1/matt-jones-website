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
  headerImagePath?: string | null; // Joined from images table
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

/**
 * ContactSubmission - Contact form submissions from the footer
 */
export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string; // unread, read, archived
  notes: string | null;
  submittedAt: Date;
  readAt: Date | null;
}

/**
 * FileRecord - Uploaded files (PDFs, documents, etc.)
 */
export interface FileRecord {
  id: number;
  filename: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  category: string | null; // resume, cv, document, or null
  description: string | null;
  displayName: string | null;
  uploadedAt: Date;
}

/**
 * SpriteLayer - A single layer in a sprite composition
 */
export interface SpriteLayer {
  imageId: number; // Reference to images table
  offset: { x: number; y: number }; // Offset from sprite center in METERS
  width: number; // Render width in pixels
  height: number; // Render height in pixels
  rotation: number; // Rotation in radians (default: 0)
  zIndex: number; // Layer order (higher = on top)
}

/**
 * ColliderShape - A single collision shape (circle or rect)
 */
export interface ColliderShape {
  id: string; // Unique ID for this shape (for selection/editing)
  type: 'circle' | 'rect';
  // Circle properties
  radius?: number; // In meters
  // Rectangle properties
  width?: number; // In meters
  height?: number; // In meters
  localRotation?: number; // In radians, relative to object rotation
  // Shared properties
  offset: { x: number; y: number }; // Offset from sprite center in meters
}

/**
 * AnimationFrame - A single frame in an animation sequence
 */
export interface AnimationFrame {
  duration: number; // Frame duration in milliseconds
  layerOverrides: {
    [layerIndex: number]: {
      visible?: boolean;
      offset?: { x: number; y: number };
      rotation?: number;
    };
  };
}

/**
 * AnimationState - A named animation state (e.g., "idle", "warp", "damaged")
 */
export interface AnimationState {
  layerOverrides: {
    [layerIndex: number]: {
      visible?: boolean;
      offset?: { x: number; y: number };
      rotation?: number;
    };
  };
  frames?: AnimationFrame[]; // Optional frame sequence for animated states
}

/**
 * SpriteDefinition - Complete sprite definition with layers, collision, and animations
 */
export interface SpriteDefinition {
  id: string;
  name: string;
  objectType:
    | 'ship'
    | 'asteroid'
    | 'planet'
    | 'blackHole'
    | 'station'
    | 'waypoint'
    | 'debris'
    | 'projectile';
  layers: SpriteLayer[];
  collider: ColliderShape | ColliderShape[]; // Single shape or array (auto-composite if array)
  animationStates: { [stateName: string]: AnimationState } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WingPerson {
  id: number;
  name: string;
  createdAt: Date;
}

export interface WingRestaurant {
  id: number;
  name: string;
  notes: string | null;
  createdAt: Date;
}

export interface WingMenuItem {
  id: number;
  restaurantId: number;
  name: string;
  priceInCents: number | null;
  createdAt: Date;
}

export interface WingSession {
  id: number;
  restaurantId: number;
  restaurantName?: string | null;
  date: string;
  notes: string | null;
  createdAt: Date;
}

export interface WingSessionAttendee {
  id: number;
  sessionId: number;
  personId: number;
  createdAt: Date;
}

export interface WingOrderEntry {
  id: number;
  sessionId: number;
  personId: number;
  menuItemId: number;
  quantity: number;
  createdAt: Date;
}

export interface WingPersonWithOrders {
  personId: number;
  personName: string;
  items: Array<{
    entryId: number;
    menuItemId: number;
    menuItemName: string;
    priceInCents: number | null;
    quantity: number;
  }>;
}
