<script>
  import ImagePicker from '$lib/components/ImagePicker.svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  /** @type {import('./$types').ActionData} */
  export let form;

  // Use form data if validation failed, otherwise use loaded item data
  /** @type {any} */
  $: itemData = form?.data || data.item;

  /** @typedef {{ id: number, slug: string, name: string, description: string | null, order: number, hasTab: number }} Category */
  $: categories = /** @type {any} */ (data.categories);

  // Track selected image - initialize with reactive statement to avoid undefined access
  let selectedImage = '';

  // Update selectedImage when itemData changes
  $: selectedImage = itemData?.image || '';

  /**
   * Handle image selection from ImagePicker
   * @param {string} path
   */
  function handleImageSelect(path) {
    selectedImage = path;
  }
</script>

<div class="form-container">
  <h2>Edit Portfolio Item</h2>

  <form method="POST">
    <div class="form-group">
      <label for="title">Title *</label>
      <input
        type="text"
        id="title"
        name="title"
        required
        value={itemData.title || ''}
      />
      {#if form?.errors?.title}
        <p class="error">{form.errors.title}</p>
      {/if}
    </div>

    <div class="form-group">
      <label for="description">Description *</label>
      <textarea id="description" name="description" rows="5" required
        >{itemData.description || ''}</textarea
      >
      {#if form?.errors?.description}
        <p class="error">{form.errors.description}</p>
      {/if}
    </div>

    <div class="form-group">
      <label for="categoryId">Category *</label>
      <select id="categoryId" name="categoryId" required>
        <option value="">Select a category</option>
        {#each categories as category}
          {@const cat = /** @type {Category} */ (category)}
          <option value={cat.id} selected={itemData.categoryId == cat.id}>
            {cat.name}
          </option>
        {/each}
      </select>
      {#if form?.errors?.categoryId}
        <p class="error">{form.errors.categoryId}</p>
      {/if}
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="startDate">Start Date (MM/DD/YYYY)</label>
        <input
          type="text"
          id="startDate"
          name="startDate"
          placeholder="01/15/2024"
          value={itemData.startDate || ''}
        />
      </div>

      <div class="form-group">
        <label for="endDate">End Date (MM/DD/YYYY)</label>
        <input
          type="text"
          id="endDate"
          name="endDate"
          placeholder="03/20/2024 or leave blank for Present"
          value={itemData.endDate || ''}
        />
      </div>
    </div>

    <div class="form-group">
      <label for="url">URL</label>
      <input
        type="text"
        id="url"
        name="url"
        placeholder="/home/project or https://..."
        value={itemData.url || ''}
      />
    </div>

    <div class="form-group">
      <label for="image">Image</label>
      <ImagePicker
        bind:selectedImage
        onSelect={handleImageSelect}
        images={data.images || []}
      />
      <!-- Hidden input to submit the selected image path -->
      <input type="hidden" name="image" value={selectedImage} />
    </div>

    <div class="form-group">
      <label class="checkbox-label">
        <input
          type="checkbox"
          name="highlight"
          checked={Boolean(itemData.highlight)}
        />
        <span>Highlight this item</span>
      </label>
    </div>

    {#if form?.error}
      <div class="form-error">{form.error}</div>
    {/if}

    {#if form && 'success' in form && form.success}
      <div class="form-success">Portfolio item updated successfully!</div>
    {/if}

    <div class="form-actions">
      <button type="submit" class="button-primary">Update Item</button>
      <a href="/admin/portfolio" class="button-secondary">Cancel</a>
    </div>
  </form>
</div>

<style>
  .form-container {
    max-width: 800px;
  }

  h2 {
    margin: 0 0 30px 0;
    color: var(--main-blue-light);
  }

  form {
    background-color: var(--neutral-gray);
    border-radius: 10px;
    padding: 30px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    color: var(--neutral-black);
    font-weight: 500;
  }

  input[type='text'],
  input[type='number'],
  select,
  textarea {
    width: 100%;
    padding: 10px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    background-color: var(--neutral-dark-gray);
    color: var(--neutral-black);
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s;
    font-family: inherit;
  }

  input[type='text']:focus,
  input[type='number']:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: var(--main-blue);
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  input[type='checkbox'] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .checkbox-label span {
    color: var(--neutral-black);
  }

  .error {
    color: var(--red);
    font-size: 14px;
    margin: 5px 0 0 0;
  }

  .form-error {
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px solid var(--red);
    color: var(--red);
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 20px;
  }

  .form-success {
    background-color: rgba(0, 255, 0, 0.1);
    border: 1px solid var(--green);
    color: var(--green);
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 20px;
  }

  .form-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
  }

  .button-primary {
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
    padding: 12px 24px;
    border-radius: 10px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.5s;
    text-decoration: none;
  }

  .button-primary:hover {
    background-color: var(--main-blue-alt);
  }

  .button-secondary {
    background-color: var(--neutral-dark-gray);
    color: var(--neutral-black);
    padding: 12px 24px;
    border-radius: 10px;
    text-decoration: none;
    transition: background-color 0.2s;
  }

  .button-secondary:hover {
    background-color: var(--neutral-dark-gray-op-50);
  }

  @media (max-width: 600px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
