import { writable } from "svelte/store";

export const themeMode = writable('dark');

export const animatePageLoadLocalStorageKey = "animatePageLoad";