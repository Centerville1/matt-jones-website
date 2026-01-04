/**
 * Defines the configuration for a single state in the grid automata.
 * @typedef {Object} StateDefinition
 * @property {string} id - Unique identifier for this state
 * @property {number[]} color - RGBA color array [r, g, b, a]
 * @property {string} name - Display name for legend
 */

/**
 * Defines a parameter that can be configured in the automata.
 * @typedef {Object} ParamDefinition
 * @property {number} default - Default value
 * @property {number} min - Minimum value
 * @property {number} max - Maximum value
 * @property {number} step - Step size for slider
 * @property {string} label - Display label
 */

/**
 * Helper object for querying neighbors of a cell.
 * @typedef {Object} NeighborHelper
 * @property {function(number[]): number} count - Count neighbors matching any of the given state IDs
 * @property {function(number[]): boolean} any - Check if any neighbor matches the given state IDs
 * @property {function(number): boolean} all - Check if all neighbors match the given state ID
 * @property {number[][]} grid - 2D array of neighbor states (relative coordinates)
 */

/**
 * Initialize a single cell in the grid.
 * @callback InitializeCellFn
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Grid width
 * @param {number} height - Grid height
 * @param {Record<string, number>} params - Parameter values
 * @param {Record<string, number>} states - State ID lookup
 * @returns {number} Initial state ID
 */

/**
 * Post-process the grid after initialization (e.g., add blobs).
 * @callback PostInitializeFn
 * @param {Uint8Array} grid - The grid array
 * @param {number} width - Grid width
 * @param {number} height - Grid height
 * @param {Record<string, number>} params - Parameter values
 * @param {Record<string, number>} states - State ID lookup
 * @param {Object} helpers - Helper functions
 * @param {function(Uint8Array, number, number): void} helpers.generateBlob - Generate a blob on the grid
 * @param {function(number, number): number} helpers.getCell - Get cell state
 * @param {function(number, number, number): void} helpers.setCell - Set cell state
 * @returns {void}
 */

/**
 * Update a single cell based on its current state and neighbors.
 * @callback UpdateCellFn
 * @param {number} cellState - Current cell state
 * @param {NeighborHelper} neighbors - Neighbor query helper
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Grid width
 * @param {number} height - Grid height
 * @param {Record<string, number>} params - Parameter values
 * @param {Record<string, number>} states - State ID lookup
 * @returns {number} New state ID
 */

/**
 * Configuration for a grid automata simulation.
 * @typedef {Object} AutomataConfig
 * @property {StateDefinition[]} states - Array of state definitions
 * @property {Object.<string, ParamDefinition>} params - Parameter definitions
 * @property {{width: number, height: number}} defaultGridSize - Default grid dimensions
 * @property {number} defaultScale - Default cell scale
 * @property {number} targetFPS - Target frames per second (default 20)
 * @property {boolean} [autoPlay] - Auto-start simulation (default false)
 * @property {'moore'|'vonNeumann'|'custom'} neighborhoodType - Neighborhood pattern
 * @property {number} neighborhoodRadius - Radius for neighborhood (default 1)
 * @property {InitializeCellFn} initializeCell - Initialize a cell
 * @property {PostInitializeFn} [postInitialize] - Post-process grid
 * @property {UpdateCellFn} updateCell - Update rule
 */

export {};
