<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // Component props (configurable from blog editor)
  export let size = 300;
  export let rotationSpeed = 1;
  export let lineColor = '#00a8ff';

  // Component linking props
  /** @type {any} */
  export let contextStore = undefined;

  // Generate unique ID for this instance
  const instanceId = `sphere-${Math.random().toString(36).substr(2, 9)}`;
  const sphereId = `${instanceId}-sphere`;
  const containerId = `${instanceId}-container`;

  // Internal display settings
  let diameter = size;
  let numLongLines = 9;
  let numLatLines = 5;
  let animate = rotationSpeed > 0;
  let animationSpeed = rotationSpeed > 0 ? 30 / rotationSpeed : 30;

  // Rotational translation props
  let rotateX = 0;
  let rotateY = 0;
  let rotateZ = 0;

  // Color mapping from context color index to CSS variable
  const colors = [
    '--main-blue-light',
    '--red',
    '--green',
    '--contrast-purple',
    '--neutral-black',
    '--logo-blue',
    '--neutral-white',
  ];

  // Use context values if available, otherwise use props
  $: if (contextStore && $contextStore) {
    if ($contextStore.diameter !== undefined) diameter = $contextStore.diameter;
    if ($contextStore.longitudeLines !== undefined)
      numLongLines = $contextStore.longitudeLines;
    if ($contextStore.latitudeLines !== undefined)
      numLatLines = $contextStore.latitudeLines;
    if ($contextStore.animationSpeed !== undefined) {
      const speedSteps = 300;
      animationSpeed = speedSteps / $contextStore.animationSpeed;
    }
    if ($contextStore.colorIndex !== undefined) {
      const colorVar = colors[$contextStore.colorIndex] || colors[0];
      lineColor = `var(${colorVar})`;
    }
    if ($contextStore.animate !== undefined) animate = $contextStore.animate;
    if ($contextStore.rotateX !== undefined) rotateX = $contextStore.rotateX;
    if ($contextStore.rotateY !== undefined) rotateY = $contextStore.rotateY;
    if ($contextStore.rotateZ !== undefined) rotateZ = $contextStore.rotateZ;
  } else {
    // Only use props when no context is provided
    diameter = size;
    animate = rotationSpeed > 0;
    animationSpeed = rotationSpeed > 0 ? 30 / rotationSpeed : 30;
  }

  $: buildSphere(diameter, numLongLines, numLatLines);
  $: updateColor(lineColor);
  $: updateAnimation(animate, animationSpeed, 'linear');
  $: updateRotation(rotateX, rotateY, rotateZ);

  /**
   * @param {string} colorValue
   */
  function updateColor(colorValue) {
    if (!browser) return;
    const sphere = document.getElementById(sphereId);
    if (!sphere) return;

    const latLines = sphere.getElementsByClassName('lat-line');
    const longLines = sphere.getElementsByClassName('long-line');

    for (let i = 0; i < latLines.length; i++) {
      let latLine = /** @type {HTMLElement} */ (latLines[i]);
      latLine.style.borderColor = colorValue;
    }
    for (let i = 0; i < longLines.length; i++) {
      let longLine = /** @type {HTMLElement} */ (longLines[i]);
      longLine.style.borderColor = colorValue;
    }
  }

  /**
   * @param {boolean} isSpinning
   * @param {number | null} [animationDuration]
   * @param {string | null} [animTiming]
   */
  function updateAnimation(
    isSpinning,
    animationDuration = null,
    animTiming = null,
  ) {
    if (!browser) return;
    const sphere = document.getElementById(sphereId);
    if (sphere !== null) {
      console.log('[Sphere] updateAnimation called:', {
        isSpinning,
        animationDuration,
        sphereId,
      });
      if (animationDuration !== null)
        sphere.style.animationDuration = animationDuration + 's';
      if (animTiming !== null)
        sphere.style.animationTimingFunction = animTiming;
      if (isSpinning) {
        sphere.style.animationName = 'spin';
        sphere.style.animationPlayState = 'running';
        // Clear manual transform when animating
        sphere.style.transform = '';
        console.log('[Sphere] Animation enabled, transform cleared');
      } else {
        sphere.style.animationName = 'none';
        sphere.style.animationPlayState = 'paused';
        console.log('[Sphere] Animation disabled');
      }
      sphere.style.animationIterationCount = 'infinite';
      console.log(
        '[Sphere] Final animation state:',
        sphere.style.animationName,
        sphere.style.animationPlayState,
        sphere.style.animationDuration,
        sphere.style.animationTimingFunction,
        sphere.style.animationIterationCount,
      );
    }
  }

  /**
   * @param {number} Xdegrees
   * @param {number} Ydegrees
   * @param {number} Zdegrees
   */
  function updateRotation(Xdegrees, Ydegrees, Zdegrees) {
    if (!browser) return;
    const sphere = document.getElementById(sphereId);
    // Only apply manual rotation when not animating
    if (sphere !== null && !animate) {
      sphere.style.transform =
        'rotateX(' +
        Xdegrees +
        'deg) rotateY(' +
        Ydegrees +
        'deg) rotateZ(' +
        Zdegrees +
        'deg)';
    }
  }

  /**
   * @param {number} diameter
   * @param {number} numLongLines
   * @param {number} numLatLines
   */
  function buildSphere(diameter, numLongLines, numLatLines) {
    if (!browser) return;
    const sphere = document.getElementById(sphereId);
    const container = document.getElementById(containerId);
    if (sphere !== null && container !== null) {
      sphere.innerHTML = '';
      sphere.style.width = diameter + 'px';
      updateAnimation(animate, animationSpeed, 'linear');
      updateRotation(rotateX, rotateY, rotateZ);
      container.style.width = diameter + 'px';
      container.style.height = diameter + 'px';
      const longAngleDiff = 360 / numLongLines;

      // Add longitude lines
      for (let i = 0; i < numLongLines; i++) {
        let longLine = document.createElement('div');
        longLine.classList.add('long-line');
        longLine.style.cssText =
          'transform: rotateY(' + longAngleDiff * i + 'deg); ';
        sphere?.appendChild(longLine);
      }

      const pi = 3.14159,
        equatorRadius = diameter / 2,
        angularSpacing = pi / (numLatLines + 1);
      let yOffsets = [];

      // Calculate position and size of each latitude line
      for (let i = 1; i <= numLatLines; i++) {
        let angleToEquator = angularSpacing * i;
        if (angularSpacing * i > pi / 2) {
          angleToEquator = pi - angleToEquator;
        }
        let latitudeRadius = equatorRadius * Math.sin(angleToEquator);
        let currYOffset = equatorRadius * Math.cos(angleToEquator);
        yOffsets.push({ offset: currYOffset, radius: latitudeRadius });
      }

      if (numLatLines % 2 !== 0) {
        let latLine = document.createElement('div');
        latLine.classList.add('lat-line');
        latLine.style.cssText = 'width: 100%;';
        sphere?.appendChild(latLine);
      }

      for (let i = 0; i < numLatLines; i++) {
        let latLine = document.createElement('div');
        latLine.classList.add('lat-line');
        latLine.style.cssText =
          'width: ' +
          yOffsets[i].radius * 2 +
          'px; transform: rotateX(90deg) translateZ(' +
          (i < numLatLines / 2 ? -1 : 1) * yOffsets[i].offset +
          'px); ';
        sphere?.appendChild(latLine);
      }

      // Set lines height to the same as their width
      let latLines = document.getElementsByClassName('lat-line');
      let longLines = document.getElementsByClassName('long-line');
      if (latLines !== null && longLines !== null) {
        for (let i = 0; i < latLines.length; i++) {
          let latLine = /** @type {HTMLElement} */ (latLines[i]);
          latLine.style.height = latLine.clientWidth + 'px';
          latLine.style.borderColor = lineColor;
        }
        for (let i = 0; i < longLines.length; i++) {
          let longLine = /** @type {HTMLElement} */ (longLines[i]);
          longLine.style.height = longLine.clientWidth + 'px';
          longLine.style.borderColor = lineColor;
        }
      }
    }
  }

  onMount(() => {
    buildSphere(diameter, numLongLines, numLatLines);
  });
</script>

<div id={containerId} class="sphere-container">
  <div class="sphere-scene">
    <div id={sphereId} class="sphere-element"></div>
  </div>
</div>

<style>
  .sphere-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
  }

  .sphere-scene {
    perspective: 800px;
    perspective-origin: 50% 100px;
  }

  .sphere-element {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    transform-style: preserve-3d;
  }

  :global(.long-line) {
    position: absolute;
    width: 100%;
    border: solid 2px var(--main-blue);
    border-radius: 50%;
  }

  :global(.lat-line) {
    position: absolute;
    border: solid 2px var(--main-blue);
    border-radius: 50%;
    transform: rotateX(90deg);
  }

  :global {
    @keyframes spin {
      0% {
        transform: rotateY(0deg) rotateX(45deg);
      }
      50% {
        transform: rotateY(180deg) rotateX(45deg);
      }
      100% {
        transform: rotateY(360deg) rotateX(45deg);
      }
    }
  }
</style>
