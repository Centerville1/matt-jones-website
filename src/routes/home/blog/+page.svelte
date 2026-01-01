<script>
  import BlogPage from '../../blogPage.svelte';
  import TagPill from '$lib/components/TagPill.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  /** @type {{ data: { posts: BlogPost[], featuredPosts: BlogPost[], tags: BlogTag[], series: BlogSeries[], selectedTag: BlogTag | null, selectedSeries: BlogSeries | null } }} */
  let { data } = $props();

  // SEO reactive variables
  let baseUrl = $derived($page.url.origin);
  let currentUrl = $derived(
    `${$page.url.origin}${$page.url.pathname}${$page.url.search}`,
  );

  /**
   * Format a date for display
   * @param {Date | string | null} date
   * @returns {string}
   */
  function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Navigate to filtered view
   * @param {'tag' | 'series'} type
   * @param {string} slug
   */
  function filterBy(type, slug) {
    goto(`/home/blog?${type}=${slug}`);
  }

  /**
   * Clear all filters
   */
  function clearFilters() {
    goto('/home/blog');
  }

  // Build page title and subtitle based on filters
  let pageTitle = $derived(
    data.selectedTag
      ? `Tag: ${data.selectedTag.name}`
      : data.selectedSeries
        ? `Series: ${data.selectedSeries.title}`
        : 'Blog',
  );

  let pageSubtitle = $derived(
    data.selectedTag
      ? data.selectedTag.description || ''
      : data.selectedSeries
        ? data.selectedSeries.description || ''
        : 'Thoughts, tutorials, and explorations',
  );

  // Generate keywords from tags
  let keywords = $derived(
    data.selectedTag
      ? [data.selectedTag.name, 'blog', 'tutorial', 'web development']
      : data.tags.slice(0, 10).map((tag) => tag.name),
  );

  // Use first featured post image or default
  let socialImage = $derived(
    data.featuredPosts.length > 0 && data.featuredPosts[0].headerImagePath
      ? data.featuredPosts[0].headerImagePath
      : `${baseUrl}/logo.png`,
  );
</script>

<svelte:head>
  <!-- RSS feed link for blog readers -->
  <link
    rel="alternate"
    type="application/rss+xml"
    title="Matt Jones - Blog RSS Feed"
    href="/home/blog/rss.xml"
  />
</svelte:head>

<SEO
  title={pageTitle}
  description={pageSubtitle}
  url={currentUrl}
  type="website"
  image={socialImage}
  {keywords}
  siteName="Matt Jones"
  author="Matt Jones"
/>

<BlogPage title={pageTitle} subtitle={pageSubtitle} background="blocks">
  {#if data.featuredPosts.length > 0}
    <section class="featured-section">
      <h2>Featured Posts</h2>
      <div class="featured-grid">
        {#each data.featuredPosts as post}
          <a href="/home/blog/{post.slug}" class="featured-card">
            {#if post.headerImagePath}
              <div class="card-image">
                <img src={post.headerImagePath} alt={post.title} />
              </div>
            {/if}
            <div class="card-content">
              <h3>{post.title}</h3>
              <p class="excerpt">{post.excerpt}</p>
              <div class="meta">
                <span class="date">{formatDate(post.publishedAt)}</span>
                {#if post.readTimeMinutes}
                  <span class="read-time">{post.readTimeMinutes} min read</span>
                {/if}
              </div>
            </div>
          </a>
        {/each}
      </div>
    </section>
  {/if}

  <section class="all-posts-section">
    <div class="section-header">
      <h2>
        {data.selectedTag || data.selectedSeries
          ? 'Filtered Posts'
          : 'All Posts'}
      </h2>
      <div class="filters">
        {#if data.selectedTag || data.selectedSeries}
          <button onclick={clearFilters} class="clear-filters"
            >Clear Filters</button
          >
        {:else if data.series.length > 0}
          <select
            onchange={(e) => {
              const select = /** @type {HTMLSelectElement} */ (e.target);
              if (select.value) filterBy('series', select.value);
            }}
            class="filter-select"
            aria-label="Filter by series"
          >
            <option value="">All Series</option>
            {#each data.series as series}
              <option value={series.slug}>{series.title}</option>
            {/each}
          </select>
        {/if}
      </div>
    </div>

    {#if data.posts.length === 0}
      <p class="no-posts">No posts found.</p>
    {:else}
      <div class="posts-list">
        {#each data.posts as post}
          <article class="post-card">
            <a href="/home/blog/{post.slug}" class="post-link">
              {#if post.headerImagePath}
                <div class="post-image">
                  <img src={post.headerImagePath} alt={post.title} />
                </div>
              {/if}
              <div class="post-content">
                <h3>{post.title}</h3>
                <p class="excerpt">{post.excerpt}</p>
                <div class="meta">
                  <span class="date">{formatDate(post.publishedAt)}</span>
                  {#if post.readTimeMinutes}
                    <span class="read-time"
                      >{post.readTimeMinutes} min read</span
                    >
                  {/if}
                  {#if post.viewCount > 0}
                    <span class="views">{post.viewCount} views</span>
                  {/if}
                </div>
              </div>
            </a>
          </article>
        {/each}
      </div>
    {/if}
  </section>
</BlogPage>

<style>
  .featured-section {
    margin-bottom: 3rem;
  }

  .featured-section h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: var(--neutral-black);
  }

  .featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .featured-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--neutral-white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 2px solid transparent;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease,
      border-color 0.3s ease;
    text-decoration: none;
    color: inherit;
  }

  .featured-card:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    border-color: var(--main-blue);
  }

  .card-image {
    width: 100%;
    height: 220px;
    overflow: hidden;
    background: var(--neutral-white);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
  }

  .card-content h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.5rem;
    color: var(--neutral-black);
    line-height: 1.3;
  }

  .card-content .excerpt {
    flex: 1;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-content .meta {
    margin-top: auto;
  }

  .excerpt {
    margin: 0 0 1rem 0;
    color: var(--neutral-black);
    line-height: 1.6;
    text-indent: 0;
    opacity: 0.7;
  }

  .meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--neutral-black);
    opacity: 0.7;
    flex-wrap: wrap;
  }

  .all-posts-section h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: var(--neutral-black);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .filters {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .filter-select {
    padding: 0.5rem 1rem;
    border: 1px solid var(--neutral-dark-gray);
    border-radius: 8px;
    background: var(--neutral-white);
    color: var(--neutral-black);
    font-size: 1rem;
    cursor: pointer;
  }

  .clear-filters {
    padding: 0.5rem 1rem;
    background: var(--neutral-dark-gray);
    color: var(--neutral-white);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .clear-filters:hover {
    background: var(--neutral-black);
  }

  .no-posts {
    text-align: center;
    color: var(--neutral-dark-gray);
    padding: 2rem;
    font-size: 1.125rem;
  }

  .posts-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
  }

  .post-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--neutral-white);
    border-radius: 12px 12px 0 0;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 2px solid transparent;
    border-bottom: 1px solid var(--main-blue);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease,
      border-color 0.3s ease;
  }

  .post-card:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
  }

  .post-link {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }

  .post-image {
    width: 100%;
    height: 220px;
    overflow: hidden;
    background: var(--neutral-white);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .post-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .post-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
  }

  .post-content h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.5rem;
    color: var(--neutral-black);
    line-height: 1.3;
  }

  .post-content .excerpt {
    flex: 1;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .post-content .meta {
    margin-top: auto;
  }

  @media screen and (max-width: 440px) {
    .featured-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .post-link {
      flex-direction: column;
      gap: 1rem;
    }

    .post-image {
      width: 100%;
      height: 200px;
    }

    .card-content h3,
    .post-content h3 {
      font-size: 1.25rem;
    }
  }
</style>
