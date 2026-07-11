# CHANGELOG

## Revision 2026-07

- Migrated to pnpm and opencode (AGENTS.md, root CHANGELOG), hardened CI, added Prettier/ESLint/`astro check`
- Upgraded Astro 6 → 7 and added React 19 for islands
- Reworked blog UX: /thoughts + Giscus, Posts/Thoughts nav tabs, brand-only Header, freshness-based post sorting
- Built a reusable DataTable React island with a filter/sort rule pipeline; migrated AnimeTable and BilibiliDump onto it
- Added presentation mode `/pres/[slug]/[pageNo]/` (arrow-key nav, CSS animation steps, View Transitions) with a Shift+S presenter-view popup (slide preview, speaker notes, next-slide thumbnail) synced via BroadcastChannel

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
