/**
 * Server-side syntax highlighting with Shiki
 */

import { codeToHtml } from 'shiki';

/**
 * Highlight code with Shiki
 * @param {string} code - The code to highlight
 * @param {string} language - The language identifier
 * @returns {Promise<string>} HTML with syntax highlighting
 */
export async function highlightCode(code, language) {
	try {
		const normalizedLang = language.toLowerCase();

		// Use the newer Shiki API
		const html = await codeToHtml(code, {
			lang: normalizedLang,
			theme: 'github-dark'
		});

		return html;
	} catch (error) {
		console.error('Error highlighting code:', error);
		// Fallback to plain code block
		return `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
	}
}

/**
 * Escape HTML special characters
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
	if (!text) return '';

	/** @type {Record<string, string>} */
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	return text.replace(/[&<>"']/g, (char) => map[char]);
}
