<script>
  // import global styles on all pages.
  import '../global.css';
  import ModeSwitcher from './modeSwitcher.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { inject } from '@vercel/analytics';
  import { page } from '$app/stores';

  // Track public site analytics using Vercel
  inject();

  /** @type {import('./$types').LayoutData} */
  export let data;

  // Get base URL for canonical and OG tags
  $: baseUrl = $page.url.origin;
  $: currentPath = $page.url.pathname;
  $: canonicalUrl = `${baseUrl}${currentPath}`;

  // Extract metadata from server data
  $: siteName = data?.siteMetadata?.site_title || 'Matt Jones - Portfolio';
  $: siteDescription =
    data?.siteMetadata?.site_description ||
    'Personal portfolio website showcasing web development projects and experience';
  $: ownerName = data?.siteMetadata?.owner_name || 'Matt Jones';
  $: socialImage = data?.siteMetadata?.social_preview_image || '/logo.png';

  // Construct full image URL for social media
  $: defaultImage = `${baseUrl}${socialImage}`;
</script>

<!-- Default SEO for all pages -->
<SEO
  {siteName}
  description={siteDescription}
  url={canonicalUrl}
  author={ownerName}
  image={defaultImage}
/>

<!-- Run theme mode switcher script (no visual component) -->
<ModeSwitcher />
<slot />
