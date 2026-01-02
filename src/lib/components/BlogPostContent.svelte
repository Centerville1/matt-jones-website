<script>
  import { renderTiptapJSON } from '$lib/utils/tiptap-renderer.js';
  import { onMount, onDestroy, tick } from 'svelte';
  import { browser } from '$app/environment';
  import { getComponent } from '$lib/components/embeddable/registry.js';
  import { mount, unmount } from 'svelte';
  import { writable } from 'svelte/store';

  /** @type {any} */
  export let content;

  /** @type {string} */
  export let backgroundPattern = '';

  /** @type {HTMLElement | undefined} */
  let contentContainer;

  /** @type {string} */
  let htmlContent = '';

  /** @type {Array<{id: string, component: any, props: any, contextId: string | null, target: HTMLElement, instance?: any, contextStore?: any}>} */
  let embeddedComponents = [];

  /** @type {Record<string, any>} Stores for shared context */
  let contextStores = {};

  // Render HTML when content changes (client-side only)
  $: if (browser && content) {
    renderTiptapJSON(content).then(async (html) => {
      htmlContent = html;
      if (contentContainer) {
        // Wait for DOM to update after htmlContent changes
        await tick();
        await parseAndRenderComponents();
        setTimeout(addCopyButtons, 0);
      }
    });
  }

  /**
   * Parse HTML content and extract component placeholders
   */
  async function parseAndRenderComponents() {
    if (!browser || !contentContainer) return;

    // Find all component placeholders
    const placeholders = contentContainer.querySelectorAll(
      'svelte-component-placeholder',
    );

    // Build new components array
    const newComponents = [];

    // Load and prepare each component
    for (let i = 0; i < placeholders.length; i++) {
      const placeholder = placeholders[i];
      const componentName = placeholder.getAttribute('data-component');
      const propsJson = placeholder.getAttribute('data-props');
      const contextId = placeholder.getAttribute('data-context-id');

      if (!componentName) continue;

      try {
        const props = propsJson ? JSON.parse(propsJson) : {};
        const componentEntry = getComponent(componentName);

        if (componentEntry) {
          // Create a unique ID for this component instance
          const id = `component-${i}-${componentName}`;

          // Load the component module
          const componentModule = await componentEntry.component();

          // Create a container div for the Svelte component
          const container = document.createElement('div');
          container.id = id;
          container.className = 'embedded-component-container';

          // Replace placeholder with container
          placeholder.replaceWith(container);

          // Add to components array
          newComponents.push({
            id,
            component: componentModule.default,
            props,
            contextId,
            target: container,
          });
        } else {
          console.error(
            '[BlogPostContent] Component not found in registry:',
            componentName,
          );
        }
      } catch (error) {
        console.error(`Failed to load component ${componentName}:`, error);
        placeholder.innerHTML = `<div class="component-error">Failed to load component: ${componentName}</div>`;
      }
    }

    // Update the components array to trigger reactive rendering
    embeddedComponents = newComponents;
  }

  /**
   * Get or create a context store for a given contextId
   * @param {string} contextId
   */
  function getContextStore(contextId) {
    if (!contextStores[contextId]) {
      contextStores[contextId] = writable({});
    }
    return contextStores[contextId];
  }

  /**
   * Update shared context from a component
   * @param {string} contextId
   * @param {any} data
   */
  function updateContext(contextId, data) {
    const store = getContextStore(contextId);
    store.set(data);
  }

  /**
   * Copy code to clipboard
   * @param {string} code
   */
  async function copyCode(code) {
    if (!browser) return;

    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch (err) {
      console.error('Failed to copy code:', err);
      return false;
    }
  }

  /**
   * Add copy buttons to code blocks after rendering
   */
  function addCopyButtons() {
    if (!browser || !contentContainer) return;

    const codeBlocks = contentContainer.querySelectorAll('pre');

    codeBlocks.forEach((pre) => {
      // Skip if copy button already exists
      if (pre.querySelector('.copy-button')) return;

      const codeElement = pre.querySelector('code');
      if (!codeElement) return;

      const code = codeElement.textContent || '';

      // Create copy button
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.innerHTML = '📋';
      button.title = 'Copy code';
      button.type = 'button';

      button.addEventListener('click', async () => {
        const success = await copyCode(code);
        if (success) {
          button.innerHTML = '✓';
          button.classList.add('copied');
          setTimeout(() => {
            button.innerHTML = '📋';
            button.classList.remove('copied');
          }, 2000);
        }
      });

      pre.style.position = 'relative';
      pre.appendChild(button);
    });
  }

  // Mount components when the array changes
  $: if (browser && embeddedComponents.length > 0) {
    embeddedComponents.forEach((comp) => {
      if (!comp.instance && comp.target) {
        try {
          // Get or create context store for this component
          const contextStore = comp.contextId ? getContextStore(comp.contextId) : null;

          // Mount the Svelte component into its target container
          comp.instance = mount(comp.component, {
            target: comp.target,
            props: {
              ...comp.props,
              contextStore: contextStore,
              updateContext: comp.contextId
                ? (/** @type {any} */ data) => {
                    if (comp.contextId) {
                      updateContext(comp.contextId, data);
                    }
                  }
                : undefined,
            },
          });
          comp.contextStore = contextStore;
        } catch (error) {
          console.error(`Failed to mount component ${comp.id}:`, error);
        }
      }
    });
  }

  onMount(async () => {
    await parseAndRenderComponents();
    addCopyButtons();
  });

  onDestroy(() => {
    // Cleanup mounted components
    embeddedComponents.forEach((comp) => {
      if (comp.instance) {
        try {
          unmount(comp.instance);
        } catch (error) {
          console.error(`Failed to unmount component:`, error);
        }
      }
    });
  });
</script>

<div class="blog-post-content {backgroundPattern}" bind:this={contentContainer}>
  {@html htmlContent}
</div>

<style>
  .blog-post-content {
    /* No padding/background - parent page handles this */
  }

  /* Typography */
  .blog-post-content :global(h1) {
    font-size: 2em;
    font-weight: bold;
    margin-top: 0.67em;
    margin-bottom: 0.67em;
    color: var(--neutral-black);
  }

  .blog-post-content :global(h2) {
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 0.83em;
    margin-bottom: 0.83em;
    color: var(--neutral-black);
  }

  .blog-post-content :global(h3) {
    font-size: 1.17em;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 1em;
    color: var(--neutral-black);
  }

  .blog-post-content :global(p) {
    margin: 1em 0;
    line-height: 1.6;
    color: var(--neutral-black);
  }

  .blog-post-content :global(ul),
  .blog-post-content :global(ol) {
    padding-left: 2em;
    margin: 1em 0;
  }

  .blog-post-content :global(li) {
    margin: 0.5em 0;
    line-height: 1.6;
  }

  .blog-post-content :global(blockquote) {
    border-left: 4px solid var(--main-blue);
    padding-left: 1em;
    margin: 1.5em 0;
    font-style: italic;
    color: var(--neutral-black);
    opacity: 0.9;
  }

  .blog-post-content :global(code) {
    background-color: var(--neutral-gray);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', Consolas, Monaco, monospace;
    font-size: 0.9em;
    color: var(--neutral-black);
  }

  .blog-post-content :global(pre) {
    background-color: var(--neutral-dark-gray);
    padding: 2em;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5em 0;
    position: relative;
  }

  .blog-post-content :global(pre code) {
    background-color: transparent;
    padding: 0;
    color: var(--neutral-black);
    font-size: 0.95em;
  }

  .blog-post-content :global(.copy-button) {
    position: absolute;
    top: 0.75em;
    right: 0.75em;
    background: var(--neutral-gray);
    border: 1px solid var(--neutral-dark-gray-op-50);
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    font-size: 1.2em;
    transition: all 0.2s;
    opacity: 0.7;
  }

  .blog-post-content :global(.copy-button:hover) {
    opacity: 1;
    background: var(--neutral-white);
  }

  .blog-post-content :global(.copy-button.copied) {
    background: var(--main-blue);
    color: var(--neutral-white);
    border-color: var(--main-blue);
    opacity: 1;
  }

  .blog-post-content :global(.blog-link) {
    color: var(--main-blue);
    text-decoration: underline;
    transition: color 0.2s;
  }

  .blog-post-content :global(.blog-link:hover) {
    color: var(--main-blue-light);
  }

  .blog-post-content :global(.blog-image) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1.5em 0;
    display: block;
  }

  /* Image resize wrapper styles */
  .blog-post-content :global(.image-resize-wrapper) {
    margin: 1.5em 0;
  }

  .blog-post-content :global(.image-resize-container) {
    max-width: 100%;
  }

  .blog-post-content :global(.image-resize-container .blog-image) {
    width: 100%;
    max-width: none;
  }

  .blog-post-content :global(hr) {
    height: 2px;
    border: none;
    background: linear-gradient(
      to right,
      transparent,
      var(--main-blue),
      transparent
    );
    margin: 2em auto;
    width: 100%;
    transform: scaleX(0);
    opacity: 0;
    animation: expand-horizontal cubic-bezier(0.58, 0, 0.48, 0.9) forwards;
    animation-timeline: view();
    animation-range-start: 0vh;
    animation-range-end: 20vh;
  }

  @keyframes expand-horizontal {
    to {
      transform: scaleX(1);
      opacity: 1;
    }
  }

  /* Embedded component styles */
  .blog-post-content :global(.embedded-component-container) {
    margin: 2em 0;
    width: 100%;
  }

  .blog-post-content :global(.component-error) {
    padding: 1em;
    background-color: var(--red);
    color: var(--neutral-white);
    border-radius: 8px;
    margin: 1em 0;
  }

  .component-mount-point {
    /* Hidden by default - components render into the embedded-component-container divs */
    display: none;
  }

  /* Responsive */
  @media screen and (max-width: 440px) {
    .blog-post-content {
      padding: 15px;
    }

    .blog-post-content :global(h1) {
      font-size: 1.75em;
    }

    .blog-post-content :global(h2) {
      font-size: 1.4em;
    }

    .blog-post-content :global(h3) {
      font-size: 1.1em;
    }

    .blog-post-content :global(pre) {
      padding: 1.5em;
      font-size: 0.9em;
    }

    .blog-post-content :global(.copy-button) {
      top: 0.5em;
      right: 0.5em;
      padding: 4px 8px;
      font-size: 1em;
    }
  }
</style>
