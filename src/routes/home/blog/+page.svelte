<script>
	import BlogPage from '../../blogPage.svelte';
	import TagPill from '$lib/components/TagPill.svelte';
	import { goto } from '$app/navigation';

	/** @type {{ data: { posts: BlogPost[], featuredPosts: BlogPost[], tags: BlogTag[], series: BlogSeries[], selectedTag: BlogTag | null, selectedSeries: BlogSeries | null } }} */
	let { data } = $props();

	/**
	 * Format a date for display
	 * @param {Date | string | null} date
	 * @returns {string}
	 */
	function formatDate(date) {
		if (!date) return '';
		const d = new Date(date);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
				: 'Blog'
	);

	let pageSubtitle = $derived(
		data.selectedTag
			? data.selectedTag.description || ''
			: data.selectedSeries
				? data.selectedSeries.description || ''
				: 'Thoughts, tutorials, and explorations'
	);
</script>

<svelte:head>
	<title>{pageTitle} - Matt Jones</title>
	<meta name="description" content={pageSubtitle} />
</svelte:head>

<BlogPage title={pageTitle} subtitle={pageSubtitle} background="blocks">
	{#if data.featuredPosts.length > 0}
		<section class="featured-section">
			<h2>Featured Posts</h2>
			<div class="featured-grid">
				{#each data.featuredPosts as post}
					<a href="/home/blog/{post.slug}" class="featured-card">
						{#if post.headerImageId}
							<div class="card-image">
								<img src="/api/images/{post.headerImageId}" alt={post.title} />
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
			<h2>{data.selectedTag || data.selectedSeries ? 'Filtered Posts' : 'All Posts'}</h2>
			<div class="filters">
				{#if data.selectedTag || data.selectedSeries}
					<button onclick={clearFilters} class="clear-filters">Clear Filters</button>
				{:else}
					{#if data.series.length > 0}
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
							{#if post.headerImageId}
								<div class="post-image">
									<img src="/api/images/{post.headerImageId}" alt={post.title} />
								</div>
							{/if}
							<div class="post-content">
								<h3>{post.title}</h3>
								<p class="excerpt">{post.excerpt}</p>
								<div class="meta">
									<span class="date">{formatDate(post.publishedAt)}</span>
									{#if post.readTimeMinutes}
										<span class="read-time">{post.readTimeMinutes} min read</span>
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
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.featured-card {
		display: flex;
		flex-direction: column;
		background: var(--neutral-white);
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s, box-shadow 0.3s;
		text-decoration: none;
		color: inherit;
	}

	.featured-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
	}

	.card-image {
		width: 100%;
		height: 200px;
		overflow: hidden;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-content {
		padding: 1.5rem;
	}

	.card-content h3 {
		margin: 0 0 0.75rem 0;
		font-size: 1.5rem;
		color: var(--neutral-black);
	}

	.excerpt {
		margin: 0 0 1rem 0;
		color: var(--neutral-dark-gray);
		line-height: 1.6;
		text-indent: 0;
	}

	.meta {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: var(--neutral-dark-gray);
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
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.post-card {
		background: var(--neutral-white);
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.3s;
	}

	.post-card:hover {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.post-link {
		display: flex;
		gap: 1.5rem;
		text-decoration: none;
		color: inherit;
		padding: 1.5rem;
	}

	.post-image {
		flex-shrink: 0;
		width: 200px;
		height: 150px;
		overflow: hidden;
		border-radius: 8px;
	}

	.post-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.post-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.post-content h3 {
		margin: 0 0 0.75rem 0;
		font-size: 1.5rem;
		color: var(--neutral-black);
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
