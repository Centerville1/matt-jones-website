/**
 * Contact submission-related database queries
 */

import { db } from '../index.js';
import { contactSubmissions } from '../schema/index.js';
import { eq, desc } from 'drizzle-orm';

/**
 * Get all contact submissions (ordered by most recent first)
 * @returns {Promise<ContactSubmission[]>}
 */
export async function getAllContactSubmissions() {
  /** @type {ContactSubmission[]} */
  const submissions = /** @type {ContactSubmission[]} */ (
    await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.submittedAt))
      .all()
  );
  return submissions;
}

/**
 * Get unread contact submissions only
 * @returns {Promise<ContactSubmission[]>}
 */
export async function getUnreadContactSubmissions() {
  /** @type {ContactSubmission[]} */
  const submissions = /** @type {ContactSubmission[]} */ (
    await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.status, 'unread'))
      .orderBy(desc(contactSubmissions.submittedAt))
      .all()
  );
  return submissions;
}

/**
 * Get a single contact submission by ID
 * @param {number} id - Submission ID
 * @returns {Promise<ContactSubmission | undefined>}
 */
export async function getContactSubmissionById(id) {
  /** @type {ContactSubmission | undefined} */
  const submission = /** @type {ContactSubmission | undefined} */ (
    await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id))
      .get()
  );
  return submission;
}

/**
 * Create a new contact submission
 * @param {{ name: string, email: string, subject?: string, message: string }} data - Submission data
 * @returns {Promise<ContactSubmission>} Created submission with ID
 */
export async function createContactSubmission(data) {
  const now = new Date();

  const [submission] = await db
    .insert(contactSubmissions)
    .values({
      name: data.name,
      email: data.email,
      subject: data.subject || null,
      message: data.message,
      status: 'unread',
      notes: null,
      submittedAt: now,
      readAt: null,
    })
    .returning();

  return /** @type {ContactSubmission} */ (submission);
}

/**
 * Update submission status to 'read' and set readAt timestamp
 * @param {number} id - Submission ID
 * @returns {Promise<void>}
 */
export async function markContactSubmissionAsRead(id) {
  const now = new Date();
  await db
    .update(contactSubmissions)
    .set({ status: 'read', readAt: now })
    .where(eq(contactSubmissions.id, id));
}

/**
 * Update submission status
 * @param {number} id - Submission ID
 * @param {string} status - New status (unread, read, archived)
 * @returns {Promise<void>}
 */
export async function updateContactSubmissionStatus(id, status) {
  await db
    .update(contactSubmissions)
    .set({ status })
    .where(eq(contactSubmissions.id, id));
}

/**
 * Update admin notes for a submission
 * @param {number} id - Submission ID
 * @param {string} notes - Admin notes
 * @returns {Promise<void>}
 */
export async function updateContactSubmissionNotes(id, notes) {
  await db
    .update(contactSubmissions)
    .set({ notes })
    .where(eq(contactSubmissions.id, id));
}

/**
 * Delete a contact submission
 * @param {number} id - Submission ID
 * @returns {Promise<void>}
 */
export async function deleteContactSubmission(id) {
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
}
