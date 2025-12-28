# Claude AI Context Guide

This document provides context for AI assistants working on the Matt Jones Portfolio Website project.

## Project Identity

**Type:** Personal portfolio website
**Framework:** SvelteKit 2.49.2 with Svelte 5.46.1 ✨
**Purpose:** Learning project and professional showcase
**Owner:** Matt Jones
**Style:** Creative, experimental, interactive
**Last Major Update:** 2025-12-27 (Upgraded to Svelte 5)

## Quick Architecture Reference

### File-Based Routing Structure

```
src/routes/
├── +page.svelte           # Landing page (3D sphere loader)
├── +layout.svelte         # Root layout (global styles, analytics)
└── home/
    ├── +page.svelte       # Main home page
    ├── +layout.svelte     # Home layout (header/nav)
    ├── projects/          # Portfolio section
    ├── about/             # About the site
    ├── architecture/      # Tech stack info
    ├── sphere/            # CSS 3D sphere demo
    ├── firesim/           # Fire simulation
    └── artwork/           # CSS artwork showcase
```

### Key Files by Function

**Styling & Theme:**

- [src/global.css](src/global.css) - Global styles, CSS custom properties, fonts
- [src/routes/palette.js](src/routes/palette.js) - Color palette definitions
- [src/routes/home/themeSwitch.svelte](src/routes/home/themeSwitch.svelte) - Theme switcher component

**State Management:**

- [src/store.js](src/store.js) - Svelte stores (themeMode, animatePageLoad key)

**Data Files:**

- [src/routes/home/bios.json](src/routes/home/bios.json) - Bio content (short, mid, long)
- [src/routes/home/projects/experiences.json](src/routes/home/projects/experiences.json) - Portfolio data
- [src/routes/home/notes.json](src/routes/home/notes.json) - Musical note frequencies

**Reusable Components:**

- [src/routes/home/bio.svelte](src/routes/home/bio.svelte) - Bio display with expandable text
- [src/routes/home/footer.svelte](src/routes/home/footer.svelte) - Footer component
- [src/routes/icons.svelte](src/routes/icons.svelte) - SVG icon components

## Code Style & Conventions

### Important: Svelte 5 Compatibility

This project now uses **Svelte 5.46.1**. Key things to know:

- Code is written in **Svelte 4 syntax** (backward compatible)
- Runes API is **NOT** used (can be adopted incrementally)
- Svelte 5 is stricter about self-closing non-void tags
- DOM element manipulation requires `/** @type {HTMLElement} */` type casting
- Build and runtime work perfectly with existing code

### Type Annotations

Uses JSDoc comments for TypeScript checking (not .ts files):

```javascript
/**
 * @param {number} frequency
 * @param {number} duration
 */
function playNote(frequency, duration) {}

// Type casting for DOM manipulation (required in Svelte 5)
let element = /** @type {HTMLElement} */ (document.getElementById('foo'));
element.style.color = 'red';
```

### Naming Conventions

- Components: PascalCase (Bio.svelte, ThemeSwitch.svelte)
- Files: kebab-case for routes (+page.svelte, +layout.svelte)
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE (in FireSim)

### CSS Approach

- Scoped styles in .svelte components
- CSS custom properties for theming (--neutral-dark-gray, --main-blue, etc.)
- Heavy use of CSS animations and transitions
- Responsive design with media queries
- View-based animation timelines (animation-timeline: view())

### Svelte Patterns Used

- Reactive declarations: `$: updateBioHeight(bioHeight)`
- Stores with `$` prefix: `$page.url.hash`, `$themeMode`
- onMount lifecycle for browser-only code
- Conditional rendering: `{#if condition}...{:else}...{/if}`
- Component props with bind: `bind:height={bioHeight}`

## Common Patterns

### Browser Safety Check

```javascript
import { browser } from '$app/environment';
if (!browser) return; // Prevent SSR errors
```

### Adding New Content

1. Portfolio items: Edit [src/routes/home/projects/experiences.json](src/routes/home/projects/experiences.json)
2. Bio versions: Edit [src/routes/home/bios.json](src/routes/home/bios.json)
3. Images: Place in [static/](static/) folder (auto-served)

### Color Usage

Use CSS custom properties from [global.css](src/global.css):

- `var(--neutral-white)`, `var(--neutral-black)`
- `var(--neutral-dark-gray)`, `var(--neutral-gray)`
- `var(--main-blue)`, `var(--main-blue-light)`
- Opacity variants: `var(--neutral-dark-gray-op-50)`

## Known Technical Debt

### High Priority

1. **Tab Animations** ([projects/+page.svelte](src/routes/home/projects/+page.svelte)): Imperative DOM manipulation with multiple `@ts-ignore` comments. Should be refactored to use Svelte transitions.

2. **No Test Coverage:** Project has no test suite. Consider Vitest + Testing Library.

3. **Hardcoded Content:** JSON files require deployment to update. Database integration (Prisma) is planned.

### Medium Priority

4. **Audio Code Duplication:** [home/+page.svelte:48-49](src/routes/home/+page.svelte#L48-L49) has duplicate `sound.connect(gain)` call.

5. **Magic Numbers:** Timeouts and dimensions hardcoded throughout (e.g., 800ms, 7.6s, 220vw).

6. **Theme System:** Infrastructure exists but only dark mode implemented.

7. **Self-Closing Tags:** Svelte 5 warns about self-closing non-void elements. These are warnings only but should be fixed for cleanliness.

### Low Priority

8. **Accessibility:** No reduced-motion media queries despite heavy animations.

9. **Type Safety:** JSON data files have no validation or type checking.

## Development Workflow

### Local Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run check        # Type checking
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

### Code Quality Tools

- **ESLint:** Configured with Svelte plugin
- **Prettier:** 2-space indent, single quotes, trailing commas
- **TypeScript:** JSDoc checking with checkJs enabled

### Deployment

- Automatic deployment via Vercel
- Uses @sveltejs/adapter-auto
- Analytics via @vercel/analytics

## Design Philosophy

### Creative & Experimental

- Prioritize visual interest and interactivity
- CSS animations and 3D transforms encouraged
- Playful elements (musical notes, jiggling stickers, animated sphere)

### Learning-Focused

- Code experimentation welcome
- Comments explaining techniques (e.g., audio API source)
- Open source for educational purposes

### Performance Considerations

- No heavy frameworks or libraries
- Static site generation where possible
- Minimal JavaScript for core functionality
- CSS-based animations for performance

## Future Architecture Plans

Based on [architecture page](src/routes/home/architecture/+page.svelte):

1. **Database Layer:** Prisma for content management
2. **Backend API:** Potential Node.js/Express for dynamic features
3. **Testing Suite:** Unit and integration tests
4. **CI/CD Pipeline:** Automated testing and deployment
5. **Blog System:** Dynamic blog posts (mentioned but not implemented)

## When Making Changes

### Before Editing

1. Read existing file to understand current implementation
2. Check [global.css](src/global.css) for available CSS variables
3. Review [project_status.md](project_status.md) for known issues
4. Maintain existing code style (JSDoc, naming conventions)

### After Editing

1. Run `npm run check` for type errors
2. Run `npm run lint` for linting issues
3. Run `npm run format` to auto-format
4. Test in browser (especially animations/interactions)
5. Check responsive behavior (mobile/desktop)

### Adding New Features

- Follow SvelteKit routing conventions
- Use scoped CSS in .svelte files
- Add JSDoc type annotations
- Consider SSR implications (use browser checks)
- Update [experiences.json](src/routes/home/projects/experiences.json) if portfolio-related

### Refactoring Guidelines

- Prefer Svelte's declarative approach over DOM manipulation
- Extract reusable components when patterns repeat
- Use Svelte transitions instead of manual CSS animation toggling
- Keep components small and focused

## Useful Context

### Animation State Management

Landing page sphere animation controlled via localStorage:

```javascript
export const animatePageLoadLocalStorageKey = 'animatePageLoad';
```

Set to prevent replay on page refresh.

### Portfolio Data Structure

[experiences.json](src/routes/home/projects/experiences.json) has three arrays:

- `work[]` - Professional experience
- `projects[]` - Personal projects
- `experiments[]` - Fun/experimental creations

Each entry: `{img, title, about, github?, live?, tech[]}`

### Responsive Breakpoints

- Mobile: < 440px
- Desktop: ≥ 441px

Used in media queries and svelte-media-query package.

## Resources

- **SvelteKit Docs:** https://kit.svelte.dev/docs
- **Svelte Tutorial:** https://svelte.dev/tutorial
- **Project Repo:** https://github.com/Centerville1/matt-jones-website
- **Owner Contact:** matt.jones3054@gmail.com

## Notes for AI Assistants

- Preserve creative/experimental code style
- Avoid over-engineering simple features
- Keep bundle size minimal (no heavy dependencies)
- Prioritize visual polish and interactivity
- Respect existing JSDoc pattern (don't convert to .ts unless requested)
- When in doubt about design choices, ask the user
- Test animations in browser before completing work
