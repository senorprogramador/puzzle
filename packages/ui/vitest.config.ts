import { fileURLToPath } from "node:url";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const resolvePath = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url));

const resolve = {
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
};

const shared = {
  clearMocks: true,
  restoreMocks: true,
};

/**
 * Three test layers:
 * - unit:      `*.unit.test.ts`      pure logic, Node, no DOM.
 * - component: `*.test.ts(x)`        React components in jsdom.
 * - browser:   `*.browser.test.tsx`  real browser (Chromium) for layout,
 *                                    focus, scrolling and pointer behavior
 *                                    that jsdom cannot reproduce.
 */
export default defineConfig({
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
