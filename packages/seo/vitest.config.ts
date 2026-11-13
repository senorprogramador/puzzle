import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

/**
 * Two test layers:
 * - unit:    `src/tests/*.test.ts(x)`         Node, server rendering and logic.
 * - browser: `src/tests/*.browser.test.tsx`   real Chromium via Playwright for
 *                                             client rendering, head hoisting,
 *                                             hydration and script execution.
 *
 * `*.test.mjs` files run with `node --test` and `public-api.test.ts` is
 * type-only (checked by `typecheck:test`).
 */
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["src/tests/*.test.{ts,tsx}"],
          exclude: [
            "src/tests/public-api.test.ts",
            "src/tests/*.browser.test.{ts,tsx}",
          ],
        },
      },
      {
        test: {
          name: "browser",
          include: ["src/tests/*.browser.test.{ts,tsx}"],
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
