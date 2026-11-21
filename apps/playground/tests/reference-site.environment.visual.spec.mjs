import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import {
  BROWSER_LAUNCH_ARGS,
  CANONICAL_IMAGE_REF,
  EXPECTED_PLATFORM_FONT_FAMILIES,
  inspectRenderedFonts,
  settlePage,
} from "./visual-support.mjs";

const require = createRequire(import.meta.url);

test("@environment reports actual browser and font rendering", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280");
  await page.goto("/");
  await settlePage(page);

  const renderedFonts = await inspectRenderedFonts(page);
  const platformFontFamilies = [
    ...new Set(
      renderedFonts.flatMap(({ platformFonts }) =>
        platformFonts.map(({ familyName }) => familyName),
      ),
    ),
  ].sort();
  expect(platformFontFamilies, JSON.stringify(renderedFonts)).toEqual(
    EXPECTED_PLATFORM_FONT_FAMILIES,
  );

  const fontRows = execFileSync(
    "fc-list",
    ["--format", "%{family}|%{style}|%{fontversion}|%{file}\\n"],
    { encoding: "utf8" },
  )
    .trim()
    .split("\n")
    .sort();
  const playwrightVersion = JSON.parse(
    readFileSync(require.resolve("playwright/package.json"), "utf8"),
  ).version;
  const diagnostics = {
    node: process.version,
    bun: execFileSync("bun", ["--version"], { encoding: "utf8" }).trim(),
    playwright: playwrightVersion,
    playwrightTest: JSON.parse(
      readFileSync(require.resolve("@playwright/test/package.json"), "utf8"),
    ).version,
    chromium: page.context().browser().version(),
    os: readFileSync("/etc/os-release", "utf8")
      .split("\n")
      .find((line) => line.startsWith("PRETTY_NAME="))
      ?.slice("PRETTY_NAME=".length)
      .replaceAll('"', ""),
    architecture: process.arch,
    installedFonts: fontRows,
    image: CANONICAL_IMAGE_REF,
    launchArgs: BROWSER_LAUNCH_ARGS,
    deviceScaleFactor: await page.evaluate(() => window.devicePixelRatio),
    viewport: page.viewportSize(),
    screenshotEnvironment: process.env.PUZZLE_VISUAL_ENVIRONMENT,
    renderedFonts,
  };

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: testInfo.outputPath("canonical-render.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    scale: "css",
  });
  console.log(`[visual-environment] ${JSON.stringify(diagnostics, null, 2)}`);
});
