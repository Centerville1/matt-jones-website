<script>
  import { onMount } from 'svelte';
  import { palette } from './palette';

  /**
   * @param {string} themeName
   */
  function loadColors(themeName) {
    /**
     * @type Array<{varName: String, color: String}>
     */
    // @ts-ignore
    const theme = palette[themeName];
    for (let i = 0; i < theme.length; i++) {
      const color = theme[i];
      document.documentElement.style.setProperty(color.varName, color.color);
    }
  }

  onMount(() => {
    loadColors('dark');
  });
</script>
