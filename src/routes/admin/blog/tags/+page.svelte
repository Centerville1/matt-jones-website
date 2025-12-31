<script>
	import { enhance } from '$app/forms';
	import TagPill from '$lib/components/TagPill.svelte';

	/** @type {{ data: { tags: BlogTag[] }, form: any }} */
	let { data, form } = $props();

	let showModal = $state(false);
	let editingTag = $state(/** @type {BlogTag | null} */ (null));
	let formData = $state({ name: '', slug: '', description: '' });
	let deletingTag = $state(/** @type {BlogTag | null} */ (null));

	function openCreateModal() {
		editingTag = null;
		formData = { name: '', slug: '', description: '' };
		showModal = true;
	}

	/**
	 * @param {BlogTag} tag
	 */
	function openEditModal(tag) {
		editingTag = tag;
		formData = { name: tag.name, slug: tag.slug, description: tag.description || '' };
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingTag = null;
		formData = { name: '', slug: '', description: '' };
	}

	/**
	 * Auto-generate slug from name
	 */
	function generateSlug() {
		if (formData.name && !formData.slug) {
			formData.slug = formData.name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '');
		}
	}

	/**
	 * @param {BlogTag} tag
	 */
	function confirmDelete(tag) {
		if (confirm(`Delete tag "${tag.name}"? This will remove it from all posts.`)) {
			const form = document.createElement('form');
			form.method = 'POST';
			form.action = '?/delete';

			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = 'id';
			input.value = tag.id.toString();
			form.appendChild(input);

			document.body.appendChild(form);
			form.submit();
		}
	}
</script>

<div class="tags-page">
	<div class="header">
		<h1>Tag Management</h1>
		<button class="btn-primary" onclick={openCreateModal}>Create New Tag</button>
	</div>

	{#if form?.error}
		<div class="alert alert-error">{form.error}</div>
	{/if}

	{#if form?.success}
		<div class="alert alert-success">Tag saved successfully!</div>
	{/if}

	<div class="tags-table">
		<table>
			<thead>
				<tr>
					<th>Tag</th>
					<th>Slug</th>
					<th>Description</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.tags as tag (tag.id)}
					<tr>
						<td>
							<TagPill {tag} />
						</td>
						<td><code>{tag.slug}</code></td>
						<td>{tag.description || '—'}</td>
						<td class="actions">
							<button class="btn-secondary" onclick={() => openEditModal(tag)}>Edit</button>
							<button class="btn-danger" onclick={() => confirmDelete(tag)}>Delete</button>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="4" class="empty">No tags yet. Create one to get started!</td>
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
				<h2>{editingTag ? 'Edit Tag' : 'Create New Tag'}</h2>
				<button class="close-btn" onclick={closeModal}>&times;</button>
			</div>

			<form
				method="POST"
				action={editingTag ? '?/update' : '?/create'}
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						closeModal();
					};
				}}
			>
				{#if editingTag}
					<input type="hidden" name="id" value={editingTag.id} />
				{/if}

				<div class="form-group">
					<label for="name">Name *</label>
					<input
						type="text"
						id="name"
						name="name"
						bind:value={formData.name}
						onblur={generateSlug}
						required
					/>
				</div>

				<div class="form-group">
					<label for="slug">Slug</label>
					<input type="text" id="slug" name="slug" bind:value={formData.slug} />
					<small>URL-friendly identifier (auto-generated from name if left blank)</small>
				</div>

				<div class="form-group">
					<label for="description">Description</label>
					<textarea id="description" name="description" bind:value={formData.description} rows="3"
					></textarea>
				</div>

				<div class="modal-actions">
					<button type="button" class="btn-secondary" onclick={closeModal}>Cancel</button>
					<button type="submit" class="btn-primary">
						{editingTag ? 'Update' : 'Create'} Tag
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.tags-page {
		padding: 2rem;
		max-width: 1200px;
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

	.tags-table {
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

	td.empty {
		text-align: center;
		color: var(--neutral-dark-gray);
		padding: 3rem;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
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
