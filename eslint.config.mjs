import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["packages/express-backend/**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["**/tests/**/*.js", "**/*.test.js"],
    languageOptions: {
      globals: globals.jest,
    },
  },
  pluginReact.configs.flat.recommended,
  { settings: { react: { version: "detect" } } },
]);
