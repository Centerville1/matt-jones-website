/**
 * Type augmentation for custom TipTap commands
 */

import '@tiptap/core';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		svelteComponent: {
			/**
			 * Insert a Svelte component
			 */
			insertComponent: (options: {
				name: string;
				props?: Record<string, any>;
				contextId?: string | null;
			}) => ReturnType;
			/**
			 * Update component props
			 */
			updateComponentProps: (props: Record<string, any>) => ReturnType;
		};
	}
}
