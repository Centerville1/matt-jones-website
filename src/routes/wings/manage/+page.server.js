import { fail } from '@sveltejs/kit';
import { requireWingsAuth } from '$lib/server/guards.js';
import {
  getAllRestaurants,
  getAllPeople,
  getMenuItemsByRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createPerson,
  deletePerson,
} from '$lib/db/queries/wings.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  requireWingsAuth(locals);

  const [restaurants, people] = await Promise.all([getAllRestaurants(), getAllPeople()]);

  const restaurantsWithMenus = await Promise.all(
    restaurants.map(async (r) => ({
      ...r,
      menuItems: await getMenuItemsByRestaurant(r.id),
    })),
  );

  return { restaurants: restaurantsWithMenus, people };
}

export const actions = {
  addRestaurant: async ({ request, locals }) => {
    requireWingsAuth(locals);
    const data = await request.formData();
    const name = /** @type {string} */ (data.get('name'))?.trim();
    const notes = /** @type {string} */ (data.get('notes'))?.trim();

    if (!name) return fail(400, { error: 'Restaurant name is required', action: 'addRestaurant' });

    await createRestaurant(name, notes || null);
    return { success: true };
  },

  deleteRestaurant: async ({ request, locals }) => {
    requireWingsAuth(locals);
    const data = await request.formData();
    const id = parseInt(/** @type {string} */ (data.get('id')));

    if (!id) return fail(400, { error: 'Missing id', action: 'deleteRestaurant' });

    await deleteRestaurant(id);
    return { success: true };
  },

  addMenuItem: async ({ request, locals }) => {
    requireWingsAuth(locals);
    const data = await request.formData();
    const restaurantId = parseInt(/** @type {string} */ (data.get('restaurantId')));
    const name = /** @type {string} */ (data.get('name'))?.trim();
    const priceRaw = /** @type {string} */ (data.get('price'))?.trim();
    const priceInCents = priceRaw ? Math.round(parseFloat(priceRaw) * 100) : null;

    if (!restaurantId || !name) return fail(400, { error: 'Missing fields', action: 'addMenuItem' });

    await createMenuItem(restaurantId, name, priceInCents);
    return { success: true };
  },

  updateMenuItem: async ({ request, locals }) => {
    requireWingsAuth(locals);
    const data = await request.formData();
    const id = parseInt(/** @type {string} */ (data.get('id')));
    const name = /** @type {string} */ (data.get('name'))?.trim();
    const priceRaw = /** @type {string} */ (data.get('price'))?.trim();
    const priceInCents = priceRaw ? Math.round(parseFloat(priceRaw) * 100) : null;

    if (!id || !name) return fail(400, { error: 'Missing fields', action: 'updateMenuItem' });

    await updateMenuItem(id, name, priceInCents);
    return { success: true };
  },

  deleteMenuItem: async ({ request, locals }) => {
    requireWingsAuth(locals);
    const data = await request.formData();
    const id = parseInt(/** @type {string} */ (data.get('id')));

    if (!id) return fail(400, { error: 'Missing id', action: 'deleteMenuItem' });

    await deleteMenuItem(id);
    return { success: true };
  },

  addPerson: async ({ request, locals }) => {
    requireWingsAuth(locals);
    const data = await request.formData();
    const name = /** @type {string} */ (data.get('name'))?.trim();

    if (!name) return fail(400, { error: 'Name is required', action: 'addPerson' });

    await createPerson(name);
    return { success: true };
  },

  deletePerson: async ({ request, locals }) => {
    requireWingsAuth(locals);
    const data = await request.formData();
    const id = parseInt(/** @type {string} */ (data.get('id')));

    if (!id) return fail(400, { error: 'Missing id', action: 'deletePerson' });

    await deletePerson(id);
    return { success: true };
  },
};
