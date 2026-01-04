/**
 * Defines the configuration for a single prop in an embeddable component.
 * This is used to generate the UI for configuring component instances in the blog editor.
 *
 * @typedef {Object} ComponentPropDef
 * @property {('string'|'number'|'boolean'|'color'|'select')} type - The type of prop, determines UI control
 * @property {any} default - Default value used when creating new component instances
 * @property {string} label - Human-readable label displayed in the editor UI
 * @property {string} [description] - Optional help text explaining what the prop controls
 * @property {any[]} [options] - For 'select' type only, array of available choices
 * @property {number} [min] - For 'number' type only, minimum allowed value
 * @property {number} [max] - For 'number' type only, maximum allowed value
 * @property {number} [step] - For 'number' type only, increment step for UI controls
 *
 * @example
 * {
 *   type: 'number',
 *   default: 50,
 *   label: 'Grid Size',
 *   description: 'Size of the simulation grid (NxN)',
 *   min: 20,
 *   max: 100,
 *   step: 5
 * }
 */

/**
 * Metadata for a single embeddable component in the registry.
 * Each component must have an entry here to be available in blog posts.
 *
 * @typedef {Object} ComponentRegistryEntry
 * @property {string} name - Component name, must match the .svelte filename (e.g., 'FireSim')
 * @property {string} label - Human-readable display name shown in component picker
 * @property {string} description - Brief explanation of what the component does
 * @property {('simulation'|'visualization'|'interactive'|'tool')} category - Category for organizing picker UI
 * @property {() => Promise<any>} component - Lazy import function (e.g., () => import('./FireSim.svelte'))
 * @property {Record<string, ComponentPropDef>} props - Configuration for all component props
 * @property {boolean} [consumesContext] - If true, component can read shared context from other components
 * @property {string[]} [providesContext] - Array of context keys this component makes available to others
 *
 * @example
 * {
 *   name: 'FireSim',
 *   label: 'Forest Fire Simulation',
 *   description: 'Interactive cellular automata forest fire simulation',
 *   category: 'simulation',
 *   component: () => import('./FireSim.svelte'),
 *   consumesContext: false,
 *   providesContext: [],
 *   props: { gridSize: {...}, spread: {...} }
 * }
 */

/**
 * Central registry of all embeddable components available for blog posts.
 *
 * This registry serves as the single source of truth for:
 * - Which components can be embedded in blog posts
 * - What props each component accepts
 * - How to display component configuration UI in the editor
 * - How to lazy-load component code for rendering
 *
 * To add a new embeddable component:
 * 1. Create the component in /src/lib/components/embeddable/YourComponent.svelte
 * 2. Add an entry to this registry object with all required metadata
 * 3. The component will automatically appear in the blog editor's component picker
 *
 * @type {Record<string, ComponentRegistryEntry>}
 */
export const componentRegistry = {
  Sphere: {
    name: 'Sphere',
    label: '3D Sphere Visualization',
    description:
      'Interactive 3D sphere with CSS transforms - can be controlled by SphereControl',
    category: 'visualization',
    component: () => import('./Sphere.svelte'),
    consumesContext: true,
    providesContext: [],
    props: {
      size: {
        type: 'number',
        default: 300,
        label: 'Size (px)',
        description: 'Diameter of the sphere in pixels',
        min: 100,
        max: 600,
        step: 50,
      },
      rotationSpeed: {
        type: 'number',
        default: 1,
        label: 'Rotation Speed',
        description: 'Speed of automatic rotation',
        min: 0,
        max: 5,
        step: 0.5,
      },
      lineColor: {
        type: 'color',
        default: '#00a8ff',
        label: 'Line Color',
        description: 'Color of the sphere lines',
      },
    },
  },

  CSSArtwork: {
    name: 'CSSArtwork',
    label: 'CSS Artwork Gallery',
    description: 'Collection of pure CSS artwork pieces',
    category: 'visualization',
    component: () => import('./CSSArtwork.svelte'),
    consumesContext: false,
    providesContext: [],
    props: {
      piece: {
        type: 'select',
        default: 'all',
        label: 'Artwork Piece',
        description: 'Which piece to display',
        options: ['all', 'geometric', 'organic', 'octagon', 'polygon'],
      },
      animationSpeed: {
        type: 'number',
        default: 1,
        label: 'Animation Speed',
        description: 'Speed multiplier for animations',
        min: 0,
        max: 3,
        step: 0.25,
      },
      showTitle: {
        type: 'boolean',
        default: false,
        label: 'Show Title',
        description: 'Whether to display the title above each artwork piece',
      },
    },
  },

  FireSim2: {
    name: 'FireSim2',
    label: 'Forest Fire Simulation v2 (Optimized)',
    description:
      'Optimized forest fire simulation using new grid automata engine - built-in controls',
    category: 'simulation',
    component: () => import('./FireSim2.svelte'),
    consumesContext: false,
    providesContext: [],
    props: {},
  },

  GameOfLife: {
    name: 'GameOfLife',
    label: 'Conway\'s Game of Life',
    description:
      'Classic cellular automaton - watch patterns evolve following simple rules of life and death',
    category: 'simulation',
    component: () => import('./GameOfLife.svelte'),
    consumesContext: false,
    providesContext: [],
    props: {},
  },

  SphereControl: {
    name: 'SphereControl',
    label: '3D Sphere with Controls',
    description:
      'Interactive 3D CSS wireframe sphere with customization controls',
    category: 'visualization',
    component: () => import('./SphereControl.svelte'),
    consumesContext: true,
    providesContext: [
      'diameter',
      'longitudeLines',
      'latitudeLines',
      'animationSpeed',
      'colorIndex',
      'animate',
      'rotateX',
      'rotateY',
      'rotateZ',
    ],
    props: {
      diameter: {
        type: 'number',
        default: 290,
        label: 'Diameter',
        description: 'Sphere diameter in pixels',
        min: 50,
        max: 700,
        step: 10,
      },
      longitudeLines: {
        type: 'number',
        default: 9,
        label: 'Longitude Lines',
        description: 'Number of vertical lines',
        min: 1,
        max: 50,
        step: 2,
      },
      latitudeLines: {
        type: 'number',
        default: 5,
        label: 'Latitude Lines',
        description: 'Number of horizontal lines',
        min: 1,
        max: 50,
        step: 1,
      },
      animationSpeed: {
        type: 'number',
        default: 30,
        label: 'Animation Speed',
        description: 'Speed of rotation animation',
        min: 1,
        max: 300,
        step: 1,
      },
      colorIndex: {
        type: 'number',
        default: 0,
        label: 'Color',
        description: 'Sphere line color (0-6)',
        min: 0,
        max: 6,
        step: 1,
      },
      animate: {
        type: 'boolean',
        default: true,
        label: 'Animate',
        description: 'Enable automatic rotation',
      },
      showControls: {
        type: 'boolean',
        default: true,
        label: 'Show Controls',
        description: 'Display control sliders',
      },
      showSphere: {
        type: 'boolean',
        default: true,
        label: 'Show Sphere',
        description: 'Display the 3D sphere',
      },
    },
  },
};

/**
 * Get a component from the registry by name
 * @param {string} name - Component name
 * @returns {ComponentRegistryEntry | undefined}
 */
export function getComponent(name) {
  return componentRegistry[name];
}

/**
 * Get all component names
 * @returns {string[]}
 */
export function getComponentNames() {
  return Object.keys(componentRegistry);
}

/**
 * Get components by category
 * @param {string} category - Category name
 * @returns {ComponentRegistryEntry[]}
 */
export function getComponentsByCategory(category) {
  return Object.values(componentRegistry).filter(
    (comp) => comp.category === category,
  );
}

/**
 * Get all unique categories
 * @returns {string[]}
 */
export function getCategories() {
  return [
    ...new Set(Object.values(componentRegistry).map((comp) => comp.category)),
  ];
}

/**
 * Get default props for a component
 * @param {string} name - Component name
 * @returns {Record<string, any>}
 */
export function getDefaultProps(name) {
  const component = getComponent(name);
  if (!component) return {};

  /** @type {Record<string, any>} */
  const defaults = {};
  for (const [key, propDef] of Object.entries(component.props)) {
    defaults[key] = propDef.default;
  }
  return defaults;
}
