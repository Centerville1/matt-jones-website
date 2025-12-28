<script>
  /**
   * SEO Component - Manages all meta tags for search engines and social media
   *
   * @component
   * @param {string} [title] - Page-specific title (will be appended to site title)
   * @param {string} [description] - Page description for meta tags
   * @param {string} [image] - Absolute URL to preview image for social media
   * @param {string} [url] - Canonical URL for this page
   * @param {string} [type='website'] - OpenGraph type (website, article, etc.)
   * @param {string} [siteName] - Override site name
   * @param {string} [author] - Content author name
   * @param {string[]} [keywords] - SEO keywords for this page
   * @param {boolean} [noindex=false] - Prevent indexing this page
   * @param {string} [twitterCard='summary_large_image'] - Twitter card type
   */

  export let title = '';
  export let description = '';
  export let image = '';
  export let url = '';
  export let type = 'website';
  export let siteName = '';
  export let author = '';
  /** @type {string[]} */
  export let keywords = [];
  export let noindex = false;
  export let twitterCard = 'summary_large_image';

  // Construct full title (page title + site name)
  $: fullTitle = title ? `${title} | ${siteName}` : siteName;
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>{fullTitle}</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
  {#if author}
    <meta name="author" content={author} />
  {/if}
  {#if keywords.length > 0}
    <meta name="keywords" content={keywords.join(', ')} />
  {/if}
  {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
  {/if}

  <!-- Canonical URL -->
  {#if url}
    <link rel="canonical" href={url} />
  {/if}

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:title" content={fullTitle} />
  {#if description}
    <meta property="og:description" content={description} />
  {/if}
  {#if url}
    <meta property="og:url" content={url} />
  {/if}
  {#if siteName}
    <meta property="og:site_name" content={siteName} />
  {/if}
  {#if image}
    <meta property="og:image" content={image} />
    <meta property="og:image:alt" content={`Preview image for ${fullTitle}`} />
  {/if}

  <!-- Twitter Card -->
  <meta name="twitter:card" content={twitterCard} />
  <meta name="twitter:title" content={fullTitle} />
  {#if description}
    <meta name="twitter:description" content={description} />
  {/if}
  {#if image}
    <meta name="twitter:image" content={image} />
    <meta name="twitter:image:alt" content={`Preview image for ${fullTitle}`} />
  {/if}

  <!-- Additional SEO -->
  <meta name="format-detection" content="telephone=no" />
  <meta name="theme-color" content="#1a1a1a" />
</svelte:head>
