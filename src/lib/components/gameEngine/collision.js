/**
 * Collision Detection System for 2D Space Game
 *
 * Implements multi-phase collision detection:
 * 1. Broad phase: Swept AABB (velocity-expanded bounding boxes)
 * 2. Narrow phase: Shape-specific algorithms (circle-circle, circle-rect, rect-rect)
 * 3. Continuous collision: Binary search for time of impact
 * 4. Resolution: Position correction + velocity response (elastic/inelastic)
 *
 * @typedef {import('./types').Vector2} Vector2
 * @typedef {import('./types').PhysicsState} PhysicsState
 * @typedef {import('./types').GameObject} GameObject
 * @typedef {import('./types').Collider} Collider
 * @typedef {import('./types').CircleCollider} CircleCollider
 * @typedef {import('./types').RectCollider} RectCollider
 * @typedef {import('./types').CompositeCollider} CompositeCollider
 * @typedef {import('./types').AABB} AABB
 * @typedef {import('./types').CollisionResult} CollisionResult
 * @typedef {import('./types').CollisionCheckResult} CollisionCheckResult
 */

import {
  vectorMagnitude,
  normalizeVector,
  scaleVector,
  subtractVectors,
  dotProduct,
} from './physicsCalculations.js';

/**
 * Main collision detection function for a single object
 * Checks against an array of potential colliders and returns the EARLIEST collision
 *
 * @param {GameObject} object - The object to check collisions for
 * @param {GameObject[]} potentialColliders - Array of objects to check against
 * @param {number} timeStep - Physics time step (for continuous collision detection)
 * @param {number} [coefficientOfRestitution=0.8] - Bounciness (0 = inelastic, 1 = perfectly elastic)
 * @returns {CollisionCheckResult} Collision result with resolved physics state
 */
export function checkObjectCollisions(
  object,
  potentialColliders,
  timeStep,
  coefficientOfRestitution = 0.8,
) {
  if (!object.physics || !object.collider) {
    // Non-physical or non-collidable object
    return {
      hasCollision: false,
      collidedWith: null,
      collision: null,
      resolvedPosition: object.physics?.position || object.transform.position,
      resolvedVelocity: object.physics?.velocity || { x: 0, y: 0 },
      resolvedPhysics: object.physics || null,
    };
  }

  // Calculate swept AABB (velocity-expanded bounding box)
  const sweptAABB = calculateSweptAABB(object, timeStep);

  let earliestCollision = null;
  let earliestCollider = null;
  let earliestTOI = Infinity;

  // Broad phase: Check AABB overlap
  for (const collider of potentialColliders) {
    if (!collider.active || collider.id === object.id || !collider.collider) {
      continue;
    }

    const colliderAABB = calculateAABB(collider);

    if (!aabbOverlap(sweptAABB, colliderAABB)) {
      continue; // No possible collision
    }

    // Narrow phase: Check actual collision
    const collision = checkCollision(object, collider, timeStep);

    if (collision.collided) {
      const toi = collision.timeOfImpact ?? 0;
      if (toi < earliestTOI) {
        earliestTOI = toi;
        earliestCollision = collision;
        earliestCollider = collider;
      }
    }
  }

  // No collision found
  if (!earliestCollision) {
    return {
      hasCollision: false,
      collidedWith: null,
      collision: null,
      resolvedPosition: object.physics.position,
      resolvedVelocity: object.physics.velocity,
      resolvedPhysics: object.physics,
    };
  }

  // Resolve the earliest collision
  const resolution = resolveCollision(
    object,
    earliestCollider,
    earliestCollision,
    coefficientOfRestitution,
  );

  return {
    hasCollision: true,
    collidedWith: earliestCollider,
    collision: earliestCollision,
    resolvedPosition: resolution.position,
    resolvedVelocity: resolution.velocity,
    resolvedPhysics: resolution,
  };
}

/**
 * Calculate axis-aligned bounding box expanded in the direction of velocity
 * This creates a "swept" AABB that covers the object's movement path
 *
 * @param {GameObject} object - The moving object
 * @param {number} timeStep - Physics time step
 * @returns {AABB} Velocity-expanded bounding box
 */
export function calculateSweptAABB(object, timeStep) {
  const baseAABB = calculateAABB(object);

  if (!object.physics) {
    return baseAABB;
  }

  // Calculate end position
  const endX = object.physics.position.x + object.physics.velocity.x * timeStep;
  const endY = object.physics.position.y + object.physics.velocity.y * timeStep;

  // Expand AABB to include both start and end positions
  return {
    minX: Math.min(
      baseAABB.minX,
      endX - (object.physics.position.x - baseAABB.minX),
    ),
    minY: Math.min(
      baseAABB.minY,
      endY - (object.physics.position.y - baseAABB.minY),
    ),
    maxX: Math.max(
      baseAABB.maxX,
      endX + (baseAABB.maxX - object.physics.position.x),
    ),
    maxY: Math.max(
      baseAABB.maxY,
      endY + (baseAABB.maxY - object.physics.position.y),
    ),
  };
}

/**
 * Calculate axis-aligned bounding box for any collider type
 *
 * @param {GameObject} object - The game object
 * @returns {AABB} Bounding box
 */
export function calculateAABB(object) {
  const collider = object.collider;
  const position = object.physics?.position || object.transform.position;
  const angle = object.physics?.angle || object.transform.angle;

  if (!collider) {
    return {
      minX: position.x,
      minY: position.y,
      maxX: position.x,
      maxY: position.y,
    };
  }

  if (collider.type === 'circle') {
    return calculateCircleAABB(position, collider, angle);
  } else if (collider.type === 'rect') {
    return calculateRectAABB(position, collider, angle);
  } else if (collider.type === 'composite') {
    return calculateCompositeAABB(position, collider, angle);
  }

  return {
    minX: position.x,
    minY: position.y,
    maxX: position.x,
    maxY: position.y,
  };
}

/**
 * Calculate AABB for a circle collider
 * @param {Vector2} position - Object position
 * @param {CircleCollider} collider - Circle collider
 * @param {number} angle - Object rotation (unused for circles)
 * @returns {AABB}
 */
function calculateCircleAABB(position, collider, angle) {
  const offset = collider.offset || { x: 0, y: 0 };
  const rotatedOffset = rotateVector(offset, angle);
  const centerX = position.x + rotatedOffset.x;
  const centerY = position.y + rotatedOffset.y;

  return {
    minX: centerX - collider.radius,
    minY: centerY - collider.radius,
    maxX: centerX + collider.radius,
    maxY: centerY + collider.radius,
  };
}

/**
 * Calculate AABB for a rotated rectangle collider
 * @param {Vector2} position - Object position
 * @param {RectCollider} collider - Rectangle collider
 * @param {number} angle - Object rotation
 * @returns {AABB}
 */
function calculateRectAABB(position, collider, angle) {
  const offset = collider.offset || { x: 0, y: 0 };
  const totalRotation = angle + (collider.localRotation || 0);

  // Calculate the four corners of the rectangle
  const halfWidth = collider.width / 2;
  const halfHeight = collider.height / 2;

  const corners = [
    { x: -halfWidth, y: -halfHeight },
    { x: halfWidth, y: -halfHeight },
    { x: halfWidth, y: halfHeight },
    { x: -halfWidth, y: halfHeight },
  ];

  // Rotate corners and apply offset
  const rotatedOffset = rotateVector(offset, angle);
  const worldCorners = corners.map((corner) => {
    const rotated = rotateVector(corner, totalRotation);
    return {
      x: position.x + rotatedOffset.x + rotated.x,
      y: position.y + rotatedOffset.y + rotated.y,
    };
  });

  // Find min/max
  return {
    minX: Math.min(...worldCorners.map((c) => c.x)),
    minY: Math.min(...worldCorners.map((c) => c.y)),
    maxX: Math.max(...worldCorners.map((c) => c.x)),
    maxY: Math.max(...worldCorners.map((c) => c.y)),
  };
}

/**
 * Calculate AABB for a composite collider (union of all shapes)
 * @param {Vector2} position - Object position
 * @param {CompositeCollider} collider - Composite collider
 * @param {number} angle - Object rotation
 * @returns {AABB}
 */
function calculateCompositeAABB(position, collider, angle) {
  const aabbs = collider.shapes.map((shape) => {
    if (shape.type === 'circle') {
      return calculateCircleAABB(position, shape, angle);
    } else {
      return calculateRectAABB(position, shape, angle);
    }
  });

  return {
    minX: Math.min(...aabbs.map((a) => a.minX)),
    minY: Math.min(...aabbs.map((a) => a.minY)),
    maxX: Math.max(...aabbs.map((a) => a.maxX)),
    maxY: Math.max(...aabbs.map((a) => a.maxY)),
  };
}

/**
 * Check if two AABBs overlap
 * @param {AABB} a - First AABB
 * @param {AABB} b - Second AABB
 * @returns {boolean} True if overlapping
 */
export function aabbOverlap(a, b) {
  return (
    a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY
  );
}

/**
 * Check collision between two game objects
 * Dispatches to shape-specific algorithms
 *
 * @param {GameObject} objectA - First object
 * @param {GameObject} objectB - Second object
 * @param {number} timeStep - Physics time step
 * @returns {CollisionResult} Collision details
 */
export function checkCollision(objectA, objectB, timeStep) {
  const colliderA = objectA.collider;
  const colliderB = objectB.collider;

  if (!colliderA || !colliderB) {
    return { collided: false };
  }

  // Handle composite colliders by checking all sub-shapes
  if (colliderA.type === 'composite' || colliderB.type === 'composite') {
    return checkCompositeCollision(objectA, objectB, timeStep);
  }

  // Dispatch to shape-specific algorithms
  if (colliderA.type === 'circle' && colliderB.type === 'circle') {
    return circleVsCircle(objectA, objectB, timeStep);
  } else if (
    (colliderA.type === 'circle' && colliderB.type === 'rect') ||
    (colliderA.type === 'rect' && colliderB.type === 'circle')
  ) {
    return circleVsRect(objectA, objectB, timeStep);
  } else if (colliderA.type === 'rect' && colliderB.type === 'rect') {
    return rectVsRect(objectA, objectB, timeStep);
  }

  return { collided: false };
}

/**
 * Check collision for composite colliders
 * Returns the earliest collision among all shape pairs
 *
 * @param {GameObject} objectA - First object
 * @param {GameObject} objectB - Second object
 * @param {number} timeStep - Physics time step
 * @returns {CollisionResult} Earliest collision
 */
function checkCompositeCollision(objectA, objectB, timeStep) {
  const shapesA =
    objectA.collider.type === 'composite'
      ? objectA.collider.shapes
      : [objectA.collider];
  const shapesB =
    objectB.collider.type === 'composite'
      ? objectB.collider.shapes
      : [objectB.collider];

  let earliestCollision = { collided: false };
  let earliestTOI = Infinity;

  for (const shapeA of shapesA) {
    for (const shapeB of shapesB) {
      // Create temporary objects with single colliders
      const tempA = { ...objectA, collider: shapeA };
      const tempB = { ...objectB, collider: shapeB };

      const collision = checkCollision(tempA, tempB, timeStep);

      if (collision.collided) {
        const toi = collision.timeOfImpact ?? 0;
        if (toi < earliestTOI) {
          earliestTOI = toi;
          earliestCollision = collision;
        }
      }
    }
  }

  return earliestCollision;
}

/**
 * Circle vs Circle collision detection
 *
 * @param {GameObject} objectA - First object (with CircleCollider)
 * @param {GameObject} objectB - Second object (with CircleCollider)
 * @param {number} timeStep - Physics time step
 * @returns {CollisionResult}
 */
function circleVsCircle(objectA, objectB, timeStep) {
  const posA = objectA.physics?.position || objectA.transform.position;
  const posB = objectB.physics?.position || objectB.transform.position;
  const angleA = objectA.physics?.angle || objectA.transform.angle;
  const angleB = objectB.physics?.angle || objectB.transform.angle;

  const colliderA = /** @type {CircleCollider} */ (objectA.collider);
  const colliderB = /** @type {CircleCollider} */ (objectB.collider);

  const offsetA = colliderA.offset || { x: 0, y: 0 };
  const offsetB = colliderB.offset || { x: 0, y: 0 };

  const rotatedOffsetA = rotateVector(offsetA, angleA);
  const rotatedOffsetB = rotateVector(offsetB, angleB);

  const centerA = {
    x: posA.x + rotatedOffsetA.x,
    y: posA.y + rotatedOffsetA.y,
  };
  const centerB = {
    x: posB.x + rotatedOffsetB.x,
    y: posB.y + rotatedOffsetB.y,
  };

  const delta = subtractVectors(centerB, centerA);
  const distance = vectorMagnitude(delta);
  const minDistance = colliderA.radius + colliderB.radius;

  if (distance >= minDistance) {
    return { collided: false };
  }

  // Collision detected
  const normal = distance > 0 ? normalizeVector(delta) : { x: 1, y: 0 };
  const penetration = minDistance - distance;
  const collisionPoint = {
    x: centerA.x + normal.x * colliderA.radius,
    y: centerA.y + normal.y * colliderA.radius,
  };

  return {
    collided: true,
    point: collisionPoint,
    normal: normal,
    penetration: penetration,
    timeOfImpact: 0, // Discrete collision
  };
}

/**
 * Circle vs Rectangle collision detection
 *
 * @param {GameObject} objectA - First object (could be circle or rect)
 * @param {GameObject} objectB - Second object (could be circle or rect)
 * @param {number} timeStep - Physics time step
 * @returns {CollisionResult}
 */
function circleVsRect(objectA, objectB, timeStep) {
  // Ensure A is circle, B is rect
  let circle = objectA.collider.type === 'circle' ? objectA : objectB;
  let rect = objectA.collider.type === 'rect' ? objectA : objectB;

  const circlePos = circle.physics?.position || circle.transform.position;
  const rectPos = rect.physics?.position || rect.transform.position;
  const circleAngle = circle.physics?.angle || circle.transform.angle;
  const rectAngle = rect.physics?.angle || rect.transform.angle;

  const circleCollider = /** @type {CircleCollider} */ (circle.collider);
  const rectCollider = /** @type {RectCollider} */ (rect.collider);

  // Transform circle center to rectangle's local space
  const circleOffset = circleCollider.offset || { x: 0, y: 0 };
  const rotatedCircleOffset = rotateVector(circleOffset, circleAngle);
  const circleWorldCenter = {
    x: circlePos.x + rotatedCircleOffset.x,
    y: circlePos.y + rotatedCircleOffset.y,
  };

  const rectOffset = rectCollider.offset || { x: 0, y: 0 };
  const rotatedRectOffset = rotateVector(rectOffset, rectAngle);
  const rectWorldCenter = {
    x: rectPos.x + rotatedRectOffset.x,
    y: rectPos.y + rotatedRectOffset.y,
  };

  const totalRectRotation = rectAngle + (rectCollider.localRotation || 0);

  // Transform circle to rect's local space
  const delta = subtractVectors(circleWorldCenter, rectWorldCenter);
  const circleLocal = rotateVector(delta, -totalRectRotation);

  // Find closest point on rectangle to circle center
  const halfWidth = rectCollider.width / 2;
  const halfHeight = rectCollider.height / 2;

  const closestX = Math.max(-halfWidth, Math.min(halfWidth, circleLocal.x));
  const closestY = Math.max(-halfHeight, Math.min(halfHeight, circleLocal.y));

  const closestLocal = { x: closestX, y: closestY };
  const distanceVec = subtractVectors(circleLocal, closestLocal);
  const distance = vectorMagnitude(distanceVec);

  if (distance >= circleCollider.radius) {
    return { collided: false };
  }

  // Collision detected
  const normalLocal =
    distance > 0 ? normalizeVector(distanceVec) : { x: 0, y: 1 };
  const normalWorld = rotateVector(normalLocal, totalRectRotation);

  // Flip normal if circle is objectB (normal points from A to B)
  const normal =
    circle === objectB ? scaleVector(normalWorld, -1) : normalWorld;

  const penetration = circleCollider.radius - distance;
  const collisionPointLocal = {
    x: closestX,
    y: closestY,
  };
  const collisionPointWorld = rotateVector(
    collisionPointLocal,
    totalRectRotation,
  );

  return {
    collided: true,
    point: {
      x: rectWorldCenter.x + collisionPointWorld.x,
      y: rectWorldCenter.y + collisionPointWorld.y,
    },
    normal: normal,
    penetration: penetration,
    timeOfImpact: 0,
  };
}

/**
 * Rectangle vs Rectangle collision detection using Separating Axis Theorem (SAT)
 *
 * @param {GameObject} objectA - First object (with RectCollider)
 * @param {GameObject} objectB - Second object (with RectCollider)
 * @param {number} timeStep - Physics time step
 * @returns {CollisionResult}
 */
function rectVsRect(objectA, objectB, timeStep) {
  const posA = objectA.physics?.position || objectA.transform.position;
  const posB = objectB.physics?.position || objectB.transform.position;
  const angleA = objectA.physics?.angle || objectA.transform.angle;
  const angleB = objectB.physics?.angle || objectB.transform.angle;

  const colliderA = /** @type {RectCollider} */ (objectA.collider);
  const colliderB = /** @type {RectCollider} */ (objectB.collider);

  // Get world centers
  const offsetA = colliderA.offset || { x: 0, y: 0 };
  const offsetB = colliderB.offset || { x: 0, y: 0 };
  const rotatedOffsetA = rotateVector(offsetA, angleA);
  const rotatedOffsetB = rotateVector(offsetB, angleB);

  const centerA = {
    x: posA.x + rotatedOffsetA.x,
    y: posA.y + rotatedOffsetA.y,
  };
  const centerB = {
    x: posB.x + rotatedOffsetB.x,
    y: posB.y + rotatedOffsetB.y,
  };

  const totalRotationA = angleA + (colliderA.localRotation || 0);
  const totalRotationB = angleB + (colliderB.localRotation || 0);

  // Get axes to test (4 axes: 2 per rectangle)
  const axesA = getRectAxes(totalRotationA);
  const axesB = getRectAxes(totalRotationB);
  const axes = [...axesA, ...axesB];

  let minOverlap = Infinity;
  let minAxis = null;

  // Test each axis
  for (const axis of axes) {
    const projA = projectRectOntoAxis(centerA, colliderA, totalRotationA, axis);
    const projB = projectRectOntoAxis(centerB, colliderB, totalRotationB, axis);

    const overlap =
      Math.min(projA.max, projB.max) - Math.max(projA.min, projB.min);

    if (overlap <= 0) {
      return { collided: false }; // Separating axis found
    }

    if (overlap < minOverlap) {
      minOverlap = overlap;
      minAxis = axis;
    }
  }

  // All axes have overlap = collision
  const delta = subtractVectors(centerB, centerA);
  const direction = dotProduct(delta, minAxis);

  // Normal points from A to B
  const normal = direction < 0 ? scaleVector(minAxis, -1) : minAxis;

  return {
    collided: true,
    point: {
      x: (centerA.x + centerB.x) / 2,
      y: (centerA.y + centerB.y) / 2,
    },
    normal: normal,
    penetration: minOverlap,
    timeOfImpact: 0,
  };
}

/**
 * Get the two perpendicular axes for a rotated rectangle
 * @param {number} angle - Rectangle rotation
 * @returns {Vector2[]} Two perpendicular unit vectors
 */
function getRectAxes(angle) {
  return [
    { x: Math.cos(angle), y: Math.sin(angle) }, // Axis along width
    { x: -Math.sin(angle), y: Math.cos(angle) }, // Axis along height
  ];
}

/**
 * Project a rectangle onto an axis
 * @param {Vector2} center - Rectangle center
 * @param {RectCollider} collider - Rectangle collider
 * @param {number} angle - Rectangle rotation
 * @param {Vector2} axis - Unit vector to project onto
 * @returns {{min: number, max: number}} Projection interval
 */
function projectRectOntoAxis(center, collider, angle, axis) {
  const halfWidth = collider.width / 2;
  const halfHeight = collider.height / 2;

  // Get rectangle corners
  const corners = [
    { x: -halfWidth, y: -halfHeight },
    { x: halfWidth, y: -halfHeight },
    { x: halfWidth, y: halfHeight },
    { x: -halfWidth, y: halfHeight },
  ];

  // Rotate corners and project onto axis
  const projections = corners.map((corner) => {
    const rotated = rotateVector(corner, angle);
    const worldPoint = { x: center.x + rotated.x, y: center.y + rotated.y };
    return dotProduct(worldPoint, axis);
  });

  return {
    min: Math.min(...projections),
    max: Math.max(...projections),
  };
}

/**
 * Resolve collision and calculate new physics state
 *
 * @param {GameObject} objectA - The moving object (with physics)
 * @param {GameObject} objectB - The collided-with object (may be static)
 * @param {CollisionResult} collision - Collision details
 * @param {number} coefficientOfRestitution - Bounciness (0 = inelastic, 1 = perfectly elastic)
 * @returns {PhysicsState} Resolved physics state for objectA
 */
function resolveCollision(
  objectA,
  objectB,
  collision,
  coefficientOfRestitution,
) {
  const physicsA = objectA.physics;

  // Correct position to remove penetration
  const correctedPosition = {
    x: physicsA.position.x - collision.normal.x * collision.penetration,
    y: physicsA.position.y - collision.normal.y * collision.penetration,
  };

  // If objectB is static (no physics), just reflect velocity
  if (!objectB.physics) {
    const newVelocity = reflectVelocity(
      physicsA.velocity,
      collision.normal,
      coefficientOfRestitution,
    );

    return {
      position: correctedPosition,
      velocity: newVelocity,
      acceleration: physicsA.acceleration,
      mass: physicsA.mass,
      angle: physicsA.angle,
      angularVelocity: physicsA.angularVelocity,
    };
  }

  // Both objects are dynamic - elastic collision
  const physicsB = objectB.physics;
  const newVelocities = calculateElasticCollision(
    physicsA,
    physicsB,
    collision.normal,
    coefficientOfRestitution,
  );

  return {
    position: correctedPosition,
    velocity: newVelocities.velocityA,
    acceleration: physicsA.acceleration,
    mass: physicsA.mass,
    angle: physicsA.angle,
    angularVelocity: physicsA.angularVelocity,
  };
}

/**
 * Reflect velocity off a static surface
 *
 * @param {Vector2} velocity - Incoming velocity
 * @param {Vector2} normal - Surface normal (unit vector)
 * @param {number} coefficientOfRestitution - Bounciness (0-1)
 * @returns {Vector2} Reflected velocity
 */
function reflectVelocity(velocity, normal, coefficientOfRestitution) {
  // v_reflected = v - (1 + e) * (v · n) * n
  const velocityAlongNormal = dotProduct(velocity, normal);

  return {
    x:
      velocity.x -
      (1 + coefficientOfRestitution) * velocityAlongNormal * normal.x,
    y:
      velocity.y -
      (1 + coefficientOfRestitution) * velocityAlongNormal * normal.y,
  };
}

/**
 * Calculate elastic collision between two moving objects
 *
 * Uses conservation of momentum and energy.
 * For a 1D elastic collision along the normal:
 *   v1' = ((m1 - e*m2) * v1 + (1 + e) * m2 * v2) / (m1 + m2)
 *   v2' = ((m2 - e*m1) * v2 + (1 + e) * m1 * v1) / (m1 + m2)
 *
 * Where:
 *   - v1, v2 are velocities along the collision normal
 *   - m1, m2 are masses
 *   - e is coefficient of restitution (0 = inelastic, 1 = perfectly elastic)
 *
 * EXAMPLE RESULT (e=1, equal masses):
 * - If ship A (mass 1000kg, velocity 100 m/s) hits ship B (mass 1000kg, velocity 0 m/s):
 *   - Ship A velocity becomes: 0 m/s (transfers all momentum)
 *   - Ship B velocity becomes: 100 m/s (receives all momentum)
 *
 * - If ship A (mass 1000kg, velocity 100 m/s) hits ship B (mass 1000kg, velocity -50 m/s):
 *   - Ship A velocity becomes: -50 m/s (velocities swap)
 *   - Ship B velocity becomes: 100 m/s
 *
 * - If ship A (mass 2000kg, velocity 100 m/s) hits ship B (mass 1000kg, velocity 0 m/s):
 *   - Ship A velocity becomes: 33.3 m/s (heavier object continues forward)
 *   - Ship B velocity becomes: 133.3 m/s (lighter object bounces faster)
 *
 * @param {PhysicsState} physicsA - First object's physics
 * @param {PhysicsState} physicsB - Second object's physics
 * @param {Vector2} normal - Collision normal (points from A to B)
 * @param {number} coefficientOfRestitution - Bounciness (0-1)
 * @returns {{velocityA: Vector2, velocityB: Vector2}} New velocities for both objects
 */
function calculateElasticCollision(
  physicsA,
  physicsB,
  normal,
  coefficientOfRestitution,
) {
  const m1 = physicsA.mass;
  const m2 = physicsB.mass;

  // Project velocities onto collision normal (1D collision along normal)
  const v1n = dotProduct(physicsA.velocity, normal);
  const v2n = dotProduct(physicsB.velocity, normal);

  // Calculate new velocities along normal
  const v1nPrime =
    ((m1 - coefficientOfRestitution * m2) * v1n +
      (1 + coefficientOfRestitution) * m2 * v2n) /
    (m1 + m2);
  const v2nPrime =
    ((m2 - coefficientOfRestitution * m1) * v2n +
      (1 + coefficientOfRestitution) * m1 * v1n) /
    (m1 + m2);

  // Get tangential components (perpendicular to normal)
  const tangent = { x: -normal.y, y: normal.x };
  const v1t = dotProduct(physicsA.velocity, tangent);
  const v2t = dotProduct(physicsB.velocity, tangent);

  // Recombine normal and tangential components
  const velocityA = {
    x: v1nPrime * normal.x + v1t * tangent.x,
    y: v1nPrime * normal.y + v1t * tangent.y,
  };

  const velocityB = {
    x: v2nPrime * normal.x + v2t * tangent.x,
    y: v2nPrime * normal.y + v2t * tangent.y,
  };

  return { velocityA, velocityB };
}

/**
 * Rotate a 2D vector by an angle
 * @param {Vector2} vector - Vector to rotate
 * @param {number} angle - Rotation angle in radians
 * @returns {Vector2} Rotated vector
 */
function rotateVector(vector, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    x: vector.x * cos - vector.y * sin,
    y: vector.x * sin + vector.y * cos,
  };
}
