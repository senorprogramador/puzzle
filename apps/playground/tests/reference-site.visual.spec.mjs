import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { routes } from "./reference-site-matrix.mjs";
import {
  EXPECTED_PLATFORM_FONT_FAMILIES,
  inspectRenderedFonts,
  settlePage,
  watchPageDiagnostics,
} from "./visual-support.mjs";

const routeName = (path) =>
  path === "/" ? "home" : path.slice(1).replaceAll("/", "-");

for (const route of routes) {
  test(`@a11y ${route.path}`, async ({ page }, testInfo) => {
    const diagnostics = watchPageDiagnostics(page);
    await page.goto(route.path, { waitUntil: "load" });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      route.heading,
    );
    await settlePage(page);

    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations, route.path).toEqual([]);
    expect(diagnostics, `${route.path} browser diagnostics`).toEqual({
      consoleErrors: [],
      pageErrors: [],
      failedRequests: [],
      externalRequests: [],
      badResponses: [],
    });
    await testInfo.attach("rendered-fonts.json", {
      body: Buffer.from(JSON.stringify(await inspectRenderedFonts(page), null, 2)),
      contentType: "application/json",
    });
  });

  test(`@visual ${route.path}`, async ({ page }, testInfo) => {
    const diagnostics = watchPageDiagnostics(page);
    await page.goto(route.path, { waitUntil: "load" });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      route.heading,
    );
    await settlePage(page);
    const renderedFonts = await inspectRenderedFonts(page);
    const platformFontFamilies = [
      ...new Set(
        renderedFonts.flatMap(({ platformFonts }) =>
          platformFonts.map(({ familyName }) => familyName),
        ),
      ),
    ].sort();
    expect(
      platformFontFamilies,
      `${route.path} must render headings and body copy with installed platform fonts: ${JSON.stringify(renderedFonts)}`,
    ).toEqual(EXPECTED_PLATFORM_FONT_FAMILIES);
    expect(diagnostics, `${route.path} browser diagnostics`).toEqual({
      consoleErrors: [],
      pageErrors: [],
      failedRequests: [],
      externalRequests: [],
      badResponses: [],
    });
    await testInfo.attach("rendered-fonts.json", {
      body: Buffer.from(JSON.stringify(renderedFonts, null, 2)),
      contentType: "application/json",
    });
    await page.evaluate(() => window.scrollTo(0, 0));

    await expect(page).toHaveScreenshot(`${routeName(route.path)}.png`, {
      fullPage: true,
      animations: "disabled",
      caret: "hide",
      scale: "css",
    });
  });
}
