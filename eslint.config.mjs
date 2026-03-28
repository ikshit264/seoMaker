import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "app/docs/**",
    "examples/**",
    "tsconfig.tsbuildinfo",
  ]),
  {
    extends: [...next],
  },
]);
