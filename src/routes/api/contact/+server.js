import { json, error } from '@sveltejs/kit';
import { createContactSubmission } from '$lib/db/queries/contact-submissions.js';

/**
 * POST /api/contact
 * Submit a contact form
 */
export async function POST({ request }) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      throw error(400, 'Name is required');
    }

    if (!data.email || typeof data.email !== 'string' || data.email.trim() === '') {
      throw error(400, 'Email is required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw error(400, 'Invalid email format');
    }

    if (!data.message || typeof data.message !== 'string' || data.message.trim() === '') {
      throw error(400, 'Message is required');
    }

    // Validate length constraints
    if (data.name.length > 100) {
      throw error(400, 'Name must be 100 characters or less');
    }

    if (data.email.length > 255) {
      throw error(400, 'Email must be 255 characters or less');
    }

    if (data.subject && data.subject.length > 200) {
      throw error(400, 'Subject must be 200 characters or less');
    }

    if (data.message.length > 5000) {
      throw error(400, 'Message must be 5000 characters or less');
    }

    // Create the submission
    const submission = await createContactSubmission({
      name: data.name.trim(),
      email: data.email.trim(),
      subject: data.subject?.trim() || null,
      message: data.message.trim(),
    });

    return json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
      id: submission.id,
    }, { status: 201 });

  } catch (err) {
    console.error('Contact form submission error:', err);

    // Re-throw SvelteKit errors
    if (err && typeof err === 'object' && 'status' in err) {
      throw err;
    }

    // Generic error
    throw error(500, 'Failed to submit contact form. Please try again later.');
  }
}
