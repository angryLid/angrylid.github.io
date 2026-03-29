import { defineConfig } from "astro/config";
import remarkGithubAdmonitions from 'remark-github-blockquote-alert';
import mdx from "@astrojs/mdx";
// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',

  markdown: {
      remarkPlugins: [remarkGithubAdmonitions],
  },

  integrations: [mdx()],
});