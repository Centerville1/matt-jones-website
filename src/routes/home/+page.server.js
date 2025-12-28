import { getBios } from '$lib/db/queries/bios.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  return {
    bios: await getBios(),
  };
}
