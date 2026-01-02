<script>
  // Props for configuration
  export let gridHeight = 50;
  export let gridWidth = 50;
  export let scale = 10;
  export let treeChance = 0.05;
  export let treeSprout = 0.000000001;
  export let nearNeighborSprout = 0.001;
  export let treeGrow = 0.01;
  export let burnRepair = 0.1;
  export let houseChance = 0;
  export let spontaneousCombustion = 0.000004;
  export let fireSpreadChance = 0.33;
  export let autoPlay = false;
  export let showControls = true;

  // Component linking props
  /** @type {any} */
  export const contextStore = undefined;
  /** @type {((data: any) => void) | undefined} */
  export let updateContext = undefined;

  // Internal state for probabilities menu and simulation control
  let showProbabilities = false;
  let play = autoPlay;
  let resetTrigger = 0; // Increment to trigger reset in FireSim

  // Note: We don't read from contextStore in the control component
  // The control component is the source of truth for these values

  // Update context when values change
  $: if (updateContext) {
    updateContext({
      gridHeight,
      gridWidth,
      scale,
      treeChance,
      treeSprout,
      nearNeighborSprout,
      treeGrow,
      burnRepair,
      houseChance,
      spontaneousCombustion,
      fireSpreadChance,
      play,
      resetTrigger,
    });
  }

  function toggleProbabilities() {
    showProbabilities = !showProbabilities;
  }

  function togglePlay() {
    play = !play;
  }

  function resetSim() {
    play = false;
    resetTrigger++;
  }
</script>

{#if showControls}
  <div class="firesim-control-container">
    <div class="controls-section">
      <h3>Fire Simulation Controls</h3>

      <!-- Play/Pause and Restart Controls -->
      <div class="simulation-controls">
        <button class="control-button" on:click={togglePlay} type="button">
          {#if play}
            Pause
          {:else}
            Play
          {/if}
        </button>
        <button class="control-button" on:click={resetSim} type="button"
          >Restart</button
        >
      </div>

      <!-- Primary Size Controls -->
      <div class="primary-controls">
        <div class="slider-group">
          <label for="grid-height">Grid Height: {gridHeight}</label>
          <input
            type="range"
            min="20"
            max="70"
            step="5"
            class="slider"
            id="grid-height"
            bind:value={gridHeight}
          />
        </div>

        <div class="slider-group">
          <label for="grid-width">Grid Width: {gridWidth}</label>
          <input
            type="range"
            min="20"
            max="200"
            step="5"
            class="slider"
            id="grid-width"
            bind:value={gridWidth}
          />
        </div>
      </div>

      <!-- Expandable Probability Controls -->
      <div class="probability-section">
        <button
          class="expand-button"
          on:click={toggleProbabilities}
          type="button"
        >
          <span class="arrow" class:expanded={showProbabilities}>▶</span>
          Probability Settings
        </button>

        {#if showProbabilities}
          <div class="probability-controls">
            <div class="slider-group">
              <label
                for="tree-chance"
                title="Initial probability of a cell being a tree"
              >
                Tree Chance: {treeChance.toFixed(3)}
                <span class="default-value">Default: 0.05</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                class="slider"
                id="tree-chance"
                bind:value={treeChance}
                title="Initial probability of a cell being a tree"
              />
            </div>

            <div class="slider-group">
              <label
                for="tree-sprout"
                title="Base probability of a tree sprouting on empty ground"
              >
                Tree Sprout: {treeSprout.toExponential(2)}
                <span class="default-value">Default: 1.00e-9</span>
              </label>
              <input
                type="range"
                min="0"
                max="0.001"
                step="0.000000001"
                class="slider"
                id="tree-sprout"
                bind:value={treeSprout}
                title="Base probability of a tree sprouting on empty ground"
              />
            </div>

            <div class="slider-group">
              <label
                for="neighbor-sprout"
                title="Probability boost per neighboring tree for sprouting"
              >
                Near Neighbor Sprout: {nearNeighborSprout.toFixed(4)}
                <span class="default-value">Default: 0.001</span>
              </label>
              <input
                type="range"
                min="0"
                max="0.01"
                step="0.0001"
                class="slider"
                id="neighbor-sprout"
                bind:value={nearNeighborSprout}
                title="Probability boost per neighboring tree for sprouting"
              />
            </div>

            <div class="slider-group">
              <label
                for="tree-grow"
                title="Probability of young tree becoming old tree"
              >
                Tree Grow: {treeGrow.toFixed(3)}
                <span class="default-value">Default: 0.01</span>
              </label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.001"
                class="slider"
                id="tree-grow"
                bind:value={treeGrow}
                title="Probability of young tree becoming old tree"
              />
            </div>

            <div class="slider-group">
              <label
                for="burn-repair"
                title="Probability of burnt ground recovering"
              >
                Burn Repair: {burnRepair.toFixed(2)}
                <span class="default-value">Default: 0.1</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                class="slider"
                id="burn-repair"
                bind:value={burnRepair}
                title="Probability of burnt ground recovering"
              />
            </div>

            <div class="slider-group">
              <label
                for="spontaneous"
                title="Probability of a tree spontaneously catching fire"
              >
                Spontaneous Combustion: {spontaneousCombustion.toExponential(2)}
                <span class="default-value">Default: 4.00e-6</span>
              </label>
              <input
                type="range"
                min="0"
                max="0.001"
                step="0.000001"
                class="slider"
                id="spontaneous"
                bind:value={spontaneousCombustion}
                title="Probability of a tree spontaneously catching fire"
              />
            </div>

            <div class="slider-group">
              <label
                for="fire-spread"
                title="Probability of fire spreading to neighboring tree"
              >
                Fire Spread: {fireSpreadChance.toFixed(2)}
                <span class="default-value">Default: 0.33</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                class="slider"
                id="fire-spread"
                bind:value={fireSpreadChance}
                title="Probability of fire spreading to neighboring tree"
              />
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .firesim-control-container {
    width: 100%;
    padding: 1rem;
    margin: 1rem 0;
  }

  .controls-section {
    background-color: var(--neutral-gray);
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid var(--neutral-dark-gray-op-50);
  }

  h3 {
    margin: 0 0 1rem 0;
    color: var(--contrast-text-light);
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
  }

  .simulation-controls {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .control-button {
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

  .control-button:hover {
    background-color: var(--main-blue-light);
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
  }

  .default-value {
    display: block;
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--neutral-light-gray);
    margin-top: 0.25rem;
  }

  .slider {
    width: 100%;
    cursor: pointer;
    accent-color: var(--main-blue);
  }

  .probability-section {
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

  .probability-controls {
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

  @media (max-width: 440px) {
    .primary-controls,
    .probability-controls {
      flex-direction: column;
      align-items: center;
    }

    .slider-group {
      width: 100%;
      max-width: 300px;
    }
  }
</style>
