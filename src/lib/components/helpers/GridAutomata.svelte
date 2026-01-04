<script>
  import { onMount, onDestroy } from 'svelte';

  /**
   * @typedef {import('./GridAutomata.types.js').AutomataConfig} AutomataConfig
   * @typedef {import('./GridAutomata.types.js').NeighborHelper} NeighborHelper
   */

  /** @type {AutomataConfig} */
  export let config;

  // Build state lookup maps
  /** @type {Record<string, number>} */
  const stateById = {};
  /** @type {string[]} */
  const stateNames = [];
  /** @type {number[][]} */
  const stateColors = [];

  config.states.forEach((state, index) => {
    stateById[state.id] = index;
    stateNames[index] = state.name;
    stateColors[index] = state.color;
  });

  // Initialize parameters with defaults
  /** @type {Record<string, number>} */
  const paramValues = {};
  Object.keys(config.params).forEach(key => {
    paramValues[key] = config.params[key].default;
  });

  // Grid state
  let gridWidth = config.defaultGridSize.width;
  let gridHeight = config.defaultGridSize.height;
  let scale = config.defaultScale;
  let canvasWidth = gridWidth * scale;
  let canvasHeight = gridHeight * scale;

  // Double-buffered grid (Uint8Array for performance)
  let currentGrid = new Uint8Array(gridWidth * gridHeight);
  let nextGrid = new Uint8Array(gridWidth * gridHeight);

  /** @type {HTMLCanvasElement} */
  let canvas;

  /** @type {CanvasRenderingContext2D} */
  let ctx;

  /** @type {ImageData} */
  let imageData;

  let isPlaying = false;
  /** @type {number | null} */
  let animationFrameId = null;
  let lastUpdateTime = 0;
  let showAdvancedParams = false;

  // Frame rate control
  let targetFPS = config.targetFPS || 20;
  let minFrameTime = 1000 / targetFPS; // Minimum time between frames in ms

  // FPS tracking
  let actualFPS = 0;
  let frameCount = 0;
  let fpsLastTime = 0;

  // Update minFrameTime when targetFPS changes
  $: minFrameTime = 1000 / targetFPS;

  // Pre-compute neighbor offsets based on config
  /** @type {Array<[number, number]>} */
  let neighborOffsets = [];

  function computeNeighborOffsets() {
    neighborOffsets = [];
    const radius = config.neighborhoodRadius || 1;

    if (config.neighborhoodType === 'vonNeumann') {
      // 4-neighbors (cardinal directions)
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx === 0 && dy === 0) continue;
          if (Math.abs(dx) + Math.abs(dy) <= radius) {
            neighborOffsets.push([dx, dy]);
          }
        }
      }
    } else {
      // Moore neighborhood (8-neighbors) - default
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx === 0 && dy === 0) continue;
          neighborOffsets.push([dx, dy]);
        }
      }
    }
  }

  /**
   * Get cell state at position
   * @param {Uint8Array} grid
   * @param {number} x
   * @param {number} y
   */
  function getCell(grid, x, y) {
    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
      return 0; // Out of bounds = background state
    }
    return grid[y * gridWidth + x];
  }

  /**
   * Set cell state at position
   * @param {Uint8Array} grid
   * @param {number} x
   * @param {number} y
   * @param {number} state
   */
  function setCell(grid, x, y, state) {
    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
      grid[y * gridWidth + x] = state;
    }
  }

  /**
   * Get neighbor helper for a cell
   * @param {number} x
   * @param {number} y
   */
  function getNeighbors(x, y) {
    /** @type {number[]} */
    const neighborStates = [];

    for (const [dx, dy] of neighborOffsets) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
        neighborStates.push(getCell(currentGrid, nx, ny));
      }
    }

    return {
      /** @param {number[]} states */
      count: (states) => {
        let count = 0;
        for (const state of neighborStates) {
          if (states.includes(state)) count++;
        }
        return count;
      },

      /** @param {number[]} states */
      any: (states) => {
        for (const state of neighborStates) {
          if (states.includes(state)) return true;
        }
        return false;
      },

      /** @param {number} state */
      all: (state) => {
        for (const neighborState of neighborStates) {
          if (neighborState !== state) return false;
        }
        return neighborStates.length > 0;
      },

      // Raw access for custom logic
      get grid() {
        const grid = [];
        for (const [dx, dy] of neighborOffsets) {
          grid.push([dx, dy, getCell(currentGrid, x + dx, y + dy)]);
        }
        return grid;
      }
    };
  }

  /**
   * Blob generation helper
   * @param {Uint8Array} grid
   * @param {number} stateId
   * @param {number} maxSize
   */
  function generateBlob(grid, stateId, maxSize) {
    const centerX = Math.floor(Math.random() * gridWidth);
    const centerY = Math.floor(Math.random() * gridHeight);

    const stretchX = 0.7 + Math.random() * 0.6;
    const stretchY = 0.7 + Math.random() * 0.6;
    const rotation = Math.random() * Math.PI * 2;
    const irregularity = 0.3 + Math.random() * 0.4;

    const baseRadius = maxSize / 2;
    const actualSize = baseRadius * (0.6 + Math.random() * 0.8);

    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);

    /**
     * @param {number} dx
     * @param {number} dy
     */
    function getProbability(dx, dy) {
      const rotX = dx * cos - dy * sin;
      const rotY = dx * sin + dy * cos;

      const distX = rotX / stretchX;
      const distY = rotY / stretchY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      const angle = Math.atan2(dy, dx);
      const waviness = Math.sin(angle * 3 + centerX * 0.1) * irregularity +
                      Math.cos(angle * 5 + centerY * 0.1) * irregularity * 0.5;

      const effectiveRadius = actualSize + waviness * actualSize;
      const distRatio = distance / effectiveRadius;

      if (distRatio < 0.7) return 0.95;
      if (distRatio < 1.0) return 0.95 - (distRatio - 0.7) * 3;
      if (distRatio < 1.3) return Math.max(0, 0.3 - (distRatio - 1.0) * 0.8);
      return 0;
    }

    /** @type {Set<string>} */
    const filled = new Set();
    /** @type {Array<[number, number]>} */
    const queue = [[0, 0]];
    filled.add('0,0');

    setCell(grid, centerX, centerY, stateId);

    while (queue.length > 0) {
      const [dx, dy] = /** @type {[number, number]} */ (queue.shift());

      const neighbors = [
        [dx + 1, dy],
        [dx - 1, dy],
        [dx, dy + 1],
        [dx, dy - 1]
      ];

      for (const [ndx, ndy] of neighbors) {
        const key = `${ndx},${ndy}`;
        if (filled.has(key)) continue;

        const nx = centerX + ndx;
        const ny = centerY + ndy;

        if (ny < 0 || ny >= gridHeight || nx < 0 || nx >= gridWidth) continue;

        const prob = getProbability(ndx, ndy);
        if (Math.random() < prob) {
          setCell(grid, nx, ny, stateId);
          filled.add(key);
          queue.push([ndx, ndy]);
        }
      }
    }
  }

  /**
   * Initialize the simulation
   */
  function initializeSimulation() {
    if (!canvas) return;

    ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
    imageData = ctx.createImageData(canvasWidth, canvasHeight);

    // Initialize grid
    currentGrid = new Uint8Array(gridWidth * gridHeight);
    nextGrid = new Uint8Array(gridWidth * gridHeight);

    // Call initialization function for each cell
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const state = config.initializeCell(x, y, gridWidth, gridHeight, paramValues, stateById);
        setCell(currentGrid, x, y, state);
      }
    }

    // Post-initialization (for blobs, etc.)
    if (config.postInitialize) {
      config.postInitialize(currentGrid, gridWidth, gridHeight, paramValues, stateById, {
        generateBlob,
        getCell: /** @param {number} x @param {number} y */ (x, y) => getCell(currentGrid, x, y),
        setCell: /** @param {number} x @param {number} y @param {number} state */ (x, y, state) => setCell(currentGrid, x, y, state)
      });
    }

    render();
  }

  /**
   * Update simulation by one step
   */
  function updateSimulation() {
    // Update each cell
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const currentState = getCell(currentGrid, x, y);
        const neighbors = getNeighbors(x, y);
        const newState = config.updateCell(
          currentState,
          neighbors,
          x,
          y,
          gridWidth,
          gridHeight,
          paramValues,
          stateById
        );
        setCell(nextGrid, x, y, newState);
      }
    }

    // Swap buffers
    [currentGrid, nextGrid] = [nextGrid, currentGrid];
  }

  /**
   * Render the grid to canvas
   */
  function render() {
    if (!ctx || !imageData) return;

    const data = imageData.data;

    // Iterate by grid cells, not pixels
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const state = getCell(currentGrid, x, y);
        const color = stateColors[state];

        // Fill the scaled cell area
        const startX = x * scale;
        const startY = y * scale;

        for (let py = 0; py < scale; py++) {
          for (let px = 0; px < scale; px++) {
            const pixelX = startX + px;
            const pixelY = startY + py;
            const pixelIndex = (pixelY * canvasWidth + pixelX) * 4;

            data[pixelIndex] = color[0];
            data[pixelIndex + 1] = color[1];
            data[pixelIndex + 2] = color[2];
            data[pixelIndex + 3] = color[3];
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Main animation loop
   * @param {number} timestamp
   */
  function animate(timestamp) {
    if (!isPlaying) return;

    // Initialize timing on first frame
    if (lastUpdateTime === 0) {
      lastUpdateTime = timestamp;
      fpsLastTime = timestamp;
    }

    const elapsed = timestamp - lastUpdateTime;

    // Only update if enough time has passed (frame rate limiting)
    if (elapsed >= minFrameTime) {
      updateSimulation();
      render();

      lastUpdateTime = timestamp;

      // Update FPS counter
      frameCount++;
      if (timestamp - fpsLastTime >= 1000) {
        actualFPS = Math.round((frameCount * 1000) / (timestamp - fpsLastTime));
        frameCount = 0;
        fpsLastTime = timestamp;
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  function play() {
    if (!isPlaying) {
      isPlaying = true;
      lastUpdateTime = 0;
      frameCount = 0;
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  function pause() {
    isPlaying = false;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    // Reset FPS display
    actualFPS = 0;
    frameCount = 0;
  }

  function reset() {
    pause();
    initializeSimulation();
  }

  function step() {
    pause();
    updateSimulation();
    render();
  }

  function toggleAdvancedParams() {
    showAdvancedParams = !showAdvancedParams;
  }

  function resetToDefaults() {
    for (const [key, param] of Object.entries(config.params)) {
      paramValues[key] = param.default;
    }
  }

  /**
   * Format a parameter value for display
   * @param {number} value
   * @returns {string}
   */
  function formatParamValue(value) {
    if (value === 0) return '0';

    const absValue = Math.abs(value);

    // For very small numbers (< 0.0001), use scientific notation
    if (absValue < 0.0001 && absValue > 0) {
      return value.toExponential(2);
    }

    // For small numbers, show enough decimal places to be meaningful
    if (absValue < 0.01) {
      return value.toFixed(6);
    }

    // For normal numbers, use 4 decimal places
    return value.toFixed(4);
  }

  // Update canvas size when dimensions change
  $: {
    canvasWidth = gridWidth * scale;
    canvasHeight = gridHeight * scale;
    if (canvas) {
      initializeSimulation();
    }
  }

  onMount(() => {
    computeNeighborOffsets();
    initializeSimulation();

    // Auto-start if configured
    if (config.autoPlay) {
      play();
    }
  });

  onDestroy(() => {
    pause();
  });
</script>

<div class="automata-container">
  <canvas bind:this={canvas} width={canvasWidth} height={canvasHeight}></canvas>

  <div class="legend">
    {#each config.states as state}
      <div class="legend-item">
        <span
          class="legend-box"
          style="background-color: rgb({state.color[0]}, {state.color[1]}, {state.color[2]});"
        ></span>
        <span class="legend-label">{state.name}</span>
      </div>
    {/each}
  </div>

  <div class="controls">
    <h3 class="controls-title">Automata Controls</h3>

    <div class="fps-display">
      {#if isPlaying}
        <span class="fps-actual">{actualFPS} /</span>
      {/if}
      <input
        type="number"
        class="fps-input"
        bind:value={targetFPS}
        min="1"
        max="120"
        step="1"
      />
      <span class="fps-label">FPS</span>
    </div>

    <div class="control-row">
      <button on:click={play} disabled={isPlaying}>Play</button>
      <button on:click={pause} disabled={!isPlaying}>Pause</button>
      <button on:click={step} disabled={isPlaying}>Step</button>
      <button on:click={reset}>Reset</button>
    </div>

    <div class="primary-controls">
      <div class="slider-group">
        <label for="grid-width">
          Grid Width: {gridWidth}
          <input type="range" id="grid-width" bind:value={gridWidth} min="10" max="500" step="10" />
        </label>
      </div>
      <div class="slider-group">
        <label for="grid-height">
          Grid Height: {gridHeight}
          <input type="range" id="grid-height" bind:value={gridHeight} min="10" max="500" step="10" />
        </label>
      </div>
      <div class="slider-group">
        <label for="scale">
          Scale: {scale}
          <input type="range" id="scale" bind:value={scale} min="1" max="20" step="1" />
        </label>
      </div>
    </div>

    {#if Object.keys(config.params).length > 0}
      <div class="advanced-section">
        <button class="expand-button" on:click={toggleAdvancedParams} type="button">
          <span class="arrow" class:expanded={showAdvancedParams}>▶</span>
          Advanced Parameters
        </button>

        {#if showAdvancedParams}
          <div class="advanced-controls">
            <div class="advanced-header">
              <button class="reset-defaults-button" on:click={resetToDefaults} type="button">
                Reset to Defaults
              </button>
            </div>
            {#each Object.entries(config.params) as [key, param]}
              <div class="slider-group">
                <label for={key}>
                  {param.label}: {formatParamValue(paramValues[key])}
                  <span class="default-value">Default: {formatParamValue(param.default)}</span>
                  <input
                    type="range"
                    id={key}
                    bind:value={paramValues[key]}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                  />
                </label>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .automata-container {
    width: 100%;
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  canvas {
    display: block;
    max-width: 100%;
    padding: 10px;
    border: solid 1px var(--contrast-text-light);
    border-radius: 20px;
    background-color: var(--neutral-black);
  }

  .controls {
    background-color: var(--neutral-gray);
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid var(--neutral-dark-gray-op-50);
    width: 100%;
    max-width: 800px;
    position: relative;
  }

  .controls-title {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--contrast-text-light);
    text-align: center;
  }

  .control-row {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .control-row:last-child {
    margin-bottom: 0;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: var(--main-blue);
    color: var(--neutral-white);
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.3s;
  }

  button:hover:not(:disabled) {
    background-color: var(--main-blue-light);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--neutral-dark-gray);
  }

  .fps-display {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: var(--contrast-text-light);
    font-family: monospace;
    font-size: 0.75rem;
    opacity: 0.7;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .fps-input {
    width: 3rem;
    padding: 0.1rem 0.25rem;
    font-family: monospace;
    font-size: 0.75rem;
    background-color: var(--neutral-dark-gray);
    color: var(--contrast-text-light);
    border: 1px solid var(--neutral-dark-gray-op-50);
    border-radius: 3px;
    text-align: center;
  }

  .fps-input:focus {
    outline: none;
    border-color: var(--main-blue);
  }

  .fps-actual,
  .fps-label {
    color: var(--contrast-text-light);
  }

  .primary-controls {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .slider-group {
    width: 160px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .slider-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--contrast-text-light);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input[type="range"] {
    width: 100%;
    cursor: pointer;
    accent-color: var(--main-blue);
  }

  .advanced-section {
    border-top: 1px solid var(--neutral-dark-gray-op-50);
    padding-top: 1.5rem;
  }

  .expand-button {
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: var(--neutral-white);
    color: var(--neutral-black);
    border: 1px solid var(--neutral-dark-gray-op-50);
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s;
  }

  .expand-button:hover {
    background-color: var(--neutral-gray);
  }

  .arrow {
    display: inline-block;
    transition: transform 0.2s;
    font-size: 0.7rem;
  }

  .arrow.expanded {
    transform: rotate(90deg);
  }

  .advanced-controls {
    margin-top: 1rem;
    padding: 1rem;
    background-color: var(--neutral-white);
    border-radius: 6px;
    border: 1px solid var(--neutral-dark-gray-op-50);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .advanced-header {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
  }

  .reset-defaults-button {
    padding: 0.5rem 1rem;
    background-color: var(--neutral-gray);
    color: var(--contrast-text-light);
    border: 1px solid var(--neutral-dark-gray-op-50);
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .reset-defaults-button:hover {
    background-color: var(--neutral-dark-gray);
  }

  .default-value {
    display: block;
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--neutral-light-gray);
    margin-top: 0.25rem;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    max-width: 100%;
    padding: 0.5rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .legend-box {
    width: 16px;
    height: 16px;
    border: 1px solid var(--contrast-text-light);
    border-radius: 3px;
    display: inline-block;
  }

  .legend-label {
    font-size: 0.875rem;
    color: var(--contrast-text-light);
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .controls {
      padding: 0.75rem;
    }

    .control-row {
      font-size: 0.85rem;
    }

    button {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }

    .primary-controls,
    .advanced-controls {
      flex-direction: column;
      align-items: center;
    }

    .slider-group {
      width: 100%;
      max-width: 300px;
    }
  }
</style>
