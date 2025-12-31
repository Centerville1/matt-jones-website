<script>
	import { enhance } from '$app/forms';

	/** @type {{ data: { series: BlogSeries[] }, form: any }} */
	let { data, form } = $props();

	let showModal = $state(false);
	let editingSeries = $state(/** @type {BlogSeries | null} */ (null));
	let formData = $state({ title: '', slug: '', description: '' });
	let deletingSeries = $state(/** @type {BlogSeries | null} */ (null));

	function openCreateModal() {
		editingSeries = null;
		formData = { title: '', slug: '', description: '' };
		showModal = true;
	}

	/**
	 * @param {BlogSeries} series
	 */
	function openEditModal(series) {
		editingSeries = series;
		formData = { title: series.title, slug: series.slug, description: series.description || '' };
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingSeries = null;
		formData = { title: '', slug: '', description: '' };
	}

	/**
	 * Auto-generate slug from title
	 */
	function generateSlug() {
		if (formData.title && !formData.slug) {
			formData.slug = formData.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '');
		}
	}

	/**
	 * @param {BlogSeries} series
	 */
	function confirmDelete(series) {
		if (confirm(`Delete series "${series.title}"? Posts in this series will not be deleted.`)) {
			deletingSeries = series;
			// Use setTimeout to ensure the form exists in the DOM before submitting
			setTimeout(() => {
				const form = /** @type {HTMLFormElement} */ (document.getElementById('delete-form'));
				if (form) {
					form.requestSubmit();
				}
			}, 0);
		}
	}

	/**
	 * Format date for display
	 * @param {Date} date
	 */
	function formatDate(date) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="series-page">
	<div class="header">
		<h1>Series Management</h1>
		<button class="btn-primary" onclick={openCreateModal}>Create New Series</button>
	</div>

	{#if form?.error}
		<div class="alert alert-error">{form.error}</div>
	{/if}

	{#if form?.success}
		<div class="alert alert-success">Series saved successfully!</div>
	{/if}

	<div class="series-table">
		<table>
			<thead>
				<tr>
					<th>Title</th>
					<th>Slug</th>
					<th>Description</th>
					<th>Created</th>
					<th>Updated</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.series as series (series.id)}
					<tr>
						<td class="title">{series.title}</td>
						<td><code>{series.slug}</code></td>
						<td class="description">{series.description || '—'}</td>
						<td>{formatDate(series.createdAt)}</td>
						<td>{formatDate(series.updatedAt)}</td>
						<td class="actions">
							<button class="btn-secondary" onclick={() => openEditModal(series)}>Edit</button>
							<button class="btn-danger" onclick={() => confirmDelete(series)}>Delete</button>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="empty">No series yet. Create one to get started!</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

{#if showModal}
	<div class="modal-overlay" onclick={closeModal}>
		<div class="modal" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h2>{editingSeries ? 'Edit Series' : 'Create New Series'}</h2>
				<button class="close-btn" onclick={closeModal}>&times;</button>
			</div>

			<form
				method="POST"
				action={editingSeries ? '?/update' : '?/create'}
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						closeModal();
					};
				}}
			>
				{#if editingSeries}
					<input type="hidden" name="id" value={editingSeries.id} />
				{/if}

				<div class="form-group">
					<label for="title">Title *</label>
					<input
						type="text"
						id="title"
						name="title"
						bind:value={formData.title}
						onblur={generateSlug}
						required
					/>
				</div>

				<div class="form-group">
					<label for="slug">Slug</label>
					<input type="text" id="slug" name="slug" bind:value={formData.slug} />
					<small>URL-friendly identifier (auto-generated from title if left blank)</small>
				</div>

				<div class="form-group">
					<label for="description">Description</label>
					<textarea id="description" name="description" bind:value={formData.description} rows="3"
					></textarea>
					<small>Overview of what this series covers</small>
				</div>

				<div class="modal-actions">
					<button type="button" class="btn-secondary" onclick={closeModal}>Cancel</button>
					<button type="submit" class="btn-primary">
						{editingSeries ? 'Update' : 'Create'} Series
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Hidden delete form with proper error handling -->
{#if deletingSeries}
	<form
		id="delete-form"
		method="POST"
		action="?/delete"
		use:enhance={() => {
			return async ({ result, update }) => {
				await update();
				deletingSeries = null;
			};
		}}
	>
		<input type="hidden" name="id" value={deletingSeries.id} />
	</form>
{/if}

<style>
	.series-page {
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2rem;
		margin: 0;
		color: var(--neutral-black);
	}

	.alert {
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

	.alert-error {
		background: #fee;
		color: #c33;
		border: 1px solid #fcc;
	}

	.alert-success {
		background: #efe;
		color: #3c3;
		border: 1px solid #cfc;
	}

	.series-table {
		background: var(--neutral-dark-gray);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	thead {
		background: rgba(0, 0, 0, 0.2);
	}

	th {
		padding: 1rem;
		text-align: left;
		font-weight: 600;
		color: var(--neutral-black);
	}

	td {
		padding: 1rem;
		border-top: 1px solid var(--neutral-dark-gray-op-50);
		color: var(--neutral-black);
	}

	td.title {
		font-weight: 500;
	}

	td.description {
		max-width: 300px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	td.empty {
		text-align: center;
		color: var(--neutral-dark-gray);
		padding: 3rem;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		white-space: nowrap;
	}

	code {
		background: rgba(0, 0, 0, 0.3);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		background: var(--neutral-gray);
		border-radius: 0.5rem;
		width: 90%;
		max-width: 600px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 2px solid var(--neutral-dark-gray-op-50);
		flex-shrink: 0;
	}

	.modal-header h2 {
		margin: 0;
		color: var(--neutral-black);
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		color: var(--neutral-black);
		cursor: pointer;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.25rem;
	}

	.close-btn:hover {
		background: var(--neutral-dark-gray-op-50);
	}

	form {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: var(--neutral-black);
	}

	input[type='text'],
	textarea {
		width: 100%;
		padding: 0.75rem;
		background: var(--neutral-dark-gray);
		border: 2px solid var(--neutral-dark-gray-op-50);
		border-radius: 0.25rem;
		color: var(--neutral-black);
		font-size: 1rem;
		box-sizing: border-box;
	}

	input[type='text']:focus,
	textarea:focus {
		outline: none;
		border-color: var(--main-blue);
	}

	small {
		display: block;
		margin-top: 0.25rem;
		color: var(--neutral-black);
		opacity: 0.7;
		font-size: 0.875rem;
	}

	.modal-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		padding-top: 1rem;
		margin-top: 1rem;
		border-top: 2px solid var(--neutral-dark-gray-op-50);
	}

	.btn-primary,
	.btn-secondary,
	.btn-danger {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 10px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: var(--main-blue);
		color: var(--contrast-text-dark);
	}

	.btn-primary:hover {
		background: var(--main-blue-alt);
	}

	.btn-secondary {
		background: var(--neutral-dark-gray);
		color: var(--neutral-black);
	}

	.btn-secondary:hover {
		background: var(--neutral-dark-gray-op-50);
	}

	.btn-danger {
		background: #c33;
		color: var(--neutral-white);
	}

	.btn-danger:hover {
		background: #a22;
	}
</style>
