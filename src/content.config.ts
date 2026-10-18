// 1. Import utilities from `astro:content`
import { defineCollection } from "astro:content";

// 2. Import loader(s)
import { glob } from "astro/loaders";

// 3. Define your collection(s)
const blog = defineCollection({
  loader: glob({
    pattern: "*.{md,mdx}",
    base: "./content/",
  }),
});

// Presentation slides are plain .astro files under
// src/pages/_presentations/decks/<slug>/ — NOT a content collection. Their
// metadata comes from a `meta` export in each slide's frontmatter (see
// src/pages/_presentations/lib/pres.ts).

// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog };
