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
    base: "./content/pres/",
  }),
  schema: z.object({
    title: z.string(),
    steps: z.number().int().min(1).default(1),
    presTitle: z.string().optional(),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog, pres };
