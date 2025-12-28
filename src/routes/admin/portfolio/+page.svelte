<script>
  /** @type {import('./$types').PageData} */
  export let data;

  let selectedCategoryId = 'all';
  let searchQuery = '';

  /**
   * Return image path as-is (all images are now Vercel Blob URLs)
   * @param {string | null | undefined} imagePath
   * @returns {string | null}
   */
  function normalizeImagePath(imagePath) {
    if (!imagePath) return null;
    return imagePath;
  }

  /**
   * @param {number} id
   */
  async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this portfolio item?')) {
      return;
    }

    try {
      const response = await fetch('/admin/api/portfolio', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Reload the page to show updated list
        window.location.reload();
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      alert('Error deleting item');
    }
  }

  // Create a category order map
  /** @type {Map<number, number>} */
  $: categoryOrderMap = new Map(
    data.categories.map((/** @type {any} */ cat) => [cat.id, cat.order]),
  );

  // Filter and sort items
  $: filteredAndSortedItems = data.items
    .filter((/** @type {any} */ item) => {
      // Filter by category
      const categoryMatch =
        selectedCategoryId === 'all' ||
        item.categoryId === parseInt(selectedCategoryId);

      // Filter by search query (title)
      const searchMatch =
        searchQuery === '' ||
        (item.title &&
          item.title.toLowerCase().includes(searchQuery.toLowerCase()));

      return categoryMatch && searchMatch;
    })
    .sort((/** @type {any} */ a, /** @type {any} */ b) => {
      // First sort by category order
      const categoryOrderA = categoryOrderMap.get(a.categoryId) ?? 999;
      const categoryOrderB = categoryOrderMap.get(b.categoryId) ?? 999;

      if (categoryOrderA !== categoryOrderB) {
        return categoryOrderA - categoryOrderB;
      }

      // Then sort by display order within category
      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    });
</script>

<div class="portfolio-admin">
  <div class="header">
    <h2>Portfolio Items</h2>
    <a href="/admin/portfolio/new" class="button-primary">+ New Item</a>
  </div>

  <div class="filter-section">
    <div class="filter-group">
      <label for="search-input">Search:</label>
      <input
        type="text"
        id="search-input"
        placeholder="Search by title..."
        bind:value={searchQuery}
      />
    </div>

    <div class="filter-group">
      <label for="category-filter">Category:</label>
      <select id="category-filter" bind:value={selectedCategoryId}>
        <option value="all">All Categories</option>
        {#each data.categories as category}
          {@const cat = /** @type {any} */ (category)}
          <option value={cat.id.toString()}>{cat.name}</option>
        {/each}
      </select>
    </div>

    <span class="item-count">{filteredAndSortedItems.length} items</span>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Title</th>
          <th>Category</th>
          <th>Date Range</th>
          <th>Order</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredAndSortedItems as item}
          <tr>
            <td>
              {#if item.image}
                <img
                  src={normalizeImagePath(item.image)}
                  alt={item.title}
                  class="thumbnail"
                />
              {:else}
                <div class="no-image">No image</div>
              {/if}
            </td>
            <td>
              <div class="title-cell">
                {item.title}
                {#if item.highlight}
                  <span class="badge">Highlighted</span>
                {/if}
              </div>
            </td>
            <td>{item.categoryName || 'Unknown'}</td>
            <td>
              {#if item.startDate || item.endDate}
                {item.startDate || '?'} - {item.endDate || 'Present'}
              {:else}
                <span class="muted">N/A</span>
              {/if}
            </td>
            <td>{item.displayOrder}</td>
            <td>
              <div class="actions">
                <a href="/admin/portfolio/{item.id}" class="button-small"
                  >Edit</a
                >
                <button
                  on:click={() => deleteItem(item.id)}
                  class="button-small button-danger"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    {#if filteredAndSortedItems.length === 0 && data.items.length > 0}
      <p class="empty-state">No items in this category.</p>
    {:else if data.items.length === 0}
      <p class="empty-state">No portfolio items yet. Create your first one!</p>
    {/if}
  </div>
</div>

<style>
  .portfolio-admin {
    max-width: 1200px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  h2 {
    margin: 0;
    color: var(--main-blue-light);
  }

  .button-primary {
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
    padding: 10px 20px;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.5s;
  }

  .button-primary:hover {
    background-color: var(--main-blue-alt);
  }

  .filter-section {
    background-color: var(--neutral-gray);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .filter-section label {
    color: var(--neutral-black);
    font-weight: 500;
    white-space: nowrap;
  }

  .filter-section input[type='text'] {
    padding: 8px 12px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    background-color: var(--neutral-dark-gray);
    color: var(--neutral-black);
    font-size: 14px;
    min-width: 200px;
    transition: border-color 0.2s;
  }

  .filter-section input[type='text']:focus {
    outline: none;
    border-color: var(--main-blue);
  }

  .filter-section input[type='text']::placeholder {
    color: var(--neutral-black);
    opacity: 0.3;
  }

  .filter-section select {
    padding: 8px 12px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    background-color: var(--neutral-dark-gray);
    color: var(--neutral-black);
    font-size: 14px;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .filter-section select:focus {
    outline: none;
    border-color: var(--main-blue);
  }

  .item-count {
    color: var(--neutral-black);
    font-size: 14px;
    opacity: 0.7;
    margin-left: auto;
  }

  .table-container {
    background-color: var(--neutral-gray);
    border-radius: 10px;
    padding: 20px;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    border-bottom: 2px solid var(--neutral-dark-gray-op-50);
  }

  th {
    text-align: left;
    padding: 12px;
    color: var(--neutral-black);
    font-weight: 600;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid var(--neutral-dark-gray-op-50);
    color: var(--neutral-black);
  }

  tbody tr:hover {
    background-color: var(--neutral-dark-gray-op-10);
  }

  .thumbnail {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 5px;
  }

  .no-image {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--neutral-dark-gray);
    border-radius: 5px;
    font-size: 10px;
    color: var(--neutral-black);
    opacity: 0.3;
  }

  .title-cell {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .badge {
    background-color: var(--main-blue);
    color: var(--neutral-white);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }

  .muted {
    color: var(--neutral-gray);
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  .button-small {
    padding: 6px 12px;
    border-radius: 5px;
    font-size: 14px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.5s;
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
  }

  .button-small:hover {
    background-color: var(--main-blue-alt);
  }

  .button-danger {
    background-color: var(--red);
  }

  .button-danger:hover {
    background-color: #cc0000;
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: var(--neutral-gray);
  }

  @media (max-width: 768px) {
    .filter-group {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }

    .filter-section input[type='text'],
    .filter-section select {
      width: 100%;
      min-width: 0;
    }

    .item-count {
      margin-left: 0;
      width: 100%;
    }
  }
</style>
