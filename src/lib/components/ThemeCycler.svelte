<script>
  import { themeMode } from '../../store';
  import { createPalette } from '../../routes/palette';

  // Get palette data
  const palette = createPalette();
  const availableThemes = Object.keys(palette);

  let slideOffset = 0;
  let isAnimating = false;
  let enableTransition = true;

  /**
   * Cycle to the next theme
   */
  function cycleNext() {
    if (isAnimating) return;
    isAnimating = true;
    slideOffset = -1;

    setTimeout(() => {
      // Disable transition for instant reset
      enableTransition = false;

      const currentIndex = availableThemes.indexOf($themeMode);
      const nextIndex = (currentIndex + 1) % availableThemes.length;
      themeMode.set(availableThemes[nextIndex]);
      slideOffset = 0;

      // Re-enable transition on next frame
      setTimeout(() => {
        enableTransition = true;
        isAnimating = false;
      }, 50);
    }, 400);
  }

  /**
   * Cycle to the previous theme
   */
  function cyclePrevious() {
    if (isAnimating) return;
    isAnimating = true;
    slideOffset = 1;

    setTimeout(() => {
      // Disable transition for instant reset
      enableTransition = false;

      const currentIndex = availableThemes.indexOf($themeMode);
      const prevIndex =
        (currentIndex - 1 + availableThemes.length) % availableThemes.length;
      themeMode.set(availableThemes[prevIndex]);
      slideOffset = 0;

      // Re-enable transition on next frame
      setTimeout(() => {
        enableTransition = true;
        isAnimating = false;
      }, 50);
    }, 400);
  }

  /**
   * Get theme index with wrapping for infinite carousel
   * @param {number} baseIndex
   * @param {number} offset
   */
  function getWrappedIndex(baseIndex, offset) {
    return (
      (baseIndex + offset + availableThemes.length) % availableThemes.length
    );
  }

  // Build carousel items: 2 left + center + 2 right
  $: currentIndex = availableThemes.indexOf($themeMode);
  $: carouselItems = [
    // Left side (hidden, then visible faded)
    {
      themeName: availableThemes[getWrappedIndex(currentIndex, -2)],
      position: -2,
    },
    {
      themeName: availableThemes[getWrappedIndex(currentIndex, -1)],
      position: -1,
    },
    // Center (current)
    { themeName: availableThemes[currentIndex], position: 0 },
    // Right side (visible faded, then hidden)
    {
      themeName: availableThemes[getWrappedIndex(currentIndex, 1)],
      position: 1,
    },
    {
      themeName: availableThemes[getWrappedIndex(currentIndex, 2)],
      position: 2,
    },
  ];
</script>

<div class="theme-carousel">
  <div class="carousel-viewport">
    <div
      class="carousel-track"
      class:no-transition={!enableTransition}
      style="transform: translateX(calc(50% - 250px + {slideOffset * 100}px))"
    >
      {#each carouselItems as item (item.themeName + item.position)}
        {@const themeData = /** @type {{icon: string, name: string}} */ (
          palette[/** @type {keyof typeof palette} */ (item.themeName)]
        )}
        {@const isCenter = item.position === 0}

        <button
          class="carousel-item"
          class:carousel-item-center={isCenter}
          on:click={() => {
            if (item.position === -1) cyclePrevious();
            if (item.position === 1) cycleNext();
          }}
          disabled={isCenter}
          title={isCenter
            ? `${themeData.name} Mode (current)`
            : `Switch to ${themeData.name} mode`}
        >
          <span class="theme-icon">{themeData.icon}</span>
          <span class="theme-label">{themeData.name}</span>
        </button>
      {/each}
    </div>
    <!-- Gradient overlays -->
    <div class="gradient-overlay gradient-left"></div>
    <div class="gradient-overlay gradient-right"></div>
  </div>
</div>

<style>
  .theme-carousel {
    position: relative;
    width: 100%;
    max-width: 600px;
    padding: 0.75rem 0;
  }

  .carousel-viewport {
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  .carousel-track {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .carousel-track.no-transition {
    transition: none;
  }

  .carousel-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 0.75rem 0.5rem;
    background-color: transparent;
    border: none;
    color: var(--contrast-text-light);
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
    cursor: pointer;
    min-width: 100px;
    box-sizing: border-box;
  }

  .carousel-item:disabled {
    cursor: default;
  }

  .carousel-item-center {
    opacity: 1;
    z-index: 1;
  }

  .gradient-overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    pointer-events: none;
    z-index: 2;
  }

  .gradient-left {
    left: 0;
    background: linear-gradient(
      to right,
      var(--neutral-white) 0%,
      var(--neutral-white) 40%,
      transparent 80%
    );
  }

  .gradient-right {
    right: 0;
    background: linear-gradient(
      to left,
      var(--neutral-white) 0%,
      var(--neutral-white) 40%,
      transparent 80%
    );
  }

  .theme-icon {
    font-size: 1.25rem;
  }

  .theme-label {
    font-size: 1rem;
  }

  /* Mobile responsive */
  @media (max-width: 440px) {
    .carousel-item {
      padding: 0.5rem 0.25rem;
      min-width: 100px;
    }

    .theme-label {
      font-size: 0.875rem;
    }

    .theme-icon {
      font-size: 1.1rem;
    }
  }
</style>
