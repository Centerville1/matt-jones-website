<script>
  import { enhance } from '$app/forms';

  /** @type {{ submissions: ContactSubmission[] }} */
  export let data;

  /** @type {string | null} */
  let error = null;
  /** @type {string | null} */
  let success = null;

  /** @type {number | null} */
  let editingNotesId = null;
  /** @type {string} */
  let editingNotesValue = '';

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

  /**
   * Start editing notes
   * @param {ContactSubmission} submission
   */
  function startEditingNotes(submission) {
    editingNotesId = submission.id;
    editingNotesValue = submission.notes || '';
  }

  function cancelEditingNotes() {
    editingNotesId = null;
    editingNotesValue = '';
  }

  $: unreadCount = data.submissions.filter((s) => s.status === 'unread').length;
</script>

<svelte:head>
  <title>Contact Submissions - Admin</title>
</svelte:head>

<div class="container">
  <header>
    <h1>Contact Form Submissions</h1>
    <p>
      {data.submissions.length} total submission{data.submissions.length !== 1
        ? 's'
        : ''}
      {#if unreadCount > 0}
        <span class="unread-badge">{unreadCount} unread</span>
      {/if}
    </p>
  </header>

  {#if error}
    <div class="alert error">{error}</div>
  {/if}

  {#if success}
    <div class="alert success">{success}</div>
  {/if}

  {#if data.submissions.length === 0}
    <div class="empty-state">
      <p>No contact submissions yet.</p>
    </div>
  {:else}
    <div class="submissions-list">
      {#each data.submissions as submission (submission.id)}
        <div class="submission-card" class:unread={submission.status === 'unread'}>
          <div class="submission-header">
            <div class="submission-meta">
              <h3>{submission.name}</h3>
              <a href="mailto:{submission.email}" class="email-link">{submission.email}</a>
              <p class="date">{formatDate(submission.submittedAt)}</p>
            </div>

            <form
              method="POST"
              action="?/updateStatus"
              use:enhance={() => {
                return async ({ result, update }) => {
                  if (result.type === 'success') {
                    success = 'Status updated!';
                    setTimeout(() => (success = null), 2000);
                  } else if (result.type === 'failure') {
                    error = result.data?.error || 'Update failed';
                  }
                  await update();
                };
              }}
            >
              <input type="hidden" name="id" value={submission.id} />
              <select
                name="status"
                value={submission.status}
                on:change={(e) => {
                  const form = e.target?.closest('form');
                  if (form) {
                    form.requestSubmit();
                  }
                }}
              >
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="archived">Archived</option>
              </select>
            </form>
          </div>

          {#if submission.subject}
            <div class="subject">
              <strong>Subject:</strong>
              {submission.subject}
            </div>
          {/if}

          <div class="message">
            <strong>Message:</strong>
            <p>{submission.message}</p>
          </div>

          <div class="notes-section">
            <strong>Admin Notes:</strong>
            {#if editingNotesId === submission.id}
              <form
                method="POST"
                action="?/updateNotes"
                use:enhance={() => {
                  return async ({ result, update }) => {
                    if (result.type === 'success') {
                      success = 'Notes updated!';
                      setTimeout(() => (success = null), 2000);
                      cancelEditingNotes();
                    } else if (result.type === 'failure') {
                      error = result.data?.error || 'Update failed';
                    }
                    await update();
                  };
                }}
              >
                <input type="hidden" name="id" value={submission.id} />
                <textarea
                  name="notes"
                  bind:value={editingNotesValue}
                  rows="3"
                  placeholder="Add notes about this submission..."
                ></textarea>
                <div class="notes-actions">
                  <button type="submit" class="btn-save">Save</button>
                  <button
                    type="button"
                    class="btn-cancel"
                    on:click={cancelEditingNotes}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            {:else}
              <p class="notes-display">
                {submission.notes || 'No notes yet'}
                <button
                  class="btn-edit"
                  on:click={() => startEditingNotes(submission)}
                >
                  Edit
                </button>
              </p>
            {/if}
          </div>

          <div class="submission-actions">
            <form
              method="POST"
              action="?/delete"
              use:enhance={() => {
                if (!confirm('Are you sure you want to delete this submission?')) {
                  return async ({ update }) => {
                    await update({ reset: false });
                  };
                }

                return async ({ result, update }) => {
                  if (result.type === 'success') {
                    success = 'Submission deleted!';
                    setTimeout(() => (success = null), 2000);
                  } else if (result.type === 'failure') {
                    error = result.data?.error || 'Delete failed';
                  }
                  await update();
                };
              }}
            >
              <input type="hidden" name="id" value={submission.id} />
              <button type="submit" class="btn-delete">Delete</button>
            </form>
          </div>
        </div>
      {/each}
    </div>
  {/if}
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

  .unread-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: var(--main-blue);
    color: var(--contrast-text-dark);
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
    margin-left: 0.5rem;
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

  .empty-state {
    text-align: center;
    padding: 40px;
    background: var(--neutral-gray);
    border-radius: 10px;
  }

  .empty-state p {
    color: var(--neutral-black);
    opacity: 0.6;
    font-size: 1.1rem;
  }

  .submissions-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .submission-card {
    background: var(--neutral-dark-gray);
    border-radius: 10px;
    padding: 25px;
  }

  .submission-card.unread {
    border-left: 4px solid var(--main-blue);
    background: var(--neutral-gray);
  }

  .submission-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  .submission-meta h3 {
    margin: 0 0 0.25rem 0;
    color: var(--neutral-black);
  }

  .email-link {
    color: var(--main-blue);
    text-decoration: none;
    font-size: 0.9rem;
  }

  .email-link:hover {
    text-decoration: underline;
  }

  .date {
    margin: 0.25rem 0 0 0;
    font-size: 0.875rem;
    color: var(--neutral-black);
    opacity: 0.7;
  }

  select {
    padding: 8px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    background-color: var(--neutral-gray);
    color: var(--neutral-black);
    font-family: inherit;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .subject {
    margin-bottom: 1rem;
    padding: 12px;
    background: var(--neutral-gray);
    border-radius: 10px;
    color: var(--neutral-black);
  }

  .message {
    margin-bottom: 1rem;
  }

  .message p {
    margin: 0.5rem 0 0 0;
    white-space: pre-wrap;
    color: var(--neutral-black);
  }

  .notes-section {
    margin-bottom: 1rem;
    padding-top: 1rem;
    border-top: 2px solid var(--neutral-dark-gray-op-50);
  }

  .notes-section strong {
    color: var(--neutral-black);
  }

  .notes-display {
    margin: 0.5rem 0 0 0;
    color: var(--neutral-black);
    opacity: 0.6;
    font-style: italic;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  textarea {
    width: 100%;
    padding: 10px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    background-color: var(--neutral-gray);
    color: var(--neutral-black);
    font-family: inherit;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    resize: vertical;
  }

  .notes-actions {
    margin-top: 0.5rem;
    display: flex;
    gap: 8px;
  }

  .btn-save,
  .btn-cancel,
  .btn-edit,
  .btn-delete {
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.5s;
  }

  .btn-save {
    background: var(--main-blue);
    color: var(--contrast-text-dark);
  }

  .btn-save:hover {
    background: var(--main-blue-alt);
  }

  .btn-cancel {
    background: var(--neutral-gray);
    color: var(--neutral-black);
  }

  .btn-cancel:hover {
    background: var(--neutral-dark-gray);
  }

  .btn-edit {
    background: transparent;
    color: var(--main-blue);
    text-decoration: underline;
    padding: 0.25rem 0.5rem;
  }

  .btn-edit:hover {
    color: var(--main-blue-alt);
  }

  .submission-actions {
    padding-top: 1rem;
    border-top: 2px solid var(--neutral-dark-gray-op-50);
  }

  .btn-delete {
    background: var(--red);
    color: var(--contrast-text-dark);
  }

  .btn-delete:hover {
    background: #cc0000;
  }

  @media (max-width: 439px) {
    .container {
      padding: 1rem;
    }

    .submission-header {
      flex-direction: column;
    }
  }
</style>
