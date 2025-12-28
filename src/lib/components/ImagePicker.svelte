<script>
  /**
   * ImagePicker - A modal component for selecting images from the library or uploading new ones
   * @component
   */

  /** @type {string | null} */
  export let selectedImage = null;

  /** @type {(path: string) => void} */
  export let onSelect;

  /** @type {Array<any>} */
  export let images = [];

  let showModal = false;
  let uploading = false;
  let uploadError = '';
  let uploadSuccess = false;

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    uploadError = '';
    uploadSuccess = false;
  }

  /**
   * @param {string} path
   */
  function selectImage(path) {
    selectedImage = path;
    onSelect(path);
    closeModal();
  }

  /**
   * @param {Event} e
   */
  async function handleUpload(e) {
    e.preventDefault();
    uploading = true;
    uploadError = '';
    uploadSuccess = false;

    const form = /** @type {HTMLFormElement} */ (e.target);
    const formData = new FormData(form);

    try {
      const response = await fetch('/admin/api/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        uploadSuccess = true;

        // Add new image to the list
        images = [result.image, ...images];

        // Automatically select the newly uploaded image
        selectImage(result.image.path);

        form.reset();
      } else {
        const error = await response.json();
        uploadError = error.error || 'Failed to upload image';
      }
    } catch (err) {
      uploadError = 'Error uploading image';
    } finally {
      uploading = false;
    }
  }
</script>

<div class="image-picker">
  <div class="current-selection">
    {#if selectedImage}
      <div class="selected-preview">
        <img src={selectedImage} alt="Selected" />
      </div>
    {:else}
      <div class="no-selection">No image selected</div>
    {/if}
  </div>

  <div class="picker-actions">
    <button type="button" on:click={openModal} class="button-select">
      {selectedImage ? 'Change Image' : 'Select Image'}
    </button>
    {#if selectedImage}
      <button
        type="button"
        on:click={() => selectImage('')}
        class="button-clear"
      >
        Clear
      </button>
    {/if}
  </div>
</div>

{#if showModal}
  <div class="modal-backdrop" on:click={closeModal} role="presentation">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="modal-content"
      on:click={(e) => e.stopPropagation()}
      role="dialog"
      tabindex="-1"
    >
      <div class="modal-header">
        <h3>Select or Upload Image</h3>
        <button class="close-button" on:click={closeModal}>&times;</button>
      </div>

      <div class="modal-body">
        <!-- Upload Section -->
        <div class="upload-section">
          <h4>Upload New Image</h4>
          <form on:submit={handleUpload}>
            <div class="upload-group">
              <input type="file" name="file" accept="image/*" required />
              <button type="submit" class="button-upload" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {#if uploadError}
              <p class="error">{uploadError}</p>
            {/if}
            {#if uploadSuccess}
              <p class="success">Image uploaded successfully!</p>
            {/if}
          </form>
        </div>

        <!-- Image Library -->
        <div class="library-section">
          <h4>Image Library ({images.length})</h4>

          {#if images.length > 0}
            <div class="image-grid">
              {#each images as image}
                <button
                  type="button"
                  class="image-option"
                  class:selected={selectedImage === image.path}
                  on:click={() => selectImage(image.path)}
                >
                  <div class="image-thumbnail">
                    <img src={image.path} alt={image.alt || image.filename} />
                  </div>
                  <div class="image-label">
                    <p class="filename">{image.filename}</p>
                    <p class="size">{(image.size / 1024).toFixed(1)} KB</p>
                  </div>
                  {#if selectedImage === image.path}
                    <div class="selected-badge">✓</div>
                  {/if}
                </button>
              {/each}
            </div>
          {:else}
            <p class="empty-message">
              No images available. Upload one to get started!
            </p>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .image-picker {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .current-selection {
    flex: 1;
  }

  .selected-preview {
    width: 100%;
    max-width: 200px;
    height: 120px;
    border-radius: 10px;
    overflow: hidden;
    background-color: var(--neutral-dark-gray);
  }

  .selected-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-selection {
    width: 100%;
    max-width: 200px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--neutral-dark-gray);
    border-radius: 10px;
    color: var(--neutral-black);
    opacity: 0.3;
    font-size: 14px;
  }

  .picker-actions {
    display: flex;
    gap: 10px;
    flex-direction: column;
  }

  .button-select,
  .button-clear,
  .button-upload {
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 14px;
  }

  .button-select {
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
  }

  .button-select:hover {
    background-color: var(--main-blue-alt);
  }

  .button-clear {
    background-color: var(--neutral-dark-gray);
    color: var(--neutral-black);
  }

  .button-clear:hover {
    background-color: var(--neutral-dark-gray-op-50);
  }

  /* Modal Styles */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-content {
    background-color: var(--neutral-white);
    border-radius: 15px;
    max-width: 900px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 2px solid var(--neutral-dark-gray-op-50);
  }

  .modal-header h3 {
    margin: 0;
    color: var(--neutral-black);
    font-size: 20px;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 32px;
    cursor: pointer;
    color: var(--neutral-black);
    line-height: 1;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover {
    color: var(--red);
  }

  .modal-body {
    overflow-y: auto;
    padding: 25px;
  }

  .upload-section {
    margin-bottom: 30px;
    padding-bottom: 25px;
    border-bottom: 2px solid var(--neutral-dark-gray-op-50);
  }

  .upload-section h4,
  .library-section h4 {
    margin: 0 0 15px 0;
    color: var(--neutral-black);
    font-size: 16px;
  }

  .upload-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  input[type='file'] {
    flex: 1;
    padding: 8px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 8px;
    background-color: var(--neutral-gray);
    color: var(--neutral-black);
    font-size: 14px;
  }

  .button-upload {
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
    white-space: nowrap;
  }

  .button-upload:hover:not(:disabled) {
    background-color: var(--main-blue-alt);
  }

  .button-upload:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error {
    color: var(--red);
    font-size: 13px;
    margin: 8px 0 0 0;
  }

  .success {
    color: var(--green);
    font-size: 13px;
    margin: 8px 0 0 0;
  }

  .library-section {
    margin-bottom: 20px;
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }

  .image-option {
    position: relative;
    background-color: var(--neutral-gray);
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    padding: 0;
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden;
  }

  .image-option:hover {
    border-color: var(--main-blue);
    transform: translateY(-2px);
  }

  .image-option.selected {
    border-color: var(--main-blue);
    box-shadow: 0 0 0 2px var(--main-blue);
  }

  .image-thumbnail {
    width: 100%;
    height: 100px;
    overflow: hidden;
    background-color: var(--neutral-dark-gray);
  }

  .image-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-label {
    padding: 8px;
  }

  .filename {
    margin: 0 0 2px 0;
    font-size: 12px;
    font-weight: 500;
    color: var(--neutral-black);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .size {
    margin: 0;
    font-size: 11px;
    color: var(--neutral-gray);
  }

  .selected-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
  }

  .empty-message {
    text-align: center;
    padding: 40px;
    color: var(--neutral-gray);
  }

  @media (max-width: 600px) {
    .modal-content {
      max-height: 100vh;
      border-radius: 0;
    }

    .upload-group {
      flex-direction: column;
    }

    .button-upload {
      width: 100%;
    }

    .image-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
  }
</style>
