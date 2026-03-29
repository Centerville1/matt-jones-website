import { db } from '$lib/db/index.js';
import {
  wingPeople,
  wingRestaurants,
  wingMenuItems,
  wingSessions,
  wingSessionAttendees,
  wingOrderEntries,
} from '$lib/db/schema/wings.js';
import { eq, and, desc, sql, inArray } from 'drizzle-orm';

// ── People ──────────────────────────────────────────────────────────────────

export async function getAllPeople() {
  return db.select().from(wingPeople).orderBy(wingPeople.name).all();
}

export async function findPersonByName(name) {
  return db
    .select()
    .from(wingPeople)
    .where(eq(sql`lower(${wingPeople.name})`, name.toLowerCase()))
    .get();
}

export async function createPerson(name) {
  const [person] = await db
    .insert(wingPeople)
    .values({ name: name.trim(), createdAt: new Date() })
    .returning();
  return person;
}

export async function deletePerson(id) {
  await db.delete(wingOrderEntries).where(eq(wingOrderEntries.personId, id));
  await db.delete(wingSessionAttendees).where(eq(wingSessionAttendees.personId, id));
  await db.delete(wingPeople).where(eq(wingPeople.id, id));
}

// ── Restaurants ──────────────────────────────────────────────────────────────

export async function getAllRestaurants() {
  return db.select().from(wingRestaurants).orderBy(wingRestaurants.name).all();
}

export async function createRestaurant(name, notes) {
  const [restaurant] = await db
    .insert(wingRestaurants)
    .values({ name: name.trim(), notes: notes || null, createdAt: new Date() })
    .returning();
  return restaurant;
}

export async function updateRestaurant(id, name, notes) {
  const [restaurant] = await db
    .update(wingRestaurants)
    .set({ name: name.trim(), notes: notes || null })
    .where(eq(wingRestaurants.id, id))
    .returning();
  return restaurant;
}

export async function deleteRestaurant(id) {
  const sessions = await db
    .select({ id: wingSessions.id })
    .from(wingSessions)
    .where(eq(wingSessions.restaurantId, id))
    .all();

  if (sessions.length > 0) {
    const sessionIds = sessions.map((s) => s.id);
    await db.delete(wingOrderEntries).where(inArray(wingOrderEntries.sessionId, sessionIds));
    await db.delete(wingSessionAttendees).where(inArray(wingSessionAttendees.sessionId, sessionIds));
    await db.delete(wingSessions).where(inArray(wingSessions.id, sessionIds));
  }

  await db.delete(wingMenuItems).where(eq(wingMenuItems.restaurantId, id));
  await db.delete(wingRestaurants).where(eq(wingRestaurants.id, id));
}

// ── Menu Items ────────────────────────────────────────────────────────────────

export async function getMenuItemsByRestaurant(restaurantId) {
  return db
    .select()
    .from(wingMenuItems)
    .where(eq(wingMenuItems.restaurantId, restaurantId))
    .orderBy(wingMenuItems.name)
    .all();
}

export async function createMenuItem(restaurantId, name, priceInCents) {
  const [item] = await db
    .insert(wingMenuItems)
    .values({
      restaurantId,
      name: name.trim(),
      priceInCents: priceInCents || null,
      createdAt: new Date(),
    })
    .returning();
  return item;
}

export async function updateMenuItem(id, name, priceInCents) {
  const [item] = await db
    .update(wingMenuItems)
    .set({ name: name.trim(), priceInCents: priceInCents || null })
    .where(eq(wingMenuItems.id, id))
    .returning();
  return item;
}

export async function deleteMenuItem(id) {
  await db.delete(wingOrderEntries).where(eq(wingOrderEntries.menuItemId, id));
  await db.delete(wingMenuItems).where(eq(wingMenuItems.id, id));
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export async function getSessionByDate(date) {
  const session = await db
    .select({
      id: wingSessions.id,
      restaurantId: wingSessions.restaurantId,
      restaurantName: wingRestaurants.name,
      date: wingSessions.date,
      notes: wingSessions.notes,
      createdAt: wingSessions.createdAt,
    })
    .from(wingSessions)
    .leftJoin(wingRestaurants, eq(wingSessions.restaurantId, wingRestaurants.id))
    .where(eq(wingSessions.date, date))
    .get();
  return session || null;
}

export async function getAllSessions() {
  return db
    .select({
      id: wingSessions.id,
      restaurantId: wingSessions.restaurantId,
      restaurantName: wingRestaurants.name,
      date: wingSessions.date,
      notes: wingSessions.notes,
      createdAt: wingSessions.createdAt,
    })
    .from(wingSessions)
    .leftJoin(wingRestaurants, eq(wingSessions.restaurantId, wingRestaurants.id))
    .orderBy(desc(wingSessions.date))
    .all();
}

export async function createSession(restaurantId, date, notes) {
  const [session] = await db
    .insert(wingSessions)
    .values({ restaurantId, date, notes: notes || null, createdAt: new Date() })
    .returning();
  return session;
}

// ── Attendees ─────────────────────────────────────────────────────────────────

export async function getAttendeesForSession(sessionId) {
  return db
    .select({
      id: wingSessionAttendees.id,
      personId: wingPeople.id,
      personName: wingPeople.name,
    })
    .from(wingSessionAttendees)
    .leftJoin(wingPeople, eq(wingSessionAttendees.personId, wingPeople.id))
    .where(eq(wingSessionAttendees.sessionId, sessionId))
    .orderBy(wingPeople.name)
    .all();
}

export async function addAttendee(sessionId, personId) {
  const existing = await db
    .select()
    .from(wingSessionAttendees)
    .where(
      and(
        eq(wingSessionAttendees.sessionId, sessionId),
        eq(wingSessionAttendees.personId, personId),
      ),
    )
    .get();
  if (existing) return existing;
  const [attendee] = await db
    .insert(wingSessionAttendees)
    .values({ sessionId, personId, createdAt: new Date() })
    .returning();
  return attendee;
}

export async function removeAttendee(sessionId, personId) {
  await db
    .delete(wingSessionAttendees)
    .where(
      and(
        eq(wingSessionAttendees.sessionId, sessionId),
        eq(wingSessionAttendees.personId, personId),
      ),
    );
  await db
    .delete(wingOrderEntries)
    .where(
      and(
        eq(wingOrderEntries.sessionId, sessionId),
        eq(wingOrderEntries.personId, personId),
      ),
    );
}

// ── Order Entries ─────────────────────────────────────────────────────────────

export async function getOrderEntriesForSession(sessionId) {
  return db
    .select({
      entryId: wingOrderEntries.id,
      sessionId: wingOrderEntries.sessionId,
      personId: wingOrderEntries.personId,
      menuItemId: wingMenuItems.id,
      menuItemName: wingMenuItems.name,
      priceInCents: wingMenuItems.priceInCents,
      quantity: wingOrderEntries.quantity,
    })
    .from(wingOrderEntries)
    .leftJoin(wingMenuItems, eq(wingOrderEntries.menuItemId, wingMenuItems.id))
    .where(eq(wingOrderEntries.sessionId, sessionId))
    .all();
}

export async function upsertOrderEntry(sessionId, personId, menuItemId, increment) {
  const existing = await db
    .select()
    .from(wingOrderEntries)
    .where(
      and(
        eq(wingOrderEntries.sessionId, sessionId),
        eq(wingOrderEntries.personId, personId),
        eq(wingOrderEntries.menuItemId, menuItemId),
      ),
    )
    .get();

  if (existing) {
    const newQty = existing.quantity + increment;
    if (newQty <= 0) {
      await db.delete(wingOrderEntries).where(eq(wingOrderEntries.id, existing.id));
      return null;
    }
    const [entry] = await db
      .update(wingOrderEntries)
      .set({ quantity: newQty })
      .where(eq(wingOrderEntries.id, existing.id))
      .returning();
    return entry;
  }

  if (increment <= 0) return null;
  const [entry] = await db
    .insert(wingOrderEntries)
    .values({ sessionId, personId, menuItemId, quantity: increment, createdAt: new Date() })
    .returning();
  return entry;
}

export async function deleteOrderEntry(entryId) {
  await db.delete(wingOrderEntries).where(eq(wingOrderEntries.id, entryId));
}

// ── Aggregate queries for session display ────────────────────────────────────

/**
 * Returns people in a session with their order items grouped
 * @param {number} sessionId
 * @returns {Promise<Array<{personId: number, personName: string, items: Array<{entryId: number, menuItemId: number, menuItemName: string, priceInCents: number|null, quantity: number}>}>>}
 */
export async function getPeopleWithOrdersForSession(sessionId) {
  const [attendees, entries] = await Promise.all([
    getAttendeesForSession(sessionId),
    getOrderEntriesForSession(sessionId),
  ]);

  return attendees.map((a) => ({
    personId: a.personId,
    personName: a.personName,
    items: entries
      .filter((e) => e.personId === a.personId)
      .map((e) => ({
        entryId: e.entryId,
        menuItemId: e.menuItemId,
        menuItemName: e.menuItemName,
        priceInCents: e.priceInCents,
        quantity: e.quantity,
      })),
  }));
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function getAttendanceStats() {
  const rows = await db
    .select({
      personId: wingPeople.id,
      personName: wingPeople.name,
      sessions: sql`count(${wingSessionAttendees.id})`.as('sessions'),
    })
    .from(wingSessionAttendees)
    .leftJoin(wingPeople, eq(wingSessionAttendees.personId, wingPeople.id))
    .groupBy(wingPeople.id)
    .orderBy(desc(sql`count(${wingSessionAttendees.id})`))
    .all();
  return rows;
}

export async function getWingCountsByPerson() {
  const rows = await db
    .select({
      personId: wingPeople.id,
      personName: wingPeople.name,
      totalWings: sql`coalesce(sum(${wingOrderEntries.quantity}), 0)`.as('totalWings'),
    })
    .from(wingPeople)
    .leftJoin(wingOrderEntries, eq(wingOrderEntries.personId, wingPeople.id))
    .groupBy(wingPeople.id)
    .orderBy(desc(sql`coalesce(sum(${wingOrderEntries.quantity}), 0)`))
    .all();
  return rows;
}

export async function getSessionStats(sessionId) {
  const entries = await getOrderEntriesForSession(sessionId);
  const totalWings = entries.reduce((sum, e) => sum + e.quantity, 0);
  const attendeeCount = new Set(entries.map((e) => e.personId)).size;
  return { totalWings, attendeeCount };
}
