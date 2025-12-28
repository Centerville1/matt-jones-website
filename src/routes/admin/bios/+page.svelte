<script>
  /** @type {import('./$types').PageData} */
  export let data;

  /** @type {import('./$types').ActionData} */
  export let form;

  // Use form data if validation failed, otherwise use loaded data
  $: shortContent = form?.data?.short ?? data.bios.short;
  $: midContent = form?.data?.mid ?? data.bios.mid;
  $: longContent = form?.data?.long ?? data.bios.long;

  // Calculate paragraph counts
  $: shortParagraphs = shortContent
    .split('\n')
    .filter((/** @type {string} */ p) => p.trim()).length;
  $: midParagraphs = midContent
    .split('\n')
    .filter((/** @type {string} */ p) => p.trim()).length;
  $: longParagraphs = longContent
    .split('\n')
    .filter((/** @type {string} */ p) => p.trim()).length;

  // Calculate word counts
  $: shortWords = shortContent
    .trim()
    .split(/\s+/)
    .filter((/** @type {string} */ w) => w.length > 0).length;
  $: midWords = midContent
    .trim()
    .split(/\s+/)
    .filter((/** @type {string} */ w) => w.length > 0).length;
  $: longWords = longContent
    .trim()
    .split(/\s+/)
    .filter((/** @type {string} */ w) => w.length > 0).length;
</script>

<div class="bios-container">
  <div class="header">
    <h2>Manage Bios</h2>
    <p class="subtitle">
      Edit all three bio versions side-by-side. Each paragraph should be on a
      new line.
    </p>
  </div>

  {#if form && 'success' in form && form.success}
    <div class="form-success">All bios updated successfully!</div>
  {/if}

  {#if form?.error}
    <div class="form-error">{form.error}</div>
  {/if}

  <form method="POST">
    <div class="bios-grid">
      <div class="bio-card">
        <div class="bio-header">
          <h3>Short Bio</h3>
          <span class="paragraph-count"
            >{shortParagraphs} paragraph{shortParagraphs !== 1 ? 's' : ''}</span
          >
        </div>
        <textarea
          name="short"
          rows="12"
          placeholder="Enter short bio paragraphs (one per line)..."
          required>{shortContent}</textarea
        >
        <div class="stats">
          <span
            >{shortParagraphs} paragraph{shortParagraphs !== 1 ? 's' : ''}</span
          >
          <span>•</span>
          <span>{shortWords} word{shortWords !== 1 ? 's' : ''}</span>
        </div>
        {#if form?.errors?.short}
          <p class="error">{form.errors.short}</p>
        {/if}
      </div>

      <div class="bio-card">
        <div class="bio-header">
          <h3>Mid Bio</h3>
          <span class="paragraph-count"
            >{midParagraphs} paragraph{midParagraphs !== 1 ? 's' : ''}</span
          >
        </div>
        <textarea
          name="mid"
          rows="12"
          placeholder="Enter mid bio paragraphs (one per line)..."
          required>{midContent}</textarea
        >
        <div class="stats">
          <span>{midParagraphs} paragraph{midParagraphs !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{midWords} word{midWords !== 1 ? 's' : ''}</span>
        </div>
        {#if form?.errors?.mid}
          <p class="error">{form.errors.mid}</p>
        {/if}
      </div>

      <div class="bio-card">
        <div class="bio-header">
          <h3>Long Bio</h3>
          <span class="paragraph-count"
            >{longParagraphs} paragraph{longParagraphs !== 1 ? 's' : ''}</span
          >
        </div>
        <textarea
          name="long"
          rows="12"
          placeholder="Enter long bio paragraphs (one per line)..."
          required>{longContent}</textarea
        >
        <div class="stats">
          <span
            >{longParagraphs} paragraph{longParagraphs !== 1 ? 's' : ''}</span
          >
          <span>•</span>
          <span>{longWords} word{longWords !== 1 ? 's' : ''}</span>
        </div>
        {#if form?.errors?.long}
          <p class="error">{form.errors.long}</p>
        {/if}
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="button-primary">Save All Changes</button>
    </div>
  </form>
</div>

<style>
  .bios-container {
    max-width: 100%;
  }

  .header {
    margin-bottom: 20px;
  }

  h2 {
    margin: 0 0 10px 0;
    color: var(--main-blue-light);
  }

  .subtitle {
    margin: 0;
    color: var(--neutral-black);
    opacity: 0.7;
  }

  .form-success {
    background-color: rgba(0, 255, 0, 0.1);
    border: 1px solid var(--green);
    color: var(--green);
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 20px;
  }

  .form-error {
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px solid var(--red);
    color: var(--red);
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .bios-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .bio-card {
    background-color: var(--neutral-gray);
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .bio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }

  h3 {
    margin: 0;
    color: var(--neutral-black);
    font-size: 18px;
  }

  .paragraph-count {
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }

  textarea {
    width: 100%;
    padding: 15px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    background-color: var(--neutral-dark-gray);
    color: var(--neutral-black);
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s;
    font-family: inherit;
    resize: vertical;
    min-height: 500px;
    line-height: 1.6;
  }

  textarea:focus {
    outline: none;
    border-color: var(--main-blue);
  }

  .stats {
    display: flex;
    gap: 8px;
    font-size: 13px;
    color: var(--neutral-black);
    opacity: 0.7;
    margin-top: -5px;
  }

  .error {
    color: var(--red);
    font-size: 14px;
    margin: 5px 0 0 0;
  }

  .form-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 10px;
  }

  .button-primary {
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
    padding: 12px 32px;
    border-radius: 10px;
    border: none;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.5s;
    text-align: center;
  }

  .button-primary:hover {
    background-color: var(--main-blue-alt);
  }

  @media (max-width: 1024px) {
    .bios-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
