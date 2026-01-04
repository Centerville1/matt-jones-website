<script>
  import { onMount, onDestroy } from 'svelte';

  /**
   * @typedef {Object} Body
   * @property {number} x - X position
   * @property {number} y - Y position
   * @property {number} dx - X velocity
   * @property {number} dy - Y velocity
   * @property {number} mass - Mass of the body
   * @property {string} color - Color of the body
   * @property {number} radius - Visual radius
   * @property {string} name - Body name
   * @property {boolean} fixed - Whether the body is fixed in place
   */

  /**
   * @typedef {Object} Preset
   * @property {string} name - Preset name
   * @property {Body[]} bodies - Array of bodies
   */

  // Canvas references
  /** @type {HTMLCanvasElement} */
  let mainCanvas;
  /** @type {HTMLCanvasElement} */
  let trailCanvas;
  /** @type {CanvasRenderingContext2D | null} */
  let mainCtx = null;
  /** @type {CanvasRenderingContext2D | null} */
  let trailCtx = null;

  // Simulation state
  /** @type {Body[]} */
  let bodies = [];
  let canvasWidth = 1000;
  let canvasHeight = 600;
  let canvasScale = 0.6; // Zoom level (0.5 to 2.0)
  let previousScale = 1; // Track previous scale to detect changes
  let isPlaying = false;
  let showTrails = true;
  let isPaused = false;

  // Animation control
  /** @type {number | null} */
  let animationFrameId = null;
  let lastUpdateTime = 0;
  let targetFPS = 60;
  let minFrameTime = 1000 / targetFPS;

  // FPS tracking
  let actualFPS = 0;
  let frameCount = 0;
  let fpsLastTime = 0;

  // Frame counter to trigger reactive updates
  let updateTick = 0;

  // Cannon state
  let cannonX = 100;
  let cannonY = 100;
  let cannonAngle = 270; // degrees, 0 = right, 90 = down, 270 = up
  let cannonVelocity = 2.0;
  let cannonMass = 5;
  let showPrediction = true;
  let predictionSteps = 300; // Number of simulation steps to predict ahead

  // Selected body for info display
  let selectedBodyIndex = 0;

  const startVelY = 0.2;

  // Preset configurations
  /** @type {Record<string, Preset>} */
  const presets = {
    solarSystem: {
      name: 'Solar System',
      bodies: [
        {
          x: 500,
          y: 300,
          dx: 0,
          dy: 0,
          mass: 300,
          color: '#FDB813',
          radius: 20,
          name: 'Sun',
          fixed: true,
        },
        {
          x: 280,
          y: 300,
          dx: 0,
          dy: -1.8,
          mass: 15,
          color: '#E74C3C',
          radius: 8,
          name: 'Ember Twin',
          fixed: false,
        },
        {
          x: 300,
          y: 300,
          dx: 0,
          dy: -0.55,
          mass: 15,
          color: '#27AE60',
          radius: 8,
          name: 'Ash Twin',
          fixed: false,
        },
        {
          x: 0,
          y: 300,
          dx: 0,
          dy: -0.75,
          mass: 25,
          color: '#3498DB',
          radius: 10,
          name: 'Timber Hearth',
          fixed: false,
        },
        {
          x: -20,
          y: 300,
          dx: 0,
          dy: -1.9,
          mass: 1,
          color: '#95A5A6',
          radius: 4,
          name: 'Attlerock',
          fixed: false,
        },
      ],
    },
    binaryStars: {
      name: 'Binary Stars',
      bodies: [
        {
          x: 400,
          y: 300,
          dx: 0,
          dy: 0.6,
          mass: 200,
          color: '#E74C3C',
          radius: 18,
          name: 'Red Giant',
          fixed: false,
        },
        {
          x: 600,
          y: 300,
          dx: 0,
          dy: -0.6,
          mass: 200,
          color: '#3498DB',
          radius: 18,
          name: 'Blue Giant',
          fixed: false,
        },
      ],
    },
    body3: {
      name: '3 Body Problem',
      bodies: [
        {
          x: 300,
          y: 250,
          dx: 0,
          dy: startVelY,
          mass: 50,
          color: '#E74C3C',
          radius: 10,
          name: 'Body 1',
          fixed: false,
        },
        {
          x: 500,
          y: 250,
          dx: 0,
          dy: -2 * startVelY,
          mass: 50,
          color: '#3498DB',
          radius: 10,
          name: 'Body 2',
          fixed: false,
        },
        {
          x: 700,
          y: 250,
          dx: 0.1,
          dy: startVelY,
          mass: 50,
          color: '#27AE60',
          radius: 10,
          name: 'Body 3',
          fixed: false,
        },
      ],
    },
    chaos: {
      name: 'Chaos',
      bodies: [
        {
          x: 500,
          y: 300,
          dx: 0,
          dy: 0,
          mass: 500,
          color: '#FDB813',
          radius: 25,
          name: 'Central Mass',
          fixed: true,
        },
        {
          x: 200,
          y: 200,
          dx: 0.5,
          dy: 1.56,
          mass: 20,
          color: '#E74C3C',
          radius: 8,
          name: 'Wanderer 1',
          fixed: false,
        },
        {
          x: 800,
          y: 400,
          dx: -0.5,
          dy: -1.5,
          mass: 20,
          color: '#3498DB',
          radius: 8,
          name: 'Wanderer 2',
          fixed: false,
        },
        {
          x: 300,
          y: 500,
          dx: 1.2,
          dy: -0.36,
          mass: 20,
          color: '#27AE60',
          radius: 8,
          name: 'Wanderer 3',
          fixed: false,
        },
        {
          x: 700,
          y: 100,
          dx: -1.2,
          dy: 0.3,
          mass: 20,
          color: '#9B59B6',
          radius: 8,
          name: 'Wanderer 4',
          fixed: false,
        },
      ],
    },
    extreme: {
      name: 'Extreme Chaos (500 Random Bodies)',
      bodies: Array.from({ length: 500 }, (_, i) => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = 50 + Math.random() * 550;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const x = centerX + distance * Math.cos(angle);
        const y = centerY + distance * Math.sin(angle);

        // Random velocity
        const speed = Math.random() * 3;
        const velocityAngle = Math.random() * 2 * Math.PI;
        const dx = speed * Math.cos(velocityAngle);
        const dy = speed * Math.sin(velocityAngle);

        // Random mass
        const mass = 1 + Math.random() * 50;

        // Random color from palette
        const colors = [
          '#E74C3C',
          '#3498DB',
          '#27AE60',
          '#9B59B6',
          '#F39C12',
          '#1ABC9C',
          '#E67E22',
          '#95A5A6',
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        return {
          x,
          y,
          dx,
          dy,
          mass,
          color,
          radius: Math.max(4, Math.min(12, mass * 0.3)),
          name: `Body ${i + 1}`,
          fixed: false,
        };
      }),
    },
    empty: {
      name: 'Empty Canvas',
      bodies: [],
    },
  };

  let currentPreset = 'solarSystem';

  // Color palette for fired bodies
  const bodyColors = [
    '#E74C3C', // Red
    '#3498DB', // Blue
    '#27AE60', // Green
    '#9B59B6', // Purple
    '#F39C12', // Orange
    '#1ABC9C', // Turquoise
    '#E67E22', // Carrot
    '#ECF0F1', // White
  ];

  const planetNames = [
    'Grendoria',
    'Koaleko',
    'Vadnicus',
    'Uraddon',
    'Mercuram',
    'Sidentania',
    'Fonella',
    'Guntlok',
    'Vabarnia',
    'Verva',
    'Doknicus',
    'Obovin',
    'Carrera',
    'Ketania',
    'Amonan',
  ];

  /**
   * Calculate direction angle between two bodies
   * @param {Body} body1
   * @param {Body} body2
   * @returns {number}
   */
  function getDirection(body1, body2) {
    const dx = body2.x - body1.x;
    const dy = body2.y - body1.y;
    if (dx !== 0) {
      return Math.atan(dy / dx);
    }
    return 0;
  }

  /**
   * Calculate distance between two bodies
   * @param {Body} body1
   * @param {Body} body2
   * @returns {number}
   */
  function getDistance(body1, body2) {
    const dx = body2.x - body1.x;
    const dy = body2.y - body1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Update velocity for a body based on gravitational forces
   * @param {Body} currentBody
   */
  function updateVelocity(currentBody) {
    if (currentBody.fixed) return;

    for (const otherBody of bodies) {
      if (otherBody === currentBody) continue;

      let distance = getDistance(currentBody, otherBody);

      // Prevent division by zero and extreme forces at close range
      if (distance < 3) distance = 3;

      const direction = getDirection(currentBody, otherBody);
      const force = (currentBody.mass * otherBody.mass) / (distance * distance);

      let forceX = force * Math.cos(direction);
      let forceY = force * Math.sin(direction);

      // Adjust force direction based on relative position
      if (currentBody.x > otherBody.x) {
        forceX *= -1;
        forceY *= -1;
      }

      currentBody.dx += forceX / currentBody.mass;
      currentBody.dy += forceY / currentBody.mass;
    }
  }

  /**
   * Update position for a body
   * @param {Body} body
   */
  function updatePosition(body) {
    if (body.fixed) return;

    body.x += body.dx;
    body.y += body.dy;
  }

  /**
   * Initialize simulation with selected preset
   */
  function initializeSimulation() {
    const preset = presets[/** @type {keyof typeof presets} */ (currentPreset)];

    // Deep copy the preset bodies
    bodies = preset.bodies.map(
      /** @param {Body} b */ (b) => ({
        x: b.x,
        y: b.y,
        dx: b.dx,
        dy: b.dy,
        mass: b.mass,
        color: b.color,
        radius: b.radius,
        name: b.name,
        fixed: b.fixed,
      }),
    );

    selectedBodyIndex = 0;
    clearTrails();
  }

  /**
   * Clear the trail canvas
   */
  function clearTrails() {
    if (trailCtx) {
      trailCtx.fillStyle = '#000000';
      trailCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
  }

  /**
   * Update simulation by one step
   */
  function updateSimulation() {
    // Update velocities for all bodies
    for (const body of bodies) {
      updateVelocity(body);
    }

    // Update positions and draw trails
    if (trailCtx && showTrails) {
      // Save context and apply zoom
      trailCtx.save();
      trailCtx.translate(canvasWidth / 2, canvasHeight / 2);
      trailCtx.scale(canvasScale, canvasScale);
      trailCtx.translate(-canvasWidth / 2, -canvasHeight / 2);

      for (const body of bodies) {
        // Draw trail point before updating position
        trailCtx.fillStyle = body.color;
        trailCtx.globalAlpha = 0.3;
        trailCtx.beginPath();
        trailCtx.arc(body.x, body.y, body.radius * 0.3, 0, Math.PI * 2);
        trailCtx.fill();
        trailCtx.globalAlpha = 1.0;

        updatePosition(body);
      }

      trailCtx.restore();
    } else {
      for (const body of bodies) {
        updatePosition(body);
      }
    }

    // Ensure selected body index is valid
    if (selectedBodyIndex >= bodies.length) {
      selectedBodyIndex = bodies.length - 1;
    }
    if (selectedBodyIndex < 0 && bodies.length > 0) {
      selectedBodyIndex = 0;
    }

    // Increment tick to trigger reactive updates
    updateTick++;
  }

  /**
   * Render all bodies to the main canvas
   */
  function render() {
    if (!mainCtx) return;

    // Clear main canvas
    mainCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Save context and apply zoom
    mainCtx.save();
    mainCtx.translate(canvasWidth / 2, canvasHeight / 2);
    mainCtx.scale(canvasScale, canvasScale);
    mainCtx.translate(-canvasWidth / 2, -canvasHeight / 2);

    // Draw bodies
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      const isSelected = i === selectedBodyIndex;

      mainCtx.beginPath();
      mainCtx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);

      // Add glow effect for selected body
      if (isSelected && bodies.length > 0) {
        mainCtx.shadowBlur = 20;
        mainCtx.shadowColor = '#00FFFF';
      } else {
        mainCtx.shadowBlur = 10;
        mainCtx.shadowColor = body.color;
      }

      mainCtx.fillStyle = body.color;
      mainCtx.fill();

      // Reset shadow
      mainCtx.shadowBlur = 0;

      // Draw selection indicator
      if (isSelected && bodies.length > 0) {
        mainCtx.strokeStyle = '#00FFFF';
        mainCtx.lineWidth = 2;
        mainCtx.stroke();
      }
    }

    // Draw cannon
    drawCannon();

    // Restore context
    mainCtx.restore();
  }

  /**
   * Calculate predicted trajectory path
   * @returns {Array<{x: number, y: number}>}
   */
  function calculatePrediction() {
    const angleRad = (cannonAngle * Math.PI) / 180;

    // Create a simulated body
    const simBody = {
      x: cannonX,
      y: cannonY,
      dx: cannonVelocity * Math.cos(angleRad),
      dy: cannonVelocity * Math.sin(angleRad),
      mass: cannonMass,
      fixed: false,
    };

    /** @type {Array<{x: number, y: number}>} */
    const path = [];

    // Simulate forward in time
    for (let step = 0; step < predictionSteps; step++) {
      // Record position every few steps to reduce path points
      if (step % 3 === 0) {
        path.push({ x: simBody.x, y: simBody.y });
      }

      // Calculate gravitational forces from all existing bodies
      for (const body of bodies) {
        let dx = body.x - simBody.x;
        let dy = body.y - simBody.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Prevent division by zero
        if (distance < 3) distance = 3;

        const force = (simBody.mass * body.mass) / (distance * distance);
        const forceX = force * (dx / distance);
        const forceY = force * (dy / distance);

        simBody.dx += forceX / simBody.mass;
        simBody.dy += forceY / simBody.mass;
      }

      // Update position
      simBody.x += simBody.dx;
      simBody.y += simBody.dy;

      // Stop if body goes too far off screen
      if (
        simBody.x < -canvasWidth ||
        simBody.x > canvasWidth * 2 ||
        simBody.y < -canvasHeight ||
        simBody.y > canvasHeight * 2
      ) {
        break;
      }
    }

    return path;
  }

  /**
   * Draw the cannon launcher
   */
  function drawCannon() {
    if (!mainCtx) return;

    const angleRad = (cannonAngle * Math.PI) / 180;
    const cannonLength = 30;
    const endX = cannonX + cannonLength * Math.cos(angleRad);
    const endY = cannonY + cannonLength * Math.sin(angleRad);

    // Draw prediction path
    if (showPrediction && bodies.length > 0) {
      const path = calculatePrediction();

      if (path.length > 1) {
        mainCtx.strokeStyle = '#00FFFF';
        mainCtx.lineWidth = 2;
        mainCtx.setLineDash([5, 5]);
        mainCtx.globalAlpha = 0.6;
        mainCtx.beginPath();
        mainCtx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length; i++) {
          mainCtx.lineTo(path[i].x, path[i].y);
        }

        mainCtx.stroke();
        mainCtx.setLineDash([]);
        mainCtx.globalAlpha = 1.0;
      }
    }

    // Draw cannon base
    mainCtx.fillStyle = '#95A5A6';
    mainCtx.beginPath();
    mainCtx.arc(cannonX, cannonY, 8, 0, Math.PI * 2);
    mainCtx.fill();

    // Draw cannon barrel
    mainCtx.strokeStyle = '#95A5A6';
    mainCtx.lineWidth = 4;
    mainCtx.beginPath();
    mainCtx.moveTo(cannonX, cannonY);
    mainCtx.lineTo(endX, endY);
    mainCtx.stroke();

    // Draw mass indicator next to cannon
    mainCtx.fillStyle = '#FFFFFF';
    mainCtx.font = '12px monospace';
    mainCtx.fillText(`M: ${cannonMass.toFixed(1)}`, cannonX + 15, cannonY - 10);
  }

  /**
   * Main animation loop
   * @param {number} timestamp
   */
  function animate(timestamp) {
    if (!isPlaying || isPaused) return;

    if (lastUpdateTime === 0) {
      lastUpdateTime = timestamp;
      fpsLastTime = timestamp;
    }

    const elapsed = timestamp - lastUpdateTime;

    // Calculate how many simulation steps to run
    // For FPS > 60, we run multiple steps per frame
    const stepsToRun = Math.max(1, Math.floor(elapsed / minFrameTime));

    if (elapsed >= minFrameTime) {
      // Run multiple simulation steps if needed for high FPS
      for (let i = 0; i < stepsToRun; i++) {
        updateSimulation();
      }

      // Only render once per animation frame
      render();

      // Use fixed time step to prevent drift
      lastUpdateTime += minFrameTime * stepsToRun;

      // If we've fallen too far behind, reset to current time
      if (timestamp - lastUpdateTime > minFrameTime * 2) {
        lastUpdateTime = timestamp;
      }

      // Update FPS counter based on simulation steps
      frameCount += stepsToRun;
      if (timestamp - fpsLastTime >= 1000) {
        actualFPS = Math.round((frameCount * 1000) / (timestamp - fpsLastTime));
        frameCount = 0;
        fpsLastTime = timestamp;
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  /**
   * Toggle play/pause state
   */
  function togglePlayPause() {
    if (!isPlaying) {
      // Start playing
      isPlaying = true;
      isPaused = false;
      lastUpdateTime = 0;
      frameCount = 0;
      animationFrameId = requestAnimationFrame(animate);
    } else {
      // Toggle pause
      isPaused = !isPaused;
      if (!isPaused) {
        lastUpdateTime = 0;
        animationFrameId = requestAnimationFrame(animate);
      }
    }
  }

  /**
   * Reset the simulation
   */
  function reset() {
    isPlaying = false;
    isPaused = false;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    actualFPS = 0;
    frameCount = 0;
    initializeSimulation();
    render();
  }

  /**
   * Fire a new body from the cannon
   */
  function fireCannon() {
    const angleRad = (cannonAngle * Math.PI) / 180;
    const randomColor =
      bodyColors[Math.floor(Math.random() * bodyColors.length)];
    const randomName =
      planetNames[Math.floor(Math.random() * planetNames.length)];

    /** @type {Body} */
    const newBody = {
      x: cannonX,
      y: cannonY,
      dx: cannonVelocity * Math.cos(angleRad),
      dy: cannonVelocity * Math.sin(angleRad),
      mass: cannonMass,
      color: randomColor,
      radius: Math.max(4, Math.min(15, cannonMass * 1.5)),
      name: randomName,
      fixed: false,
    };

    bodies.push(newBody);
    selectedBodyIndex = bodies.length - 1;
  }

  /**
   * Cycle forward through bodies for selection
   */
  function cycleSelectionForward() {
    if (bodies.length === 0) return;
    selectedBodyIndex = (selectedBodyIndex + 1) % bodies.length;
    // Re-render to show selection change when paused
    if (!isPlaying || isPaused) {
      render();
    }
  }

  /**
   * Cycle backward through bodies for selection
   */
  function cycleSelectionBackward() {
    if (bodies.length === 0) return;
    selectedBodyIndex = (selectedBodyIndex - 1 + bodies.length) % bodies.length;
    // Re-render to show selection change when paused
    if (!isPlaying || isPaused) {
      render();
    }
  }

  /**
   * Delete the currently selected body
   */
  function deleteSelected() {
    if (bodies.length === 0) return;
    bodies.splice(selectedBodyIndex, 1);
    if (selectedBodyIndex >= bodies.length) {
      selectedBodyIndex = Math.max(0, bodies.length - 1);
    }
    // Re-render to show deletion when paused
    if (!isPlaying || isPaused) {
      render();
    }
  }

  /**
   * Handle canvas click to move cannon
   * @param {MouseEvent} event
   */
  function handleCanvasClick(event) {
    const rect = mainCanvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Transform click coordinates to account for zoom
    // Reverse the zoom transformation: translate back, scale inverse, translate forward
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    cannonX = (clickX - centerX) / canvasScale + centerX;
    cannonY = (clickY - centerY) / canvasScale + centerY;
    render();
  }

  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} event
   */
  function handleKeyPress(event) {
    switch (event.key.toLowerCase()) {
      case ' ':
        event.preventDefault();
        togglePlayPause();
        break;
      case 'f':
        fireCannon();
        break;
      case 'r':
        reset();
        break;
      case 'x':
        clearTrails();
        break;
      case '[':
        cycleSelectionBackward();
        break;
      case ']':
        cycleSelectionForward();
        break;
      case 'delete':
      case 'backspace':
        deleteSelected();
        break;
      case 'a':
        cannonAngle = (cannonAngle - 10 + 360) % 360;
        render();
        break;
      case 'd':
        cannonAngle = (cannonAngle + 10) % 360;
        render();
        break;
      case 'w':
        cannonVelocity = Math.min(10, cannonVelocity + 0.1);
        break;
      case 's':
        cannonVelocity = Math.max(0.1, cannonVelocity - 0.1);
        break;
      case 'q':
        cannonMass = Math.max(0.5, cannonMass - 1);
        break;
      case 'e':
        cannonMass = Math.min(100, cannonMass + 1);
        break;
      case '=':
      case '+':
        canvasScale = Math.min(2.0, canvasScale + 0.1);
        break;
      case '-':
      case '_':
        canvasScale = Math.max(0.1, canvasScale - 0.1);
        break;
    }
  }

  // Reactive computed values for info displays
  /** @type {string} */
  let selectedBodyInfo = 'No bodies';

  /** @type {string} */
  let cannonInfo = '';

  // Update selected body info reactively
  $: {
    // Depend on updateTick to trigger updates each frame
    updateTick;
    if (bodies.length === 0 || selectedBodyIndex < 0) {
      selectedBodyInfo = 'No bodies';
    } else {
      const body = bodies[selectedBodyIndex];
      const velocity = Math.sqrt(body.dx ** 2 + body.dy ** 2);
      const distanceFromOrigin = Math.sqrt(
        (body.x - canvasWidth / 2) ** 2 + (body.y - canvasHeight / 2) ** 2,
      );

      selectedBodyInfo = `Name: ${body.name}
Color: ${body.color}
Mass: ${body.mass.toFixed(1)}
Velocity: ${velocity.toFixed(1)}
Position: (${Math.round(body.x)}, ${Math.round(body.y)})
Distance from Center: ${Math.round(distanceFromOrigin)}`;
    }
  }

  // Update cannon info reactively
  $: cannonInfo = `Launcher Controls:
Velocity: ${cannonVelocity.toFixed(2)}
Angle: ${Math.round(cannonAngle)}°
Mass: ${cannonMass.toFixed(1)}`;

  // Update FPS timing when target changes
  $: minFrameTime = 1000 / targetFPS;

  // Clear trails when zoom changes to prevent distortion
  $: if (canvasScale !== previousScale && trailCtx) {
    clearTrails();
    render();
    previousScale = canvasScale;
  }

  // Reinitialize when preset changes
  $: if (currentPreset) {
    reset();
  }

  onMount(() => {
    mainCtx = mainCanvas.getContext('2d');
    trailCtx = trailCanvas.getContext('2d');

    if (!mainCtx || !trailCtx) return;

    // Initialize trail canvas with black background
    trailCtx.fillStyle = '#000000';
    trailCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    initializeSimulation();
    render();

    // Add keyboard listener
    window.addEventListener('keydown', handleKeyPress);

    // Auto-play
    togglePlayPause();
  });

  onDestroy(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener('keydown', handleKeyPress);
  });
</script>

<div class="orbits-container">
  <div class="canvas-wrapper">
    <canvas
      bind:this={trailCanvas}
      width={canvasWidth}
      height={canvasHeight}
      class="trail-canvas"
    ></canvas>
    <canvas
      bind:this={mainCanvas}
      width={canvasWidth}
      height={canvasHeight}
      class="main-canvas"
      on:click={handleCanvasClick}
    ></canvas>
  </div>

  <div class="info-panels">
    <div class="info-panel">
      <h4>Selected Body</h4>
      <pre>{selectedBodyInfo}</pre>
    </div>
    <div class="info-panel">
      <h4>Launcher</h4>
      <pre>{cannonInfo}</pre>
    </div>
  </div>

  <div class="controls">
    <h3>Orbital Mechanics Simulator</h3>

    <div class="preset-selector">
      <label for="preset">Preset:</label>
      <select id="preset" bind:value={currentPreset}>
        {#each Object.entries(presets) as [key, preset]}
          <option value={key}>{preset.name}</option>
        {/each}
      </select>
    </div>

    <div class="fps-display">
      {#if isPlaying && !isPaused}
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
      <button on:click={togglePlayPause}>
        {!isPlaying
          ? 'Play (Space)'
          : isPaused
            ? 'Resume (Space)'
            : 'Pause (Space)'}
      </button>
      <button on:click={reset}>Reset (R)</button>
      <button on:click={fireCannon}>Fire Cannon (F)</button>
    </div>

    <div class="control-row">
      <button on:click={clearTrails}>Clear Trails (X)</button>
      <button on:click={cycleSelectionBackward}>◄ Cycle ([)</button>
      <button on:click={cycleSelectionForward}>Cycle ► (])</button>
      <button on:click={deleteSelected} disabled={bodies.length === 0}
        >Delete Body (Del)</button
      >
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={showTrails} />
        Show Trails
      </label>
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={showPrediction} />
        Show Prediction Path
      </label>
    </div>

    <div class="slider-controls">
      <div class="slider-group">
        <label for="cannon-angle">
          Angle: {cannonAngle}° (A/D)
          <input
            type="range"
            id="cannon-angle"
            bind:value={cannonAngle}
            min="0"
            max="359"
            step="1"
          />
        </label>
      </div>
      <div class="slider-group">
        <label for="cannon-velocity">
          Velocity: {cannonVelocity.toFixed(2)} (W/S)
          <input
            type="range"
            id="cannon-velocity"
            bind:value={cannonVelocity}
            min="0.1"
            max="10"
            step="0.1"
          />
        </label>
      </div>
      <div class="slider-group">
        <label for="cannon-mass">
          Mass: {cannonMass.toFixed(1)} (Q/E)
          <input
            type="range"
            id="cannon-mass"
            bind:value={cannonMass}
            min="0.5"
            max="100"
            step="0.5"
          />
        </label>
      </div>
      <div class="slider-group">
        <label for="canvas-zoom">
          Zoom: {canvasScale.toFixed(1)}x (+/-)
          <input
            type="range"
            id="canvas-zoom"
            bind:value={canvasScale}
            min="0.5"
            max="2.0"
            step="0.1"
          />
        </label>
      </div>
      <div class="slider-group">
        <label for="prediction-steps">
          Prediction Length: {predictionSteps}
          <input
            type="range"
            id="prediction-steps"
            bind:value={predictionSteps}
            min="50"
            max="1000"
            step="50"
          />
        </label>
      </div>
    </div>

    <div class="keyboard-hints">
      <p><strong>Keyboard Shortcuts:</strong></p>
      <p>
        Space: Play/Pause | F: Fire | R: Reset | X: Clear Trails | [/]: Cycle
        Body | Del/Backspace: Remove Body
      </p>
      <p>
        Click canvas to move launcher | WASD: Angle/velocity | Q/E: Mass | +/-:
        Zoom
      </p>
    </div>
  </div>
</div>

<style>
  .orbits-container {
    width: 100%;
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .canvas-wrapper {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  canvas {
    display: block;
  }

  .trail-canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .main-canvas {
    position: relative;
    z-index: 2;
    cursor: crosshair;
  }

  .info-panels {
    display: flex;
    gap: 2rem;
    width: 100%;
    max-width: 1000px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .info-panel {
    background-color: var(--neutral-gray);
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid var(--neutral-dark-gray-op-50);
    min-width: 280px;
    flex: 1;
  }

  .info-panel h4 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--contrast-text-light);
  }

  .info-panel pre {
    margin: 0;
    font-family: monospace;
    font-size: 0.85rem;
    color: var(--contrast-text-light);
    white-space: pre-wrap;
    line-height: 1.5;
  }

  .controls {
    background-color: var(--neutral-gray);
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid var(--neutral-dark-gray-op-50);
    width: 100%;
    max-width: 1000px;
    position: relative;
  }

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--contrast-text-light);
    text-align: center;
  }

  .preset-selector {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .preset-selector label {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--contrast-text-light);
  }

  select {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
    background-color: var(--neutral-white);
    color: var(--neutral-black);
    border: 1px solid var(--neutral-dark-gray-op-50);
    border-radius: 6px;
    cursor: pointer;
  }

  select:focus {
    outline: none;
    border-color: var(--main-blue);
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

  .control-row {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: var(--main-blue);
    color: var(--neutral-white);
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
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

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--contrast-text-light);
    cursor: pointer;
  }

  .checkbox-label input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--main-blue);
  }

  .slider-controls {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .slider-group {
    width: 200px;
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

  input[type='range'] {
    width: 100%;
    cursor: pointer;
    accent-color: var(--main-blue);
  }

  .keyboard-hints {
    border-top: 1px solid var(--neutral-dark-gray-op-50);
    padding-top: 1rem;
    text-align: center;
  }

  .keyboard-hints p {
    margin: 0.25rem 0;
    font-size: 0.85rem;
    color: var(--contrast-text-light);
    font-style: italic;
    opacity: 0.8;
  }

  .keyboard-hints p:first-of-type {
    margin-top: 0;
  }

  @media (max-width: 640px) {
    .canvas-wrapper {
      max-width: 100%;
    }

    canvas {
      max-width: 100%;
      height: auto;
    }

    .controls {
      padding: 1rem;
    }

    .control-row {
      font-size: 0.85rem;
      gap: 0.5rem;
    }

    button {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }

    .slider-controls {
      flex-direction: column;
      align-items: center;
    }

    .slider-group {
      width: 100%;
      max-width: 300px;
    }

    .info-panels {
      flex-direction: column;
    }
  }
</style>
