# CHANGELOG

## Revision 2026-07

- Migrated npm → pnpm (pinned pnpm@11.10.0, Node >=22) and hardened CI (pinned GitHub Actions SHAs, per-job permissions, Node 22)
- Migrated toolchain from Claude Code to opencode (skills → .opencode/skills, CLAUDE.md → AGENTS.md); moved CHANGELOG out of the content collection to root CHANGELOG.md
- Added Prettier and ESLint with format/lint scripts; removed unused imports/vars surfaced by the linter
- Added /thoughts route with Giscus comments and Posts/Thoughts nav tabs (NavMenu with active-state highlighting); reworked Header to a brand-only banner; added a visually-hidden h1 for a11y/SEO; renamed index title to "Posts"
- Added freshness scoring for post sorting (exponential decay, 2-year half-life) in src/utils/freshness.ts; replaced created-date with tags on the posts listing
- Added a reusable DataTable component with a rule-pipeline UI (filter + sort chips, per-column rule menu; AND-combined filters, multi-level sort with Intl.Collator/parseFloat/Date comparators); refactored AnimeTable and BilibiliDump onto it
- Split DataTable into a `src/components/DataTable/` subfolder organized by server/client boundary: `DataTable.astro` (server wrapper), `DataTable.client.tsx` (React island entry), `types.ts` (sectioned seam/server/client), `logic.ts` (pure helpers), and `FilterForm`/`SortForm`/`HeaderMenu` sub-components; deduped the `FilterRule`/`SortRule`/`FilterOp` types that were redeclared in the island
- Added React integration (`@astrojs/react` + React 19) and rewrote DataTable as a React island (`DataTable.tsx` + `DataTable.css` + a thin `.astro` wrapper); enabled `jsx: react-jsx` in tsconfig
- Upgraded Astro 6 → 7 (Vite 8, `@astrojs/mdx` 5 → 7); markdown config now builds its processor via `unified()`
- Added `pnpm typecheck` (`astro check`) with `@astrojs/check` + `typescript` devDeps; fixed implicit-any params surfaced by the checker
- Extracted `parseCSV` to `src/utils/csv.ts` and `escapeHtml` to `src/utils/html.ts`; both table components now share the CSV parser

## Revision 2026-03-28

- Upgraded Astro to v6
- Added MDX integration
- Added .nvmrc with Node version 22

## Revision 2026-03-08

- Updated Header component: removed language selector and centered brand title
- Added La Belle Aurore Google Font for brand styling
- Installed and integrated github-markdown-css package
- Cleaned up unused styling rules in IndexLayout.astro and Layout.astro
- Optimized font stacks for loading performance

## Revision 2025-12-28

- Added CHANGELOG
- Added created time for post pages
- Added table styles
