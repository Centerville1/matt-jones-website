<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // Props for configuration
  export let diameter = 290;
  export let longitudeLines = 9;
  export let latitudeLines = 5;
  export let animationSpeed = 30;
  export let colorIndex = 0;
  export let animate = true;
  export let showControls = true;
  export let showSphere = true;

  // Component linking props
  /** @type {any} */
  export let contextStore = undefined;
  /** @type {((data: any) => void) | undefined} */
  export let updateContext = undefined;

  const animationSpeedSteps = 300;
  let rotateX = 30;
  let rotateY = 30;
  let rotateZ = 30;

  let colors = [
    { title: 'Light Blue', variable: '--main-blue-light' },
    { title: 'Red', variable: '--red' },
    { title: 'Green', variable: '--green' },
    { title: 'Purple', variable: '--contrast-purple' },
    { title: 'White', variable: '--neutral-black' },
    { title: 'Dark Blue', variable: '--logo-blue' },
    { title: 'Black', variable: '--neutral-white' },
  ];

  // If context store is provided, use it to initialize values
  $: if (contextStore && $contextStore) {
    if ($contextStore.diameter !== undefined) diameter = $contextStore.diameter;
    if ($contextStore.longitudeLines !== undefined)
      longitudeLines = $contextStore.longitudeLines;
    if ($contextStore.latitudeLines !== undefined)
      latitudeLines = $contextStore.latitudeLines;
    if ($contextStore.animationSpeed !== undefined)
      animationSpeed = $contextStore.animationSpeed;
    if ($contextStore.colorIndex !== undefined)
      colorIndex = $contextStore.colorIndex;
    if ($contextStore.animate !== undefined) animate = $contextStore.animate;
    if ($contextStore.rotateX !== undefined) rotateX = $contextStore.rotateX;
    if ($contextStore.rotateY !== undefined) rotateY = $contextStore.rotateY;
    if ($contextStore.rotateZ !== undefined) rotateZ = $contextStore.rotateZ;
  }

  // Update context when values change
  $: if (updateContext) {
    updateContext({
      diameter,
      longitudeLines,
      latitudeLines,
      animationSpeed,
      colorIndex,
      animate,
      rotateX,
      rotateY,
      rotateZ,
    });
  }

  // Sphere building logic
  $: if (browser && showSphere) {
    buildSphere();
  }

  $: if (browser && showSphere) {
    updateColor();
  }

  $: if (browser && showSphere) {
    updateAnimation();
  }

  $: if (browser && showSphere) {
    updateRotation();
  }

  function updateColor() {
    if (!browser) return;
    const sphere = document.getElementById('sphere-embed');
    if (!sphere) return;

    const latLines = sphere.getElementsByClassName('lat-line');
    const longLines = sphere.getElementsByClassName('long-line');
    const colorVar = colors[colorIndex]?.variable || colors[0].variable;

    for (let i = 0; i < latLines.length; i++) {
      /** @type {HTMLElement} */ (latLines[i]).style.borderColor =
        `var(${colorVar})`;
    }
    for (let i = 0; i < longLines.length; i++) {
      /** @type {HTMLElement} */ (longLines[i]).style.borderColor =
        `var(${colorVar})`;
    }
  }

  function updateAnimation() {
    if (!browser) return;
    const sphere = document.getElementById('sphere-embed');
    if (!sphere) return;

    sphere.style.animationDuration = `${animationSpeedSteps / animationSpeed}s`;
    sphere.style.animationTimingFunction = 'linear';
    sphere.style.animationName = animate ? 'spin' : 'none';
    sphere.style.animationIterationCount = 'infinite';
  }

  function updateRotation() {
    if (!browser) return;
    const sphere = document.getElementById('sphere-embed');
    if (!sphere) return;

    sphere.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
  }

  function buildSphere() {
    if (!browser) return;
    const sphere = document.getElementById('sphere-embed');
    const container = document.getElementById('container-embed');
    if (!sphere || !container) return;

    sphere.innerHTML = '';
    sphere.style.width = `${diameter}px`;
    container.style.width = `${diameter}px`;
    container.style.height = `${diameter}px`;

    const longAngleDiff = 360 / longitudeLines;

    // Add longitude lines
    for (let i = 0; i < longitudeLines; i++) {
      const longLine = document.createElement('div');
      longLine.classList.add('long-line');
      longLine.style.transform = `rotateY(${longAngleDiff * i}deg)`;
      sphere.appendChild(longLine);
    }

    // Calculate latitude lines
    const pi = 3.14159;
    const equatorRadius = diameter / 2;
    const angularSpacing = pi / (latitudeLines + 1);
    /** @type {Array<{offset: number, radius: number}>} */
    const yOffsets = [];

    for (let i = 1; i <= latitudeLines; i++) {
      let angleToEquator = angularSpacing * i;
      if (angularSpacing * i > pi / 2) {
        angleToEquator = pi - angleToEquator;
      }
      const latitudeRadius = equatorRadius * Math.sin(angleToEquator);
      const currYOffset = equatorRadius * Math.cos(angleToEquator);
      yOffsets.push({ offset: currYOffset, radius: latitudeRadius });
    }

    // Add equator if odd number of latitude lines
    if (latitudeLines % 2 !== 0) {
      const latLine = document.createElement('div');
      latLine.classList.add('lat-line');
      latLine.style.width = '100%';
      sphere.appendChild(latLine);
    }

    // Add latitude lines
    for (let i = 0; i < latitudeLines; i++) {
      const latLine = document.createElement('div');
      latLine.classList.add('lat-line');
      const width = yOffsets[i].radius * 2;
      const translateZ = (i < latitudeLines / 2 ? -1 : 1) * yOffsets[i].offset;
      latLine.style.width = `${width}px`;
      latLine.style.transform = `rotateX(90deg) translateZ(${translateZ}px)`;
      sphere.appendChild(latLine);
    }

    // Set line heights equal to width (for circular borders)
    const latLines = sphere.getElementsByClassName('lat-line');
    const longLines = sphere.getElementsByClassName('long-line');
    const colorVar = colors[colorIndex]?.variable || colors[0].variable;

    for (let i = 0; i < latLines.length; i++) {
      const latLine = /** @type {HTMLElement} */ (latLines[i]);
      latLine.style.height = `${latLine.clientWidth}px`;
      latLine.style.borderColor = `var(${colorVar})`;
    }
    for (let i = 0; i < longLines.length; i++) {
      const longLine = /** @type {HTMLElement} */ (longLines[i]);
      longLine.style.height = `${longLine.clientWidth}px`;
      longLine.style.borderColor = `var(${colorVar})`;
    }

    updateAnimation();
    updateRotation();
  }

  onMount(() => {
    if (showSphere) {
      buildSphere();
    }
  });
</script>

<div class="sphere-control-container">
  {#if showControls}
    <div class="slider-container">
      <div class="slider-group">
        <label for="animate-embed">
          <input id="animate-embed" type="checkbox" bind:checked={animate} />
          Play Animation
        </label>
      </div>
      <div class="slider-group">
        <label for="speed-embed">Rotation Speed</label>
        <input
          type="range"
          min="1"
          max={animationSpeedSteps}
          class="slider"
          id="speed-embed"
          bind:value={animationSpeed}
        />
      </div>
      <div class="slider-group">
        <label for="diam-embed">Diameter: {diameter}px</label>
        <input
          type="range"
          min="10"
          max="700"
          step="10"
          class="slider"
          id="diam-embed"
          bind:value={diameter}
        />
      </div>
      <div class="slider-group">
        <label for="long-embed">Longitude Lines: {longitudeLines}</label>
        <input
          type="range"
          min="1"
          max="50"
          step="2"
          class="slider"
          id="long-embed"
          bind:value={longitudeLines}
        />
      </div>
      <div class="slider-group">
        <label for="lat-embed">Latitude Lines: {latitudeLines}</label>
        <input
          type="range"
          min="1"
          max="50"
          class="slider"
          id="lat-embed"
          bind:value={latitudeLines}
        />
      </div>
      <div class="slider-group">
        <label for="color-embed"
          >Color: {colors[colorIndex]?.title || 'Unknown'}</label
        >
        <input
          type="range"
          min="0"
          max={colors.length - 1}
          class="slider"
          id="color-embed"
          bind:value={colorIndex}
        />
      </div>
      {#if !animate}
        <div class="slider-group">
          <label for="rotateX-embed">X Rotation: {rotateX}°</label>
          <input
            type="range"
            min="0"
            max="360"
            class="slider"
            id="rotateX-embed"
            bind:value={rotateX}
          />
        </div>
        <div class="slider-group">
          <label for="rotateY-embed">Y Rotation: {rotateY}°</label>
          <input
            type="range"
            min="0"
            max="360"
            class="slider"
            id="rotateY-embed"
            bind:value={rotateY}
          />
        </div>
        <div class="slider-group">
          <label for="rotateZ-embed">Z Rotation: {rotateZ}°</label>
          <input
            type="range"
            min="0"
            max="360"
            class="slider"
            id="rotateZ-embed"
            bind:value={rotateZ}
          />
        </div>
      {/if}
    </div>
  {/if}

  {#if showSphere}
    <div class="sphere-wrapper">
      <div id="container-embed">
        <div class="scene">
          <div id="sphere-embed"></div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .sphere-control-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 1rem;
  }

  .slider-container {
    width: 100%;
    max-width: 800px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
    color: var(--contrast-text-light);
  }

  .slider-group {
    width: 140px;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .slider-group label {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .slider {
    width: 100%;
    cursor: pointer;
  }

  input[type='checkbox'] {
    cursor: pointer;
    margin-right: 0.5rem;
  }

  .sphere-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

  #container-embed {
    position: relative;
    perspective: 1000px;
  }

  .scene {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
  }

  #sphere-embed {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  #sphere-embed :global(.long-line),
  #sphere-embed :global(.lat-line) {
    position: absolute;
    border: 2px solid;
    border-radius: 50%;
    transform-style: preserve-3d;
  }

  #sphere-embed :global(.long-line) {
    width: 100%;
    left: 0;
    top: 0;
  }

  #sphere-embed :global(.lat-line) {
    left: 50%;
    top: 50%;
    margin-left: calc(var(--width, 100%) / -2);
    margin-top: calc(var(--height, 100%) / -2);
  }

  @keyframes spin {
    from {
      transform: rotateX(0deg) rotateY(0deg);
    }
    to {
      transform: rotateX(360deg) rotateY(360deg);
    }
  }
</style>
