# CHANGELOG

## Revision 2026-07-05

- Migrated package manager from npm to pnpm (pinned pnpm@11.10.0, Node >=22)
- Hardened CI: pinned GitHub Actions to commit SHAs, added per-job permissions, set Node 22
- Moved CHANGELOG out of the content collection to root CHANGELOG.md (no longer published as a post)
- Migrated Claude Code toolchain to opencode: relocated skills to .opencode/skills, renamed CLAUDE.md to AGENTS.md, dropped format-notion skill
- Added Prettier formatter with prettier-plugin-astro (.prettierrc.json, .prettierignore); added format/format:check scripts
- Added ESLint linter with eslint-plugin-astro and @eslint/js recommended (eslint.config.mjs); added lint script
- Removed unused imports/vars surfaced by the linter (src/utils/freshness.ts, src/content.config.ts, content/bilibili-dump/BilibiliDump.astro)

## Revision 2026-07-04

- Added /thoughts route with Giscus comments
- Added Posts/Thoughts nav tabs in IndexLayout, replacing the visible `<h1>`
- Reworked Header to a brand-only banner
- Added NavMenu component with active-state highlighting
- Renamed index page title from "Index" to "Posts"
- Added visually-hidden h1 for accessibility and SEO
- Added freshness/recency scoring for post sorting (exponential decay, 2-year half-life) via src/utils/freshness.ts
- Replaced created-date with tags on the posts listing; tagless posts show no metadata

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
