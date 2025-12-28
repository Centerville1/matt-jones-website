<script>
  // @ts-nocheck - TypeScript has trouble inferring database object types in templates
  /** @type {import('./$types').PageData} */
  export let data;

  /** @type {import('./$types').ActionData} */
  export let form;

  let uploading = false;

  /**
   * @param {number} id
   * @param {string} url
   */
  async function deleteImage(id, url) {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch('/admin/api/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, url }),
      });

      if (response.ok) {
        // Reload the page to show updated list
        window.location.reload();
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      alert('Error deleting image');
    }
  }

  /**
   * @param {Event} e
   */
  function handleSubmit(e) {
    uploading = true;
  }
</script>

<div class="images-admin">
  <div class="header">
    <h2>Image Manager</h2>
  </div>

  <div class="upload-section">
    <h3>Upload New Image</h3>
    <form method="POST" enctype="multipart/form-data" on:submit={handleSubmit}>
      <div class="file-input-group">
        <input type="file" name="file" accept="image/*" required />
        <button type="submit" class="button-primary" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>

      {#if form?.error}
        <p class="error">{form.error}</p>
      {/if}

      {#if form?.success}
        <p class="success">Image uploaded successfully!</p>
      {/if}

      <p class="help-text">
        Supported formats: JPEG, PNG, WebP, GIF. Max size: 5MB.
      </p>
    </form>
  </div>

  <div class="images-grid">
    <h3>All Images ({data.images.length})</h3>

    {#if data.images.length > 0}
      <div class="grid">
        {#each data.images as image}
          <div class="image-card">
            <div class="image-wrapper">
              <img src={image.path} alt={image.alt || image.originalName} />
            </div>
            <div class="image-info">
              <p class="filename">{image.filename}</p>
              <p class="details">
                {(image.size / 1024).toFixed(1)} KB • {image.mimeType}
              </p>
              <div class="image-actions">
                <button
                  on:click={() => navigator.clipboard.writeText(image.path)}
                  class="button-small"
                >
                  Copy URL
                </button>
                <button
                  on:click={() => deleteImage(image.id, image.path)}
                  class="button-small button-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="empty-state">No images uploaded yet.</p>
    {/if}
  </div>
</div>

<style>
  .images-admin {
    max-width: 1200px;
  }

  .header {
    margin-bottom: 30px;
  }

  h2 {
    margin: 0;
    color: var(--main-blue-light);
  }

  h3 {
    margin: 0 0 20px 0;
    color: var(--neutral-black);
    font-size: 18px;
  }

  .upload-section {
    background-color: var(--neutral-gray);
    border-radius: 10px;
    padding: 25px;
    margin-bottom: 30px;
  }

  .file-input-group {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-bottom: 10px;
  }

  input[type='file'] {
    flex: 1;
    padding: 10px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    background-color: var(--neutral-dark-gray);
    color: var(--neutral-black);
  }

  input[type='file']::file-selector-button {
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
  }

  .button-primary {
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.5s;
    white-space: nowrap;
  }

  .button-primary:hover:not(:disabled) {
    background-color: var(--main-blue-alt);
  }

  .button-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .help-text {
    font-size: 13px;
    color: var(--neutral-gray);
    margin: 10px 0 0 0;
  }

  .error {
    color: var(--red);
    font-size: 14px;
    margin: 10px 0 0 0;
  }

  .success {
    color: var(--green);
    font-size: 14px;
    margin: 10px 0 0 0;
  }

  .images-grid {
    background-color: var(--neutral-gray);
    border-radius: 10px;
    padding: 25px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .image-card {
    background-color: var(--neutral-dark-gray);
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.2s;
  }

  .image-card:hover {
    transform: translateY(-2px);
  }

  .image-wrapper {
    width: 100%;
    height: 200px;
    overflow: hidden;
    background-color: var(--neutral-black);
  }

  .image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-info {
    padding: 15px;
  }

  .filename {
    margin: 0 0 5px 0;
    font-weight: 500;
    color: var(--neutral-black);
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .details {
    margin: 0 0 12px 0;
    font-size: 12px;
    color: var(--neutral-gray);
  }

  .image-actions {
    display: flex;
    gap: 8px;
  }

  .button-small {
    flex: 1;
    padding: 6px 12px;
    border-radius: 5px;
    font-size: 13px;
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

  @media (max-width: 600px) {
    .file-input-group {
      flex-direction: column;
    }

    .button-primary {
      width: 100%;
    }
  }
</style>
