/// <reference path="./tiptap.d.ts" />

import { Node, mergeAttributes } from '@tiptap/core';

/**
 * TipTap extension for embedding Svelte components in blog posts.
 *
 * This creates a custom node type that stores:
 * - Component name (which component to render)
 * - Component props (configuration for the component instance)
 * - Optional context ID (for prop sharing between components)
 *
 * Example TipTap JSON structure:
 * {
 *   type: 'svelteComponent',
 *   attrs: {
 *     name: 'FireSim',
 *     props: { gridSize: 50, spread: 4 },
 *     contextId: 'fire-sim-1'
 *   }
 * }
 */
export const ComponentNode = Node.create({
	name: 'svelteComponent',

	group: 'block',

	atom: true, // Cannot have content inside

	draggable: true,

	/**
	 * Define the attributes stored for each component instance
	 */
	addAttributes() {
		return {
			name: {
				default: null,
				parseHTML: (element) => element.getAttribute('data-component-name'),
				renderHTML: (attributes) => {
					if (!attributes.name) {
						return {};
					}
					return {
						'data-component-name': attributes.name
					};
				}
			},
			props: {
				default: {},
				parseHTML: (element) => {
					const propsStr = element.getAttribute('data-component-props');
					return propsStr ? JSON.parse(propsStr) : {};
				},
				renderHTML: (attributes) => {
					if (!attributes.props || Object.keys(attributes.props).length === 0) {
						return {};
					}
					return {
						'data-component-props': JSON.stringify(attributes.props)
					};
				}
			},
			contextId: {
				default: null,
				parseHTML: (element) => element.getAttribute('data-context-id'),
				renderHTML: (attributes) => {
					if (!attributes.contextId) {
						return {};
					}
					return {
						'data-context-id': attributes.contextId
					};
				}
			}
		};
	},

	/**
	 * Parse HTML to TipTap JSON
	 * Looks for <div class="svelte-component"> elements
	 */
	parseHTML() {
		return [
			{
				tag: 'div.svelte-component'
			}
		];
	},

	/**
	 * Render TipTap JSON to HTML for the editor view
	 * Shows a placeholder/preview in the editor
	 */
	renderHTML({ node, HTMLAttributes }) {
		const { name, props } = node.attrs;
		const componentLabel = name || 'Unknown Component';
		const propsPreview = props ? JSON.stringify(props, null, 2) : '{}';

		return [
			'div',
			mergeAttributes(HTMLAttributes, {
				class: 'svelte-component',
				'data-component-name': name,
				'data-component-props': JSON.stringify(props),
				'data-context-id': node.attrs.contextId,
				contenteditable: 'false'
			}),
			[
				'div',
				{ class: 'component-preview' },
				[
					'div',
					{ class: 'component-header' },
					['strong', { class: 'component-title' }, `📦 ${componentLabel}`],
					['button', { class: 'edit-props-btn', type: 'button', 'data-action': 'edit-props' }, '⚙️ Edit']
				],
				[
					'details',
					{ class: 'component-props' },
					['summary', {}, 'Current Props'],
					['pre', {}, propsPreview]
				]
			]
		];
	},

	/**
	 * Add commands for inserting components
	 */
	addCommands() {
		return {
			/**
			 * Insert a component at the current cursor position
			 * @param {Object} options - Component options
			 * @param {string} options.name - Component name from registry
			 * @param {Object} [options.props] - Component props
			 * @param {string | null} [options.contextId] - Optional context ID for prop sharing
			 */
			insertComponent:
				(/** @type {{ name: string, props?: Object, contextId?: string | null }} */ options) =>
				(/** @type {{ commands: any }} */ { commands }) => {
					const { name, props = {}, contextId = null } = options;
					return commands.insertContent({
						type: this.name,
						attrs: { name, props, contextId }
					});
				},

			/**
			 * Update props for the selected component
			 * @param {Object} props - New props to merge
			 */
			updateComponentProps:
				(/** @type {Object} */ props) =>
				(/** @type {{ tr: any, state: any }} */ { tr, state }) => {
					const { from } = state.selection;
					const node = state.doc.nodeAt(from);

					if (node && node.type.name === this.name) {
						const newProps = { ...node.attrs.props, ...props };
						tr.setNodeMarkup(from, undefined, { ...node.attrs, props: newProps });
						return true;
					}
					return false;
				}
		};
	}
});
