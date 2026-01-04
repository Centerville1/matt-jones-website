<script>
  import GridAutomata from '../helpers/GridAutomata.svelte';

  /**
   * Helper to get number param value with type safety
   * @param {Record<string, number | boolean | string>} params
   * @param {string} key
   * @returns {number}
   */
  const getNum = (params, key) => /** @type {number} */ (params[key]);

  /** @type {import('../helpers/GridAutomata.types.js').AutomataConfig} */
  const fireSimConfig = {
    states: [
      { id: 'BACKGROUND', color: [51, 31, 14, 255], name: 'Empty Ground' },
      { id: 'YOUNG_TREE', color: [0, 255, 0, 255], name: 'Young Tree' },
      { id: 'OLD_TREE', color: [0, 175, 0, 255], name: 'Old Tree' },
      { id: 'HOUSE', color: [130, 100, 150, 255], name: 'House' },
      { id: 'STONE', color: [100, 100, 100, 255], name: 'Stone' },
      { id: 'WATER', color: [0, 0, 255, 255], name: 'Water' },
      { id: 'BURNT', color: [80, 130, 130, 255], name: 'Burnt Ground' },
      { id: 'FIRE_COOL', color: [255, 126, 42, 255], name: 'Fire (Cool)' },
      { id: 'FIRE_MED', color: [220, 50, 0, 255], name: 'Fire (Medium)' },
      { id: 'FIRE_HOT', color: [200, 0, 0, 255], name: 'Fire (Hot)' }
    ],

    params: {
      treeChance: {
        type: 'number',
        default: 0.05,
        min: 0,
        max: 0.2,
        step: 0.01,
        label: 'Initial Tree Density',
        description: 'Probability that each cell starts as a tree when the simulation is initialized'
      },
      treeSprout: {
        type: 'number',
        default: 0.000000001,
        min: 0,
        max: 0.0001,
        step: 0.000000001,
        label: 'Tree Sprout Base Rate',
        description: 'Base probability per frame that a tree will sprout on empty ground (multiplied by neighbor count)'
      },
      nearNeighborSprout: {
        type: 'number',
        default: 0.001,
        min: 0,
        max: 0.01,
        step: 0.0001,
        label: 'Neighbor Sprout Multiplier',
        description: 'Multiplier applied to sprout rate for each neighboring tree (encourages forest clustering)'
      },
      treeGrow: {
        type: 'number',
        default: 0.01,
        min: 0,
        max: 0.1,
        step: 0.001,
        label: 'Tree Growth Rate',
        description: 'Probability per frame that a young tree matures into an old tree'
      },
      burnRepair: {
        type: 'number',
        default: 0.1,
        min: 0,
        max: 1,
        step: 0.01,
        label: 'Burn Repair Rate',
        description: 'Probability per frame that burnt ground recovers back to empty ground'
      },
      houseChance: {
        type: 'number',
        default: 0,
        min: 0,
        max: 0.1,
        step: 0.001,
        label: 'Initial House Density',
        description: 'Probability that each cell starts as a house when the simulation is initialized'
      },
      spontaneousCombustion: {
        type: 'number',
        default: 0.000004,
        min: 0,
        max: 0.0001,
        step: 0.000001,
        label: 'Spontaneous Combustion',
        description: 'Probability per frame that a tree spontaneously catches fire (like lightning strikes)'
      },
      fireSpread: {
        type: 'number',
        default: 0.33,
        min: 0,
        max: 1,
        step: 0.01,
        label: 'Fire Spread Chance',
        description: 'Probability that fire spreads from a burning cell to an adjacent tree'
      },
      stoneCount: {
        type: 'number',
        default: 10,
        min: 0,
        max: 50,
        step: 1,
        label: 'Initial Stone Blob Multiplier',
        description: 'Multiplier for stone formations (base: 0-10 random blobs per reset) [reset required]'
      },
      lakeCount: {
        type: 'number',
        default: 2,
        min: 0,
        max: 10,
        step: 1,
        label: 'Initial Lake Count Multiplier',
        description: 'Multiplier for water lakes (base: 0-2 random lakes per reset) [reset required]'
      },
      stoneSize: {
        type: 'number',
        default: 6,
        min: 1,
        max: 50,
        step: 1,
        label: 'Stone Blob Max Size',
        description: 'Maximum size for each stone formation (affects blob generation radius) [reset required]'
      },
      lakeSize: {
        type: 'number',
        default: 10,
        min: 1,
        max: 50,
        step: 1,
        label: 'Lake Max Size',
        description: 'Maximum size for each water lake (affects blob generation radius) [reset required]'
      }
    },

    defaultGridSize: { width: 100, height: 50 },
    defaultScale: 10,
    targetFPS: 5,
    autoPlay: true,
    neighborhoodType: 'moore',
    neighborhoodRadius: 2,

    initializeCell: (_x, _y, _width, _height, params, states) => {
      if (Math.random() < getNum(params, 'houseChance')) {
        return states.HOUSE;
      } else if (Math.random() < getNum(params, 'treeChance')) {
        return states.OLD_TREE;
      }
      return states.BACKGROUND;
    },

    postInitialize: (grid, _width, _height, params, states, helpers) => {
      // Add stone blobs
      const numStones = Math.floor(Math.random() * getNum(params, 'stoneCount'));
      for (let i = 0; i < numStones; i++) {
        helpers.generateBlob(grid, states.STONE, getNum(params, 'stoneSize'));
      }

      // Add water lakes
      const numLakes = Math.floor(Math.random() * getNum(params, 'lakeCount'));
      for (let i = 0; i < numLakes; i++) {
        helpers.generateBlob(grid, states.WATER, getNum(params, 'lakeSize'));
      }
    },

    updateCell: (cellState, neighbors, x, y, width, height, params, states) => {
      // Background: trees can sprout (uses full radius 2 neighborhood)
      if (cellState === states.BACKGROUND) {
        const treeNeighbors = neighbors.count([states.YOUNG_TREE, states.OLD_TREE]);
        if (Math.random() < getNum(params, 'treeSprout') + treeNeighbors * getNum(params, 'nearNeighborSprout')) {
          return states.YOUNG_TREE;
        }
      }

      // Trees: can catch fire or grow
      else if (cellState === states.YOUNG_TREE || cellState === states.OLD_TREE) {
        // Count burning neighbors (only radius 1 for fire spread)
        // Filter to neighbors within Chebyshev distance 1 (3x3 grid)
        const burningNeighbors = neighbors.grid
          .filter(([dx, dy]) => Math.max(Math.abs(dx), Math.abs(dy)) <= 1)
          .filter(([, , state]) =>
            state === states.FIRE_COOL ||
            state === states.FIRE_MED ||
            state === states.FIRE_HOT
          ).length;

        // Fire spreads from neighbors
        if (burningNeighbors > 0) {
          if (Math.random() < burningNeighbors * getNum(params, 'fireSpread')) {
            // Young trees catch fire easier
            if (cellState === states.YOUNG_TREE) {
              return states.FIRE_COOL;
            }
            // Old trees are more resistant
            else if (Math.random() < burningNeighbors * (getNum(params, 'fireSpread') / 2)) {
              return states.FIRE_COOL;
            }
          }
        }
        // Spontaneous combustion
        else if (Math.random() < getNum(params, 'spontaneousCombustion')) {
          return states.FIRE_COOL;
        }

        // Young trees grow into old trees
        if (cellState === states.YOUNG_TREE && Math.random() < getNum(params, 'treeGrow')) {
          return states.OLD_TREE;
        }
      }

      // Fire progression
      else if (cellState === states.FIRE_COOL) {
        return states.FIRE_MED;
      } else if (cellState === states.FIRE_MED) {
        return states.FIRE_HOT;
      } else if (cellState === states.FIRE_HOT) {
        return states.BURNT;
      }

      // Burnt ground slowly recovers
      else if (cellState === states.BURNT) {
        if (Math.random() < getNum(params, 'burnRepair')) {
          return states.BACKGROUND;
        }
      }

      // No change
      return cellState;
    }
  };
</script>

<GridAutomata config={fireSimConfig} />
