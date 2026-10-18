---
name: astro-notes
description: Authoring rules for presentation slides and blog posts. Load when creating or editing a slide under src/pages/_presentations/decks/ (single .astro per slide) or an .mdx blog post under content/.
---

# Slide & post authoring rules

## Presentation slides (single `.astro` per slide)

Each slide is one self-contained file at `src/pages/_presentations/decks/<deck>/NN-name.astro`.

### Required metadata

Export it from the frontmatter — the deck loader (`src/pages/_presentations/lib/pres.ts`) reads it at build time:

```astro
---
export const meta = { title: "页面标题", steps: 4 };
---
```

- `title` is required (menu + breadcrumb + document view).
- `steps` is optional: it is only a floor; the real step count is `max(meta.steps, max(data-anim) + 1)`.
- Forgetting `meta` fails the build with "must export meta with a title" — add it, don't bypass the check.

### Structure

- Wrap content in `PresentationLayout` (props: `title`, `narrow`, `reverse`; `eyebrow` is deprecated and not rendered).
- Speaker notes: place a `<Notes>` element at the end of the component (import from `@pres/components/Notes.astro`). It renders an inert `<template>` — invisible on the audience side, cloned into the presenter view.
- Scoped `<style>` blocks are fine and preferred over inline styles; do NOT put a `<script>` without `is:inline`.

### Reveal animations

- Elements with `data-anim="N"` start transparent and fade in when the step reaches N.
- For pre-built entrance effects wrap content in `PresentationStep` (`effect="fade" | "fly" | "blinds"`, `direction`, `duration`, `strips`, …).

### Slide CSS constraints

Never use `vh`/`vw`/`vmin`/`vmax` — they reference the browser viewport, not the 1280×720 design canvas, and break the scaled previews in the speaker/document views. Use `rem`/`em`/`%`/`px`.

### After adding a slide

Add its id to `src/pages/_presentations/deck.ts` (tree of ids / titled sections). The build validates: id exists as a file, no duplicates, no empty sections.

## Blog posts (`.mdx` under `content/`)

MDX parses `{ … }` as JS (acorn). The classic traps:

- Comments must be `{/* … */}`, never `<!-- … -->`.
- No inline `<script>`; no `<style>` blocks (any CSS braces break the parser).
- Avoid `<p>`; use `<div>`.
- Escape literal braces (`&#123;`), `style` takes objects (`style={{ color: "red" }}`), imports go at the very top, component names start uppercase.
- No bare blank lines inside JSX layout blocks.
