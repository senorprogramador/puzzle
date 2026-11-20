import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { routes } from "./reference-site-matrix.mjs";

const routeName = (path) =>
  path === "/" ? "home" : path.slice(1).replaceAll("/", "-");

for (const route of routes) {
  test(`@a11y ${route.path}`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "load" });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      route.heading,
    );

    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations, route.path).toEqual([]);
  });

  test(`@visual ${route.path}`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "load" });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      route.heading,
    );
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.locator("img").evaluateAll((images) =>
      Promise.all(
        images.map((image) => {
          image.loading = "eager";
          return image.decode();
        }),
      ),
    );

    await expect(page).toHaveScreenshot(`${routeName(route.path)}.png`, {
      fullPage: true,
    });
  });
}
