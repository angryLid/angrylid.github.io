import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import tseslintParser from "@typescript-eslint/parser";
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
      globals: globals.node,
    },
  },
  {
    files: ["src/components/DataTable.types.ts"],
    rules: {
      "no-unused-vars": "off",
    },
  },
];
