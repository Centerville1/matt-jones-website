<script>
  import SphereLoader from './home/sphere/sphereLoader.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { animatePageLoadLocalStorageKey } from '../store';
  import { onMount } from 'svelte';

  // Set move-up animation to occur after sphere loader
  onMount(() => {
    localStorage.setItem(animatePageLoadLocalStorageKey, 'true');
  });
</script>

<SEO
  title="Welcome"
  description="Portfolio of Matt Jones - Software developer, web designer, and creative technologist"
  keywords={[
    'Matt Jones',
    'portfolio',
    'web developer',
    'software engineer',
    'creative coding',
  ]}
/>

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
