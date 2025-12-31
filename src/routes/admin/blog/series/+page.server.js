import {
	getAllSeries,
	createSeries,
	updateSeries,
	deleteSeries
} from '$lib/db/queries/blog-series.js';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const series = await getAllSeries();

	return {
		series
	};
}

/**
 * Generate slug from title
 * @param {string} title
 */
function generateSlug(title) {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title');
		let slug = data.get('slug');
		const description = data.get('description');

		if (!title) {
			return fail(400, { error: 'Title is required' });
		}

		// Auto-generate slug if not provided
		if (!slug) {
			slug = generateSlug(/** @type {string} */ (title));
		}

		try {
			await createSeries({
				title: /** @type {string} */ (title),
				slug: /** @type {string} */ (slug),
				description: description ? /** @type {string} */ (description) : undefined
			});

			return { success: true };
		} catch (error) {
			console.error('Error creating series:', error);
			return fail(500, { error: 'Failed to create series' });
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const title = data.get('title');
		let slug = data.get('slug');
		const description = data.get('description');

		if (!id || !title) {
			return fail(400, { error: 'ID and title are required' });
		}

		// Auto-generate slug if not provided
		if (!slug) {
			slug = generateSlug(/** @type {string} */ (title));
		}

		try {
			await updateSeries(Number(id), {
				title: /** @type {string} */ (title),
				slug: /** @type {string} */ (slug),
				description: description ? /** @type {string} */ (description) : undefined
			});

			return { success: true };
		} catch (error) {
			console.error('Error updating series:', error);
			return fail(500, { error: 'Failed to update series' });
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) {
			return fail(400, { error: 'ID is required' });
		}

		try {
			await deleteSeries(Number(id));
			return { success: true };
		} catch (error) {
			console.error('Error deleting series:', error);

			// Check if it's a foreign key constraint error
			if (error && typeof error === 'object' && 'code' in error && error.code === 'SQLITE_CONSTRAINT') {
				return fail(400, {
					error: 'Cannot delete this series because it has blog posts assigned to it. Please remove or reassign those posts first.'
				});
			}

			return fail(500, { error: 'Failed to delete series' });
		}
	}
};
