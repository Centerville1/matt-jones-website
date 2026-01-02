import { highlightCode } from './syntax-highlighter.js';

/**
 * Renders TipTap JSON content to HTML (async for syntax highlighting)
 * @param {any} json - TipTap JSON content
 * @param {boolean} enableSyntaxHighlighting - Whether to use Shiki for code blocks
 * @returns {Promise<string>} HTML string
 */
export async function renderTiptapJSON(json, enableSyntaxHighlighting = true) {
	if (!json) return '';

	return await renderNode(json, enableSyntaxHighlighting);
}

/**
 * Recursively render a TipTap node to HTML
 * @param {any} node
 * @param {boolean} enableSyntaxHighlighting
 * @returns {Promise<string>}
 */
async function renderNode(node, enableSyntaxHighlighting = true) {
	if (!node) return '';

	// Handle text nodes
	if (node.type === 'text') {
		let text = escapeHtml(node.text);

		// Apply marks
		if (node.marks && node.marks.length > 0) {
			node.marks.forEach(/** @param {any} mark */ (mark) => {
				switch (mark.type) {
					case 'bold':
						text = `<strong>${text}</strong>`;
						break;
					case 'italic':
						text = `<em>${text}</em>`;
						break;
					case 'strike':
						text = `<s>${text}</s>`;
						break;
					case 'code':
						text = `<code>${text}</code>`;
						break;
					case 'link':
						const href = escapeHtml(mark.attrs?.href || '');
						text = `<a href="${href}" class="blog-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
						break;
				}
			});
		}

		return text;
	}

	// Handle block nodes
	let html = '';
	const content = node.content || [];
	const childrenHtmlArray = await Promise.all(
		content.map(/** @param {any} child */ (child) => renderNode(child, enableSyntaxHighlighting))
	);
	const childrenHtml = childrenHtmlArray.join('');

	// Get background pattern class if exists
	const bgPattern = node.attrs?.backgroundPattern;
	const bgClass = bgPattern ? ` class="bg-pattern-${bgPattern}"` : '';
	const textAlign = node.attrs?.textAlign;
	const alignStyle = textAlign ? ` style="text-align: ${textAlign};"` : '';

	switch (node.type) {
		case 'doc':
			return childrenHtml;

		case 'paragraph':
			html = `<p${bgClass}${alignStyle}>${childrenHtml || '<br>'}</p>`;
			break;

		case 'heading':
			const level = node.attrs?.level || 1;
			html = `<h${level}${bgClass}${alignStyle}>${childrenHtml}</h${level}>`;
			break;

		case 'blockquote':
			html = `<blockquote${bgClass}>${childrenHtml}</blockquote>`;
			break;

		case 'codeBlock':
			const language = node.attrs?.language || '';
			// Extract raw text from code block (not HTML-escaped version)
			const code = extractText(node);

			if (enableSyntaxHighlighting && language) {
				// Use Shiki for syntax highlighting (Shiki handles escaping)
				html = await highlightCode(code, language);
			} else {
				// Fallback to plain code block (need to escape manually)
				const langClass = language ? ` class="language-${language}"` : '';
				html = `<pre${bgClass}><code${langClass}>${escapeHtml(code)}</code></pre>`;
			}
			break;

		case 'bulletList':
			html = `<ul${bgClass}>${childrenHtml}</ul>`;
			break;

		case 'orderedList':
			html = `<ol${bgClass}>${childrenHtml}</ol>`;
			break;

		case 'listItem':
			html = `<li>${childrenHtml}</li>`;
			break;

		case 'horizontalRule':
			html = '<hr>';
			break;

		case 'image':
			const src = node.attrs?.src || '';
			const alt = node.attrs?.alt || '';
			const title = node.attrs?.title ? ` title="${escapeHtml(node.attrs.title)}"` : '';
			const width = node.attrs?.width ? ` width="${node.attrs.width}"` : '';
			const height = node.attrs?.height ? ` height="${node.attrs.height}"` : '';
			// Don't escape the src URL - it's already a valid URL
			html = `<img src="${src}" alt="${escapeHtml(alt)}"${title}${width}${height} class="blog-image">`;
			break;

		case 'imageResize':
			const resizeSrc = node.attrs?.src || '';
			const resizeAlt = node.attrs?.alt || '';
			const resizeTitle = node.attrs?.title ? ` title="${escapeHtml(node.attrs.title)}"` : '';
			const resizeWidth = node.attrs?.width ? ` width="${node.attrs.width}"` : '';
			const resizeHeight = node.attrs?.height ? ` height="${node.attrs.height}"` : '';
			const wrapperStyle = node.attrs?.wrapperStyle || '';
			const containerStyle = node.attrs?.containerStyle || '';

			// Wrap image with the same structure as the editor for consistent centering/positioning
			let imgTag = `<img src="${resizeSrc}" alt="${escapeHtml(resizeAlt)}"${resizeTitle}${resizeWidth}${resizeHeight} class="blog-image">`;

			if (wrapperStyle || containerStyle) {
				const wrapperStyleAttr = wrapperStyle ? ` style="${wrapperStyle}"` : '';
				const containerStyleAttr = containerStyle ? ` style="${containerStyle}"` : '';
				html = `<div class="image-resize-wrapper"${wrapperStyleAttr}><div class="image-resize-container"${containerStyleAttr}>${imgTag}</div></div>`;
			} else {
				html = imgTag;
			}
			break;

		case 'hardBreak':
			html = '<br>';
			break;

		case 'svelteComponent':
			// Render a placeholder for Svelte components
			// The actual component will be rendered by BlogPostContent.svelte
			const componentName = node.attrs?.name || 'Unknown';
			const componentProps = node.attrs?.props || {};
			const contextId = node.attrs?.contextId || null;

			// Create a data marker that BlogPostContent can parse
			// Using a custom HTML element that won't be rendered by browsers
			const propsJson = escapeHtml(JSON.stringify(componentProps));
			const contextAttr = contextId ? ` data-context-id="${escapeHtml(contextId)}"` : '';
			html = `<svelte-component-placeholder data-component="${escapeHtml(componentName)}" data-props="${propsJson}"${contextAttr}></svelte-component-placeholder>`;
			break;

		default:
			// Unknown node type, just render children
			html = childrenHtml;
	}

	return html;
}

/**
 * Escape HTML special characters
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
	if (!text) return '';

	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;',
	};

	return text.replace(/[&<>"']/g, (/** @type {string} */ char) => map[/** @type {keyof typeof map} */ (char)]);
}

/**
 * Calculate estimated read time based on word count
 * @param {any} json - TipTap JSON content
 * @param {number} wordsPerMinute - Average reading speed (default: 200)
 * @returns {number} Estimated read time in minutes
 */
export function calculateReadTime(json, wordsPerMinute = 200) {
	if (!json) return 0;

	const text = extractText(json);
	const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
	const minutes = Math.ceil(words.length / wordsPerMinute);

	return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Extract plain text from TipTap JSON
 * @param {any} node
 * @returns {string}
 */
function extractText(node) {
	if (!node) return '';

	if (node.type === 'text') {
		return node.text || '';
	}

	if (node.content && Array.isArray(node.content)) {
		return node.content.map(/** @param {any} child */ (child) => extractText(child)).join(' ');
	}

	return '';
}

/**
 * Validate TipTap JSON content
 * @param {any} json - TipTap JSON to validate
 * @returns {{ valid: boolean; errors: string[] }}
 */
export function validateTiptapContent(json) {
	const errors = [];

	if (!json) {
		errors.push('Content is empty');
		return { valid: false, errors };
	}

	if (typeof json !== 'object') {
		errors.push('Content must be a valid JSON object');
		return { valid: false, errors };
	}

	if (json.type !== 'doc') {
		errors.push('Root node must be of type "doc"');
	}

	if (!json.content || !Array.isArray(json.content)) {
		errors.push('Content must have a "content" array');
	}

	// Check for minimum content
	const text = extractText(json);
	if (text.trim().length === 0) {
		errors.push('Content cannot be empty');
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
