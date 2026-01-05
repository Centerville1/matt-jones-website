import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * @typedef {import('./types').SpriteDefinition} SpriteDefinition
 * @typedef {import('./types').SpriteLayer} SpriteLayer
 * @typedef {import('./types').ColliderShape} ColliderShape
 * @typedef {import('./types').AnimationState} AnimationState
 */

/**
 * Sprite definitions for game objects
 * Stores layered images, collision boxes, and animation states
 */
export const sprites = sqliteTable('sprites', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  objectType: text('object_type').notNull(), // 'ship', 'asteroid', 'planet', etc.

  // JSON field: Array of SpriteLayer
  // Each layer: { imageId, offset, width, height, rotation, zIndex }
  layers: text('layers').notNull(),

  // JSON field: ColliderShape | ColliderShape[]
  // Single shape or array (auto-composite if array has multiple items)
  collider: text('collider').notNull(),

  // JSON field: { [stateName: string]: AnimationState } | null
  // Animation states like "idle", "warp", "damaged"
  animationStates: text('animation_states'),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
