import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** Next.js stack: React, Hooks, a11y, import, `@next/next/*`, and TypeScript rules via `eslint-config-next`. */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "coverage/**",
      "src/data.js",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
