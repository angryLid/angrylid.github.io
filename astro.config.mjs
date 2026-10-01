import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import remarkGithubAdmonitions from "remark-github-blockquote-alert";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
// https://astro.build/config
export default defineConfig({
  site: "https://example.com",

  server: {
    host: true,
    allowedHosts: true,
  },

  devToolbar: {
    enabled: false,
  },

  markdown: {
    processor: unified({
      remarkPlugins: [remarkGithubAdmonitions, remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },

  integrations: [mdx(), react()],

  // Opt-in prefetching across the site. With <ClientRouter /> Astro default
  // enables prefetchAll anyway, but an explicit flag also covers pages
  // without the router (document/speaker) and documents the intent; the ±1
  // slide neighbors are prefetched programmatically via astro:prefetch.
  prefetch: true,
});
