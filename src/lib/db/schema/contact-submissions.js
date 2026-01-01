import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Contact submissions table - stores form submissions from the contact form
 * @typedef {import('./types').ContactSubmission} ContactSubmission
 */
export const contactSubmissions = sqliteTable('contact_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Contact information
  name: text('name').notNull(),
  email: text('email').notNull(),

  // Message content
  subject: text('subject'),
  message: text('message').notNull(),

  // Status tracking
  status: text('status').notNull().default('unread'), // unread, read, archived

  // Admin notes
  notes: text('notes'),

  // Timestamps
  submittedAt: integer('submitted_at', { mode: 'timestamp' }).notNull(),
  readAt: integer('read_at', { mode: 'timestamp' }),
});
