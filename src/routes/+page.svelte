<script>
  import SphereLoader from './home/sphere/sphereLoader.svelte';
  import { animatePageLoadLocalStorageKey } from '../store';
  import { onMount } from 'svelte';

  // Set move-up animation to occur after sphere loader
  onMount(() => {
    localStorage.setItem(animatePageLoadLocalStorageKey, "true")
  })

</script>

<div id="page">
  <SphereLoader />
</div>

<style>
  #page {
    height: 100vh;
    width: 100vw;
    background-color: var(--neutral-white);
  }
</style>
