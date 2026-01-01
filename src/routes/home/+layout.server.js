import { getLatestResume } from '$lib/db/queries/files.js';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  const resume = await getLatestResume();

  return {
    resume,
  };
}
