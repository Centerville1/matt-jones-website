<script>
  import { onMount } from 'svelte';

  // Component props (configurable from blog editor)
  export let gridHeight = 50;
  export let gridWidth = 50;
  export let scale = 10;
  export let autoPlay = false;

  // Probability props (all configurable)
  export let treeChance = 0.05;
  export let treeSprout = 0.000000001;
  export let nearNeighborSprout = 0.001;
  export let treeGrow = 0.01;
  export let burnRepair = 0.1;
  export let houseChance = 0;
  export let spontaneousCombustion = 0.000004;
  export let fireSpreadChance = 0.33;

  // Component linking props
  /** @type {any} */
  export let contextStore = undefined;

  // Internal state - will be updated by context or props
  let _gridHeight = gridHeight;
  let _gridWidth = gridWidth;
  let _scale = scale;
  let _treeChance = treeChance;
  let _treeSprout = treeSprout;
  let _nearNeighborSprout = nearNeighborSprout;
  let _treeGrow = treeGrow;
  let _burnRepair = burnRepair;
  let _houseChance = houseChance;
  let _spontaneousCombustion = spontaneousCombustion;
  let _fireSpreadChance = fireSpreadChance;

  // Derived dimensions
  let width = _gridWidth * _scale;
  let height = _gridHeight * _scale;

  let play = autoPlay;
  let realHeight = _gridHeight;
  let realWidth = _gridWidth;

  /** @type {number[][][]} */
  let simMatrix = [];

  /** @type {HTMLCanvasElement} */
  let canvas;

  /** @type {CanvasRenderingContext2D} */
  let canvasCtx;

  /** @type {ImageData} */
  let imgData;

  // Track last reset trigger to detect changes
  let lastResetTrigger = 0;

  // Use context values if available, otherwise use props
  $: if (contextStore && $contextStore) {
    if ($contextStore.gridHeight !== undefined)
      _gridHeight = $contextStore.gridHeight;
    if ($contextStore.gridWidth !== undefined)
      _gridWidth = $contextStore.gridWidth;
    if ($contextStore.scale !== undefined) _scale = $contextStore.scale;
    if ($contextStore.treeChance !== undefined)
      _treeChance = $contextStore.treeChance;
    if ($contextStore.treeSprout !== undefined)
      _treeSprout = $contextStore.treeSprout;
    if ($contextStore.nearNeighborSprout !== undefined)
      _nearNeighborSprout = $contextStore.nearNeighborSprout;
    if ($contextStore.treeGrow !== undefined)
      _treeGrow = $contextStore.treeGrow;
    if ($contextStore.burnRepair !== undefined)
      _burnRepair = $contextStore.burnRepair;
    if ($contextStore.houseChance !== undefined)
      _houseChance = $contextStore.houseChance;
    if ($contextStore.spontaneousCombustion !== undefined)
      _spontaneousCombustion = $contextStore.spontaneousCombustion;
    if ($contextStore.fireSpreadChance !== undefined)
      _fireSpreadChance = $contextStore.fireSpreadChance;
    if ($contextStore.play !== undefined) play = $contextStore.play;
  } else {
    // Only use props when no context is provided
    _gridHeight = gridHeight;
    _gridWidth = gridWidth;
    _scale = scale;
    _treeChance = treeChance;
    _treeSprout = treeSprout;
    _nearNeighborSprout = nearNeighborSprout;
    _treeGrow = treeGrow;
    _burnRepair = burnRepair;
    _houseChance = houseChance;
    _spontaneousCombustion = spontaneousCombustion;
    _fireSpreadChance = fireSpreadChance;
  }

  // Separate reactive statement for reset trigger to avoid conflicts
  $: if (
    contextStore &&
    $contextStore &&
    $contextStore.resetTrigger !== undefined
  ) {
    if ($contextStore.resetTrigger !== lastResetTrigger) {
      lastResetTrigger = $contextStore.resetTrigger;
      initSimulation();
      renderSim();
    }
  }

  const BACKGROUND = [51, 31, 14, 255];
  const YOUNGTREE = [0, 255, 0, 255];
  const OLDTREE = [0, 175, 0, 255];
  const HOUSECOLOR = [130, 100, 150, 255];
  const STONE = [100, 100, 100, 255];
  const WATER = [0, 0, 255, 255];
  const BURNTCOLOR = [80, 130, 130, 255];
  const FIRECOOL = [255, 126, 42, 255];
  const FIREMED = [220, 50, 0, 255];
  const FIREHOT = [200, 0, 0, 255];

  const TREECOLORS = [YOUNGTREE, OLDTREE];
  const FIRECOLORS = [FIRECOOL, FIREMED, FIREHOT];

  const MAXSTONES = 10;
  const MAXSTONESIZE = 6;
  const MAXLAKES = 2;
  const MAXLAKESIZE = 10;

  let simulationDelay = 50;

  /**
   * @param {number} maxsize
   * @param {number[]} color
   */
  function generateBlob(maxsize, color) {
    // Random center point
    let centerX = Math.floor(Math.random() * realWidth);
    let centerY = Math.floor(Math.random() * realHeight);

    // Random shape parameters for variety
    let stretchX = 0.7 + Math.random() * 0.6; // 0.7-1.3
    let stretchY = 0.7 + Math.random() * 0.6; // 0.7-1.3
    let rotation = Math.random() * Math.PI * 2;
    let irregularity = 0.3 + Math.random() * 0.4; // 0.3-0.7

    // Random radius variation for blob
    let baseRadius = maxsize / 2;
    let actualSize = baseRadius * (0.6 + Math.random() * 0.8); // 60-140% of base

    // Pre-calculate rotation values
    let cos = Math.cos(rotation);
    let sin = Math.sin(rotation);

    /**
     * Calculate probability for a given position
     * @param {number} dx
     * @param {number} dy
     */
    function getProbability(dx, dy) {
      // Apply rotation and stretch
      let rotX = dx * cos - dy * sin;
      let rotY = dx * sin + dy * cos;

      // Calculate distance with stretch applied
      let distX = rotX / stretchX;
      let distY = rotY / stretchY;
      let distance = Math.sqrt(distX * distX + distY * distY);

      // Add perlin-noise-like irregularity based on angle
      let angle = Math.atan2(dy, dx);
      let waviness = Math.sin(angle * 3 + centerX * 0.1) * irregularity +
                    Math.cos(angle * 5 + centerY * 0.1) * irregularity * 0.5;

      let effectiveRadius = actualSize + waviness * actualSize;

      // Probability drops off with distance for smooth edges
      let distRatio = distance / effectiveRadius;

      if (distRatio < 0.7) {
        return 0.95; // Core of blob
      } else if (distRatio < 1.0) {
        return 0.95 - (distRatio - 0.7) * 3; // Edge falloff
      } else if (distRatio < 1.3) {
        return Math.max(0, 0.3 - (distRatio - 1.0) * 0.8); // Outer fuzzy area
      }
      return 0;
    }

    // Use flood-fill growth from center to ensure connectivity
    /** @type {Set<string>} */
    let filled = new Set();
    /** @type {Array<[number, number]>} */
    let queue = [[0, 0]]; // Start from center (relative coords)
    filled.add('0,0');

    // Set the center cell
    if (centerY > 0 && centerY < realHeight && centerX > 0 && centerX < realWidth) {
      simMatrix[centerY][centerX] = color;
    }

    // Grow outward from center
    while (queue.length > 0) {
      let [dx, dy] = /** @type {[number, number]} */ (queue.shift());

      // Try to expand to 4 neighbors (no diagonals to ensure better connectivity)
      let neighbors = [
        [dx + 1, dy],
        [dx - 1, dy],
        [dx, dy + 1],
        [dx, dy - 1]
      ];

      for (let [ndx, ndy] of neighbors) {
        let key = `${ndx},${ndy}`;
        if (filled.has(key)) continue;

        let nx = centerX + ndx;
        let ny = centerY + ndy;

        // Check bounds
        if (ny <= 0 || ny >= realHeight || nx <= 0 || nx >= realWidth) continue;

        // Check if this position should be filled based on probability
        let prob = getProbability(ndx, ndy);
        if (Math.random() < prob) {
          simMatrix[ny][nx] = color;
          filled.add(key);
          queue.push([ndx, ndy]);
        }
      }
    }
  }

  /**
   * @param {number} x
   * @param {number} dx
   * @param {number} y
   * @param {number} dy
   * @param {number[][]} colors
   */
  function countNeighbors(x, dx, y, dy, colors) {
    let count = 0;
    for (let iy = y - dy; iy <= y + dy; iy++) {
      for (let ix = x - dx; ix <= x + dx; ix++) {
        if (iy > 0 && iy < realHeight && ix > 0 && ix < realWidth) {
          if (!(iy === y && ix === x)) {
            let color = simMatrix[iy][ix];
            for (let i = 0; i < colors.length; i++) {
              if (colors[i].toString() === color.toString()) {
                count++;
              }
            }
          }
        }
      }
    }
    return count;
  }

  /**
   * @param {number[][][]} matrix
   */
  function deepCopyGameMatrix(matrix) {
    /** @type {number[][][]} */
    let returnedMatrix = [];
    for (let y = 0; y < realHeight; y++) {
      let row = [];
      for (let x = 0; x < realWidth; x++) {
        let item = [];
        for (let i = 0; i < 4; i++) {
          item[i] = matrix[y][x][i];
        }
        row[x] = item;
      }
      returnedMatrix[y] = row;
    }
    return returnedMatrix;
  }

  function initSimulation() {
    if (!canvas) return;

    canvasCtx = /** @type {CanvasRenderingContext2D} */ (
      canvas.getContext('2d')
    );
    imgData = canvasCtx.createImageData(width, height);

    simMatrix = [];
    for (let y = 0; y < realHeight; y++) {
      let row = [];
      for (let x = 0; x < realWidth; x++) {
        if (Math.random() < _houseChance) {
          row[x] = HOUSECOLOR;
        } else if (Math.random() < _treeChance) {
          row[x] = OLDTREE;
        } else {
          row[x] = BACKGROUND;
        }
      }
      simMatrix[y] = row;
    }

    let numStones = Math.floor(Math.random() * MAXSTONES);
    for (let i = 0; i < numStones; i++) {
      generateBlob(MAXSTONESIZE, STONE);
    }
    let numLakes = Math.floor(Math.random() * MAXLAKES);
    for (let i = 0; i < numLakes; i++) {
      generateBlob(MAXLAKESIZE, WATER);
    }
  }

  function runSimulation() {
    if (play) {
      let modifiedMatrix = deepCopyGameMatrix(simMatrix);
      for (let y = 0; y < realHeight; y++) {
        for (let x = 0; x < realWidth; x++) {
          let color = simMatrix[y][x].toString();

          if (color === BACKGROUND.toString()) {
            let aliveNeighbors = countNeighbors(x, 2, y, 2, TREECOLORS);
            if (
              Math.random() <
              _treeSprout + aliveNeighbors * _nearNeighborSprout
            ) {
              modifiedMatrix[y][x] = YOUNGTREE;
            }
          } else if (
            color === OLDTREE.toString() ||
            color === YOUNGTREE.toString()
          ) {
            let burningNeighbors = countNeighbors(x, 1, y, 1, FIRECOLORS);

            if (Math.random() < burningNeighbors * _fireSpreadChance) {
              if (color === YOUNGTREE.toString()) {
                modifiedMatrix[y][x] = FIRECOOL;
              } else if (
                Math.random() <
                burningNeighbors * (_fireSpreadChance / 2)
              ) {
                modifiedMatrix[y][x] = FIRECOOL;
              }
            } else if (Math.random() < _spontaneousCombustion) {
              modifiedMatrix[y][x] = FIRECOOL;
            } else if (color === YOUNGTREE.toString()) {
              if (Math.random() < _treeGrow) {
                modifiedMatrix[y][x] = OLDTREE;
              }
            }
          } else if (color === FIRECOOL.toString()) {
            modifiedMatrix[y][x] = FIREMED;
          } else if (color === FIREMED.toString()) {
            modifiedMatrix[y][x] = FIREHOT;
          } else if (color === FIREHOT.toString()) {
            modifiedMatrix[y][x] = BURNTCOLOR;
          } else if (color === BURNTCOLOR.toString()) {
            if (Math.random() < _burnRepair) {
              modifiedMatrix[y][x] = BACKGROUND;
            }
          }
        }
      }
      simMatrix = deepCopyGameMatrix(modifiedMatrix);
      renderSim();
    }
    setTimeout(runSimulation, simulationDelay);
  }

  function renderSim() {
    if (!canvasCtx || !imgData) return;

    for (let i = 0; i < imgData.data.length; i += 4) {
      let x = (i / 4) % width;
      let y = Math.ceil(((i / 4 + 1) / (height * width)) * height) - 1;

      x = Math.floor(x / scale);
      y = Math.floor(y / scale);

      if (x < realWidth && y < realHeight) {
        let r = simMatrix[y][x][0];
        let g = simMatrix[y][x][1];
        let b = simMatrix[y][x][2];
        let a = simMatrix[y][x][3];

        imgData.data[i + 0] = r;
        imgData.data[i + 1] = g;
        imgData.data[i + 2] = b;
        imgData.data[i + 3] = a;
      }
    }
    canvasCtx.putImageData(imgData, 0, 0);
  }

  // Update dimensions when grid dimensions or scale change
  $: {
    width = _gridWidth * _scale;
    height = _gridHeight * _scale;
    realHeight = _gridHeight;
    realWidth = _gridWidth;
  }

  // Reinitialize simulation when dimensions change
  $: if (canvas && (_gridHeight || _gridWidth || _scale)) {
    initSimulation();
    renderSim();
  }

  onMount(() => {
    initSimulation();
    renderSim();
    runSimulation();
  });
</script>

<div class="fire-sim-container">
  <canvas bind:this={canvas} {width} {height}></canvas>
  <div class="legend">
    <div class="legend-item">
      <span class="legend-box" style="background-color: rgb(51, 31, 14);"
      ></span>
      <span class="legend-label">Empty Ground</span>
    </div>
    <div class="legend-item">
      <span class="legend-box" style="background-color: rgb(0, 255, 0);"></span>
      <span class="legend-label">Young Tree</span>
    </div>
    <div class="legend-item">
      <span class="legend-box" style="background-color: rgb(0, 175, 0);"></span>
      <span class="legend-label">Old Tree</span>
    </div>
    <div class="legend-item">
      <span class="legend-box" style="background-color: rgb(255, 126, 42);"
      ></span>
      <span class="legend-label">Fire (Cool)</span>
    </div>
    <div class="legend-item">
      <span class="legend-box" style="background-color: rgb(220, 50, 0);"
      ></span>
      <span class="legend-label">Fire (Medium)</span>
    </div>
    <div class="legend-item">
      <span class="legend-box" style="background-color: rgb(200, 0, 0);"></span>
      <span class="legend-label">Fire (Hot)</span>
    </div>
    <div class="legend-item">
      <span class="legend-box" style="background-color: rgb(80, 130, 130);"
      ></span>
      <span class="legend-label">Burnt Ground</span>
    </div>
    <div class="legend-item">
      <span class="legend-box" style="background-color: rgb(100, 100, 100);"
      ></span>
      <span class="legend-label">Stone</span>
    </div>
    <div class="legend-item">
      <span class="legend-box" style="background-color: rgb(0, 0, 255);"></span>
      <span class="legend-label">Water</span>
    </div>
  </div>
</div>

<style>
  .fire-sim-container {
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

  @media (max-width: 440px) {
    .legend {
      gap: 0.5rem;
    }

    .legend-item {
      gap: 0.35rem;
    }

    .legend-label {
      font-size: 0.8rem;
    }

    .legend-box {
      width: 14px;
      height: 14px;
    }
  }
</style>
