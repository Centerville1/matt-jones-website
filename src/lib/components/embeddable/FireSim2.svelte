<script>
  import GridAutomata from '../helpers/GridAutomata.svelte';

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
        default: 0.05,
        min: 0,
        max: 0.2,
        step: 0.01,
        label: 'Initial Tree Density'
      },
      treeSprout: {
        default: 0.000000001,
        min: 0,
        max: 0.0001,
        step: 0.000000001,
        label: 'Tree Sprout Base Rate'
      },
      nearNeighborSprout: {
        default: 0.001,
        min: 0,
        max: 0.01,
        step: 0.0001,
        label: 'Neighbor Sprout Multiplier'
      },
      treeGrow: {
        default: 0.01,
        min: 0,
        max: 0.1,
        step: 0.001,
        label: 'Tree Growth Rate'
      },
      burnRepair: {
        default: 0.1,
        min: 0,
        max: 1,
        step: 0.01,
        label: 'Burn Repair Rate'
      },
      houseChance: {
        default: 0,
        min: 0,
        max: 0.1,
        step: 0.001,
        label: 'Initial House Density'
      },
      spontaneousCombustion: {
        default: 0.000004,
        min: 0,
        max: 0.0001,
        step: 0.000001,
        label: 'Spontaneous Combustion'
      },
      fireSpread: {
        default: 0.33,
        min: 0,
        max: 1,
        step: 0.01,
        label: 'Fire Spread Chance'
      }
    },

    defaultGridSize: { width: 100, height: 50 },
    defaultScale: 10,
    targetFPS: 5,
    autoPlay: true,
    neighborhoodType: 'moore',
    neighborhoodRadius: 2,

    initializeCell: (_x, _y, _width, _height, params, states) => {
      if (Math.random() < params.houseChance) {
        return states.HOUSE;
      } else if (Math.random() < params.treeChance) {
        return states.OLD_TREE;
      }
      return states.BACKGROUND;
    },

    postInitialize: (grid, _width, _height, _params, states, helpers) => {
      // Add stone blobs
      const numStones = Math.floor(Math.random() * 10);
      for (let i = 0; i < numStones; i++) {
        helpers.generateBlob(grid, states.STONE, 6);
      }

      // Add water lakes
      const numLakes = Math.floor(Math.random() * 2);
      for (let i = 0; i < numLakes; i++) {
        helpers.generateBlob(grid, states.WATER, 10);
      }
    },

    updateCell: (cellState, neighbors, x, y, width, height, params, states) => {
      // Background: trees can sprout (uses full radius 2 neighborhood)
      if (cellState === states.BACKGROUND) {
        const treeNeighbors = neighbors.count([states.YOUNG_TREE, states.OLD_TREE]);
        if (Math.random() < params.treeSprout + treeNeighbors * params.nearNeighborSprout) {
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
          if (Math.random() < burningNeighbors * params.fireSpread) {
            // Young trees catch fire easier
            if (cellState === states.YOUNG_TREE) {
              return states.FIRE_COOL;
            }
            // Old trees are more resistant
            else if (Math.random() < burningNeighbors * (params.fireSpread / 2)) {
              return states.FIRE_COOL;
            }
          }
        }
        // Spontaneous combustion
        else if (Math.random() < params.spontaneousCombustion) {
          return states.FIRE_COOL;
        }

        // Young trees grow into old trees
        if (cellState === states.YOUNG_TREE && Math.random() < params.treeGrow) {
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
        if (Math.random() < params.burnRepair) {
          return states.BACKGROUND;
        }
      }

      // No change
      return cellState;
    }
  };
</script>

<GridAutomata config={fireSimConfig} />
