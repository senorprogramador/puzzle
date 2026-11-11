import { expect, test } from "playwright/test";

const fixtureUrl = process.env.PUZZLE_HERO_FIXTURE_URL;

test.describe("Hero browser behavior", () => {
  test.skip(
    !fixtureUrl,
    "Configure PUZZLE_HERO_FIXTURE_URL to run Hero browser tests.",
  );

  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureUrl!);
  });

  test("uses two columns on desktop", async ({ page }) => {
    await page.setViewportSize({
      width: 1280,
      height: 900,
    });

    const hero = page.getByTestId("hero-responsive");
    const inner = hero.locator("[data-hero-inner]");

    const columns = await inner.evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean),
    );

    expect(columns).toHaveLength(2);
  });

  test("stacks content and media on mobile", async ({ page }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    const hero = page.getByTestId("hero-responsive");
    const inner = hero.locator("[data-hero-inner]");

    const columns = await inner.evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean),
    );

    expect(columns).toHaveLength(1);
  });

  test("places media before content on mobile when reversed", async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    const hero = page.getByTestId("hero-responsive");

    const media = hero.locator("[data-hero-media]");
    const content = hero.locator("[data-hero-content]");

    const mediaTop = await media.evaluate(
      (element) => element.getBoundingClientRect().top,
    );

    const contentTop = await content.evaluate(
      (element) => element.getBoundingClientRect().top,
    );

    expect(mediaTop).toBeLessThan(contentTop);
  });

  test("keeps content before media when mobile reversal is disabled", async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    const hero = page.getByTestId("hero-normal-order");

    const media = hero.locator("[data-hero-media]");
    const content = hero.locator("[data-hero-content]");

    const mediaTop = await media.evaluate(
      (element) => element.getBoundingClientRect().top,
    );

    const contentTop = await content.evaluate(
      (element) => element.getBoundingClientRect().top,
    );

    expect(contentTop).toBeLessThan(mediaTop);
  });

  test("keeps CTA elements accessible on mobile", async ({ page }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    const hero = page.getByTestId("hero-responsive");

    await expect(hero.getByRole("heading")).toBeVisible();

    await expect(
      hero.getByRole("img", { name: "Example landscape" }),
    ).toBeVisible();
  });
});
