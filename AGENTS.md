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

- `content/` - Blog articles in Markdown/MDX format, plus `.astro` table components that render CSV data via DataTable (`anime-from-notion/AnimeTable.astro`, `bilibili-dump/BilibiliDump.astro`)
- `src/pages/` - Astro page components and routing
  - `index.astro` - Posts listing (title "Posts")
  - `thoughts.astro` - /thoughts route with Giscus comments
  - `posts/[...slug].astro` - Dynamic blog post route
- `src/layouts/` - Layout components
  - `Layout.astro` - Base HTML shell (Header + slot + footer)
  - `IndexLayout.astro` - Centered container with NavMenu and sr-only h1
  - `BlogPost.astro` - Markdown body wrapper for posts
- `src/components/` - Reusable components
  - `Header.astro` - Brand-only top banner
  - `NavMenu.astro` - Posts/Thoughts nav tabs with active-state highlighting
  - `Giscus.astro` - Giscus comments (is:inline external script)
  - `BlogList.astro` - Post listing
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
- `src/content.config.ts` - Content collection schema
- `astro.config.mjs` - Markdown plugins (remark-github-blockquote-alert, remark-math, rehype-katex) built via `unified()`, plus MDX and React integrations
- `tsconfig.json` - TypeScript config with path aliases (@components, @layouts, @utils) and `jsx: react-jsx` / `jsxImportSource: react` for React islands
- `.nojekyll` - Disables Jekyll processing on GitHub Pages

### Key Features

- **Static Site Generation**: Astro generates fast, static HTML/CSS/JS
- **React Islands**: Interactive widgets (DataTable) ship as React islands via `@astrojs/react` (React 19); most pages remain zero-JS
- **Component-Based**: Uses Astro's component system with frontmatter code execution
- **TypeScript Support**: Configured with TypeScript extensions
- **GitHub Pages Ready**: Configured for automatic deployment with .nojekyll file

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
