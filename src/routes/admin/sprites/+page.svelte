<script>
  /** @type {{ sprites: SpriteDefinition[], images: Image[] }} */
  let { data } = $props();

  /**
   * Navigate to sprite editor
   * @param {string | null} id - Sprite ID to edit, or null to create new
   */
  function editSprite(id) {
    window.location.href = `/admin/sprites/${id || 'new'}`;
  }
</script>

<svelte:head>
  <title>Sprite Editor - Admin</title>
</svelte:head>

<div class="sprite-admin">
  <header>
    <h1>Sprite Editor</h1>
    <button class="create-btn" onclick={() => editSprite(null)}>
      + New Sprite
    </button>
  </header>

  <div class="sprite-grid">
    {#each data.sprites as sprite}
      <div class="sprite-card" onclick={() => editSprite(sprite.id)}>
        <div class="sprite-preview">
          <!-- TODO: Render sprite preview -->
          <div class="placeholder">
            {sprite.layers.length} layer{sprite.layers.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div class="sprite-info">
          <h3>{sprite.name}</h3>
          <span class="type-badge">{sprite.objectType}</span>
        </div>
      </div>
    {/each}

    {#if data.sprites.length === 0}
      <div class="empty-state">
        <p>No sprites yet. Create your first sprite to get started!</p>
        <button onclick={() => editSprite(null)}>Create Sprite</button>
      </div>
    {/if}
  </div>
</div>

<style>
  .sprite-admin {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 2rem;
    margin: 0;
  }

  .create-btn {
    background: var(--main-blue);
    color: var(--neutral-white);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .create-btn:hover {
    opacity: 0.8;
  }

  .sprite-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .sprite-card {
    border: 2px solid var(--neutral-dark-gray);
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .sprite-card:hover {
    border-color: var(--main-blue);
    transform: translateY(-4px);
  }

  .sprite-preview {
    aspect-ratio: 1;
    background: var(--neutral-dark-gray);
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .placeholder {
    color: var(--neutral-white);
    opacity: 0.5;
    font-size: 0.9rem;
  }

  .sprite-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  .sprite-info h3 {
    margin: 0;
    font-size: 1.1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .type-badge {
    background: var(--neutral-dark-gray);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
  }

  .empty-state p {
    margin-bottom: 1.5rem;
    opacity: 0.7;
  }

  .empty-state button {
    background: var(--main-blue);
    color: var(--neutral-white);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }
</style>
