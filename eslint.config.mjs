import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import tseslintParser from "@typescript-eslint/parser";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  {
    ignores: ["dist/", ".astro/", "node_modules/", ".opencode/"],
  },
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["**/*.astro/*.{js,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["**/*.ts"],
    ignores: ["**/*.astro/*.ts"],
    languageOptions: {
      parser: tseslintParser,
      // lib/*.ts under _presentations are client-side helpers, so DOM globals
      // must resolve for no-undef (HTMLElement etc. appear in type positions).
      globals: { ...globals.node, ...globals.browser },
    },
    plugins: { "@typescript-eslint": tseslintPlugin },
    rules: {
      // The base rule flags type-position identifiers (function-type params,
      // type-alias arguments); the TS-aware rule handles them correctly.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
  {
    files: ["**/*.tsx"],
    ignores: ["**/*.astro/*.tsx"],
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser },
    },
    rules: {
      ...reactHooksPlugin.configs["recommended-latest"].rules,
      "no-unused-vars": "off",
    },
  },
  {
    files: ["src/components/DataTable/types.ts"],
    rules: {
      "no-unused-vars": "off",
    },
  },
  {
    // The slide protocol exports `const meta` from frontmatter; lib/pres.ts
    // reads it at build time, so exporting from these "components" is by design.
    files: ["src/pages/_presentations/decks/**/*.astro"],
    rules: {
      "astro/no-exports-from-components": "off",
    },
  },
];
