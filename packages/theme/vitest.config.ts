import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const resolvePath = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@puzzle\/core$/,
        replacement: resolvePath("../core/src/index.ts"),
      },
      {
        find: /^@puzzle\/core\/(.+)$/,
        replacement: resolvePath("../core/src/$1"),
      },
    ],
  },
  test: {
    clearMocks: true,
    restoreMocks: true,
  },
});
