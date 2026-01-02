<script>
  import { onMount } from 'svelte';
  import { createPalette } from './palette';
  import { browser } from '$app/environment';
  import { themeMode } from '../store';

  const THEME_STORAGE_KEY = 'themeMode';

  /**
   * @param {string} themeName
   */
  const loadColors = (themeName) => {
    if (!browser) return;

    // @ts-ignore - dynamic theme access
    const themeData = createPalette()[themeName];
    if (!themeData) return;

    /** @type Array<{varName: string, color: string}> */
    const colors = themeData.colors;
    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      document.documentElement.style.setProperty(color.varName, color.color);
    }
  };

  // Load saved theme and subscribe to changes
  onMount(() => {
    if (!browser) return;

    // First, load the saved theme from localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const availableThemes = Object.keys(createPalette());

    let currentTheme = '';
    const unsubscribe = themeMode.subscribe((value) => {
      currentTheme = value;
    });
    unsubscribe();

    if (savedTheme && availableThemes.includes(savedTheme)) {
      themeMode.set(savedTheme);
    } else {
      // No saved theme, apply the default from the store
      loadColors(currentTheme);
    }

    // Subscribe to future theme changes and save to localStorage
    return themeMode.subscribe((value) => {
      loadColors(value);
      localStorage.setItem(THEME_STORAGE_KEY, value);
    });
  });
</script>
