import { defineConfig } from "@playwright/test";
import { viewportMatrix } from "./tests/reference-site-matrix.mjs";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.visual.spec.mjs",
  globalSetup: "./tests/visual-environment.mjs",
  fullyParallel: true,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  outputDir: "./test-results",
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.01,
      scale: "css",
      timeout: 20_000,
    },
  },
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    colorScheme: "light",
    deviceScaleFactor: 1,
    locale: "en-US",
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    timezoneId: "UTC",
    trace: "retain-on-failure",
    launchOptions: {
      args: ["--disable-gpu", "--disable-dev-shm-usage"],
    },
  },
  projects: viewportMatrix.map(({ name, width, height }) => ({
    name,
    use: { viewport: { width, height } },
  })),
  snapshotPathTemplate:
    "{testDir}/__screenshots__/linux/{projectName}/{arg}{ext}",
  webServer: {
    command: "bun run preview --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
