import { fileURLToPath } from "node:url";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const resolvePath = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url));

const resolve = {
  alias: [
    {
      find: /^server-only$/,
      replacement: resolvePath("./src/test/server-only.ts"),
    },
    { find: /^@puzzle-ui\/core$/, replacement: resolvePath("../core/src/index.ts") },
    { find: /^@puzzle-ui\/core\/(.+)$/, replacement: resolvePath("../core/src/$1") },
    { find: /^@puzzle-ui\/theme$/, replacement: resolvePath("../theme/src/index.ts") },
    { find: /^@puzzle-ui\/theme\/(.+)$/, replacement: resolvePath("../theme/src/$1") },
    { find: /^@puzzle-ui\/hooks$/, replacement: resolvePath("../hooks/src/index.ts") },
    { find: /^@puzzle-ui\/hooks\/(.+)$/, replacement: resolvePath("../hooks/src/$1") },
    { find: /^@puzzle-ui\/icons$/, replacement: resolvePath("../icons/src/index.ts") },
    { find: /^@puzzle-ui\/icons\/(.+)$/, replacement: resolvePath("../icons/src/$1") },
  ],
};

const shared = { clearMocks: true, restoreMocks: true };

export default defineConfig({
  resolve,
  test: {
    projects: [
      {
        resolve,
        test: {
          ...shared,
          name: "unit",
          environment: "node",
          include: ["src/**/*.unit.test.ts"],
        },
      },
      {
        resolve,
        test: {
          ...shared,
          name: "component",
          environment: "jsdom",
          pool: "vmThreads",
          setupFiles: ["./src/test/setup.ts"],
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: ["src/**/*.unit.test.ts", "src/**/*.browser.test.{ts,tsx}"],
        },
      },
      {
        resolve,
        test: {
          ...shared,
          name: "browser",
          setupFiles: ["./src/test/setup.ts"],
          include: ["src/**/*.browser.test.{ts,tsx}"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
