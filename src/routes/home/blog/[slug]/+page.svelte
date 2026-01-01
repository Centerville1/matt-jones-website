<script>
	import BlogPage from '../../../blogPage.svelte';
	import TagPill from '$lib/components/TagPill.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	/** @type {{ data: { post: BlogPost, tags: BlogTag[], series: BlogSeries | null, seriesPosts: BlogPost[], renderedContent: string } }} */
	let { data } = $props();

	// SEO metadata
	let baseUrl = $derived($page.url.origin);
	let currentUrl = $derived(`${baseUrl}${$page.url.pathname}`);
	let keywords = $derived(data.tags.map((tag) => tag.name));
	let socialImage = $derived(
		data.post.headerImagePath || `${baseUrl}/logo.png`
	);

	// Structured data for Google rich results
	let structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: data.post.title,
		description: data.post.excerpt,
		image: data.post.headerImagePath ? [data.post.headerImagePath] : [],
		datePublished: data.post.publishedAt ? new Date(data.post.publishedAt).toISOString() : new Date(data.post.createdAt).toISOString(),
		dateModified: new Date(data.post.updatedAt).toISOString(),
		author: {
			'@type': 'Person',
			name: data.post.authorName || 'Matt Jones',
			url: baseUrl
		},
		publisher: {
			'@type': 'Person',
			name: 'Matt Jones',
			url: baseUrl
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': currentUrl
		},
		keywords: keywords.join(', '),
		wordCount: data.renderedContent.split(/\s+/).length,
		...(data.post.readTimeMinutes && { timeRequired: `PT${data.post.readTimeMinutes}M` }),
		...(data.series && {
			isPartOf: {
				'@type': 'Series',
				name: data.series.title,
				position: data.post.seriesOrder || 1
			}
		})
	});

	/** @type {HTMLElement | undefined} */
	let contentContainer;

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
	 * Copy code to clipboard
	 * @param {string} code
	 */
	async function copyCode(code) {
		if (!browser) return;

		try {
			await navigator.clipboard.writeText(code);
			return true;
		} catch (err) {
			console.error('Failed to copy code:', err);
			return false;
		}
	}

	/**
	 * Add copy buttons to code blocks after rendering
	 */
	function addCopyButtons() {
		if (!browser || !contentContainer) return;

		const codeBlocks = contentContainer.querySelectorAll('pre');

		codeBlocks.forEach((pre) => {
			// Skip if copy button already exists
			if (pre.querySelector('.copy-button')) return;

			const codeElement = pre.querySelector('code');
			if (!codeElement) return;

			const code = codeElement.textContent || '';

			// Create copy button
			const button = document.createElement('button');
			button.className = 'copy-button';
			button.innerHTML = '📋';
			button.title = 'Copy code';
			button.type = 'button';

			button.addEventListener('click', async () => {
				const success = await copyCode(code);
				if (success) {
					button.innerHTML = '✓';
					button.classList.add('copied');
					setTimeout(() => {
						button.innerHTML = '📋';
						button.classList.remove('copied');
					}, 2000);
				}
			});

			pre.style.position = 'relative';
			pre.appendChild(button);
		});
	}

	$effect(() => {
		if (browser && data.renderedContent && contentContainer) {
			setTimeout(addCopyButtons, 0);
		}
	});
</script>

<svelte:head>
	{#if data.post.canonicalUrl}
		<link rel="canonical" href={data.post.canonicalUrl} />
	{/if}

	<!-- Article-specific meta tags -->
	<meta property="article:published_time" content={data.post.publishedAt ? new Date(data.post.publishedAt).toISOString() : new Date(data.post.createdAt).toISOString()} />
	<meta property="article:modified_time" content={new Date(data.post.updatedAt).toISOString()} />
	<meta property="article:author" content={data.post.authorName || 'Matt Jones'} />
	{#each data.tags as tag}
		<meta property="article:tag" content={tag.name} />
	{/each}

	<!-- Structured data for rich results -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</scr${'ipt'}>`}
</svelte:head>

<SEO
	title={data.post.title}
	description={data.post.excerpt}
	url={currentUrl}
	type="article"
	image={socialImage}
	{keywords}
	siteName="Matt Jones"
	author={data.post.authorName || 'Matt Jones'}
/>

<BlogPage
	title={data.post.title}
	subtitle=""
	background={data.post.background || 'blocks'}
	signature={false}
>
	<div class="back-link top">
		<a href="/home/blog">← All posts</a>
	</div>

	<article class="blog-post">
		<header class="post-header">
			{#if data.post.headerImagePath}
				<div class="header-image">
					<img src={data.post.headerImagePath} alt={data.post.title} />
				</div>
			{/if}

			<div class="post-meta">
				<div class="meta-row">
					{#if data.post.authorName}
						<span class="author">By {data.post.authorName}</span>
					{/if}
					<span class="date">{formatDate(data.post.publishedAt)}</span>
					{#if data.post.readTimeMinutes}
						<span class="read-time">{data.post.readTimeMinutes} min read</span>
					{/if}
					{#if data.post.viewCount > 0}
						<span class="views">{data.post.viewCount} views</span>
					{/if}
				</div>

				{#if data.tags.length > 0}
					<div class="tags-row">
						{#each data.tags as tag}
							<a href="/home/blog?tag={tag.slug}" class="tag-link">
								<TagPill {tag} />
							</a>
						{/each}
					</div>
				{/if}

				{#if data.series}
					<div class="series-badge">
						<a href="/home/blog?series={data.series.slug}">
							Part {data.post.seriesOrder || 1} of series: {data.series.title}
						</a>
					</div>
				{/if}
			</div>
		</header>

		<div class="post-body">
			<div class="blog-post-content {data.post.background || ''}" bind:this={contentContainer}>
				{@html data.renderedContent}
			</div>
		</div>

		{#if data.seriesPosts.length > 1}
			<aside class="series-navigation">
				<h3>More in this series: {data.series?.title}</h3>
				<ol class="series-list">
					{#each data.seriesPosts as seriesPost}
						<li class:current={seriesPost.id === data.post.id}>
							{#if seriesPost.id === data.post.id}
								<span class="current-post">{seriesPost.title} (Current)</span>
							{:else}
								<a href="/home/blog/{seriesPost.slug}">{seriesPost.title}</a>
							{/if}
						</li>
					{/each}
				</ol>
				<div class="back-link bottom">
					<a href="/home/blog">← All posts</a>
				</div>
			</aside>
		{:else}
			<div class="back-link bottom">
				<a href="/home/blog">← All posts</a>
			</div>
		{/if}
	</article>
</BlogPage>

<style>
	.blog-post {
		max-width: 1000px;
		margin: 0 auto;
	}

	.post-header {
		margin-bottom: 2rem;
	}

	.header-image {
		width: 100%;
		max-height: 400px;
		overflow: hidden;
		border-radius: 12px;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.header-image img {
		width: 100%;
		max-height: 400px;
		object-fit: contain;
	}

	.post-meta {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.meta-row {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		font-size: 0.9rem;
		color: var(--neutral-black);
		opacity: 0.85;
	}

	.meta-row > span {
		display: flex;
		align-items: center;
	}

	.author {
		font-weight: 600;
		color: var(--neutral-black);
		opacity: 1;
	}

	.tags-row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tag-link {
		text-decoration: none;
	}

	.series-badge {
		background: var(--main-blue);
		color: var(--neutral-white);
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-size: 0.95rem;
	}

	.series-badge a {
		color: var(--neutral-white);
		text-decoration: none;
		font-weight: 500;
	}

	.series-badge a:hover {
		text-decoration: underline;
	}

	.excerpt {
		font-size: 1.125rem;
		line-height: 1.7;
		color: var(--neutral-black);
		font-style: italic;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.05);
		border-radius: 8px;
		text-indent: 0;
		opacity: 0.9;
	}

	.post-body {
		margin: 2rem 0;
	}

	.series-navigation {
		margin-top: 3rem;
		padding: 1.5rem;
		background: var(--neutral-white);
		border-radius: 12px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.series-navigation h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--neutral-black);
	}

	.series-list {
		list-style: decimal;
		padding-left: 1.5rem;
		margin: 0;
	}

	.series-list li {
		margin: 0.75rem 0;
		line-height: 1.6;
	}

	.series-list li.current {
		font-weight: 600;
	}

	.series-list a {
		color: var(--main-blue);
		text-decoration: none;
	}

	.series-list a:hover {
		text-decoration: underline;
	}

	.current-post {
		color: var(--neutral-black);
	}

	.back-link.top {
		margin-bottom: 2rem;
	}

	.back-link.bottom {
		margin-top: 2rem;
	}

	.series-navigation .back-link.bottom {
		margin-top: 1rem;
		padding-top: 0;
		border-top: none;
	}

	.back-link a {
		color: var(--main-blue);
		text-decoration: none;
		font-weight: 500;
		font-size: 1.1rem;
	}

	.back-link a:hover {
		text-decoration: underline;
	}

	/* Blog post content styles */
	.blog-post-content {
		padding: 0;
		min-height: 200px;
	}

	.blog-post-content :global(h1) {
		font-size: 2em;
		font-weight: bold;
		margin-top: 0.67em;
		margin-bottom: 0.67em;
		color: var(--neutral-black);
	}

	.blog-post-content :global(h2) {
		font-size: 1.5em;
		font-weight: bold;
		margin-top: 0.83em;
		margin-bottom: 0.83em;
		color: var(--neutral-black);
	}

	.blog-post-content :global(h3) {
		font-size: 1.17em;
		font-weight: bold;
		margin-top: 1em;
		margin-bottom: 1em;
		color: var(--neutral-black);
	}

	.blog-post-content :global(p) {
		margin: 1em 0;
		line-height: 1.6;
		color: var(--neutral-black);
		text-indent: 0;
	}

	.blog-post-content :global(ul),
	.blog-post-content :global(ol) {
		padding-left: 2em;
		margin: 1em 0;
	}

	.blog-post-content :global(li) {
		margin: 0.5em 0;
		line-height: 1.6;
	}

	.blog-post-content :global(blockquote) {
		border-left: 4px solid var(--main-blue);
		padding-left: 1em;
		margin: 1.5em 0;
		font-style: italic;
		color: var(--neutral-black);
		opacity: 0.9;
	}

	.blog-post-content :global(code) {
		background-color: var(--neutral-dark-gray);
		padding: 2px 6px;
		border-radius: 3px;
		font-family: 'Courier New', Consolas, Monaco, monospace;
		font-size: 0.9em;
		color: var(--neutral-white);
	}

	.blog-post-content :global(pre) {
		border-radius: 8px;
		overflow-x: auto;
		margin: 1.5em 0;
		padding: 2em;
		position: relative;
	}

	.blog-post-content :global(pre code) {
		background-color: transparent;
		padding: 0;
		font-size: 0.95em;
	}

	.blog-post-content :global(.copy-button) {
		position: absolute;
		top: 0.75em;
		right: 0.75em;
		background: var(--neutral-gray);
		border: 1px solid var(--neutral-dark-gray-op-50);
		border-radius: 6px;
		padding: 6px 10px;
		cursor: pointer;
		font-size: 1.2em;
		transition: all 0.2s;
		opacity: 0.7;
	}

	.blog-post-content :global(.copy-button:hover) {
		opacity: 1;
		background: var(--neutral-white);
	}

	.blog-post-content :global(.copy-button.copied) {
		background: var(--main-blue);
		color: var(--neutral-white);
		border-color: var(--main-blue);
		opacity: 1;
	}

	.blog-post-content :global(.blog-link) {
		color: var(--main-blue);
		text-decoration: underline;
		transition: color 0.2s;
	}

	.blog-post-content :global(.blog-link:hover) {
		color: var(--main-blue-light);
	}

	.blog-post-content :global(.blog-image) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin: 1.5em 0;
		display: block;
	}

	/* Image resize wrapper styles */
	.blog-post-content :global(.image-resize-wrapper) {
		margin: 1.5em 0;
	}

	.blog-post-content :global(.image-resize-container) {
		max-width: 100%;
	}

	.blog-post-content :global(.image-resize-container .blog-image) {
		width: 100%;
		max-width: none;
	}

	.blog-post-content :global(hr) {
		border: none;
		border-top: 2px solid var(--neutral-dark-gray-op-50);
		margin: 2em 0;
	}

	@media screen and (max-width: 440px) {
		.meta-row {
			flex-direction: column;
			gap: 0.5rem;
		}

		.header-image {
			max-height: 250px;
		}

		.excerpt {
			font-size: 1rem;
		}

		.series-navigation {
			padding: 1rem;
		}

		.blog-post-content {
			padding: 0;
		}

		.blog-post-content :global(h1) {
			font-size: 1.75em;
		}

		.blog-post-content :global(h2) {
			font-size: 1.4em;
		}

		.blog-post-content :global(h3) {
			font-size: 1.1em;
		}

		.blog-post-content :global(pre) {
			padding: 1.5em;
			font-size: 0.9em;
		}

		.blog-post-content :global(.copy-button) {
			top: 0.5em;
			right: 0.5em;
			padding: 4px 8px;
			font-size: 1em;
		}
	}
</style>
