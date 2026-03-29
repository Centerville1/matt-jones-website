import { requireWingsAuth } from '$lib/server/guards.js';
import {
  getAllSessions,
  getAttendeesForSession,
  getOrderEntriesForSession,
  getAttendanceStats,
  getWingCountsByPerson,
} from '$lib/db/queries/wings.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  requireWingsAuth(locals);

  const [sessions, attendanceStats, wingStats] = await Promise.all([
    getAllSessions(),
    getAttendanceStats(),
    getWingCountsByPerson(),
  ]);

  // Enrich sessions with attendee names and total wings
  const enrichedSessions = await Promise.all(
    sessions.map(async (s) => {
      const [attendees, entries] = await Promise.all([
        getAttendeesForSession(s.id),
        getOrderEntriesForSession(s.id),
      ]);
      const totalWings = entries.reduce((sum, e) => sum + e.quantity, 0);
      return {
        ...s,
        attendees: attendees.map((a) => a.personName),
        totalWings,
      };
    }),
  );

  return {
    sessions: enrichedSessions,
    attendanceStats,
    wingStats,
  };
}
