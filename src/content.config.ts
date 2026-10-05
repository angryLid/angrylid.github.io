// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// 2. Import loader(s)
import { glob } from "astro/loaders";

// 3. Define your collection(s)
const blog = defineCollection({
  loader: glob({
    pattern: "*.{md,mdx}",
    base: "./content/",
  }),
});

const pres = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/pages/_presentations/decks/",
  }),
  schema: z.object({
    title: z.string(),
    steps: z.number().int().min(1).default(1),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog, pres };
