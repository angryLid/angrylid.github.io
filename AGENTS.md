# AGENTS.md

This file provides guidance to opencode when working with code in this repository.

## Project Overview

This is a modern static website built with Astro, deployed to GitHub Pages. The project has been cleaned of all Jekyll-related content and now uses a pure Astro setup for optimal performance and development experience.

## Development Commands

```bash
# Start development server
pnpm dev

# Build static site for production
pnpm build

# Preview production build locally
pnpm preview

# Format the codebase with Prettier
pnpm format

# Check formatting without writing (CI / verification)
pnpm format:check

# Lint with ESLint
pnpm lint

# Typecheck the project (astro check)
pnpm typecheck
```

## Architecture

### Project Structure

- `content/` - Blog articles in Markdown/MDX format, plus `.astro` table components that render CSV data via DataTable (`anime-from-notion/AnimeTable.astro`, `bilibili-dump/BilibiliDump.astro`); `content/pres/[slug]/NN-*.mdx` - one MDX file per presentation slide
- `src/pages/` - Astro page components and routing
  - `index.astro` - Posts listing (title "Posts")
  - `thoughts.astro` - /thoughts route with Giscus comments
  - `posts/[...slug].astro` - Dynamic blog post route
  - `pres/index.astro` - Presentations listing
  - `pres/[slug]/[pageNo].astro` - Dynamic slide route (one static HTML per slide)
  - `pres/[slug]/index.astro` - Redirects /pres/[slug]/ → /pres/[slug]/1/
  - `pres/[slug]/presenter.astro` - Presenter-view popup (pre-renders all slides; BroadcastChannel-synced to the main window)
- `src/layouts/` - Layout components
  - `Layout.astro` - Base HTML shell (Header + slot + footer)
  - `IndexLayout.astro` - Centered container with NavMenu and sr-only h1
  - `BlogPost.astro` - Markdown body wrapper for posts
  - `Presentation.astro` - Fullscreen slide layout (no header/footer); `<ClientRouter />` for view transitions, `data-anim`/`data-step` reveal system, bundled keyboard script (arrows, Shift+Enter fullscreen, Shift+S open presenter, BroadcastChannel sync)
- `src/components/` - Reusable components
  - `Header.astro` - Brand-only top banner
  - `NavMenu.astro` - Posts/Thoughts nav tabs with active-state highlighting
  - `Giscus.astro` - Giscus comments (is:inline external script)
  - `BlogList.astro` - Post listing
  - `Notes.astro` - Speaker-notes wrapper (renders `<template class="speaker-notes">`; inert on audience slides, cloned into the presenter-view notes panel)
  - `DataTable/` - Reusable table island split by server/client boundary
    - `DataTable.astro` - SERVER wrapper; public API consumers import this. Runs `render`/`format` at build time and ships a serialized `DataTablePayload` of pre-rendered HTML to the island
    - `DataTable.client.tsx` - CLIENT React island entry (hydrated via `client:visible`); orchestrator only
    - `DataTable.css` - Island styles (imported by `.client.tsx`)
    - `types.ts` - Shared types sectioned by boundary: seam (`ColumnType`, `Serialized*`, `DataTablePayload`), server-only (`Column`, `Props`), client-only (`FilterOp`, `FilterRule`, `SortRule`)
    - `logic.ts` - Client-only pure helpers (`compare`, `matchesFilter`, `opsForType`, `findCol`, `colIndexByKey`, `newId`)
    - `FilterForm.tsx` / `SortForm.tsx` / `HeaderMenu.tsx` - Client sub-components used by the island
- `src/utils/date.ts` - Date formatting helpers
- `src/utils/csv.ts` - `parseCSV` (RFC-style quoted/multiline CSV parser) shared by both table components
- `src/utils/html.ts` - `escapeHtml` helper used by DataTable render functions
- `src/content.config.ts` - Content collections: `blog` (glob `*.{md,mdx}` at `./content/`, no schema) and `pres` (glob `**/*.mdx` at `./content/pres/`, schema: `title`/`steps`/`presTitle`)
- `astro.config.mjs` - Markdown plugins (remark-github-blockquote-alert, remark-math, rehype-katex) built via `unified()`, plus MDX and React integrations
- `tsconfig.json` - TypeScript config with path aliases (@components, @layouts, @utils) and `jsx: react-jsx` / `jsxImportSource: react` for React islands
- `.nojekyll` - Disables Jekyll processing on GitHub Pages

### Key Features

- **Static Site Generation**: Astro generates fast, static HTML/CSS/JS
- **React Islands**: Interactive widgets (DataTable) ship as React islands via `@astrojs/react` (React 19); most pages remain zero-JS
- **Presentation Mode**: `/pres/[slug]/[pageNo]/` slides with arrow-key nav, CSS-driven animation steps, View Transitions, a Shift+S presenter-view popup with speaker notes, and BroadcastChannel dual-window sync (see Presentation Mode below)
- **Component-Based**: Uses Astro's component system with frontmatter code execution
- **TypeScript Support**: Configured with TypeScript extensions
- **GitHub Pages Ready**: Configured for automatic deployment with .nojekyll file

### Presentation Mode

- **Routes**: `/pres/[slug]/[pageNo]/` (one static HTML per slide), `/pres/[slug]/presenter/` (presenter-view popup), `/pres/[slug]/` (redirect to slide 1), `/pres/` (listing)
- **Slide content**: MDX per slide at `content/pres/[slug]/NN-name.mdx` in the `pres` collection. Slides use `data-anim="N"` on elements for progressive reveal; frontmatter `steps` declares the step count (defaults to 1; JS also scans `max(data-anim)+1` as a fallback). Slide CSS must avoid `vh`/`vw`/`vmin`/`vmax` — they reference the popup viewport rather than the 1280×720 design size and break the scaled preview; use `rem`/`em`/`%`/`px`
- **Animations**: CSS-driven. Root `<body data-step="N">`; elements with `data-anim="N"` are `opacity:0` until a JS-toggled `[data-visible]` attribute appears (CSS can't do `>=` attribute selectors, so `syncVisibility` toggles the attribute from `data-step`)
- **Keyboard**: bundled `<script>` in `Presentation.astro` (runs once per session; `astro:page-load` re-inits per slide). ArrowRight/Down → advance step or next slide; ArrowLeft/Up → back step or previous slide (own-keyboard back-nav sets a `sessionStorage` flag so the previous slide lands on its last step); Shift+Enter → fullscreen toggle; Shift+S → open presenter popup
- **View Transitions**: `<ClientRouter />` in `Presentation.astro`; slide-to-slide navigation uses `navigate()` from `astro:transitions/client` (not `window.location.href`, which bypasses the router and triggers a full reload)
- **Presenter view**: `/pres/[slug]/presenter/` pre-renders all slides in hidden `<section data-page>` containers; a `ResizeObserver` scales each preview via `transform: scale(var(--s))` against a 1280×720 design size. Speaker notes via the `<Notes>` MDX component (inert `<template>` on the audience side; `template.content.cloneNode(true)` into the notes panel on the presenter side). The page has no `<ClientRouter />` and no `astro:page-load` — the deferred module script initializes directly
- **Dual-window sync**: `BroadcastChannel("pres-speaker")`, symmetric state-broadcast — each window broadcasts `{kind:"state",slug,pageNo,step,total}` only on local user actions and applies received state silently (BC doesn't echo to the sender, so no loops). The main window is the navigation authority for cross-page nav: a module-scope `pendingStep` (not `sessionStorage`, which is per-window) carries the target step across the view-transition swap; a `navigatingTo` guard absorbs messages arriving mid-swap; `navSource` ("local"|"sync") prevents sync-driven navs from re-broadcasting (echo prevention)

### Development Workflow

1. Run `pnpm dev` for local development with hot reload
2. Run `pnpm build` to create production build in `dist/`
3. Deploy the `dist/` directory to GitHub Pages

## Configuration Notes

- Astro config includes remark/rehype plugins (GitHub admonitions, math/KaTeX), the MDX integration, and the React integration; markdown plugins are assembled via `unified()`
- TypeScript is configured with path aliases (@components, @layouts, @utils) and `jsx: react-jsx` / `jsxImportSource: react` for React islands
- The site uses inline CSS rather than external stylesheets
- Uses pnpm (pinned via `packageManager: pnpm@11.10.0`); requires Node >=22. Install deps with `pnpm install`, not `npm install`
- Formatting: Prettier with `prettier-plugin-astro` (config in `.prettierrc.json`, ignores in `.prettierignore`). Blog prose under `content/` is excluded from formatting
- Linting: ESLint flat config in `eslint.config.mjs` using `@eslint/js` recommended + `eslint-plugin-astro` recommended. `@typescript-eslint/parser` is included so `eslint-plugin-astro` can parse TypeScript in `.astro` frontmatter; `.tsx` files get `eslint-plugin-react-hooks` recommended-latest rules. `.opencode/` is ignored. Run `pnpm lint` to verify
- Typechecking: `pnpm typecheck` runs `astro check` (via `@astrojs/check` + `typescript`); run it alongside lint before pushing

## GitHub Pages Deployment

The project includes a `.nojekyll` file to disable GitHub's Jekyll processing, ensuring Astro-generated static files are served directly. The CNAME file suggests custom domain configuration.

## Skills

All skills are saved in `.opencode/skills`.
