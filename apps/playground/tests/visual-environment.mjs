import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
  BROWSER_LAUNCH_ARGS,
  CANONICAL_ENVIRONMENT_ID,
  CANONICAL_IMAGE_REF,
} from "./visual-support.mjs";

const expected = {
  architecture: "arm64",
  bunVersion: "1.4.4",
  chromiumVersion: "159.0.8154.6",
  image: CANONICAL_IMAGE_REF,
  nodeVersion: "v26.13.1",
  playwrightVersion: "1.65.1",
  platform: "linux",
};

const require = createRequire(import.meta.url);
const workflowPath = fileURLToPath(
  new URL("../../../.github/workflows/ci.yml", import.meta.url),
);

const verifyVisualEnvironment = async () => {
  const bunVersion = execFileSync("bun", ["--version"], {
    encoding: "utf8",
  }).trim();
  const playwrightVersion = JSON.parse(
    readFileSync(require.resolve("playwright/package.json"), "utf8"),
  ).version;
  const testRunnerVersion = JSON.parse(
    readFileSync(require.resolve("@playwright/test/package.json"), "utf8"),
  ).version;
  const workflow = readFileSync(workflowPath, "utf8");

  assert.equal(process.platform, expected.platform, "Visual tests require Linux.");
  assert.equal(process.arch, expected.architecture, "Visual tests require ARM64.");
  assert.equal(process.version, expected.nodeVersion, "Unexpected Node.js version.");
  assert.equal(bunVersion, expected.bunVersion, "Unexpected Bun version.");
  assert.equal(
    playwrightVersion,
    expected.playwrightVersion,
    "Unexpected Playwright version.",
  );
  assert.equal(
    testRunnerVersion,
    expected.playwrightVersion,
    "The Playwright test runner must match the browser package version.",
  );
  assert.equal(
    process.env.PUZZLE_VISUAL_ENVIRONMENT,
    CANONICAL_ENVIRONMENT_ID,
    "Visual tests must run in the canonical environment.",
  );
  assert.equal(
    process.env.PUZZLE_PLAYWRIGHT_IMAGE,
    expected.image,
    "Visual test image does not match the pinned official image.",
  );
  assert.ok(
    workflow.includes(`image: ${expected.image}`),
    "The CI image reference must match the canonical local image.",
  );
  assert.ok(
    workflow.includes("runs-on: ubuntu-24.04-arm"),
    "Visual CI must use the ARM64 GitHub-hosted runner.",
  );

  const browser = await chromium.launch({
    headless: true,
    args: BROWSER_LAUNCH_ARGS,
  });

  try {
    assert.equal(
      browser.version(),
      expected.chromiumVersion,
      "Chromium does not match the pinned Playwright image.",
    );
  } finally {
    await browser.close();
  }

  const fontRows = execFileSync(
    "fc-list",
    ["--format", "%{family}|%{style}|%{fontversion}|%{file}\\n"],
    { encoding: "utf8" },
  )
    .trim()
    .split("\n")
    .sort();
  const osRelease = readFileSync("/etc/os-release", "utf8")
    .split("\n")
    .find((line) => line.startsWith("PRETTY_NAME="))
    ?.slice("PRETTY_NAME=".length)
    .replaceAll('"', "");

  console.log(
    `[visual-environment] ${JSON.stringify(
      {
        environmentId: CANONICAL_ENVIRONMENT_ID,
        image: expected.image,
        os: osRelease,
        architecture: process.arch,
        node: process.version,
        bun: bunVersion,
        playwright: playwrightVersion,
        playwrightTest: testRunnerVersion,
        chromium: browser.version(),
        launchArgs: BROWSER_LAUNCH_ARGS,
        installedFonts: fontRows,
      },
      null,
      2,
    )}`,
  );
};

export default async function globalSetup() {
  await verifyVisualEnvironment();
}
