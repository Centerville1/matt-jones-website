<script>
  import BlogEditor from '$lib/components/BlogEditor.svelte';
  import ImagePicker from '$lib/components/ImagePicker.svelte';
  import TagPill from '$lib/components/TagPill.svelte';

  /** @type {{ tags: any[], series: any[], images: any[] }} */
  export let data;

  /** @type {any} */
  export let form = null;

  /** @type {any} */
  export let post = null;

  /** @type {any[]} */
  export let postTags = [];

  /** @type {boolean} */
  export let isEdit = false;

  // Editor content - use existing post content or form data
  let editorContent = form?.data?.content
    ? JSON.parse(form.data.content)
    : post?.content || null;

  // Track background pattern
  let backgroundPattern = form?.data?.background || post?.background || 'blocks';

  // Track selected tags - use existing tags or form data
  let selectedTagIds =
    form?.data?.tagIds && form.data.tagIds.trim() !== ''
      ? form.data.tagIds
          .split(',')
          .map((/** @type {string} */ id) => parseInt(id.trim(), 10))
          .filter((id) => !isNaN(id))
      : postTags.map((/** @type {any} */ tag) => tag.id);

  // Track selected header image - store the path for ImagePicker
  let selectedHeaderImagePath = '';

  // Initialize from form data or post data
  if (form?.data?.headerImageId !== undefined && form.data.headerImageId !== '') {
    const imageId = parseInt(String(form.data.headerImageId), 10);
    const image = data.images.find((/** @type {any} */ img) => img.id === imageId);
    selectedHeaderImagePath = image ? image.path : '';
  } else if (post?.headerImageId) {
    const image = data.images.find((/** @type {any} */ img) => img.id === post.headerImageId);
    selectedHeaderImagePath = image ? image.path : '';
  }

  /**
   * Handle editor content changes
   * @param {any} content
   */
  function handleEditorChange(content) {
    editorContent = content;
  }

  /**
   * Handle background pattern changes
   * @param {string} pattern
   */
  function handleBackgroundChange(pattern) {
    backgroundPattern = pattern;
  }

  /**
   * Add a tag to the post
   * @param {number} tagId
   */
  function addTag(tagId) {
    if (!selectedTagIds.includes(tagId)) {
      selectedTagIds = [...selectedTagIds, tagId];
    }
  }

  /**
   * Remove a tag from the post
   * @param {any} tag
   */
  function removeTag(tag) {
    selectedTagIds = selectedTagIds.filter((/** @type {number} */ id) => id !== tag.id);
  }

  // Reactive declarations for selected and available tags
  $: selectedTags = data.tags.filter((/** @type {any} */ tag) => selectedTagIds.includes(tag.id));
  $: availableTags = data.tags.filter((/** @type {any} */ tag) => !selectedTagIds.includes(tag.id));

  /**
   * Handle header image selection - receives path from ImagePicker
   * @param {string} imagePath
   */
  function handleHeaderImageSelect(imagePath) {
    selectedHeaderImagePath = imagePath;
  }

  // Reactive: Convert path back to ID for form submission
  $: selectedHeaderImageId = selectedHeaderImagePath
    ? String(data.images.find((/** @type {any} */ img) => img.path === selectedHeaderImagePath)?.id || '')
    : '';

  // Helper to get field value (form data, post data, or default)
  /**
   * @param {string} field
   * @param {any} defaultValue
   */
  function getValue(field, defaultValue = '') {
    return form?.data?.[field] !== undefined
      ? form.data[field]
      : post?.[field] !== undefined
        ? post[field]
        : defaultValue;
  }
</script>

{#if isEdit && form?.success}
  <div class="success-message">Post updated successfully!</div>
{/if}

<form method="POST">
  <!-- Title -->
  <div class="form-group">
    <label for="title">Title *</label>
    <input
      type="text"
      id="title"
      name="title"
      required
      value={getValue('title')}
      placeholder="Enter post title"
    />
    {#if form?.errors?.title}
      <p class="error">{form.errors.title}</p>
    {/if}
  </div>

  <!-- Slug -->
  <div class="form-group">
    <label for="slug">Slug</label>
    <input
      type="text"
      id="slug"
      name="slug"
      value={getValue('slug')}
      placeholder="Auto-generated from title if left blank"
    />
    <small>URL-friendly version of the title (e.g., "my-first-post")</small>
  </div>

  <!-- Excerpt -->
  <div class="form-group">
    <label for="excerpt">Excerpt *</label>
    <textarea
      id="excerpt"
      name="excerpt"
      rows="3"
      required
      value={String(getValue('excerpt'))}
      placeholder="Brief summary of the post (used in listings and SEO)"
    ></textarea>
    {#if form?.errors?.excerpt}
      <p class="error">{form.errors.excerpt}</p>
    {/if}
  </div>

  <!-- Content Editor -->
  <div class="form-group">
    <label>Content *</label>
    <BlogEditor
      content={editorContent}
      onChange={handleEditorChange}
      onBackgroundChange={handleBackgroundChange}
      {backgroundPattern}
      images={data.images}
    />
    <input
      type="hidden"
      name="content"
      value={editorContent ? JSON.stringify(editorContent) : ''}
    />
    <input type="hidden" name="background" value={backgroundPattern} />
    {#if form?.errors?.content}
      <p class="error">{form.errors.content}</p>
    {/if}
    <small>Use the 🎨 button in the editor toolbar to change the background pattern</small>
  </div>

  <!-- Header Image -->
  <div class="form-group">
    <label>Header Image</label>
    <!-- TODO: Add filterCategory="blog" once ImagePicker supports it -->
    <ImagePicker
      images={data.images}
      selectedImage={selectedHeaderImagePath}
      onSelect={handleHeaderImageSelect}
    />
    <input type="hidden" name="headerImageId" value={selectedHeaderImageId} />
  </div>

  <!-- Tags -->
  <div class="form-group">
    <label>Tags</label>

    <!-- Selected tags -->
    {#if selectedTags.length > 0}
      <div class="selected-tags">
        {#each selectedTags as tag (tag.id)}
          <TagPill {tag} removable={true} onRemove={removeTag} />
        {/each}
      </div>
    {:else}
      <p class="no-tags-message">No tags selected. Choose from available tags below.</p>
    {/if}

    <!-- Available tags to add -->
    {#if availableTags.length > 0}
      <div class="available-tags">
        <small class="available-label">Available tags (click to add):</small>
        <div class="tag-selection">
          {#each availableTags as tag (tag.id)}
            <button
              type="button"
              class="tag-add-button"
              onclick={() => addTag(tag.id)}
            >
              <TagPill {tag} />
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <input type="hidden" name="tagIds" value={selectedTagIds.join(',')} />

    {#if data.tags.length === 0}
      <small>No tags available. <a href="/admin/blog/tags">Create tags</a></small>
    {/if}
  </div>

  <!-- Series -->
  <div class="form-row">
    <div class="form-group">
      <label for="seriesId">Series</label>
      <select id="seriesId" name="seriesId" value={getValue('seriesId', '')}>
        <option value="">None</option>
        {#each data.series as series}
          <option value={series.id}>{series.title}</option>
        {/each}
      </select>
    </div>

    <div class="form-group">
      <label for="seriesOrder">Order in Series</label>
      <input
        type="number"
        id="seriesOrder"
        name="seriesOrder"
        min="0"
        value={getValue('seriesOrder', '')}
        placeholder="0"
      />
    </div>
  </div>

  <!-- Status and Featured -->
  <div class="form-row">
    <div class="form-group">
      <label for="status">Status</label>
      <select id="status" name="status" value={getValue('status', 'draft')}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
    </div>

    <div class="form-group">
      <label for="featuredOrder">Featured Order</label>
      <input
        type="number"
        id="featuredOrder"
        name="featuredOrder"
        min="0"
        value={getValue('featuredOrder', '')}
        placeholder="Leave blank to not feature"
      />
      <small>Lower numbers appear first</small>
    </div>
  </div>

  <!-- Author and Canonical URL -->
  <div class="form-row">
    <div class="form-group">
      <label for="authorName">Author Name</label>
      <input
        type="text"
        id="authorName"
        name="authorName"
        value={getValue('authorName', 'Matt Jones')}
      />
    </div>

    <div class="form-group">
      <label for="canonicalUrl">Canonical URL</label>
      <input
        type="url"
        id="canonicalUrl"
        name="canonicalUrl"
        value={getValue('canonicalUrl', '')}
        placeholder="https://example.com/original-post"
      />
      <small>For cross-posted content</small>
    </div>
  </div>

  <!-- Form Actions -->
  <div class="form-actions">
    <button type="submit" class="button-primary">
      {isEdit ? 'Update Post' : 'Create Post'}
    </button>
    <a href="/admin/blog" class="button-secondary">Cancel</a>
  </div>

  <!-- General error -->
  {#if form?.error}
    <p class="error general-error">{form.error}</p>
  {/if}
</form>

<style>
  .success-message {
    background-color: rgba(34, 124, 64, 0.1);
    border: 1px solid var(--green);
    color: var(--green);
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 20px;
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
  input[type='url'],
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
  input[type='url']:focus,
  input[type='number']:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: var(--main-blue);
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  small {
    display: block;
    margin-top: 5px;
    font-size: 12px;
    color: var(--neutral-black);
    opacity: 0.6;
  }

  small a {
    color: var(--main-blue);
    text-decoration: underline;
  }

  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
    background: var(--neutral-gray);
    border-radius: 10px;
    margin-bottom: 12px;
    min-height: 50px;
    align-items: flex-start;
  }

  .no-tags-message {
    padding: 12px;
    background: var(--neutral-gray);
    border-radius: 10px;
    margin: 0 0 12px 0;
    color: var(--neutral-black);
    opacity: 0.6;
    font-style: italic;
  }

  .available-tags {
    margin-top: 12px;
  }

  .available-label {
    display: block;
    margin-bottom: 8px;
    color: var(--neutral-black);
    opacity: 0.7;
    font-weight: 500;
  }

  .tag-selection {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag-add-button {
    padding: 0;
    border: none;
    border-radius: 9999px;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    opacity: 0.7;
  }

  .tag-add-button:hover {
    transform: scale(1.05);
    opacity: 1;
  }

  .error {
    color: var(--red);
    font-size: 14px;
    margin: 5px 0 0 0;
  }

  .general-error {
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px solid var(--red);
    padding: 12px;
    border-radius: 5px;
    margin-top: 20px;
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
    display: inline-block;
  }

  .button-secondary:hover {
    background-color: var(--neutral-dark-gray-op-50);
  }

  @media (max-width: 600px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    form {
      padding: 20px;
    }
  }
</style>
