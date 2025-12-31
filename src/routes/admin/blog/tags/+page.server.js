import { getAllTags, createTag, updateTag, deleteTag } from '$lib/db/queries/blog-tags.js';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const tags = await getAllTags();

	return {
		tags
	};
}

/**
 * Generate slug from name
 * @param {string} name
 */
function generateSlug(name) {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		let slug = data.get('slug');
		const description = data.get('description');

		if (!name) {
			return fail(400, { error: 'Name is required' });
		}

		// Auto-generate slug if not provided
		if (!slug) {
			slug = generateSlug(/** @type {string} */ (name));
		}

		try {
			await createTag({
				name: /** @type {string} */ (name),
				slug: /** @type {string} */ (slug),
				description: description ? /** @type {string} */ (description) : undefined
			});

			return { success: true };
		} catch (error) {
			console.error('Error creating tag:', error);
			return fail(500, { error: 'Failed to create tag' });
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const name = data.get('name');
		let slug = data.get('slug');
		const description = data.get('description');

		if (!id || !name) {
			return fail(400, { error: 'ID and name are required' });
		}

		// Auto-generate slug if not provided
		if (!slug) {
			slug = generateSlug(/** @type {string} */ (name));
		}

		try {
			await updateTag(Number(id), {
				name: /** @type {string} */ (name),
				slug: /** @type {string} */ (slug),
				description: description ? /** @type {string} */ (description) : undefined
			});

			return { success: true };
		} catch (error) {
			console.error('Error updating tag:', error);
			return fail(500, { error: 'Failed to update tag' });
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) {
			return fail(400, { error: 'ID is required' });
		}

		try {
			await deleteTag(Number(id));
			return { success: true };
		} catch (error) {
			console.error('Error deleting tag:', error);

			// Check if it's a foreign key constraint error
			if (error && typeof error === 'object' && 'code' in error && error.code === 'SQLITE_CONSTRAINT') {
				return fail(400, {
					error: 'Cannot delete this tag because it is assigned to blog posts. Please remove it from those posts first.'
				});
			}

			return fail(500, { error: 'Failed to delete tag' });
		}
	}
};
