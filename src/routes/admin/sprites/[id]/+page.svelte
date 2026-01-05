<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  /** @type {{ data: { sprite: SpriteDefinition | null, images: Image[], isNew: boolean } }} */
  let { data } = $props();

  // Sprite metadata
  let spriteName = $state(data.sprite?.name || '');
  let objectType = $state(data.sprite?.objectType || 'ship');

  /** @type {SpriteLayer[]} */
  let layers = $state(data.sprite?.layers || []);

  /** @type {ColliderShape[]} */
  let colliders = $state(
    Array.isArray(data.sprite?.collider)
      ? data.sprite.collider
      : data.sprite?.collider
        ? [data.sprite.collider]
        : [],
  );

  // Editor state
  let selectedTool = $state('select'); // 'select', 'circle', 'rect'
  let selectedLayerIndex = $state(/** @type {number | null} */ (null));
  let selectedColliderIndex = $state(/** @type {number | null} */ (null));
  let showMode = $state('sprite'); // 'sprite', 'collision', 'both'
  let editMode = $state('collision'); // 'sprite', 'collision' - what you're editing in select mode
  let showRulers = $state(true); // Show measurement rulers

  /** @type {HTMLCanvasElement | null} */
  let canvas = $state(null);
  /** @type {CanvasRenderingContext2D | null} */
  let ctx = $state(null);

  // Canvas interaction state
  let isDragging = $state(false);
  let isDrawing = $state(false);
  let dragStart = $state({ x: 0, y: 0 });
  let drawStart = $state({ x: 0, y: 0 });
  let canvasOffset = $state({ x: 0, y: 0 });
  let zoom = $state(1);

  // Conversion factor: pixels per meter (adjustable)
  const PIXELS_PER_METER = 50;

  // Image loading cache
  /** @type {Map<number, HTMLImageElement>} */
  const imageCache = new Map();

  // Layer editor modal
  let showLayerModal = $state(false);
  let editingLayerIndex = $state(null);
  let uploading = $state(false);
  let uploadError = $state('');
  let uploadSuccess = $state(false);

  onMount(() => {
    // Preload all layer images
    layers.forEach((layer) => {
      loadImage(layer.imageId);
    });

    if (canvas) {
      ctx = canvas.getContext('2d');
      resizeCanvas();
      render();
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  function resizeCanvas() {
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    render();
  }

  /**
   * Load an image and cache it
   * @param {number} imageId
   * @returns {Promise<HTMLImageElement>}
   */
  function loadImage(imageId) {
    if (imageCache.has(imageId)) {
      const cached = imageCache.get(imageId);
      if (cached) return Promise.resolve(cached);
    }

    const image = data.images.find(
      (/** @type {Image} */ img) => img.id === imageId,
    );
    if (!image) return Promise.reject(new Error('Image not found'));

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageCache.set(imageId, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = image.path;
    });
  }

  /**
   * Add a new layer from selected image
   * @param {string} imagePath
   */
  function addLayer(imagePath) {
    const image = data.images.find(
      (/** @type {Image} */ img) => img.path === imagePath,
    );
    if (!image) return;

    loadImage(image.id).then((img) => {
      layers.push({
        imageId: image.id,
        offset: { x: 0, y: 0 },
        width: img.width,
        height: img.height,
        rotation: 0,
        zIndex: layers.length,
      });
      showLayerModal = false;
      render();
    });
  }

  /**
   * Remove a layer
   * @param {number} index
   */
  function removeLayer(index) {
    layers.splice(index, 1);
    if (selectedLayerIndex === index) {
      selectedLayerIndex = null;
    }
    render();
  }

  /**
   * Move layer up in z-index
   * @param {number} index
   */
  function moveLayerUp(index) {
    if (index < layers.length - 1) {
      [layers[index], layers[index + 1]] = [layers[index + 1], layers[index]];
      layers[index].zIndex = index;
      layers[index + 1].zIndex = index + 1;
      render();
    }
  }

  /**
   * Move layer down in z-index
   * @param {number} index
   */
  function moveLayerDown(index) {
    if (index > 0) {
      [layers[index], layers[index - 1]] = [layers[index - 1], layers[index]];
      layers[index].zIndex = index;
      layers[index - 1].zIndex = index - 1;
      render();
    }
  }

  /**
   * Remove a collider
   * @param {number} index
   */
  function removeCollider(index) {
    colliders.splice(index, 1);
    if (selectedColliderIndex === index) {
      selectedColliderIndex = null;
    }
    render();
  }

  /**
   * Keyboard handler for scaling layers, rotating colliders, and moving objects
   * @param {KeyboardEvent} e
   */
  function handleKeyDown(e) {
    // Only handle keys when not typing in an input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    // WASD movement and layer duplication
    if (selectedLayerIndex !== null) {
      const layer = layers[selectedLayerIndex];
      if (!layer) return;

      if (e.key === 'w' || e.key === 'W') {
        // Move up by 0.1 meter
        layer.offset.y -= 0.1;
        render();
        e.preventDefault();
      } else if (e.key === 's' || e.key === 'S') {
        // Move down by 0.1 meter
        layer.offset.y += 0.1;
        render();
        e.preventDefault();
      } else if (e.key === 'a' || e.key === 'A') {
        // Move left by 0.1 meter
        layer.offset.x -= 0.1;
        render();
        e.preventDefault();
      } else if (e.key === 'd' || e.key === 'D') {
        // Move right by 0.1 meter
        layer.offset.x += 0.1;
        render();
        e.preventDefault();
      } else if (e.key === 'q' || e.key === 'Q') {
        // Duplicate current layer (offset by 0.2m)
        const newLayer = {
          imageId: layer.imageId,
          offset: { x: layer.offset.x + 0.2, y: layer.offset.y + 0.2 },
          width: layer.width,
          height: layer.height,
          rotation: layer.rotation,
          zIndex: layer.zIndex + 1,
        };
        layers.push(newLayer);
        selectedLayerIndex = layers.length - 1;
        // Preload the image for the new layer
        loadImage(newLayer.imageId);
        render();
        e.preventDefault();
      } else if (e.key === '+' || e.key === '=') {
        // Scale up by 10%
        layer.width *= 1.1;
        layer.height *= 1.1;
        render();
        e.preventDefault();
      } else if (e.key === '-' || e.key === '_') {
        // Scale down by 10%
        layer.width *= 0.9;
        layer.height *= 0.9;
        render();
        e.preventDefault();
      }
    }

    if (selectedColliderIndex !== null) {
      const collider = colliders[selectedColliderIndex];
      if (!collider) return;

      if (e.key === 'w' || e.key === 'W') {
        // Move up by 0.1 meter
        collider.offset.y -= 0.1;
        render();
        e.preventDefault();
      } else if (e.key === 's' || e.key === 'S') {
        // Move down by 0.1 meter
        collider.offset.y += 0.1;
        render();
        e.preventDefault();
      } else if (e.key === 'a' || e.key === 'A') {
        // Move left by 0.1 meter
        collider.offset.x -= 0.1;
        render();
        e.preventDefault();
      } else if (e.key === 'd' || e.key === 'D') {
        // Move right by 0.1 meter
        collider.offset.x += 0.1;
        render();
        e.preventDefault();
      } else if (e.key === 'q' || e.key === 'Q') {
        // Duplicate current collider (offset by 0.2m)
        const newCollider = {
          id: `collider-${Date.now()}`,
          type: collider.type,
          offset: { x: collider.offset.x + 0.2, y: collider.offset.y + 0.2 },
          ...(collider.type === 'circle' && { radius: collider.radius }),
          ...(collider.type === 'rect' && {
            width: collider.width,
            height: collider.height,
            localRotation: collider.localRotation || 0,
          }),
        };
        colliders.push(newCollider);
        selectedColliderIndex = colliders.length - 1;
        render();
        e.preventDefault();
      } else if (collider.type === 'rect' && (e.key === 'r' || e.key === 'R')) {
        // Rotate clockwise by 1 degree
        collider.localRotation = (collider.localRotation || 0) + Math.PI / 180;
        render();
        e.preventDefault();
      } else if (collider.type === 'rect' && (e.key === 'e' || e.key === 'E')) {
        // Rotate counter-clockwise by 1 degree
        collider.localRotation = (collider.localRotation || 0) - Math.PI / 180;
        render();
        e.preventDefault();
      }
    }
  }

  /**
   * Check if point is inside a layer's image bounds
   * @param {{ x: number, y: number }} point - Screen coordinates
   * @param {SpriteLayer} layer
   * @returns {boolean}
   */
  function isPointInLayer(point, layer) {
    if (!canvas) return false;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Transform point to layer's local space (convert meters to pixels)
    const localX =
      point.x - (centerX + canvasOffset.x + layer.offset.x * PIXELS_PER_METER * zoom);
    const localY =
      point.y - (centerY + canvasOffset.y + layer.offset.y * PIXELS_PER_METER * zoom);

    // Check if within scaled bounds (centered on offset point)
    const halfWidth = (layer.width * zoom) / 2;
    const halfHeight = (layer.height * zoom) / 2;

    return Math.abs(localX) <= halfWidth && Math.abs(localY) <= halfHeight;
  }

  /**
   * Canvas mouse down handler
   * @param {MouseEvent} e
   */
  function handleMouseDown(e) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const worldPos = screenToWorld(x, y);
    const screenPos = { x, y };

    if (selectedTool === 'select') {
      // Check what we're editing
      if (
        editMode === 'sprite' ||
        showMode === 'sprite' ||
        showMode === 'both'
      ) {
        // Check if clicking on a layer (check in reverse order for top-most)
        for (let i = layers.length - 1; i >= 0; i--) {
          if (isPointInLayer(screenPos, layers[i])) {
            selectedLayerIndex = i;
            selectedColliderIndex = null;
            isDragging = true;
            dragStart = worldPos;
            return;
          }
        }
      }

      if (
        editMode === 'collision' ||
        showMode === 'collision' ||
        showMode === 'both'
      ) {
        // Check if clicking on a collider
        for (let i = colliders.length - 1; i >= 0; i--) {
          if (isPointInCollider(worldPos, colliders[i])) {
            selectedColliderIndex = i;
            selectedLayerIndex = null;
            isDragging = true;
            dragStart = worldPos;
            return;
          }
        }
      }

      // Clicked on nothing
      selectedColliderIndex = null;
      selectedLayerIndex = null;
    } else if (selectedTool === 'circle' || selectedTool === 'rect') {
      // Start drawing new shape
      isDrawing = true;
      drawStart = worldPos;
    }
  }

  /**
   * Canvas mouse move handler
   * @param {MouseEvent} e
   */
  function handleMouseMove(e) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const worldPos = screenToWorld(x, y);

    if (isDragging && selectedLayerIndex !== null) {
      // Move selected layer (offsets are in meters)
      const dx = worldPos.x - dragStart.x;
      const dy = worldPos.y - dragStart.y;

      layers[selectedLayerIndex].offset.x += dx;
      layers[selectedLayerIndex].offset.y += dy;

      dragStart = worldPos;
      render();
    } else if (isDragging && selectedColliderIndex !== null) {
      // Move selected collider (offsets are in meters)
      const dx = worldPos.x - dragStart.x;
      const dy = worldPos.y - dragStart.y;

      colliders[selectedColliderIndex].offset.x += dx;
      colliders[selectedColliderIndex].offset.y += dy;

      dragStart = worldPos;
      render();
    } else if (isDrawing) {
      // Preview shape being drawn
      render();
      drawShapePreview(drawStart, worldPos);
    }
  }

  /**
   * Canvas mouse up handler
   * @param {MouseEvent} e
   */
  function handleMouseUp(e) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const worldPos = screenToWorld(x, y);

    if (isDrawing) {
      // Finish drawing shape
      const dx = worldPos.x - drawStart.x;
      const dy = worldPos.y - drawStart.y;

      if (selectedTool === 'circle') {
        const radius = Math.sqrt(dx * dx + dy * dy);
        if (radius > 0.1) {
          // Minimum 0.1m radius
          colliders.push({
            id: `collider-${Date.now()}`,
            type: 'circle',
            radius: radius,
            offset: { x: drawStart.x, y: drawStart.y },
          });
        }
      } else if (selectedTool === 'rect') {
        const width = Math.abs(dx);
        const height = Math.abs(dy);
        if (width > 0.1 && height > 0.1) {
          // Minimum 0.1m size
          colliders.push({
            id: `collider-${Date.now()}`,
            type: 'rect',
            width: width,
            height: height,
            localRotation: 0,
            offset: {
              x: drawStart.x + dx / 2,
              y: drawStart.y + dy / 2,
            },
          });
        }
      }

      render();
    }

    isDragging = false;
    isDrawing = false;
  }

  /**
   * Convert screen coordinates to world coordinates
   * @param {number} screenX
   * @param {number} screenY
   * @returns {{ x: number, y: number }}
   */
  function screenToWorld(screenX, screenY) {
    if (!canvas) return { x: 0, y: 0 };

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    return {
      x: (screenX - centerX - canvasOffset.x) / zoom / PIXELS_PER_METER,
      y: (screenY - centerY - canvasOffset.y) / zoom / PIXELS_PER_METER,
    };
  }

  /**
   * Convert world coordinates to screen coordinates
   * @param {number} worldX
   * @param {number} worldY
   * @returns {{ x: number, y: number }}
   */
  function worldToScreen(worldX, worldY) {
    if (!canvas) return { x: 0, y: 0 };

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    return {
      x: worldX * PIXELS_PER_METER * zoom + centerX + canvasOffset.x,
      y: worldY * PIXELS_PER_METER * zoom + centerY + canvasOffset.y,
    };
  }

  /**
   * Check if point is inside collider
   * @param {{ x: number, y: number }} point - World coordinates
   * @param {ColliderShape} collider
   * @returns {boolean}
   */
  function isPointInCollider(point, collider) {
    const dx = point.x - collider.offset.x;
    const dy = point.y - collider.offset.y;

    if (collider.type === 'circle') {
      const distSq = dx * dx + dy * dy;
      return distSq <= (collider.radius || 0) ** 2;
    } else if (collider.type === 'rect') {
      const halfW = (collider.width || 0) / 2;
      const halfH = (collider.height || 0) / 2;
      return Math.abs(dx) <= halfW && Math.abs(dy) <= halfH;
    }

    return false;
  }

  /**
   * Draw shape preview while dragging
   * @param {{ x: number, y: number }} start - World coordinates
   * @param {{ x: number, y: number }} end - World coordinates
   */
  function drawShapePreview(start, end) {
    if (!ctx) return;

    const startScreen = worldToScreen(start.x, start.y);
    const endScreen = worldToScreen(end.x, end.y);

    ctx.strokeStyle = '#4A9EFF';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    if (selectedTool === 'circle') {
      const radius = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
      const radiusScreen = radius * PIXELS_PER_METER * zoom;

      ctx.beginPath();
      ctx.arc(startScreen.x, startScreen.y, radiusScreen, 0, Math.PI * 2);
      ctx.stroke();
    } else if (selectedTool === 'rect') {
      const dx = endScreen.x - startScreen.x;
      const dy = endScreen.y - startScreen.y;

      ctx.strokeRect(startScreen.x, startScreen.y, dx, dy);
    }

    ctx.setLineDash([]);
  }

  /**
   * Main render function
   */
  function render() {
    if (!ctx || !canvas) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid();

    // Draw sprite layers
    if (showMode === 'sprite' || showMode === 'both') {
      drawLayers();
    }

    // Draw collision boxes
    if (showMode === 'collision' || showMode === 'both') {
      drawColliders();
    }

    // Draw center crosshair
    drawCenterCrosshair();

    // Draw rulers (on top of everything)
    drawRulers();
  }

  /**
   * Calculate appropriate grid/ruler interval based on zoom
   * Returns interval in meters (e.g., 1, 2, 5, 10, 20, 50, 100, etc.)
   */
  function getGridInterval() {
    const pixelsPerMeter = PIXELS_PER_METER * zoom;

    // Target: grid lines should be roughly 30-100 pixels apart
    const targetPixels = 50;
    const baseInterval = targetPixels / pixelsPerMeter;

    // Round to nice numbers: 1, 2, 5, 10, 20, 50, 100, 200, 500, etc.
    const magnitude = Math.floor(Math.log10(baseInterval));
    const normalizedValue = baseInterval / Math.pow(10, magnitude);

    let niceValue;
    if (normalizedValue < 1.5) {
      niceValue = 1;
    } else if (normalizedValue < 3.5) {
      niceValue = 2;
    } else if (normalizedValue < 7.5) {
      niceValue = 5;
    } else {
      niceValue = 10;
    }

    return niceValue * Math.pow(10, magnitude);
  }

  function drawGrid() {
    if (!ctx || !canvas) return;

    const centerX = canvas.width / 2 + canvasOffset.x;
    const centerY = canvas.height / 2 + canvasOffset.y;
    const interval = getGridInterval();
    const gridSize = interval * PIXELS_PER_METER * zoom;

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = centerX % gridSize; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = centerY % gridSize; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  function drawCenterCrosshair() {
    if (!ctx || !canvas) return;

    const centerX = canvas.width / 2 + canvasOffset.x;
    const centerY = canvas.height / 2 + canvasOffset.y;

    ctx.strokeStyle = '#FF4A4A';
    ctx.lineWidth = 2;

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 20);
    ctx.lineTo(centerX, centerY + 20);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(centerX - 20, centerY);
    ctx.lineTo(centerX + 20, centerY);
    ctx.stroke();
  }

  function drawRulers() {
    if (!ctx || !canvas || !showRulers) return;

    const centerX = canvas.width / 2 + canvasOffset.x;
    const centerY = canvas.height / 2 + canvasOffset.y;
    const interval = getGridInterval();
    const intervalSize = interval * PIXELS_PER_METER * zoom;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const rulerWidth = 30;

    // Top ruler (horizontal measurements)
    ctx.fillRect(0, 0, canvas.width, rulerWidth);
    ctx.strokeRect(0, 0, canvas.width, rulerWidth);

    // Find the meter value at the left edge (rounded to interval)
    const leftEdgeMeters = Math.floor((0 - centerX) / intervalSize) * interval;
    const rightEdgeMeters =
      Math.ceil((canvas.width - centerX) / intervalSize) * interval;

    for (let m = leftEdgeMeters; m <= rightEdgeMeters; m += interval) {
      const x = centerX + (m / interval) * intervalSize;
      if (x >= 0 && x <= canvas.width) {
        // Tick mark
        ctx.beginPath();
        ctx.strokeStyle = m === 0 ? '#FF4A4A' : '#666';
        ctx.moveTo(x, rulerWidth - 10);
        ctx.lineTo(x, rulerWidth);
        ctx.stroke();

        // Label
        ctx.fillStyle = m === 0 ? '#FF4A4A' : '#AAA';
        const label = m >= 1000 || m <= -1000 ? `${m / 1000}km` : `${m}m`;
        ctx.fillText(label, x, rulerWidth / 2 - 2);
      }
    }

    // Left ruler (vertical measurements)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, rulerWidth, canvas.height);
    ctx.strokeStyle = '#666';
    ctx.strokeRect(0, 0, rulerWidth, canvas.height);

    const topEdgeMeters = Math.floor((0 - centerY) / intervalSize) * interval;
    const bottomEdgeMeters =
      Math.ceil((canvas.height - centerY) / intervalSize) * interval;

    ctx.save();
    for (let m = topEdgeMeters; m <= bottomEdgeMeters; m += interval) {
      const y = centerY + (m / interval) * intervalSize;
      if (y >= 0 && y <= canvas.height) {
        // Tick mark
        ctx.beginPath();
        ctx.strokeStyle = m === 0 ? '#FF4A4A' : '#666';
        ctx.moveTo(rulerWidth - 10, y);
        ctx.lineTo(rulerWidth, y);
        ctx.stroke();

        // Label (rotated)
        ctx.save();
        ctx.translate(rulerWidth / 2 - 2, y);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = m === 0 ? '#FF4A4A' : '#AAA';
        const label = m >= 1000 || m <= -1000 ? `${m / 1000}km` : `${m}m`;
        ctx.fillText(label, 0, 0);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function drawLayers() {
    if (!ctx || !canvas) return;

    // Sort layers by zIndex
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

    sortedLayers.forEach((layer) => {
      const img = imageCache.get(layer.imageId);
      if (!img || !ctx || !canvas) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.save();

      // Translate to sprite center + offset (convert meters to pixels)
      ctx.translate(
        centerX + canvasOffset.x + layer.offset.x * PIXELS_PER_METER * zoom,
        centerY + canvasOffset.y + layer.offset.y * PIXELS_PER_METER * zoom,
      );

      // Apply rotation
      if (layer.rotation) {
        ctx.rotate(layer.rotation);
      }

      // Scale
      const scaledWidth = layer.width * zoom;
      const scaledHeight = layer.height * zoom;

      // Draw image centered on the offset point
      ctx.drawImage(
        img,
        -scaledWidth / 2,
        -scaledHeight / 2,
        scaledWidth,
        scaledHeight,
      );

      // Draw selection highlight
      const layerIndex = layers.indexOf(layer);
      if (layerIndex === selectedLayerIndex) {
        ctx.strokeStyle = '#FFD700'; // Gold color for selection
        ctx.lineWidth = 3;
        ctx.strokeRect(
          -scaledWidth / 2,
          -scaledHeight / 2,
          scaledWidth,
          scaledHeight,
        );

        // Draw cross pattern for centering
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        // Vertical line through center
        ctx.beginPath();
        ctx.moveTo(0, -scaledHeight / 2);
        ctx.lineTo(0, scaledHeight / 2);
        ctx.stroke();

        // Horizontal line through center
        ctx.beginPath();
        ctx.moveTo(-scaledWidth / 2, 0);
        ctx.lineTo(scaledWidth / 2, 0);
        ctx.stroke();

        ctx.setLineDash([]);
      }

      ctx.restore();
    });
  }

  function drawColliders() {
    if (!ctx) return;

    colliders.forEach((collider, index) => {
      if (!ctx) return;

      const isSelected = index === selectedColliderIndex;
      const screenPos = worldToScreen(collider.offset.x, collider.offset.y);

      ctx.strokeStyle = isSelected ? '#4A9EFF' : '#00FF88';
      ctx.fillStyle = isSelected
        ? 'rgba(74, 158, 255, 0.2)'
        : 'rgba(0, 255, 136, 0.2)';
      ctx.lineWidth = isSelected ? 3 : 2;

      if (collider.type === 'circle' && collider.radius) {
        const radiusScreen = collider.radius * PIXELS_PER_METER * zoom;

        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, radiusScreen, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (
        collider.type === 'rect' &&
        collider.width &&
        collider.height
      ) {
        const widthScreen = collider.width * PIXELS_PER_METER * zoom;
        const heightScreen = collider.height * PIXELS_PER_METER * zoom;

        ctx.save();
        ctx.translate(screenPos.x, screenPos.y);
        ctx.rotate(collider.localRotation || 0);

        ctx.fillRect(
          -widthScreen / 2,
          -heightScreen / 2,
          widthScreen,
          heightScreen,
        );
        ctx.strokeRect(
          -widthScreen / 2,
          -heightScreen / 2,
          widthScreen,
          heightScreen,
        );

        ctx.restore();
      }
    });
  }

  /**
   * Save sprite
   */
  async function saveSprite() {
    if (!spriteName.trim()) {
      alert('Please enter a sprite name');
      return;
    }

    const spriteData = {
      id: data.sprite?.id || `sprite-${Date.now()}`,
      name: spriteName,
      objectType: objectType,
      layers: layers,
      collider: colliders.length === 1 ? colliders[0] : colliders,
      animationStates: null,
    };

    const formData = new FormData();
    formData.append('spriteData', JSON.stringify(spriteData));

    const response = await fetch('?/save', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      if (result.type === 'success') {
        alert('Sprite saved successfully!');
        if (data.isNew) {
          goto(`/admin/sprites/${spriteData.id}`);
        }
      }
    }
  }

  /**
   * Delete sprite
   */
  async function deleteSpriteConfirm() {
    if (!confirm('Are you sure you want to delete this sprite?')) return;

    const response = await fetch('?/delete', {
      method: 'POST',
    });

    if (response.ok) {
      goto('/admin/sprites');
    }
  }

  /**
   * Handle image upload
   * @param {Event} e
   */
  async function handleImageUpload(e) {
    e.preventDefault();
    uploading = true;
    uploadError = '';
    uploadSuccess = false;

    const form = /** @type {HTMLFormElement} */ (e.target);
    const formData = new FormData(form);

    try {
      const response = await fetch('/admin/api/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        uploadSuccess = true;

        // Add new image to the list
        data.images = [result.image, ...data.images];

        // Automatically select and add the newly uploaded image
        addLayer(result.image.path);

        form.reset();
      } else {
        const error = await response.json();
        uploadError = error.error || 'Failed to upload image';
      }
    } catch (err) {
      uploadError = 'Error uploading image';
    } finally {
      uploading = false;
    }
  }

  // Re-render when state changes
  $effect(() => {
    if (layers || colliders || showMode || zoom || showRulers) {
      render();
    }
  });
</script>

<svelte:head>
  <title
    >{data.isNew ? 'New Sprite' : `Edit ${data.sprite?.name}`} - Sprite Editor</title
  >
</svelte:head>

<div class="sprite-editor">
  <div class="editor-header">
    <div class="title-section">
      <a href="/admin/sprites" class="back-btn">← Back</a>
      <h1>{data.isNew ? 'New Sprite' : 'Edit Sprite'}</h1>
    </div>
    <div class="actions">
      <button class="save-btn" onclick={saveSprite}>Save</button>
      {#if !data.isNew}
        <button class="delete-btn" onclick={deleteSpriteConfirm}>Delete</button>
      {/if}
    </div>
  </div>

  <div class="editor-body">
    <!-- Left sidebar: Properties & Layers -->
    <div class="sidebar left">
      <section class="properties">
        <h3>Sprite Properties</h3>
        <label>
          Name
          <input
            type="text"
            bind:value={spriteName}
            placeholder="Sprite name"
          />
        </label>
        <label>
          Object Type
          <select bind:value={objectType}>
            <option value="ship">Ship</option>
            <option value="asteroid">Asteroid</option>
            <option value="planet">Planet</option>
            <option value="blackHole">Black Hole</option>
            <option value="station">Station</option>
            <option value="waypoint">Waypoint</option>
            <option value="debris">Debris</option>
            <option value="projectile">Projectile</option>
          </select>
        </label>
      </section>

      <section class="layers">
        <h3>Layers ({layers.length})</h3>
        {#if selectedLayerIndex !== null}
          <div class="layer-help">
            <strong>Selected:</strong> Layer {selectedLayerIndex}<br />
            <small>WASD to move, +/- to scale, Q to duplicate</small>
          </div>
        {/if}
        <div class="layer-list">
          {#each layers as _, index}
            <div
              class="layer-item"
              class:selected={selectedLayerIndex === index}
              role="button"
              tabindex="0"
              onclick={() => {
                selectedLayerIndex = index;
                selectedColliderIndex = null;
                render();
              }}
              onkeydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  selectedLayerIndex = index;
                  selectedColliderIndex = null;
                  render();
                }
              }}
            >
              <span>Layer {index}</span>
              <div class="layer-actions">
                <button
                  onclick={() => moveLayerUp(index)}
                  disabled={index === layers.length - 1}>↑</button
                >
                <button
                  onclick={() => moveLayerDown(index)}
                  disabled={index === 0}>↓</button
                >
                <button onclick={() => removeLayer(index)}>✕</button>
              </div>
            </div>
          {/each}
        </div>
        <div class="add-layer">
          <button class="add-layer-btn" onclick={() => (showLayerModal = true)}
            >+ Add Layer</button
          >
        </div>
      </section>
    </div>

    <!-- Center: Canvas -->
    <div class="canvas-container">
      <div class="canvas-toolbar">
        <div class="view-controls">
          <button
            class:active={showMode === 'sprite'}
            onclick={() => (showMode = 'sprite')}>Sprite</button
          >
          <button
            class:active={showMode === 'collision'}
            onclick={() => (showMode = 'collision')}>Collision</button
          >
          <button
            class:active={showMode === 'both'}
            onclick={() => (showMode = 'both')}>Both</button
          >
          <button
            class:active={showRulers}
            onclick={() => {
              showRulers = !showRulers;
              render();
            }}
            title="Toggle measurement rulers"
          >
            Rulers
          </button>
        </div>
        <div class="zoom-controls">
          <button
            onclick={() => {
              // Zoom out by dividing by 1.2 (consistent percentage decrease)
              zoom = Math.max(0.01, zoom / 1.2);
            }}>-</button
          >
          <span>{Math.round(zoom * 100)}%</span>
          <button
            onclick={() => {
              // Zoom in by multiplying by 1.2 (consistent percentage increase)
              zoom = Math.min(10, zoom * 1.2);
            }}>+</button
          >
          <button
            onclick={() => (zoom = 1)}
            title="Reset to 100%"
            style="margin-left: 0.5rem; font-size: 0.75rem; padding: 0.3rem 0.5rem;"
          >
            Reset
          </button>
        </div>
      </div>
      <canvas
        bind:this={canvas}
        onmousedown={handleMouseDown}
        onmousemove={handleMouseMove}
        onmouseup={handleMouseUp}
      ></canvas>
    </div>

    <!-- Right sidebar: Tools & Collision -->
    <div class="sidebar right">
      <section class="tools">
        <h3>Tools</h3>
        <div class="tool-buttons">
          <button
            class:active={selectedTool === 'select'}
            onclick={() => (selectedTool = 'select')}>Select</button
          >
          <button
            class:active={selectedTool === 'circle'}
            onclick={() => (selectedTool = 'circle')}>Circle</button
          >
          <button
            class:active={selectedTool === 'rect'}
            onclick={() => (selectedTool = 'rect')}>Rectangle</button
          >
        </div>
      </section>

      <section class="colliders">
        <h3>Collision Boxes ({colliders.length})</h3>
        {#if selectedColliderIndex !== null}
          <div class="collider-help">
            <strong>Selected {colliders[selectedColliderIndex]?.type}</strong
            ><br />
            <small
              >WASD to move, Q to duplicate{colliders[selectedColliderIndex]?.type ===
              'rect'
                ? ', R/E to rotate ±1°'
                : ''}</small
            >
          </div>
        {/if}
        <div class="collider-list">
          {#each colliders as collider, index}
            <div
              class="collider-item"
              class:selected={selectedColliderIndex === index}
              role="button"
              tabindex="0"
              onclick={() => {
                selectedColliderIndex = index;
                selectedLayerIndex = null;
                render();
              }}
              onkeydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  selectedColliderIndex = index;
                  selectedLayerIndex = null;
                  render();
                }
              }}
            >
              <div class="collider-info">
                <strong>{collider.type}</strong>
                {#if collider.type === 'circle'}
                  <span>r: {collider.radius?.toFixed(2)}m</span>
                {:else if collider.type === 'rect'}
                  <span
                    >{collider.width?.toFixed(2)} × {collider.height?.toFixed(
                      2,
                    )}m</span
                  >
                  {#if collider.localRotation}
                    <span class="rotation-display"
                      >∠ {((collider.localRotation * 180) / Math.PI).toFixed(
                        0,
                      )}°</span
                    >
                  {/if}
                {/if}
              </div>
              <button
                onclick={(e) => {
                  e.stopPropagation();
                  removeCollider(index);
                }}>✕</button
              >
            </div>
          {/each}
        </div>
        {#if colliders.length === 0}
          <p class="empty-hint">Draw collision boxes using the tools above</p>
        {/if}
      </section>
    </div>
  </div>
</div>

<!-- Layer Image Picker Modal -->
{#if showLayerModal}
  <div
    class="modal-backdrop"
    onclick={() => (showLayerModal = false)}
    onkeydown={(e) => {
      if (e.key === 'Escape') showLayerModal = false;
    }}
    role="presentation"
  >
    <div
      class="layer-modal"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      tabindex="-1"
    >
      <h3>Select Image for Layer</h3>

      <!-- Upload Section -->
      <div class="upload-section">
        <h4>Upload New Image</h4>
        <form onsubmit={handleImageUpload}>
          <div class="upload-group">
            <input type="file" name="file" accept="image/*" required />
            <button type="submit" class="upload-btn" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {#if uploadError}
            <p class="error-message">{uploadError}</p>
          {/if}
          {#if uploadSuccess}
            <p class="success-message">Image uploaded and added to layer!</p>
          {/if}
        </form>
      </div>

      <!-- Image Library -->
      {#if data.images.length > 0}
        <h4>Or Select from Library ({data.images.length})</h4>
        <div class="image-grid">
          {#each data.images as image}
            <button
              type="button"
              class="image-option"
              onclick={() => addLayer(image.path)}
            >
              <div class="image-thumbnail">
                <img src={image.path} alt={image.alt || image.filename} />
              </div>
              <div class="image-label">
                <p class="filename">{image.filename}</p>
              </div>
            </button>
          {/each}
        </div>
      {:else}
        <p class="empty-message">No images in library yet.</p>
      {/if}

      <button class="cancel-btn" onclick={() => (showLayerModal = false)}
        >Cancel</button
      >
    </div>
  </div>
{/if}

<style>
  .sprite-editor {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 140px);
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .back-btn {
    color: var(--main-blue);
    text-decoration: none;
    font-size: 0.9rem;
  }

  .back-btn:hover {
    text-decoration: underline;
  }

  h1 {
    margin: 0;
    font-size: 1.75rem;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
  }

  .save-btn,
  .delete-btn {
    padding: 0.5rem 1.25rem;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .save-btn {
    background: var(--main-blue);
    color: var(--neutral-white);
  }

  .delete-btn {
    background: #ff4a4a;
    color: var(--neutral-white);
  }

  .save-btn:hover,
  .delete-btn:hover {
    opacity: 0.8;
  }

  .editor-body {
    display: grid;
    grid-template-columns: 250px 1fr 250px;
    gap: 1rem;
    flex: 1;
    overflow: hidden;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
  }

  section {
    background: var(--neutral-gray);
    padding: 1rem;
    border-radius: 8px;
  }

  section h3 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
  }

  input,
  select {
    padding: 0.5rem;
    border: 1px solid #444;
    border-radius: 4px;
    background: var(--neutral-dark-gray);
    color: var(--neutral-white);
    font-size: 0.9rem;
  }

  .layer-list,
  .collider-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 300px;
    overflow-y: auto;
  }

  .layer-item,
  .collider-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: var(--neutral-dark-gray);
    border-radius: 4px;
    font-size: 0.85rem;
  }

  .layer-item.selected,
  .collider-item.selected {
    background: var(--main-blue);
    color: var(--neutral-white);
  }

  .layer-actions,
  .collider-item button {
    display: flex;
    gap: 0.25rem;
  }

  .layer-actions button,
  .collider-item button {
    padding: 0.25rem 0.5rem;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: inherit;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.75rem;
  }

  .layer-actions button:hover,
  .collider-item button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .layer-actions button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .add-layer {
    margin-top: 0.5rem;
  }

  .add-layer-btn {
    width: 100%;
    padding: 0.5rem;
    background: var(--main-blue);
    color: var(--neutral-white);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: opacity 0.2s;
  }

  .add-layer-btn:hover {
    opacity: 0.8;
  }

  .layer-help {
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.3);
    padding: 0.5rem;
    border-radius: 4px;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
  }

  .layer-help strong {
    color: #ffd700;
  }

  .layer-help small {
    opacity: 0.7;
  }

  .collider-help {
    background: rgba(74, 158, 255, 0.1);
    border: 1px solid rgba(74, 158, 255, 0.3);
    padding: 0.5rem;
    border-radius: 4px;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
  }

  .collider-help strong {
    color: #4a9eff;
  }

  .collider-help small {
    opacity: 0.7;
  }

  .collider-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .collider-info span {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .rotation-display {
    color: #4a9eff !important;
    opacity: 1 !important;
    font-weight: 500;
  }

  .empty-hint {
    text-align: center;
    font-size: 0.85rem;
    opacity: 0.5;
    margin: 1rem 0;
  }

  .canvas-container {
    display: flex;
    flex-direction: column;
    background: var(--neutral-gray);
    border-radius: 8px;
    overflow: hidden;
  }

  .canvas-toolbar {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: var(--neutral-gray);
    border-bottom: 1px solid #444;
  }

  .view-controls,
  .zoom-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .view-controls button,
  .zoom-controls button,
  .tool-buttons button {
    padding: 0.4rem 0.75rem;
    border: 1px solid #444;
    background: var(--neutral-dark-gray);
    color: var(--neutral-white);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
  }

  .view-controls button:hover,
  .zoom-controls button:hover,
  .tool-buttons button:hover {
    background: #555;
  }

  .view-controls button.active,
  .tool-buttons button.active {
    background: var(--main-blue);
    border-color: var(--main-blue);
  }

  .zoom-controls span {
    min-width: 50px;
    text-align: center;
    font-size: 0.85rem;
  }

  canvas {
    flex: 1;
    cursor: crosshair;
  }

  .tool-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tool-buttons button {
    width: 100%;
  }

  /* Layer Modal */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .layer-modal {
    background: var(--neutral-dark-gray);
    padding: 2rem;
    border-radius: 12px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .layer-modal h3 {
    margin: 0 0 1.5rem 0;
    color: var(--neutral-white);
  }

  .cancel-btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: var(--neutral-gray);
    color: var(--neutral-white);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
  }

  .cancel-btn:hover {
    background: #555;
  }

  /* Upload Section Styles */
  .upload-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #444;
  }

  .upload-section h4,
  .layer-modal h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: var(--neutral-white);
    opacity: 0.8;
  }

  .upload-group {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .upload-group input[type='file'] {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #444;
    border-radius: 4px;
    background: var(--neutral-dark-gray);
    color: var(--neutral-white);
    font-size: 0.85rem;
  }

  .upload-btn {
    padding: 0.5rem 1rem;
    background: var(--main-blue);
    color: var(--neutral-white);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    white-space: nowrap;
    transition: opacity 0.2s;
  }

  .upload-btn:hover:not(:disabled) {
    opacity: 0.8;
  }

  .upload-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-message {
    color: #ff4a4a;
    font-size: 0.8rem;
    margin: 0.5rem 0 0 0;
  }

  .success-message {
    color: #4aff88;
    font-size: 0.8rem;
    margin: 0.5rem 0 0 0;
  }

  /* Image Grid Styles */
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 1.5rem;
    padding: 0.5rem;
  }

  .image-option {
    background: var(--neutral-dark-gray);
    border: 2px solid #444;
    border-radius: 8px;
    padding: 0;
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden;
  }

  .image-option:hover {
    border-color: var(--main-blue);
    transform: translateY(-2px);
  }

  .image-thumbnail {
    width: 100%;
    height: 100px;
    overflow: hidden;
    background: #2a2a2a;
  }

  .image-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-label {
    padding: 0.5rem;
  }

  .filename {
    margin: 0;
    font-size: 0.75rem;
    color: var(--neutral-white);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .empty-message {
    text-align: center;
    padding: 2rem;
    color: #888;
    margin-bottom: 1rem;
  }
</style>
