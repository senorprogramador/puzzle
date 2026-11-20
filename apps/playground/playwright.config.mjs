import { defineConfig } from "@playwright/test";
import { viewportMatrix } from "./tests/reference-site-matrix.mjs";

const snapshotPlatformDirectory = process.platform === "linux" ? "linux/" : "";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.visual.spec.mjs",
  fullyParallel: true,
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    reducedMotion: "reduce",
  },
  projects: viewportMatrix.map(({ name, width, height }) => ({
    name,
    use: { viewport: { width, height } },
  })),
  snapshotPathTemplate:
    `{testDir}/__screenshots__/${snapshotPlatformDirectory}{projectName}/{arg}{ext}`,
  webServer: {
    command: "bun run preview --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
});
