# Claude AI Context Guide

## Project Overview

**Type:** Personal portfolio website
**Stack:** SvelteKit 2.49.2 + Svelte 5.46.1 + Turso (LibSQL) + Drizzle ORM
**Style:** Creative, experimental, interactive learning project
**Owner:** Matt Jones (matt.jones3054@gmail.com)

## Architecture

### Key Directories

- **[src/routes/](src/routes/)** - File-based routing (landing page, `/home/*`, `/admin/*`)
- **[src/lib/db/](src/lib/db/)** - Database layer (schema, queries, types)
- **[src/lib/server/](src/lib/server/)** - Server utilities (auth, storage, guards)
- **[src/global.css](src/global.css)** - Global styles and CSS custom properties
- **[src/store.js](src/store.js)** - Svelte stores (theme, animation state)

### Database Schema

- **categories** - Portfolio sections (experiences, projects, other)
- **portfolioItems** - Work/project entries with category linking
- **bios** - Three bio lengths (short, mid, long)
- **siteMetadata** - Key-value config (site title, URLs, SEO data)
- **images** - Vercel Blob image library (5MB max)

## Code Conventions

### Type System (JSDoc + TypeScript)

Uses **JSDoc comments** for type checking (not `.ts` files). All database types are globally available via [src/app.d.ts](src/app.d.ts).

**Type flow:** Define in `schema/types.d.ts` → Export via `types.d.ts` → Add to `app.d.ts` → Use globally

```javascript
// Function typing
/** @param {number} frequency */
function playNote(frequency) {}

// Query typing (always use type assertions with Drizzle)
/** @type {Category[]} */
const items = /** @type {Category[]} */ (await db.select().from(categories).all());

// DOM manipulation (required in Svelte 5)
let el = /** @type {HTMLElement} */ (document.getElementById('foo'));
```

**Adding a new database table:**
1. Create schema in `src/lib/db/schema/your-table.js` with `@typedef`
2. Add interface to `src/lib/db/schema/types.d.ts`
3. Export via `src/lib/db/types.d.ts`
4. Add to global scope in `src/app.d.ts`
5. Create query functions in `src/lib/db/queries/your-table.js`
6. Run `npx drizzle-kit push`

**Drizzle quirks:**
- Booleans: `integer('field', { mode: 'boolean' })` → `boolean`
- Timestamps: `integer('field', { mode: 'timestamp' })` → `Date`
- Always use type assertions on queries

### Svelte 5

- Existing code uses **Svelte 4 syntax** (backward compatible)
- **New code can use Svelte 5 features** (runes, snippets, etc.)
- Stricter about self-closing non-void tags
- DOM manipulation requires type casting

### Naming & Style

- **Components:** PascalCase (`Bio.svelte`)
- **Routes:** kebab-case (`+page.svelte`)
- **Functions:** camelCase
- **CSS:** Scoped styles, custom properties (`var(--main-blue)`), heavy animations
- **Responsive:** Mobile < 440px, Desktop ≥ 441px

### Common Patterns

```javascript
// SSR safety
import { browser } from '$app/environment';
if (!browser) return;

// Svelte reactivity
$: categories = data.categories;
$store.themeMode;

// Color usage
var(--neutral-white), var(--neutral-black)
var(--neutral-dark-gray), var(--main-blue)
```

## Development Workflow

### Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run check        # Type checking
npm run lint         # ESLint
npm run format       # Prettier
```

### Database

```bash
# One-time setup
cp .env.example .env  # Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
npx drizzle-kit push

# Schema changes
npx drizzle-kit push      # Push changes to Turso
npx drizzle-kit studio    # Open Drizzle Studio GUI
```

### Deployment

- **Platform:** Vercel (automatic deployment)
- **Required env vars:** `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
- **Analytics:** @vercel/analytics

## Content Management

- **Portfolio items:** `/admin/portfolio` (login required)
- **Images:** `/admin/images` (Vercel Blob uploads, login required)
- **Bios/metadata:** Direct database access (admin UI coming soon)

## Design Philosophy

- **Creative & experimental** - Visual interest, CSS 3D, playful interactions
- **Learning-focused** - Code experimentation welcome, open source
- **Performance-conscious** - Minimal JS, CSS animations, no heavy dependencies

## Known Technical Debt

**High Priority:**
- Admin interface incomplete (bios/metadata need UI)

**Medium Priority:**
- Magic numbers hardcoded (timeouts, dimensions)
- Theme system (only dark mode implemented)

**Low Priority:**
- No `prefers-reduced-motion` support
- [notes.json](src/routes/home/notes.json) not migrated to database

## Guidelines for AI Assistants

**Before editing:**
- Read existing files to understand implementation
- Check [global.css](src/global.css) for available CSS variables
- Maintain JSDoc pattern (don't convert to `.ts` unless requested)

**When adding features:**
- Follow SvelteKit routing conventions
- Use scoped CSS in components
- Add JSDoc type annotations
- Consider SSR (use `browser` checks)
- Keep database queries in `src/lib/db/queries/`
- Prefer Svelte's declarative approach over DOM manipulation

**Code quality:**
- Run `npm run check && npm run lint && npm run format`
- Test animations in browser
- Check responsive behavior (mobile/desktop)
- Preserve creative/experimental style
- Avoid over-engineering
- Keep bundle size minimal

## Resources

- **SvelteKit Docs:** https://kit.svelte.dev/docs
- **Svelte Tutorial:** https://svelte.dev/tutorial
- **Project Repo:** https://github.com/Centerville1/matt-jones-website
