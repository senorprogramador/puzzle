/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
const appRoot = path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@puzzle-ui\/core$/,
        replacement: fileURLToPath(
          new URL("../../packages/core/src/index.ts", import.meta.url),
        ),
      },
      {
        find: /^@puzzle-ui\/hooks$/,
        replacement: fileURLToPath(
          new URL("../../packages/hooks/src/index.ts", import.meta.url),
        ),
      },
      {
        find: /^@puzzle-ui\/theme$/,
        replacement: fileURLToPath(
          new URL("../../packages/theme/src/index.ts", import.meta.url),
        ),
      },
      {
        find: /^@puzzle-ui\/ui$/,
        replacement: fileURLToPath(
          new URL("../../packages/ui/src/index.ts", import.meta.url),
        ),
      },
      {
        find: /^@puzzle-ui\/icons(?=\/|$)/,
        replacement: fileURLToPath(
          new URL("../../packages/icons/src", import.meta.url),
        ),
      },
      {
        find: /^@puzzle-ui\/pieces$/,
        replacement: fileURLToPath(
          new URL("../../packages/pieces/src/index.ts", import.meta.url),
        ),
      },
    ],
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(appRoot, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
      },
    ],
  },
});
