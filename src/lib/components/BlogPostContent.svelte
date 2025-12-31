<script>
  import { renderTiptapJSON } from '$lib/utils/tiptap-renderer.js';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  /** @type {any} */
  export let content;

  /** @type {string} */
  export let backgroundPattern = '';

  /** @type {HTMLElement | undefined} */
  let contentContainer;

  $: htmlContent = renderTiptapJSON(content);

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

  onMount(() => {
    addCopyButtons();
  });

  // Re-add copy buttons when content changes
  $: if (browser && htmlContent && contentContainer) {
    setTimeout(addCopyButtons, 0);
  }
</script>

<div class="blog-post-content {backgroundPattern}" bind:this={contentContainer}>
  {@html htmlContent}
</div>

<style>
  .blog-post-content {
    padding: 20px;
    min-height: 200px;
    background-color: var(--neutral-gray);
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
    border: none;
    border-top: 2px solid var(--neutral-dark-gray-op-50);
    margin: 2em 0;
  }

  /* Background patterns for the whole content area */
  .blog-post-content.zigzag {
    background:
      linear-gradient(
          135deg,
          var(--neutral-dark-gray-op-10) 25%,
          transparent 25%
        ) -45px
        0/ 90px 90px,
      linear-gradient(
          225deg,
          var(--neutral-dark-gray-op-50) 25%,
          transparent 25%
        ) -45px
        0/ 90px 90px,
      linear-gradient(
          315deg,
          var(--neutral-dark-gray-op-10) 25%,
          transparent 25%
        )
        0px 0/ 90px 90px,
      linear-gradient(
          45deg,
          var(--neutral-dark-gray-op-50) 25%,
          var(--no-background) 25%
        )
        0px 0/ 90px 90px;
  }

  .blog-post-content.blocks {
    background-image:
      linear-gradient(
        30deg,
        var(--neutral-dark-gray-op-50) 12%,
        transparent 12.5%,
        transparent 87%,
        var(--neutral-dark-gray-op-50) 87.5%,
        var(--neutral-dark-gray-op-50)
      ),
      linear-gradient(
        150deg,
        var(--neutral-dark-gray-op-50) 12%,
        transparent 12.5%,
        transparent 87%,
        var(--neutral-dark-gray-op-50) 87.5%,
        var(--neutral-dark-gray-op-50)
      ),
      linear-gradient(
        30deg,
        var(--neutral-dark-gray-op-50) 12%,
        transparent 12.5%,
        transparent 87%,
        var(--neutral-dark-gray-op-50) 87.5%,
        var(--neutral-dark-gray-op-50)
      ),
      linear-gradient(
        150deg,
        var(--neutral-dark-gray-op-50) 12%,
        transparent 12.5%,
        transparent 87%,
        var(--neutral-dark-gray-op-50) 87.5%,
        var(--neutral-dark-gray-op-50)
      ),
      linear-gradient(
        60deg,
        var(--neutral-dark-gray-op-10) 25%,
        transparent 25.5%,
        transparent 75%,
        var(--neutral-dark-gray-op-10) 75%,
        var(--neutral-dark-gray-op-10)
      ),
      linear-gradient(
        60deg,
        var(--neutral-dark-gray-op-10) 25%,
        transparent 25.5%,
        transparent 75%,
        var(--neutral-dark-gray-op-10) 75%,
        var(--neutral-dark-gray-op-10)
      );
    background-size: 80px 140px;
    background-position:
      0 0,
      0 0,
      40px 70px,
      40px 70px,
      0 0,
      40px 70px;
  }

  .blog-post-content.checker {
    background-image:
      repeating-linear-gradient(
        45deg,
        var(--neutral-dark-gray-op-50) 25%,
        transparent 25%,
        transparent 75%,
        var(--neutral-dark-gray-op-50) 75%,
        var(--neutral-dark-gray-op-50)
      ),
      repeating-linear-gradient(
        45deg,
        var(--neutral-dark-gray-op-50) 25%,
        var(--neutral-dark-gray-op-10) 25%,
        var(--neutral-dark-gray-op-10) 75%,
        var(--neutral-dark-gray-op-50) 75%,
        var(--neutral-dark-gray-op-50)
      );
    background-position:
      0 0,
      15px 15px;
    background-size: 30px 30px;
  }

  .blog-post-content.crosses {
    background:
      radial-gradient(
        circle,
        transparent 20%,
        var(--neutral-gray) 20%,
        var(--neutral-gray) 80%,
        transparent 80%,
        transparent
      ),
      radial-gradient(
          circle,
          transparent 20%,
          var(--neutral-gray) 20%,
          var(--neutral-gray) 80%,
          transparent 80%,
          transparent
        )
        30px 30px,
      linear-gradient(var(--neutral-dark-gray) 2.6px, transparent 2.6px)
        0 -1.3px,
      linear-gradient(
          90deg,
          var(--neutral-dark-gray) 2.6px,
          var(--neutral-gray) 2.6px
        ) -1.3px
        0;
    background-size:
      60px 60px,
      60px 60px,
      30px 30px,
      30px 30px;
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
