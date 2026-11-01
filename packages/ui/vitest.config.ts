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
      {
        find: /^@puzzle\/theme$/,
        replacement: resolvePath("../theme/src/index.ts"),
      },
      {
        find: /^@puzzle\/theme\/(.+)$/,
        replacement: resolvePath("../theme/src/$1"),
      },
      {
        find: /^@puzzle\/hooks$/,
        replacement: resolvePath("../hooks/src/index.ts"),
      },
      {
        find: /^@puzzle\/hooks\/(.+)$/,
        replacement: resolvePath("../hooks/src/$1"),
      },
      {
        find: /^@puzzle\/icons$/,
        replacement: resolvePath("../icons/src/index.ts"),
      },
      {
        find: /^@puzzle\/icons\/(.+)$/,
        replacement: resolvePath("../icons/src/$1"),
      },
    ],
  },

  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    clearMocks: true,
    restoreMocks: true,
  },
});
