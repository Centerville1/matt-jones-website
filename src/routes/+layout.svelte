<script>
  // import global styles on all pages.
  import '../global.css';
  import ModeSwitcher from './modeSwitcher.svelte';
  import { inject } from '@vercel/analytics';

  // Track public site analytics using Vercel
  inject();
</script>

<!-- Run theme mode switcher script (no visual component) -->
<ModeSwitcher />
<slot />
