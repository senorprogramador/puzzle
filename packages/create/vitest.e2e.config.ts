import { defineConfig } from "vitest/config";

const minutes = 60_000;

export default defineConfig({
  test: {
    include: ["e2e/**/*.e2e.test.ts"],
    environment: "node",
    globalSetup: ["e2e/global-setup.ts"],
    setupFiles: ["e2e/setup.ts"],
    // One file per framework; their scaffolds run in parallel.
    maxWorkers: Number(process.env.PUZZLE_E2E_CONCURRENCY ?? 4),
    testTimeout: 15 * minutes,
    hookTimeout: 5 * minutes,
    teardownTimeout: 5 * minutes,
  },
});
