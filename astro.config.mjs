import { defineConfig } from "astro/config";
import remarkGithubAdmonitions from 'remark-github-blockquote-alert';
import mdx from "@astrojs/mdx";
// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',

  i18n: {
      locales: ["zh", "en"],
      defaultLocale: "en",
  },

  markdown: {
      remarkPlugins: [remarkGithubAdmonitions],
  },

  integrations: [mdx()],
});