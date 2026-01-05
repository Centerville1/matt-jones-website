/**
 * Type definitions for 2D Space Game Physics Engine
 *
 * All calculations use real-world SI units:
 * - Position: meters (m)
 * - Velocity: meters per second (m/s)
 * - Acceleration: meters per second squared (m/s²)
 * - Force: Newtons (N)
 * - Mass: kilograms (kg)
 * - Time: seconds (s)
 * - Density: kilograms per cubic meter (kg/m³)
 * - Area: square meters (m²)
 */

/**
 * 2D Vector representing position, velocity, acceleration, or force
 */
export interface Vector2 {
  x: number;
  y: number;
}

/**
 * Complete physics state of an object
 */
export interface PhysicsState {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  mass: number;
  /** Rotation angle in radians (0 = pointing right/east, increases counter-clockwise) */
  angle: number;
  /** Angular velocity in radians per second */
  angularVelocity: number;
}

/**
 * Transform (position + rotation) for non-physics objects
 */
export interface Transform {
  position: Vector2;
  /** Rotation angle in radians (0 = pointing right/east, increases counter-clockwise) */
  angle: number;
}

/**
 * Physical properties of a game object
 */
export interface PhysicalObject {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  mass: number;
  crossSectionalArea: number;
  dragCoefficient: number;
}

/**
 * Gravity source (planet, black hole, etc.)
 */
export interface GravitySource {
  position: Vector2;
  mass: number;
  influenceRadius: number;
}

/**
 * Sprite image data for rendering
 */
export interface SpriteImage {
  /** Path to image file or HTMLImageElement */
  src: string | HTMLImageElement;
  /** Width in pixels (for rendering, not physics) */
  width: number;
  /** Height in pixels (for rendering, not physics) */
  height: number;
  /** Offset from object center for rendering (default: centered) */
  offset?: Vector2;
}

/**
 * Multi-part sprite for composite objects (e.g., modular ships)
 */
export interface CompositeSpriteImage {
  /** Array of sprite parts (e.g., hull, engines, weapons) */
  parts: SpriteImage[];
  /** How parts are arranged/layered */
  layout?: 'layered' | 'connected';
}

/**
 * Cargo/inventory item
 */
export interface CargoItem {
  /** Item type identifier (e.g., 'ore', 'fuel', 'parts') */
  type: string;
  /** Quantity */
  amount: number;
  /** Mass per unit in kg */
  unitMass: number;
  /** Optional item-specific data */
  metadata?: Record<string, unknown>;
}

/**
 * Circular collision shape
 */
export interface CircleCollider {
  type: 'circle';
  /** Radius in meters */
  radius: number;
  /** Offset from object center in local space (before rotation) */
  offset?: Vector2;
}

/**
 * Rectangular collision shape (axis-aligned in local space, rotates with object)
 */
export interface RectCollider {
  type: 'rect';
  /** Width in meters (along local x-axis) */
  width: number;
  /** Height in meters (along local y-axis) */
  height: number;
  /** Offset from object center in local space (before rotation) */
  offset?: Vector2;
  /** Local rotation in radians relative to object's angle (default: 0) */
  localRotation?: number;
}

/**
 * Composite collision shape made of multiple primitives
 */
export interface CompositeCollider {
  type: 'composite';
  /** Array of collision shapes */
  shapes: (CircleCollider | RectCollider)[];
}

/**
 * Union type for all collision shapes
 */
export type Collider = CircleCollider | RectCollider | CompositeCollider;

/**
 * Axis-Aligned Bounding Box (AABB) for broad-phase collision detection
 * Always axis-aligned in world space (not rotated)
 */
export interface AABB {
  /** Minimum x coordinate */
  minX: number;
  /** Minimum y coordinate */
  minY: number;
  /** Maximum x coordinate */
  maxX: number;
  /** Maximum y coordinate */
  maxY: number;
}

/**
 * Result of a collision detection check between two objects
 */
export interface CollisionResult {
  /** Did a collision occur? */
  collided: boolean;
  /** Point of collision in world space (if collided) */
  point?: Vector2;
  /** Collision normal (direction to push objects apart, pointing from object A to B) */
  normal?: Vector2;
  /** Penetration depth in meters (how far objects overlap) */
  penetration?: number;
  /** Time of impact for continuous collision (0-1, where 0 = start of frame, 1 = end) */
  timeOfImpact?: number;
}

/**
 * Complete collision check result for a single object
 * Returns ONLY the earliest/first collision encountered
 */
export interface CollisionCheckResult {
  /** Did a collision occur? */
  hasCollision: boolean;
  /** The object that was collided with (null if no collision) */
  collidedWith: GameObject | null;
  /** Collision details for the earliest collision */
  collision: CollisionResult | null;
  /** Resolved position where object should be placed (accounts for penetration) */
  resolvedPosition: Vector2;
  /** Resolved velocity after collision response */
  resolvedVelocity: Vector2;
  /** Full resolved physics state after collision */
  resolvedPhysics: PhysicsState;
}

/**
 * Object type categories
 */
export type GameObjectType =
  | 'ship'
  | 'asteroid'
  | 'planet'
  | 'blackHole'
  | 'station'
  | 'waypoint'
  | 'debris'
  | 'projectile';

/**
 * Base game object - everything that exists in the game world
 */
export interface GameObject {
  /** Unique identifier */
  id: string;
  /** Object type */
  type: GameObjectType;
  /** Display name */
  name: string;
  /** Description (for UI/tooltips) */
  description?: string;
  /** Sprite data (single or composite) */
  sprite: SpriteImage | CompositeSpriteImage;
  /** Physics state (null for static non-physics objects) */
  physics: PhysicsState | null;
  /** Transform for static objects (null if using physics) */
  transform: Transform | null;
  /** Collision shape (null for non-collidable decorative objects) */
  collider: Collider | null;
  /** Cargo inventory (null if object can't carry cargo) */
  cargo?: CargoItem[];
  /** Maximum cargo capacity in kg (null if no limit) */
  maxCargoMass?: number;
  /** Is this object currently alive/active? */
  active: boolean;
  /** Custom properties for specific object types */
  properties?: Record<string, unknown>;
}

/**
 * Player-controlled or AI-controlled ship
 */
export interface Ship extends GameObject {
  type: 'ship';
  physics: PhysicsState; // Ships always have physics
  /** Current fuel in kg */
  fuel: number;
  /** Maximum fuel capacity in kg */
  maxFuel: number;
  /** Engine thrust force in Newtons */
  engineThrust: number;
  /** Turning force (angular acceleration) in rad/s² */
  turningForce: number;
  /** Cross-sectional area for drag calculations in m² */
  crossSectionalArea: number;
  /** Drag coefficient (dimensionless) */
  dragCoefficient: number;
  /** Ship variant/model (e.g., 'orange', 'cruiser', 'shuttle') */
  variant?: string;
  /** Is engine currently firing? */
  engineOn: boolean;
  /** Is warp drive active? */
  warpDrive: boolean;
}

/**
 * Asteroid obstacle/mining target
 */
export interface Asteroid extends GameObject {
  type: 'asteroid';
  physics: PhysicsState | null; // Can be static or drifting
  /** Resource type this asteroid contains */
  resourceType?: string;
  /** Amount of resources remaining */
  resourceAmount?: number;
}

/**
 * Planet with gravity and landable surface
 */
export interface Planet extends GameObject {
  type: 'planet';
  physics: PhysicsState | null; // Usually static, but could orbit
  /** Gravity well properties */
  gravity: GravitySource;
  /** Can ships land on this planet? */
  landable: boolean;
  /** Atmosphere density at surface (kg/m³) */
  atmosphereDensity?: number;
}

/**
 * Black hole with extreme gravity
 */
export interface BlackHole extends GameObject {
  type: 'blackHole';
  physics: PhysicsState | null; // Usually static
  /** Gravity well properties */
  gravity: GravitySource;
  /** Radius at which objects are destroyed (event horizon) */
  destructionRadius: number;
}

/**
 * Space station for docking, trading, refueling
 */
export interface Station extends GameObject {
  type: 'station';
  physics: PhysicsState | null; // Usually static, could orbit
  /** Station subtype (e.g., 'shipyard', 'trading post', 'home base') */
  stationType: 'shipyard' | 'homeBase' | 'supplyDepot' | 'generic';
  /** Can ships dock here? */
  dockable: boolean;
  /** Services available (refuel, repair, trade, etc.) */
  services?: string[];
}

/**
 * Navigation waypoint marker
 */
export interface Waypoint extends GameObject {
  type: 'waypoint';
  physics: null; // Waypoints are always static markers
  /** Color for rendering waypoint */
  color?: string;
  /** Who created this waypoint (player ID) */
  ownerId?: string;
}
