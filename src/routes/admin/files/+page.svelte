<script>
  import { enhance } from '$app/forms';

  /** @type {{ files: FileRecord[] }} */
  export let data;

  /** @type {string | null} */
  let error = null;
  /** @type {string | null} */
  let success = null;
  let uploading = false;

  /**
   * Format file size for display
   * @param {number} bytes
   * @returns {string}
   */
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * Format date for display
   * @param {Date} date
   * @returns {string}
   */
  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<svelte:head>
  <title>File Manager - Admin</title>
</svelte:head>

<div class="container">
  <header>
    <h1>File Manager</h1>
    <p>Upload and manage resume, PDFs, and other documents</p>
  </header>

  {#if error}
    <div class="alert error">{error}</div>
  {/if}

  {#if success}
    <div class="alert success">{success}</div>
  {/if}

  <section class="upload-section">
    <h2>Upload New File</h2>
    <form
      method="POST"
      action="?/upload"
      enctype="multipart/form-data"
      use:enhance={() => {
        uploading = true;
        error = null;
        success = null;

        return async ({ result, update }) => {
          uploading = false;

          if (result.type === 'success') {
            success = 'File uploaded successfully!';
            setTimeout(() => (success = null), 3000);
          } else if (result.type === 'failure') {
            error = result.data?.error || 'Upload failed';
          }

          await update();
        };
      }}
    >
      <div class="form-group">
        <label for="file">File (PDF, DOC, DOCX, TXT - Max 5MB)</label>
        <input type="file" id="file" name="file" accept=".pdf,.doc,.docx,.txt" required />
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" name="category">
          <option value="">None</option>
          <option value="resume">Resume</option>
          <option value="cv">CV</option>
          <option value="document">Document</option>
        </select>
      </div>

      <div class="form-group">
        <label for="displayName">Display Name (optional)</label>
        <input
          type="text"
          id="displayName"
          name="displayName"
          placeholder="e.g., My Resume 2026"
        />
      </div>

      <div class="form-group">
        <label for="description">Description (optional)</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          placeholder="Brief description of this file..."
        ></textarea>
      </div>

      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
    </form>
  </section>

  <section class="files-section">
    <h2>Uploaded Files ({data.files.length})</h2>

    {#if data.files.length === 0}
      <p class="empty-state">No files uploaded yet.</p>
    {:else}
      <div class="files-grid">
        {#each data.files as file (file.id)}
          <div class="file-card">
            <div class="file-info">
              <div class="file-icon">
                {#if file.mimeType === 'application/pdf'}
                  ��
                {:else if file.mimeType.includes('word')}
                  📝
                {:else}
                  📋
                {/if}
              </div>
              <div class="file-details">
                <h3>{file.displayName || file.originalName}</h3>
                {#if file.category}
                  <span class="category-badge">{file.category}</span>
                {/if}
                <p class="file-meta">
                  {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                </p>
                {#if file.description}
                  <p class="file-description">{file.description}</p>
                {/if}
              </div>
            </div>

            <div class="file-actions">
              <a href={file.path} target="_blank" class="btn-link">View</a>
              <a href={file.path} download class="btn-link">Download</a>
              <form
                method="POST"
                action="?/delete"
                use:enhance={() => {
                  if (!confirm('Are you sure you want to delete this file?')) {
                    return async ({ update }) => {
                      await update({ reset: false });
                    };
                  }

                  return async ({ result, update }) => {
                    if (result.type === 'success') {
                      success = 'File deleted successfully!';
                      setTimeout(() => (success = null), 3000);
                    } else if (result.type === 'failure') {
                      error = result.data?.error || 'Delete failed';
                    }

                    await update();
                  };
                }}
              >
                <input type="hidden" name="id" value={file.id} />
                <input type="hidden" name="url" value={file.path} />
                <button type="submit" class="btn-delete">Delete</button>
              </form>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .container {
    max-width: 1200px;
  }

  header {
    margin-bottom: 30px;
  }

  h1 {
    margin: 0;
    color: var(--main-blue-light);
  }

  header p {
    margin: 0.5rem 0 0 0;
    color: var(--neutral-black);
  }

  .alert {
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 1rem;
  }

  .alert.error {
    background-color: rgba(255, 0, 0, 0.1);
    color: var(--red);
    border: 1px solid var(--red);
  }

  .alert.success {
    background-color: rgba(0, 255, 0, 0.1);
    color: var(--green);
    border: 1px solid var(--green);
  }

  .upload-section,
  .files-section {
    background: var(--neutral-gray);
    border-radius: 10px;
    padding: 25px;
    margin-bottom: 30px;
  }

  h2 {
    margin-top: 0;
    color: var(--neutral-black);
    font-size: 18px;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--neutral-black);
  }

  input[type='text'],
  input[type='file'],
  select,
  textarea {
    width: 100%;
    padding: 10px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    background-color: var(--neutral-dark-gray);
    color: var(--neutral-black);
    font-family: inherit;
    font-size: 1rem;
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

  textarea {
    resize: vertical;
  }

  button[type='submit'] {
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: 500;
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.5s;
  }

  button[type='submit']:hover:not(:disabled) {
    background-color: var(--main-blue-alt);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .empty-state {
    text-align: center;
    color: var(--neutral-black);
    opacity: 0.6;
    padding: 40px;
  }

  .files-grid {
    display: grid;
    gap: 20px;
  }

  .file-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-radius: 10px;
    background: var(--neutral-dark-gray);
    transition: transform 0.2s;
  }

  .file-card:hover {
    transform: translateY(-2px);
  }

  .file-info {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    flex: 1;
  }

  .file-icon {
    font-size: 2rem;
  }

  .file-details h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: var(--neutral-black);
  }

  .category-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background: var(--main-blue);
    color: var(--contrast-text-dark);
    border-radius: 4px;
    font-size: 0.75rem;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .file-meta {
    margin: 0.5rem 0;
    font-size: 0.875rem;
    color: var(--neutral-black);
    opacity: 0.7;
  }

  .file-description {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    color: var(--neutral-black);
  }

  .file-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .btn-link {
    padding: 6px 12px;
    background: var(--main-blue);
    color: var(--contrast-text-dark);
    text-decoration: none;
    border-radius: 5px;
    font-size: 13px;
    font-weight: 600;
    transition: background-color 0.5s;
  }

  .btn-link:hover {
    background: var(--main-blue-alt);
  }

  .btn-delete {
    padding: 6px 12px;
    background: var(--red);
    color: var(--contrast-text-dark);
    border: none;
    border-radius: 5px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.5s;
  }

  .btn-delete:hover {
    background: #cc0000;
  }

  @media (max-width: 439px) {
    .container {
      padding: 1rem;
    }

    .file-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .file-actions {
      width: 100%;
      justify-content: flex-start;
    }
  }
</style>
