<script>
  import Timeline from './timeline.svelte';
  import Experiments from './experiments.svelte';
  import Projects from './projects.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';

  /** @type {import('./$types').PageData} */
  export let data;

  /**
   * @typedef {Object} Category
   * @property {number} id
   * @property {string} slug
   * @property {string} name
   * @property {string | null} description
   * @property {number} order
   * @property {boolean} hasTab
   */

  // Animation constants
  const ANIMATION_TIMINGS = {
    EXIT: 800,
    INSTANT_SWITCH: 20,
    ENTER: 500,
  };

  const EASING = {
    EXIT: 'cubic-bezier(1,-0.3,0.9,0.5)',
    ENTER: 'cubic-bezier(0,0,.3,1.3)',
  };

  let animateRight = true;
  let isAnimating = false;
  /** @type {HTMLDivElement | null} */
  let tabContentElement = null;
  /** @type {HTMLElement | null} */
  let mainElement = null;

  // Tab cutout state
  /** @type {Record<string, HTMLLabelElement | null>} */
  let tabLabels = {};
  /** @type {HTMLElement | null} */
  let navElement = null;

  /**
   * Get current tab from hash
   * @param {string} hash
   * @returns {string}
   */
  function getCurrentTab(hash) {
    const slug = hash.replace('#', '');
    /** @type {Category[]} */
    const cats = /** @type {Category[]} */ (data.categories);
    const category = cats.find((cat) => cat.slug === slug);
    // Default to first category if hash doesn't match
    return category ? category.slug : cats[0]?.slug || 'projects';
  }

  /**
   * Scroll main container to top
   */
  function scrollToTop() {
    if (!mainElement && browser) {
      mainElement = document.getElementsByTagName('main')[0] || null;
    }
    mainElement?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Apply transform styles to tab content
   * @param {string} translateX - CSS translateX value
   * @param {string} transition - CSS transition value
   */
  function applyTransform(translateX, transition) {
    if (!tabContentElement) return;
    tabContentElement.style.transition = transition;
    tabContentElement.style.transform = `translateX(${translateX})`;
  }

  /**
   * Phase 1: Slide out current content off-screen
   * @param {{ currentTarget: { value: string; }; }} event
   */
  function onTabChange(event) {
    // Prevent tab changes during animation
    if (isAnimating) return;

    const target = event?.currentTarget.value;
    const current = window.location.hash.replace('#', '');

    // Lock tabs during animation
    isAnimating = true;

    // Determine animation direction based on tab order
    /** @type {Category[]} */
    const cats = /** @type {Category[]} */ (data.categories);
    const currentIndex = cats.findIndex((cat) => cat.slug === current);
    const targetIndex = cats.findIndex((cat) => cat.slug === target);
    animateRight = targetIndex > currentIndex;

    // Phase 1: Slide out current content
    applyTransform(
      animateRight ? '-100vw' : '100vw',
      `transform ${ANIMATION_TIMINGS.EXIT}ms ${EASING.EXIT}`,
    );
    scrollToTop();

    setTimeout(() => {
      changeTab(target);
    }, ANIMATION_TIMINGS.EXIT);
  }

  /**
   * Phase 2: Update hash and position new content off-screen (opposite side)
   * @param {string} target
   */
  function changeTab(target) {
    // Update URL hash
    window.location.hash = target;

    // Phase 2: Instantly position new content off-screen (opposite side)
    applyTransform(animateRight ? '100vw' : '-100vw', 'transform 0s');
    scrollToTop();

    setTimeout(() => {
      animateEnd();
    }, ANIMATION_TIMINGS.INSTANT_SWITCH);
  }

  /**
   * Phase 3: Slide new content into view   */
  function animateEnd() {
    applyTransform(
      '0',
      `transform ${ANIMATION_TIMINGS.ENTER}ms ${EASING.ENTER}`,
    );
    scrollToTop();

    setTimeout(() => {
      resetTranslation();
    }, ANIMATION_TIMINGS.ENTER);
  }

  /**
   * Clear inline styles to restore position:fixed behavior on nav bar
   */
  function resetTranslation() {
    if (tabContentElement) {
      tabContentElement.style.cssText = '';
    }
    // Unlock tabs after animation completes
    isAnimating = false;
  }

  /**
   * Calculate widths of the three background sections
   * All three should add up to 100vw
   */
  let bgLeftWidth = 0;
  let bgMiddleWidth = 100;
  let bgRightWidth = 0;
  let enableTabAnimation = false;
  let isFirstLoad = true;

  function updateBackgroundPosition() {
    if (!browser || !navElement) return;

    const activeLabel = tabLabels[currentTab];
    if (!activeLabel) return;

    const labelRect = activeLabel.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Calculate widths based on tab position within viewport
    bgLeftWidth = labelRect.left; // From left edge of viewport to tab
    bgMiddleWidth = labelRect.width; // Width of the tab (transparent)
    bgRightWidth = viewportWidth - labelRect.left - labelRect.width; // Remaining space
  }

  // Reactive statement to update background position when tab changes
  $: currentTab = getCurrentTab($page.url.hash);
  $: if (
    browser &&
    navElement &&
    Object.keys(tabLabels).length > 0 &&
    currentTab // Add currentTab as dependency to trigger on tab change
  ) {
    // Only enable animation after first load
    if (!isFirstLoad) {
      enableTabAnimation = true; // Enable animation for tab changes
      // Disable animation after transition completes
      setTimeout(() => {
        enableTabAnimation = false;
      }, 500); // Match the transition duration
    }
    updateBackgroundPosition();
    isFirstLoad = false;
  }

  // Update on mount and resize
  import { onMount } from 'svelte';

  onMount(() => {
    updateBackgroundPosition();
    window.addEventListener('resize', updateBackgroundPosition);
    return () => window.removeEventListener('resize', updateBackgroundPosition);
  });
</script>

<SEO
  title="Projects & Experience"
  description="Browse Matt Jones's professional experience, personal projects, and creative experiments including web development, CSS art, and interactive demos"
  keywords={[
    'portfolio projects',
    'web development projects',
    'CSS experiments',
    'creative coding',
    'interactive demos',
  ]}
/>

<div id="projects-page">
  <!-- Sliding background with 3 sections: dark | transparent | dark -->
  <div class="nav-background">
    <div
      class="bg-left"
      class:animate={enableTabAnimation}
      style="width: {bgLeftWidth}px;"
    ></div>
    <div
      class="bg-middle"
      class:animate={enableTabAnimation}
      style="width: {bgMiddleWidth}px;"
    ></div>
    <div
      class="bg-right"
      class:animate={enableTabAnimation}
      style="width: {bgRightWidth}px;"
    ></div>
  </div>

  <nav bind:this={navElement}>
    <hr />
    <form>
      <div class="title"><h3>Portfolio:</h3></div>
      <div class="tabs">
        {#each /** @type {Category[]} */ (data.categories) as category (category.id)}
          <div class="tab">
            <input
              type="radio"
              id={category.slug}
              value={category.slug}
              checked={currentTab === category.slug}
              disabled={isAnimating}
              on:change={onTabChange}
            />
            <label
              for={category.slug}
              class:loading={isAnimating}
              bind:this={tabLabels[category.slug]}
              title={category.description || ''}
            >
              {category.name}
            </label>
          </div>
        {/each}
      </div>
    </form>
  </nav>
  <div id="tab-content" bind:this={tabContentElement}>
    {#if currentTab === 'other'}
      <Experiments experiences={data.experiences} />
    {:else if currentTab === 'experiences'}
      <Timeline experiences={data.experiences} />
    {:else if currentTab === 'projects'}
      <Projects experiences={data.experiences} />
    {/if}
  </div>
</div>

<style>
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* Background pattern originally generated from 
  https://www.magicpattern.design/tools/css-backgrounds */
  #projects-page {
    width: 450vw;
    padding-left: 220vw;
    margin-left: -220vw;
    min-height: 100vh;
    overflow: auto;
    background:
      radial-gradient(
        circle,
        transparent 20%,
        var(--neutral-white) 20%,
        var(--neutral-white) 80%,
        transparent 80%,
        transparent
      ),
      radial-gradient(
          circle,
          transparent 20%,
          var(--neutral-white) 20%,
          var(--neutral-white) 80%,
          transparent 80%,
          transparent
        )
        30px 30px,
      linear-gradient(var(--neutral-dark-gray-op-50) 2.6px, transparent 2.6px)
        0 -1.3px,
      linear-gradient(
          90deg,
          var(--neutral-dark-gray-op-50) 2.6px,
          var(--neutral-white) 2.6px
        ) -1.3px
        0;
    background-size:
      60px 60px,
      60px 60px,
      30px 30px,
      30px 30px;
  }

  /* Sliding background behind nav */
  .nav-background {
    position: fixed;
    width: 100vw;
    height: 59px;
    display: flex;
    z-index: 9;
  }

  .bg-left {
    background-color: var(--neutral-dark-gray);
    border-bottom-right-radius: 8px;
    /* Width set dynamically via inline style */
  }

  .bg-left.animate {
    transition: width 500ms cubic-bezier(0, 0, 0.3, 1.3);
  }

  .bg-middle {
    background-color: transparent;
    position: relative;
    /* Width set dynamically via inline style */
  }

  /* Left curve notch */
  .bg-middle::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 16px;
    background: radial-gradient(
      circle at bottom right,
      transparent 16px,
      var(--neutral-dark-gray) 16px
    );
  }

  /* Right curve notch */
  .bg-middle::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 16px;
    height: 16px;
    background: radial-gradient(
      circle at bottom left,
      transparent 16px,
      var(--neutral-dark-gray) 16px
    );
  }

  .bg-middle.animate {
    transition: width 500ms cubic-bezier(0, 0, 0.3, 1.3);
  }

  .bg-right {
    background-color: var(--neutral-dark-gray);
    border-bottom-left-radius: 8px;
    /* Width set dynamically via inline style */
  }

  .bg-right.animate {
    transition: width 500ms cubic-bezier(0, 0, 0.3, 1.3);
  }

  nav {
    width: 450vw;
    padding-left: 220vw;
    margin-left: -220vw;
    background-color: transparent;
    position: fixed;
    z-index: 10;
  }

  hr {
    padding-left: 220vw;
    margin-left: -220vw;
    border-color: var(--neutral-black);
    margin-top: 0;
  }

  .title {
    display: flex;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
  }

  .title h3 {
    margin: 0;
    height: fit-content;
  }

  nav form {
    padding-left: 220vw;
    margin-left: -220vw;
    min-width: fit-content;
    width: fit-content;
    margin-right: auto;
    display: flex;
    width: 40vw;
    padding-bottom: 0;
  }

  .tabs {
    display: flex;
    gap: 4px;
    align-items: flex-end;
  }

  .tab {
    position: relative;
  }

  .tab label {
    display: block;
    padding: 8px 20px;
    margin: 0;
    transition: all 0.2s ease;
    border-radius: 8px;
    background: transparent;
    position: relative;
    cursor: pointer;
    z-index: 90;
    line-height: 1.8em;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
  }

  /* Tooltip styling */
  .tab label[title]:hover::after {
    content: attr(title);
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--neutral-black);
    color: var(--neutral-white);
    padding: 6px 12px;
    border-radius: 4px;
    white-space: nowrap;
    font-size: 0.875rem;
    z-index: 100;
    pointer-events: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .tab label[title]:hover::before {
    content: '';
    position: absolute;
    bottom: calc(100% + 2px);
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: var(--neutral-black);
    z-index: 100;
    pointer-events: none;
  }

  .tab label:hover {
    background-color: rgba(77, 180, 224, 0.221);
  }

  .tab input[type='radio'] {
    height: 0;
    position: absolute;
    opacity: 0;
  }

  .tab input[type='radio']:checked + label {
    background: transparent;
    color: var(--neutral-black);
    position: relative;
    z-index: 2;
  }

  /* Curved notches on left side of active tab */
  .tab input[type='radio']:checked + label::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: -8px;
    width: 8px;
    height: 8px;
    background: var(--neutral-dark-gray);
    border-bottom-right-radius: 8px;
  }

  /* Curved notches on right side of active tab */
  .tab input[type='radio']:checked + label::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: -8px;
    width: 8px;
    height: 8px;
    background: var(--neutral-dark-gray);
    border-bottom-left-radius: 8px;
  }

  .tab label.loading {
    cursor: not-allowed;
    pointer-events: none;
  }

  .tab label.loading::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--neutral-white) 20%,
      var(--neutral-white) 40%,
      transparent 60%
    );
    background-size: 200% 100%;
    animation: shimmer 1.3s infinite linear;
    opacity: 0.15;
    transition: opacity 0.3s ease-out;
  }

  .tab label:not(.loading)::before {
    opacity: 0;
  }

  .tab input[type='radio']:disabled + label {
    opacity: 0.7;
    transition: opacity 0.3s ease-out;
  }

  .tab input[type='radio']:not(:disabled) + label {
    opacity: 1;
    transition: opacity 0.3s ease-out;
  }

  #tab-content {
    width: 100vw;
    margin-top: 59px;
    height: fit-content;
    overflow: auto;
  }
</style>
