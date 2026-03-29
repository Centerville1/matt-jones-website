import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * @typedef {Object} WingPerson
 * @property {number} id
 * @property {string} name
 * @property {Date} createdAt
 */
export const wingPeople = sqliteTable('wing_people', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

/**
 * @typedef {Object} WingRestaurant
 * @property {number} id
 * @property {string} name
 * @property {string|null} notes
 * @property {Date} createdAt
 */
export const wingRestaurants = sqliteTable('wing_restaurants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

/**
 * @typedef {Object} WingMenuItem
 * @property {number} id
 * @property {number} restaurantId
 * @property {string} name
 * @property {number|null} priceInCents
 * @property {Date} createdAt
 */
export const wingMenuItems = sqliteTable('wing_menu_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  restaurantId: integer('restaurant_id')
    .notNull()
    .references(() => wingRestaurants.id),
  name: text('name').notNull(),
  priceInCents: integer('price_in_cents'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

/**
 * @typedef {Object} WingSession
 * @property {number} id
 * @property {number} restaurantId
 * @property {string} date - YYYY-MM-DD
 * @property {string|null} notes
 * @property {Date} createdAt
 */
export const wingSessions = sqliteTable('wing_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  restaurantId: integer('restaurant_id')
    .notNull()
    .references(() => wingRestaurants.id),
  date: text('date').notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

/**
 * @typedef {Object} WingSessionAttendee
 * @property {number} id
 * @property {number} sessionId
 * @property {number} personId
 * @property {Date} createdAt
 */
export const wingSessionAttendees = sqliteTable('wing_session_attendees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: integer('session_id')
    .notNull()
    .references(() => wingSessions.id),
  personId: integer('person_id')
    .notNull()
    .references(() => wingPeople.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

/**
 * @typedef {Object} WingOrderEntry
 * @property {number} id
 * @property {number} sessionId
 * @property {number} personId
 * @property {number} menuItemId
 * @property {number} quantity
 * @property {Date} createdAt
 */
export const wingOrderEntries = sqliteTable('wing_order_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: integer('session_id')
    .notNull()
    .references(() => wingSessions.id),
  personId: integer('person_id')
    .notNull()
    .references(() => wingPeople.id),
  menuItemId: integer('menu_item_id')
    .notNull()
    .references(() => wingMenuItems.id),
  quantity: integer('quantity').notNull().default(1),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
