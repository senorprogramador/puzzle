import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import { createServer } from "vite";

const fixtureRoot = fileURLToPath(
  new URL("../../fixtures/accessibility/", import.meta.url),
);

test("locale controls, language attributes, and translation rendering work in a browser", async () => {
  const server = await createServer({
    configFile: false,
    logLevel: "silent",
    root: fixtureRoot,
    server: { host: "127.0.0.1", port: 0 },
  });
  let browser;

  try {
    await server.listen();
    const address = server.httpServer?.address();

    if (!address || typeof address === "string") {
      throw new Error("Vite did not provide a local browser-test address.");
    }

    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    page.on("pageerror", (error) =>
      pageErrors.push(error.stack ?? error.message),
    );
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    await page.goto(`http://127.0.0.1:${address.port}`);
    try {
      await page.getByRole("combobox", { name: "Language" }).waitFor({
        timeout: 5_000,
      });
    } catch (error) {
      throw new Error(
        `Accessibility fixture did not render. Page errors: ${pageErrors.join("; ")}. Console errors: ${consoleErrors.join("; ")}`,
        { cause: error },
      );
    }

    const accessibility = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(
      accessibility.violations.map(({ id, impact }) => ({ id, impact })),
      [],
    );

    const language = page.getByRole("combobox", { name: "Language" });
    await page.getByRole("button", { name: "Rerender 0" }).click();
    assert.equal(await page.locator("#provider-stability").textContent(), "stable");

    await language.focus();
    assert.equal(await language.evaluate((element) => element.id), "language");
    assert.equal(
      await language.getAttribute("aria-describedby"),
      "language-help",
    );
    assert.equal(await language.evaluate((element) => element === document.activeElement), true);

    await language.press("n");
    assert.equal(await language.inputValue(), "nl");
    await page.getByText("Hallo Ada").waitFor();
    assert.equal(await page.locator("main").getAttribute("lang"), "nl");
    assert.equal(await page.locator("main").getAttribute("dir"), "ltr");
    assert.equal(await page.locator("#number").textContent(), "1.235");
    assert.equal(await page.locator("#announcement strong").textContent(), "Ada");
    assert.equal(await page.locator("#untrusted img").count(), 0);
    assert.equal(
      await page.locator("#untrusted").textContent(),
      "Untrusted: <img src=x onerror=alert(1)>",
    );

    await language.selectOption("ar");
    await page.getByText("مرحبا Ada").waitFor();
    assert.equal(await page.locator("main").getAttribute("lang"), "ar");
    assert.equal(await page.locator("main").getAttribute("dir"), "rtl");

    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    assert.equal(await language.isVisible(), true);
    assert.equal(
      await language.evaluate((element) => getComputedStyle(element).animationName),
      "none",
    );
    assert.equal(
      await page.locator("html").getAttribute("lang"),
      "en",
      "locale attributes remain opt-in and do not mutate global document state",
    );
  } finally {
    await browser?.close();
    await server.close();
  }
});
