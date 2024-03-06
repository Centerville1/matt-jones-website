<script>
  // import global styles on all pages.
  import '../global.css';
  import ModeSwitcher from './modeSwitcher.svelte';
  import { inject } from '@vercel/analytics';

  inject();
</script>

<ModeSwitcher />
<slot />
