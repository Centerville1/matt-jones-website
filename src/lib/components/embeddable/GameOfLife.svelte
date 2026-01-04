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
  const gameOfLifeConfig = {
    states: [
      { id: 'DEAD', color: [20, 20, 20, 255], name: 'Dead' },
      { id: 'ALIVE', color: [0, 150, 255, 255], name: 'Alive' }
    ],

    params: {
      initialPattern: {
        type: 'select',
        default: 2,
        options: [
          { value: 0, label: 'Random' },
          { value: 1, label: 'Glider' },
          { value: 2, label: 'Glider Gun' },
          { value: 3, label: 'Empty' }
        ],
        label: 'Initial Pattern',
        description: 'Pattern to start with [reset required]'
      },
      randomDensity: {
        type: 'number',
        default: 0.3,
        min: 0,
        max: 1,
        step: 0.05,
        label: 'Random Density',
        description: 'Probability of cell being alive when Random pattern is selected [reset required]'
      }
    },

    defaultGridSize: { width: 80, height: 50 },
    defaultScale: 10,
    targetFPS: 60,
    autoPlay: true,
    neighborhoodType: 'moore',
    neighborhoodRadius: 1,

    initializeCell: (_x, _y, _width, _height, params, states) => {
      // Will be overridden by postInitialize for patterns
      if (getNum(params, 'initialPattern') === 0) {
        // Random pattern
        return Math.random() < getNum(params, 'randomDensity') ? states.ALIVE : states.DEAD;
      }
      return states.DEAD;
    },

    postInitialize: (grid, width, height, params, states, helpers) => {
      // Glider pattern
      const glider = [
        [0, 0, 1],
        [1, 0, 1],
        [0, 1, 1]
      ];

      // Blinker pattern
      const blinker = [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ];

      // Glider Gun (Gosper's Glider Gun)
      const gun = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];

      /**
       * Paste a pattern template onto the grid
       * @param {number} startX
       * @param {number} startY
       * @param {number[][]} template
       */
      function pasteTemplate(startX, startY, template) {
        for (let y = 0; y < template.length; y++) {
          for (let x = 0; x < template[y].length; x++) {
            if (template[y][x] === 1) {
              const gridX = startX + x;
              const gridY = startY + y;
              if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
                helpers.setCell(gridX, gridY, states.ALIVE);
              }
            }
          }
        }
      }

      // Apply selected pattern
      const pattern = getNum(params, 'initialPattern');
      if (pattern === 1) {
        // Glider
        pasteTemplate(5, 5, glider);
        pasteTemplate(17, 16, blinker);
      } else if (pattern === 2) {
        // Glider Gun (centered)
        // const gunWidth = gun[0].length;
        // const gunHeight = gun.length;
        // const startX = Math.floor((width - gunWidth) / 2);
        // const startY = Math.floor((height - gunHeight) / 2);
        // Glider Gun (top left)
        const startX = 10;
        const startY = 10
        pasteTemplate(startX, startY, gun);
      }
      // Pattern 3 (Empty) and 0 (Random) are already handled by initializeCell
    },

    updateCell: (cellState, neighbors, _x, _y, _width, _height, _params, states) => {
      // Count living neighbors
      const aliveNeighbors = neighbors.count([states.ALIVE]);

      if (cellState === states.ALIVE) {
        // Living cells with 2 or 3 neighbors stay alive (survival)
        if (aliveNeighbors === 2 || aliveNeighbors === 3) {
          return states.ALIVE;
        }
        // Otherwise, they die (overpopulation or underpopulation)
        return states.DEAD;
      } else {
        // Dead cells with exactly 3 neighbors become alive (birth)
        if (aliveNeighbors === 3) {
          return states.ALIVE;
        }
      }

      return cellState;
    }
  };
</script>

<GridAutomata config={gameOfLifeConfig} />
