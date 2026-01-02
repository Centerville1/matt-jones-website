<script>
	import { getComponent } from '$lib/components/embeddable/registry.js';

	/** @type {string} */
	export let componentName;

	/** @type {Record<string, any>} */
	export let props = {};

	/** @type {(props: Record<string, any>) => void} */
	export let onSave = () => {};

	/** @type {() => void} */
	export let onCancel = () => {};

	/** @type {string | null} */
	export let contextId = null;

	/** @type {(props: Record<string, any>, contextId: string | null) => void} */
	export let onSaveWithContext = (props, contextId) => {};

	const component = getComponent(componentName);
	if (!component) {
		throw new Error(`Component ${componentName} not found in registry`);
	}

	// Create editable copy of props
	/** @type {Record<string, any>} */
	let editableProps = { ...props };

	/** @type {string} */
	let editableContextId = contextId || '';

	function handleSave() {
		// Use new callback if provided, otherwise fall back to old one
		if (onSaveWithContext !== (() => {})) {
			onSaveWithContext(editableProps, editableContextId || null);
		} else {
			onSave(editableProps);
		}
	}

	/**
	 * @param {string} propName
	 * @param {any} value
	 */
	function updateProp(propName, value) {
		editableProps = { ...editableProps, [propName]: value };
	}
</script>

<div class="props-editor">
	<h4>Edit {component.label} Properties</h4>
	<p class="help-text">{component.description}</p>

	<!-- Context ID for component linking -->
	<div class="context-section">
		<label for="contextId">
			🔗 Component Link ID (Optional)
			<span class="prop-description">
				Components with the same Link ID can share data. Leave empty if this component doesn't need to connect to others.
			</span>
		</label>
		<input
			id="contextId"
			type="text"
			bind:value={editableContextId}
			placeholder="e.g., demo-1, shared-controls"
			class="context-input"
		/>
	</div>

	<div class="props-form">
		{#each Object.entries(component.props) as [propName, propDef]}
			<div class="form-group">
				<label for={propName}>
					{propDef.label}
					{#if propDef.description}
						<span class="prop-description">{propDef.description}</span>
					{/if}
				</label>

				{#if propDef.type === 'number'}
					<input
						id={propName}
						type="number"
						bind:value={editableProps[propName]}
						min={propDef.min}
						max={propDef.max}
						step={propDef.step}
						on:input={(e) => updateProp(propName, parseFloat(e.currentTarget.value))}
					/>
				{:else if propDef.type === 'boolean'}
					<label class="checkbox-label">
						<input
							id={propName}
							type="checkbox"
							bind:checked={editableProps[propName]}
							on:change={(e) => updateProp(propName, e.currentTarget.checked)}
						/>
						<span>Enabled</span>
					</label>
				{:else if propDef.type === 'color'}
					<div class="color-input-group">
						<input
							id={propName}
							type="color"
							bind:value={editableProps[propName]}
							on:input={(e) => updateProp(propName, e.currentTarget.value)}
						/>
						<input
							type="text"
							bind:value={editableProps[propName]}
							placeholder="#000000"
							on:input={(e) => updateProp(propName, e.currentTarget.value)}
						/>
					</div>
				{:else if propDef.type === 'select'}
					<select
						id={propName}
						bind:value={editableProps[propName]}
						on:change={(e) => updateProp(propName, e.currentTarget.value)}
					>
						{#each propDef.options || [] as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				{:else}
					<input
						id={propName}
						type="text"
						bind:value={editableProps[propName]}
						on:input={(e) => updateProp(propName, e.currentTarget.value)}
					/>
				{/if}
			</div>
		{/each}
	</div>

	<div class="dialog-actions">
		<button on:click={handleSave} type="button" class="button-primary">
			Save Changes
		</button>
		<button on:click={onCancel} type="button" class="button-secondary"> Cancel </button>
	</div>
</div>

<style>
	.props-editor {
		padding: 1rem 0;
	}

	h4 {
		margin: 0 0 0.5rem 0;
		color: var(--neutral-black);
	}

	.help-text {
		font-size: 0.85rem;
		color: var(--contrast-text-light);
		margin: 0 0 1.5rem 0;
	}

	.context-section {
		background-color: var(--neutral-gray);
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		border: 2px solid var(--main-blue-light-op-10);
	}

	.context-section label {
		font-weight: 600;
		color: var(--neutral-black);
		font-size: 0.9rem;
		display: block;
		margin-bottom: 0.5rem;
	}

	.context-input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--neutral-dark-gray-op-50);
		border-radius: 4px;
		font-size: 0.9rem;
		background-color: var(--neutral-white);
		color: var(--neutral-black);
		font-family: monospace;
	}

	.context-input:focus {
		outline: none;
		border-color: var(--main-blue);
		box-shadow: 0 0 0 2px rgba(0, 168, 255, 0.1);
	}

	.props-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
		max-height: 400px;
		overflow-y: auto;
		padding-right: 0.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-weight: 600;
		color: var(--neutral-black);
		font-size: 0.9rem;
	}

	.prop-description {
		display: block;
		font-weight: 400;
		font-size: 0.8rem;
		color: var(--contrast-text-light);
		margin-top: 0.25rem;
	}

	.form-group input[type='number'],
	.form-group input[type='text'],
	.form-group select {
		padding: 0.5rem;
		border: 1px solid var(--neutral-dark-gray-op-50);
		border-radius: 4px;
		font-size: 0.9rem;
		background-color: var(--neutral-white);
		color: var(--neutral-black);
	}

	.form-group input:focus,
	.form-group select:focus {
		outline: none;
		border-color: var(--main-blue);
		box-shadow: 0 0 0 2px rgba(0, 168, 255, 0.1);
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-weight: 400;
	}

	.checkbox-label input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.color-input-group {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.color-input-group input[type='color'] {
		width: 60px;
		height: 40px;
		border: 1px solid var(--neutral-dark-gray-op-50);
		border-radius: 4px;
		cursor: pointer;
	}

	.color-input-group input[type='text'] {
		flex: 1;
	}

	.dialog-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--neutral-dark-gray-op-50);
	}

	.button-primary,
	.button-secondary {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-size: 0.9rem;
		cursor: pointer;
		border: none;
		transition: background-color 0.2s;
	}

	.button-primary {
		background-color: var(--main-blue);
		color: var(--neutral-white);
	}

	.button-primary:hover {
		background-color: var(--main-blue-light);
	}

	.button-secondary {
		background-color: var(--neutral-gray);
		color: var(--neutral-black);
	}

	.button-secondary:hover {
		background-color: var(--neutral-dark-gray-op-50);
	}
</style>
