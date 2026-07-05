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

  markdown: {
    processor: unified({
      remarkPlugins: [remarkGithubAdmonitions, remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },

  integrations: [mdx(), react()],
});
