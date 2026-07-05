import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import tseslintParser from "@typescript-eslint/parser";
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
      globals: globals.node,
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
];
