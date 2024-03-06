<script>
  import { onMount } from 'svelte';
  import { createPalette } from './palette';
  import { browser } from '$app/environment';
  import { themeMode } from '../store';

  /**
   * @param {string} themeName
   */
  const loadColors = (themeName) => {
    if (!browser) return;

    /**
     * @type Array<{varName: String, color: String}>
     */
    // @ts-ignore
    const theme = createPalette()[themeName];
    for (let i = 0; i < theme.length; i++) {
      const color = theme[i];
      document.documentElement.style.setProperty(color.varName, color.color);
    }
  };

  themeMode.subscribe((value) => {
    if (!browser) return;
    loadColors(value);
  });

  onMount(
    themeMode.subscribe((value) => {
      loadColors(value);
    }),
  );
</script>
