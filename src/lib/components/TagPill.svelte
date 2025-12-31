<script>
  /**
   * Reusable tag pill component for displaying blog tags
   * @type {{ tag: BlogTag, removable?: boolean, onRemove?: (tag: BlogTag) => void }}
   */
  let { tag, removable = false, onRemove } = $props();
</script>

<span class="tag-pill" class:removable>
  {tag.name}
  {#if removable && onRemove}
    <button
      type="button"
      class="remove-btn"
      onclick={() => onRemove(tag)}
      aria-label="Remove {tag.name} tag"
    >
      ×
    </button>
  {/if}
</span>

<style>
  .tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    background: var(--main-blue);
    color: var(--neutral-white);
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .tag-pill.removable {
    padding-right: 0.5rem;
  }

  .remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    color: var(--neutral-white);
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .remove-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .remove-btn:focus-visible {
    outline: 2px solid var(--neutral-white);
    outline-offset: 2px;
  }
</style>
