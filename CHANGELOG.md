# CHANGELOG

## Revision 2026-07

- Migrated npm → pnpm (pinned pnpm@11.10.0, Node >=22) and hardened CI (pinned GitHub Actions SHAs, per-job permissions, Node 22)
- Migrated toolchain from Claude Code to opencode (skills → .opencode/skills, CLAUDE.md → AGENTS.md); moved CHANGELOG out of the content collection to root CHANGELOG.md
- Added Prettier and ESLint with format/lint scripts; removed unused imports/vars surfaced by the linter
- Added /thoughts route with Giscus comments and Posts/Thoughts nav tabs (NavMenu with active-state highlighting); reworked Header to a brand-only banner; added a visually-hidden h1 for a11y/SEO; renamed index title to "Posts"
- Added freshness scoring for post sorting (exponential decay, 2-year half-life) in src/utils/freshness.ts; replaced created-date with tags on the posts listing

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
