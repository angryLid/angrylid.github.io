// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

// 3. Define your collection(s)
const blog = defineCollection({ 
    loader: glob({
         pattern: "**/*.en.md", base: "./content/" 
    }),
 });

 const blogZh = defineCollection({ 
    loader: glob({
         pattern: "**/*.zh.md", base: "./content/" 
    }),
 });
// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog, blogZh };