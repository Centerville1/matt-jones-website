import { db } from '../index.js';
import { sprites } from '../schema/index.js';
import { eq } from 'drizzle-orm';

/**
 * @typedef {import('../schema/types').SpriteDefinition} SpriteDefinition
 */

/**
 * Get all sprite definitions
 * @returns {Promise<SpriteDefinition[]>}
 */
export async function getAllSprites() {
  const results = await db.select().from(sprites).all();

  // Parse JSON fields
  return /** @type {SpriteDefinition[]} */ (
    results.map((row) => ({
      ...row,
      layers: JSON.parse(row.layers),
      collider: JSON.parse(row.collider),
      animationStates: row.animationStates
        ? JSON.parse(row.animationStates)
        : null,
    }))
  );
}

/**
 * Get a single sprite by ID
 * @param {string} id - Sprite ID
 * @returns {Promise<SpriteDefinition | null>}
 */
export async function getSpriteById(id) {
  const result = await db
    .select()
    .from(sprites)
    .where(eq(sprites.id, id))
    .get();

  if (!result) return null;

  // Parse JSON fields
  return /** @type {SpriteDefinition} */ ({
    ...result,
    layers: JSON.parse(result.layers),
    collider: JSON.parse(result.collider),
    animationStates: result.animationStates
      ? JSON.parse(result.animationStates)
      : null,
  });
}

/**
 * Get sprites by object type
 * @param {'ship' | 'asteroid' | 'planet' | 'blackHole' | 'station' | 'waypoint' | 'debris' | 'projectile'} objectType
 * @returns {Promise<SpriteDefinition[]>}
 */
export async function getSpritesByType(objectType) {
  const results = await db
    .select()
    .from(sprites)
    .where(eq(sprites.objectType, objectType))
    .all();

  // Parse JSON fields
  return /** @type {SpriteDefinition[]} */ (
    results.map((row) => ({
      ...row,
      layers: JSON.parse(row.layers),
      collider: JSON.parse(row.collider),
      animationStates: row.animationStates
        ? JSON.parse(row.animationStates)
        : null,
    }))
  );
}

/**
 * Create a new sprite definition
 * @param {Omit<SpriteDefinition, 'createdAt' | 'updatedAt'>} sprite - Sprite data
 * @returns {Promise<SpriteDefinition>}
 */
export async function createSprite(sprite) {
  const now = new Date();

  await db.insert(sprites).values({
    id: sprite.id,
    name: sprite.name,
    objectType: sprite.objectType,
    layers: JSON.stringify(sprite.layers),
    collider: JSON.stringify(sprite.collider),
    animationStates: sprite.animationStates
      ? JSON.stringify(sprite.animationStates)
      : null,
    createdAt: now,
    updatedAt: now,
  });

  return /** @type {SpriteDefinition} */ ({
    ...sprite,
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * Update an existing sprite definition
 * @param {string} id - Sprite ID
 * @param {Partial<Omit<SpriteDefinition, 'id' | 'createdAt' | 'updatedAt'>>} updates - Fields to update
 * @returns {Promise<SpriteDefinition | null>}
 */
export async function updateSprite(id, updates) {
  const now = new Date();

  const updateData = {
    ...(updates.name && { name: updates.name }),
    ...(updates.objectType && { objectType: updates.objectType }),
    ...(updates.layers && { layers: JSON.stringify(updates.layers) }),
    ...(updates.collider && { collider: JSON.stringify(updates.collider) }),
    ...(updates.animationStates !== undefined && {
      animationStates: updates.animationStates
        ? JSON.stringify(updates.animationStates)
        : null,
    }),
    updatedAt: now,
  };

  await db.update(sprites).set(updateData).where(eq(sprites.id, id));

  return getSpriteById(id);
}

/**
 * Delete a sprite definition
 * @param {string} id - Sprite ID
 * @returns {Promise<void>}
 */
export async function deleteSprite(id) {
  await db.delete(sprites).where(eq(sprites.id, id));
}
