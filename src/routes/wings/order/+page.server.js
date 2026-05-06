import { fail, redirect } from '@sveltejs/kit';
import { requireWingsAuth } from '$lib/server/guards.js';
import {
  getSessionByDate,
  getAllRestaurants,
  getAllPeople,
  getMenuItemsByRestaurant,
  getPeopleWithOrdersForSession,
  createSession,
  addAttendee,
  removeAttendee,
  findPersonByName,
  createPerson,
  upsertOrderEntry,
  deleteOrderEntry,
} from '$lib/db/queries/wings.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
  requireWingsAuth(locals);

  const dateParam = url.searchParams.get('date');
  const today = dateParam || getTodayString();

  const [session, restaurants, allPeople] = await Promise.all([
    getSessionByDate(today),
    getAllRestaurants(),
    getAllPeople(),
  ]);

  if (session) {
    const [people, menuItems] = await Promise.all([
      getPeopleWithOrdersForSession(session.id),
      getMenuItemsByRestaurant(session.restaurantId),
    ]);
    return { session, people, menuItems, allPeople, restaurants, today };
  }

  return { session: null, people: [], menuItems: [], allPeople, restaurants, today };
}

export const actions = {
  startSession: async ({ request, locals }) => {
    requireWingsAuth(locals);
    const data = await request.formData();
    const restaurantId = parseInt(/** @type {string} */ (data.get('restaurantId')));
    const date = /** @type {string} */ (data.get('date')) || getTodayString();

    if (!restaurantId) return fail(400, { error: 'Select a restaurant' });

    const existing = await getSessionByDate(date);
    if (existing) return fail(400, { error: 'Session already exists for this date' });

    await createSession(restaurantId, date, null);
    return { success: true };
  },

  addPerson: async ({ request, locals }) => {
    requireWingsAuth(locals);
    const data = await request.formData();
    const sessionId = parseInt(/** @type {string} */ (data.get('sessionId')));
    const personIdRaw = data.get('personId');
    const name = /** @type {string} */ (data.get('name'))?.trim();

    if (!sessionId) return fail(400, { error: 'Missing session' });

    let personId = personIdRaw ? parseInt(/** @type {string} */ (personIdRaw)) : null;

    if (!personId && name) {
      const existing = await findPersonByName(name);
      if (existing) {
        personId = existing.id;
      } else {
        const created = await createPerson(name);
        personId = created.id;
      }
    }

    if (!personId) return fail(400, { error: 'Provide a name or select a person' });

    await addAttendee(sessionId, personId);
    return { personId };
  },

  removePerson: async ({ request, locals }) => {
    requireWingsAuth(locals);
    const data = await request.formData();
    const sessionId = parseInt(/** @type {string} */ (data.get('sessionId')));
    const personId = parseInt(/** @type {string} */ (data.get('personId')));

    if (!sessionId || !personId) return fail(400, { error: 'Missing data' });

    await removeAttendee(sessionId, personId);
    return { success: true };
  },

  addItem: async ({ request, locals }) => {
    requireWingsAuth(locals);
    const data = await request.formData();
    const sessionId = parseInt(/** @type {string} */ (data.get('sessionId')));
    const personId = parseInt(/** @type {string} */ (data.get('personId')));
    const menuItemId = parseInt(/** @type {string} */ (data.get('menuItemId')));
    const increment = parseInt(/** @type {string} */ (data.get('increment'))) || 1;

    if (!sessionId || !personId || !menuItemId) return fail(400, { error: 'Missing data' });

    await upsertOrderEntry(sessionId, personId, menuItemId, increment);
    return { success: true };
  },

  removeItem: async ({ request, locals }) => {
    requireWingsAuth(locals);
    const data = await request.formData();
    const entryId = parseInt(/** @type {string} */ (data.get('entryId')));

    if (!entryId) return fail(400, { error: 'Missing entry' });

    await deleteOrderEntry(entryId);
    return { success: true };
  },
};

function getTodayString() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return parts;
}
