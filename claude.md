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

**Database Layer:**

- [src/lib/db/index.js](src/lib/db/index.js) - Turso (LibSQL) database connection using Drizzle ORM
- [src/lib/db/schema/](src/lib/db/schema/) - Database schemas (categories, portfolioItems, bios, siteMetadata)
- [src/lib/db/queries/](src/lib/db/queries/) - Query functions for fetching data
- [drizzle.config.js](drizzle.config.js) - Drizzle Kit configuration for schema management

**Data Files:**

- [src/routes/home/notes.json](src/routes/home/notes.json) - Musical note frequencies (only remaining JSON data)

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
- Conditional classes: `class:animate={enableTabAnimation}`

## Common Patterns

### Browser Safety Check

```javascript
import { browser } from '$app/environment';
if (!browser) return; // Prevent SSR errors
```

### Adding New Content

1. **Portfolio items:** Update directly in Turso database or use future admin interface
2. **Bio content:** Update directly in Turso database or use future admin interface
3. **Site metadata:** Update via `siteMetadata` table in database
4. **Images:** Place in [static/](static/) folder (auto-served)

### Color Usage

Use CSS custom properties from [global.css](src/global.css):

- `var(--neutral-white)`, `var(--neutral-black)`
- `var(--neutral-dark-gray)`, `var(--neutral-gray)`
- `var(--main-blue)`, `var(--main-blue-light)`
- Opacity variants: `var(--neutral-dark-gray-op-50)`

## Recent Improvements

### Turso Database Integration (2025-12-27)

Migrated from static JSON files to Turso (LibSQL) cloud database:

- **Database:** Turso with Drizzle ORM for type-safe queries
- **Schema:** Categories, portfolio items, bios, and site metadata tables
- **Migration:** Automated script migrated all JSON data to database
- **Dual-mode imports:** Database client works in both SvelteKit (`$env/static/private`) and Node.js scripts (`process.env`)
- **Server-side loading:** SvelteKit `+page.server.js` files fetch data asynchronously from database

### Tab Navigation System (2025-12-27)

The projects page now features a Chrome-style tab navigation with:

- **Transparent cutout effect**: Active tab reveals the patterned background through a "hole" in the dark nav bar
- **Smooth beveled corners**: 8px border-radius on both sides of the cutout for modern browser-tab aesthetics
- **Conditional animations**: Tabs animate smoothly (500ms, elastic bezier) on click, but resize instantly with no animation lag
- **Three-section background**: Dynamic width calculation using viewport-based positioning
- **Implementation**: Uses reactive Svelte patterns with conditional CSS classes instead of imperative DOM manipulation

## Known Technical Debt

### High Priority

1. **No Test Coverage:** Project has no test suite. Consider Vitest + Testing Library.

2. **No Admin Interface:** Content updates require direct database access or running migration scripts.

### Medium Priority

3. **Magic Numbers:** Timeouts and dimensions hardcoded throughout (e.g., 800ms, 7.6s, 220vw).

4. **Theme System:** Infrastructure exists but only dark mode implemented.

5. **Self-Closing Tags:** Svelte 5 warns about self-closing non-void elements. These are warnings only but should be fixed for cleanliness.

6. **Site Metadata Not Used:** `siteMetadata` table exists but not integrated site-wide (still using hardcoded values).

### Low Priority

7. **Accessibility:** No reduced-motion media queries despite heavy animations.

8. **Musical Notes Data:** [notes.json](src/routes/home/notes.json) is the only remaining JSON file - could be migrated to database for consistency.

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

### Database Management

```bash
# Setup (one-time)
cp .env.example .env              # Copy environment template
# Fill in TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env
npx drizzle-kit push              # Push schema to database
node scripts/migrate-json-to-db.js # Migrate data (if needed)

# Schema changes
npx drizzle-kit push              # Push schema changes to Turso
npx drizzle-kit studio            # Open Drizzle Studio (GUI browser)
```

### Code Quality Tools

- **ESLint:** Configured with Svelte plugin
- **Prettier:** 2-space indent, single quotes, trailing commas
- **TypeScript:** JSDoc checking with checkJs enabled

### Deployment

- Automatic deployment via Vercel
- Uses @sveltejs/adapter-auto
- Analytics via @vercel/analytics
- **IMPORTANT:** Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to Vercel environment variables for production

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

## Next Steps & Future Features

### Immediate Priorities

1. **Admin Interface:** Build a `/admin` route for managing content without database access
   - CRUD operations for portfolio items, bios, and categories
   - Authentication (consider SvelteKit's built-in auth or Lucia)
   - Rich text editor for bio content
   - Image upload integration

2. **Site Metadata Integration:** Use the `siteMetadata` table site-wide
   - Replace hardcoded site title, description, owner info
   - Make it editable via admin interface
   - Use in meta tags for SEO

3. **Blog System:** Implement the planned blog feature
   - Create `blogPosts` table (title, slug, content, publishedAt, tags)
   - Markdown rendering with syntax highlighting
   - Tag/category filtering
   - RSS feed generation

### Future Enhancements

4. **Testing Suite:** Add Vitest + Testing Library for unit and integration tests

5. **Analytics Dashboard:** Visualize visitor data from Vercel Analytics

6. **Theme System Completion:** Implement light mode and additional color schemes

7. **Accessibility Improvements:**
   - Add `prefers-reduced-motion` media queries
   - Keyboard navigation improvements
   - Screen reader optimization

8. **Performance Optimizations:**
   - Image optimization (WebP, lazy loading)
   - Consider migrating [notes.json](src/routes/home/notes.json) to database
   - Database query caching for frequently accessed data

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
- For portfolio-related features, update database schema and queries
- Create `+page.server.js` files for database queries (SSR)
- Keep database queries in `src/lib/db/queries/` for reusability

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

### Database Schema Overview

**Categories** (slug, name, description, order, hasTab):

- `experiences` - Professional experience and leadership roles
- `projects` - Personal and academic projects
- `other` - Experiments, CSS art, interactive demos

**Portfolio Items** (categoryId, title, description, startDate, endDate, url, image, highlight, displayOrder):

- Linked to categories via `categoryId`
- Ordered by `displayOrder` within each category
- `highlight` boolean for featured items

**Bios** (type, content, updatedAt):

- Three types: `short`, `mid`, `long`
- Content stored as newline-separated paragraphs

**Site Metadata** (key, value, description, updatedAt):

- Key-value pairs for site-wide configuration
- Examples: `site_title`, `site_description`, `owner_name`, `owner_email`

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
