import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import { satteriKatex } from "satteri-katex";
import satteriCallouts from "satteri-callouts";
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
    // Native Sätteri pipeline (Astro 7 default). GitHub-style alerts and
    // KaTeX math replicate the old remark/rehype plugins; satteriKatex runs
    // at the MDAST stage per its README — on HAST the syntax highlighter
    // would claim display math as a plaintext code block first.
    processor: satteri({
      // rawHtml is required for MDX: satteriKatex emits raw-html nodes (as
      // rehype-katex did), which cannot compile to JSX unless reparsed into
      // real elements.
      features: { math: true, rawHtml: true },
      mdastPlugins: [satteriKatex()],
      hastPlugins: [satteriCallouts({ theme: "github" })],
    }),
  },

  integrations: [mdx(), react()],

  // Opt-in prefetching across the site. With <ClientRouter /> Astro default
  // enables prefetchAll anyway, but an explicit flag also covers pages
  // without the router (document/speaker) and documents the intent; the ±1
  // slide neighbors are prefetched programmatically via astro:prefetch.
  prefetch: true,
});
