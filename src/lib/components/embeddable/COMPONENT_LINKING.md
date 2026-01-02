# Component Linking Guide

## What is Component Linking?

Component linking allows multiple embedded components in a blog post to share data and communicate with each other. This enables powerful interactive experiences where controls in one component affect the behavior of another.

## How It Works

Components are linked using a **Component Link ID** (contextId). All components with the same Link ID can share data through a shared context object.

### Example Use Cases

1. **Control Panel + Visualization**
   - A slider control panel with Link ID `demo-1`
   - A 3D visualization with Link ID `demo-1`
   - Moving the sliders updates the visualization in real-time

2. **Multiple Synchronized Views**
   - Three different visualizations all with Link ID `shared-view`
   - All show the same data from different perspectives
   - Changing one updates all three

3. **Step-by-Step Tutorial**
   - Control component with Link ID `tutorial`
   - Multiple demo components showing different steps
   - Clicking "Next" in controls advances all demos

## Setting Up Component Linking

### 1. When Inserting Components

After clicking the 📦 button and selecting a component, you'll see a **Props Editor** dialog. At the top is a field labeled:

```
🔗 Component Link ID (Optional)
```

Enter a unique ID like `demo-1`, `controls-sim`, or `tutorial-step`.

### 2. Link Multiple Components

Insert another component and give it the **same Link ID**. Now they're connected!

### 3. Components Must Support Linking

Check the component registry to see if a component supports linking:
- **`consumesContext: true`** - Component can read shared data
- **`providesContext: ['key']`** - Component provides data with the given key

## Example: Creating a Linked Demo

1. **Insert a Control Component** (when one exists)
   - Set Link ID: `my-demo`
   - This component provides: `{ speed: 1.5, color: '#ff0000' }`

2. **Insert a Visualization Component**
   - Set Link ID: `my-demo` (same as above!)
   - In your blog text, explain: "Use the controls above to adjust the visualization"

3. **Readers interact**
   - When they move the speed slider, the visualization updates
   - When they pick a color, the visualization changes color
   - All in real-time!

## For Developers: Creating Linkable Components

### Consuming Context

Your component receives two special props:
- `context` - The shared context object
- `updateContext` - Function to update the shared context

```svelte
<script>
  export let context = undefined;
  export let updateContext = undefined;

  // Read from context
  $: speed = context?.speed ?? 1;
  $: color = context?.color ?? '#0000ff';
</script>
```

### Providing Context

Call `updateContext()` to share data with other components:

```svelte
<script>
  export let context = undefined;
  export let updateContext = undefined;

  let speed = 1;
  let color = '#0000ff';

  // Update context when values change
  $: if (updateContext) {
    updateContext({ speed, color });
  }
</script>

<input type="range" bind:value={speed} />
<input type="color" bind:value={color} />
```

### Register in Component Registry

Mark your component's capabilities:

```javascript
{
  name: 'ControlPanel',
  consumesContext: false,  // Doesn't read context
  providesContext: ['speed', 'color'],  // Provides these keys
  // ...
}
```

```javascript
{
  name: 'Visualization',
  consumesContext: true,  // Reads context
  providesContext: [],  // Doesn't provide
  // ...
}
```

## Tips

1. **Use Descriptive Link IDs**: `demo-1` is better than `d1`
2. **Same Post Only**: Link IDs only work within a single blog post
3. **Optional Feature**: Most components work fine standalone
4. **Document in Post**: Tell readers which components are linked
5. **Test Before Publishing**: Insert components and verify linking works

## Current Linked Components

Currently, the embeddable components (FireSim, Sphere, CSSArtwork) don't consume or provide context. They work great standalone!

To create your first linked demo:
1. Create a control component (sliders, buttons, etc.)
2. Update an existing component to consume context
3. Update the registry with `consumesContext` / `providesContext`
4. Link them in a blog post!
