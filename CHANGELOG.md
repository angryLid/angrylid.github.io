# CHANGELOG

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
