<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import TagPill from '$lib/components/TagPill.svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  const STATUS_STORAGE_KEY = 'admin_blog_status_filter';

  let selectedStatus = 'all';
  let searchQuery = '';
  let isInitialized = false;

  // Create a map of series ID to series object for quick lookup
  $: seriesMap = new Map(data.series.map((s) => [s.id, s]));

  // Load saved status filter on mount
  onMount(() => {
    if (browser) {
      const saved = localStorage.getItem(STATUS_STORAGE_KEY);
      if (saved) {
        selectedStatus = saved;
      }
      isInitialized = true;
    }
  });

  // Save status filter when it changes
  $: if (browser && isInitialized && selectedStatus) {
    localStorage.setItem(STATUS_STORAGE_KEY, selectedStatus);
  }

  /**
   * @param {number} id
   */
  async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const response = await fetch('/admin/api/blog/posts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      alert('Error deleting post');
    }
  }

  /**
   * Format date for display
   * @param {Date | null} date
   * @returns {string}
   */
  function formatDate(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Filter and sort posts
  $: filteredAndSortedPosts = data.posts
    .filter((/** @type {BlogPost} */ post) => {
      // Filter by status
      const statusMatch =
        selectedStatus === 'all' || post.status === selectedStatus;

      // Filter by search query (title or excerpt)
      const searchMatch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && searchMatch;
    })
    .sort((/** @type {BlogPost} */ a, /** @type {BlogPost} */ b) => {
      // Sort by most recently updated
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
</script>

<div class="blog-admin">
  <div class="header">
    <h2>Blog Posts</h2>
    <a href="/admin/blog/new" class="button-primary">+ New Post</a>
  </div>

  <div class="filter-section">
    <div class="filter-group">
      <label for="search-input">Search:</label>
      <input
        type="text"
        id="search-input"
        placeholder="Search by title or excerpt..."
        bind:value={searchQuery}
      />
    </div>

    <div class="filter-group">
      <label for="status-filter">Status:</label>
      <select id="status-filter" bind:value={selectedStatus}>
        <option value="all">All Posts</option>
        <option value="published">Published</option>
        <option value="draft">Drafts</option>
      </select>
    </div>

    <span class="item-count">{filteredAndSortedPosts.length} posts</span>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Published</th>
          <th>Views</th>
          <th>Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredAndSortedPosts as post}
          <tr>
            <td>
              <div class="title-cell">
                <span class="post-title">{post.title}</span>
                {#if post.featuredOrder !== null}
                  <span class="badge badge-featured">Featured</span>
                {/if}
                {#if post.seriesId && seriesMap.get(post.seriesId)}
                  <span class="badge badge-series">{/** @type {any} */ (seriesMap.get(post.seriesId)).title}</span>
                {/if}
              </div>
              <div class="excerpt">{post.excerpt}</div>
              {#if post.tags && post.tags.length > 0}
                <div class="tags-row">
                  {#each post.tags.slice(0, 3) as tag}
                    <TagPill {tag} />
                  {/each}
                  {#if post.tags.length > 3}
                    <span class="more-tags">+{post.tags.length - 3} more</span>
                  {/if}
                </div>
              {/if}
            </td>
            <td>
              <span class="status-badge status-{post.status}">
                {post.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </td>
            <td>{formatDate(post.publishedAt)}</td>
            <td>{post.viewCount}</td>
            <td>{formatDate(post.updatedAt)}</td>
            <td>
              <div class="actions">
                <a href="/admin/blog/{post.id}" class="button-small">Edit</a>
                <button
                  on:click={() => deletePost(post.id)}
                  class="button-small button-danger"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    {#if filteredAndSortedPosts.length === 0 && data.posts.length > 0}
      <p class="empty-state">No posts match your filters.</p>
    {:else if data.posts.length === 0}
      <p class="empty-state">No blog posts yet. Create your first one!</p>
    {/if}
  </div>

  <!-- Quick links section -->
  <div class="quick-links">
    <h3>Manage</h3>
    <div class="link-group">
      <a href="/admin/blog/tags" class="link-card">
        <div class="link-title">Tags</div>
        <div class="link-count">{data.tags.length} tags</div>
      </a>
      <a href="/admin/blog/series" class="link-card">
        <div class="link-title">Series</div>
        <div class="link-count">{data.series.length} series</div>
      </a>
    </div>
  </div>
</div>

<style>
  .blog-admin {
    max-width: 1200px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  h2 {
    margin: 0;
    color: var(--main-blue-light);
  }

  .button-primary {
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
    padding: 10px 20px;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.5s;
  }

  .button-primary:hover {
    background-color: var(--main-blue-alt);
  }

  .filter-section {
    background-color: var(--neutral-gray);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .filter-section label {
    color: var(--neutral-black);
    font-weight: 500;
    white-space: nowrap;
  }

  .filter-section input[type='text'] {
    padding: 8px 12px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    background-color: var(--neutral-dark-gray);
    color: var(--neutral-black);
    font-size: 14px;
    min-width: 250px;
    transition: border-color 0.2s;
  }

  .filter-section input[type='text']:focus {
    outline: none;
    border-color: var(--main-blue);
  }

  .filter-section select {
    padding: 8px 12px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    background-color: var(--neutral-dark-gray);
    color: var(--neutral-black);
    font-size: 14px;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .filter-section select:focus {
    outline: none;
    border-color: var(--main-blue);
  }

  .item-count {
    color: var(--neutral-black);
    font-size: 14px;
    opacity: 0.7;
    margin-left: auto;
  }

  .table-container {
    background-color: var(--neutral-gray);
    border-radius: 10px;
    padding: 20px;
    overflow-x: auto;
    margin-bottom: 30px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    border-bottom: 2px solid var(--neutral-dark-gray-op-50);
  }

  th {
    text-align: left;
    padding: 12px;
    color: var(--neutral-black);
    font-weight: 600;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid var(--neutral-dark-gray-op-50);
    color: var(--neutral-black);
    vertical-align: top;
  }

  tbody tr {
    transition: background-color 0.2s;
  }

  tbody tr:hover {
    background-color: var(--neutral-dark-gray-op-10);
  }

  .title-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }

  .post-title {
    font-weight: 500;
  }

  .excerpt {
    font-size: 13px;
    color: var(--neutral-black);
    opacity: 0.6;
    margin-top: 4px;
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tags-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    flex-wrap: wrap;
  }

  .more-tags {
    font-size: 12px;
    color: var(--neutral-black);
    opacity: 0.6;
    font-style: italic;
  }

  .badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }

  .badge-featured {
    background-color: var(--main-blue);
    color: var(--neutral-white);
  }

  .badge-series {
    background-color: var(--neutral-dark-gray);
    color: var(--neutral-black);
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }

  .status-published {
    background-color: rgba(34, 124, 64, 0.2);
    color: var(--green);
  }

  .status-draft {
    background-color: rgba(255, 165, 0, 0.2);
    color: orange;
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  .button-small {
    padding: 6px 12px;
    border-radius: 5px;
    font-size: 14px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.5s;
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
  }

  .button-small:hover {
    background-color: var(--main-blue-alt);
  }

  .button-danger {
    background-color: var(--red);
  }

  .button-danger:hover {
    background-color: #cc0000;
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: var(--neutral-black);
    opacity: 0.5;
  }

  .quick-links {
    background-color: var(--neutral-gray);
    border-radius: 10px;
    padding: 20px;
  }

  .quick-links h3 {
    margin: 0 0 15px 0;
    color: var(--neutral-black);
    font-size: 18px;
  }

  .link-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }

  .link-card {
    background-color: var(--neutral-dark-gray);
    padding: 20px;
    border-radius: 10px;
    text-decoration: none;
    transition: background-color 0.2s;
  }

  .link-card:hover {
    background-color: var(--neutral-dark-gray-op-50);
  }

  .link-title {
    font-weight: 500;
    color: var(--main-blue-light);
    margin-bottom: 5px;
  }

  .link-count {
    font-size: 14px;
    color: var(--neutral-black);
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    .filter-group {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }

    .filter-section input[type='text'],
    .filter-section select {
      width: 100%;
      min-width: 0;
    }

    .item-count {
      margin-left: 0;
      width: 100%;
    }

    .actions {
      flex-direction: column;
    }

    .excerpt {
      max-width: 200px;
    }
  }
</style>