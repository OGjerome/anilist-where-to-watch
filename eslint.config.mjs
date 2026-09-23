import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Allow explicit any if necessary for quick API responses
      "@typescript-eslint/no-explicit-any": "warn",
      // Enforce clean variables
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    // Ignore build output and dependencies
    ignores: ["dist/**", "node_modules/**"],
  }
);
