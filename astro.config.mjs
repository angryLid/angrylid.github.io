import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com',
    i18n: {
        locales: ["zh", "en"],
        defaultLocale: "en",
    }
});