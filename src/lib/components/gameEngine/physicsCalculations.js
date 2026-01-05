/**
 * Physics Calculations for 2D Space Game
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
 *
 * @typedef {import('./types').Vector2} Vector2
 * @typedef {import('./types').PhysicsState} PhysicsState
 */

/**
 * Calculate acceleration from force using Newton's second law (F = ma)
 * @param {Vector2} forceVector - Force in Newtons (N)
 * @param {number} mass - Mass in kilograms (kg)
 * @returns {Vector2} Acceleration in m/s²
 */
export function forceToAcceleration(forceVector, mass) {
  if (mass <= 0) {
    throw new Error('Mass must be greater than zero');
  }

  return {
    x: forceVector.x / mass,
    y: forceVector.y / mass,
  };
}

/**
 * Calculate force from acceleration using Newton's second law (F = ma)
 * @param {Vector2} accelVector - Acceleration in m/s²
 * @param {number} mass - Mass in kilograms (kg)
 * @returns {Vector2} Force in Newtons (N)
 */
export function accelerationToForce(accelVector, mass) {
  if (mass <= 0) {
    throw new Error('Mass must be greater than zero');
  }

  return {
    x: accelVector.x * mass,
    y: accelVector.y * mass,
  };
}

/**
 * Calculate drag force opposing velocity
 * Formula: F_drag = -0.5 * ρ * v² * C_d * A * (v_hat)
 * where v_hat is the unit vector in the direction of velocity
 *
 * @param {Vector2} velocityVector - Velocity in m/s
 * @param {number} crossSectArea - Cross-sectional area in m²
 * @param {number} dragCoeff - Drag coefficient (dimensionless, typically 0.1-2.0)
 * @param {number} [density=0] - Fluid density in kg/m³ (air ≈ 1.2, space ≈ 0)
 * @returns {Vector2} Drag force in Newtons (N), opposing velocity
 */
export function applyDrag(
  velocityVector,
  crossSectArea,
  dragCoeff,
  density = 0,
) {
  const velocityMagnitude = Math.sqrt(
    velocityVector.x ** 2 + velocityVector.y ** 2,
  );

  // No drag if not moving or in vacuum
  if (velocityMagnitude === 0 || density === 0) {
    return { x: 0, y: 0 };
  }

  // Drag magnitude: 0.5 * ρ * v² * C_d * A
  const dragMagnitude =
    0.5 * density * velocityMagnitude ** 2 * dragCoeff * crossSectArea;

  // Unit vector in direction of velocity
  const velocityUnitX = velocityVector.x / velocityMagnitude;
  const velocityUnitY = velocityVector.y / velocityMagnitude;

  // Drag force opposes velocity (negative sign)
  return {
    x: -dragMagnitude * velocityUnitX,
    y: -dragMagnitude * velocityUnitY,
  };
}

/**
 * Calculate next velocity using Euler integration
 * v_new = v_old + a * Δt
 *
 * @param {Vector2} velocityVector - Current velocity in m/s
 * @param {Vector2} accelVector - Acceleration in m/s²
 * @param {number} timeStep - Time step in seconds (s)
 * @returns {Vector2} New velocity in m/s
 */
export function nextVelocity(velocityVector, accelVector, timeStep) {
  return {
    x: velocityVector.x + accelVector.x * timeStep,
    y: velocityVector.y + accelVector.y * timeStep,
  };
}

/**
 * Calculate next position using Euler integration
 * p_new = p_old + v * Δt
 *
 * @param {Vector2} positionVector - Current position in meters (m)
 * @param {Vector2} velocityVector - Velocity in m/s
 * @param {number} timeStep - Time step in seconds (s)
 * @returns {Vector2} New position in meters (m)
 */
export function nextPosition(positionVector, velocityVector, timeStep) {
  return {
    x: positionVector.x + velocityVector.x * timeStep,
    y: positionVector.y + velocityVector.y * timeStep,
  };
}

/**
 * Add multiple 2D vectors together
 * @param {Vector2[]} vectors - Array of vectors to sum
 * @returns {Vector2} Sum of all vectors
 */
export function addVectors(vectors) {
  return vectors.reduce(
    (sum, vector) => ({
      x: sum.x + vector.x,
      y: sum.y + vector.y,
    }),
    { x: 0, y: 0 },
  );
}

/**
 * Complete physics integration for one time step
 * Combines force → acceleration → velocity → position
 * Also updates rotation based on angular velocity
 *
 * This is the main integration function that should be called each frame.
 * It applies the net force to update both velocity and position.
 *
 * @param {PhysicsState} state - Current physics state
 * @param {Vector2} forceVector - Net force in Newtons (N)
 * @param {number} timeStep - Time step in seconds (s)
 * @returns {PhysicsState} New physics state with updated position, velocity, acceleration, rotation, and same mass
 */
export function forceToNextPosition(state, forceVector, timeStep) {
  // Calculate new acceleration from force
  const newAcceleration = forceToAcceleration(forceVector, state.mass);

  // Update velocity based on new acceleration
  const newVelocity = nextVelocity(state.velocity, newAcceleration, timeStep);

  // Update position based on new velocity
  const newPosition = nextPosition(state.position, newVelocity, timeStep);

  // Update rotation based on angular velocity
  const newAngle = normalizeAngle(
    state.angle + state.angularVelocity * timeStep,
  );

  return {
    position: newPosition,
    velocity: newVelocity,
    acceleration: newAcceleration,
    mass: state.mass,
    angle: newAngle,
    angularVelocity: state.angularVelocity,
  };
}

/**
 * Helper: Calculate magnitude of a 2D vector
 * @param {Vector2} vector
 * @returns {number} Magnitude
 */
export function vectorMagnitude(vector) {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}

/**
 * Helper: Normalize a 2D vector to unit length
 * @param {Vector2} vector
 * @returns {Vector2} Unit vector (or {0, 0} if input is zero vector)
 */
export function normalizeVector(vector) {
  const magnitude = vectorMagnitude(vector);

  if (magnitude === 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
  };
}

/**
 * Helper: Scale a vector by a scalar
 * @param {Vector2} vector
 * @param {number} scalar
 * @returns {Vector2} Scaled vector
 */
export function scaleVector(vector, scalar) {
  return {
    x: vector.x * scalar,
    y: vector.y * scalar,
  };
}

/**
 * Helper: Subtract two vectors (v1 - v2)
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @returns {Vector2} Difference vector
 */
export function subtractVectors(v1, v2) {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y,
  };
}

/**
 * Helper: Calculate dot product of two vectors
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @returns {number} Dot product
 */
export function dotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

/**
 * Helper: Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Helper: Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Helper: Normalize angle to [0, 2π) range
 * @param {number} radians - Angle in radians
 * @returns {number} Normalized angle in [0, 2π)
 */
export function normalizeAngle(radians) {
  const twoPi = 2 * Math.PI;
  let normalized = radians % twoPi;
  if (normalized < 0) {
    normalized += twoPi;
  }
  return normalized;
}
