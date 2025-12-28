/**
 * A simple media query utility using Svelte 5 runes and native matchMedia API
 * @param {string} query - CSS media query string (e.g., "(min-width: 440px)")
 * @returns {{matches: boolean}} - Reactive object with matches property
 */
export function useMediaQuery(query) {
	let matches = $state(false);

	if (typeof window !== 'undefined') {
		const mediaQuery = window.matchMedia(query);
		matches = mediaQuery.matches;

		const handler = (/** @type {MediaQueryListEvent} */ e) => {
			matches = e.matches;
		};

		mediaQuery.addEventListener('change', handler);

		// Cleanup handled by Svelte when component unmounts
	}

	return {
		get matches() {
			return matches;
		}
	};
}
