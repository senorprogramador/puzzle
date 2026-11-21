import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { access, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { chromium } from "playwright";
import {
  BROWSER_LAUNCH_ARGS,
  settlePage,
} from "./visual-support.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const viteCli = join(appRoot, "node_modules", "vite", "bin", "vite.js");
import { routes, viewportMatrix } from "./reference-site-matrix.mjs";
const primaryNavigationLinks = [
  "Home",
  "About",
  "Capabilities",
  "Journal",
  "Contact",
];
const screenshotDirectory = process.env.PUZZLE_REFERENCE_SCREENSHOT_DIR;

let server;
let browser;
let page;
let baseUrl;
let serverOutput = "";
const diagnostics = [];

const reservePort = async () =>
  new Promise((resolve, reject) => {
    const listener = createServer();
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", () => {
      const address = listener.address();
      if (!address || typeof address === "string") {
        reject(new Error("Could not determine an available test port."));
        return;
      }

      listener.close((error) => {
        if (error) reject(error);
        else resolve(address.port);
      });
    });
  });

const appendServerOutput = (chunk) => {
  serverOutput = `${serverOutput}${chunk}`.slice(-6000);
};

const waitForServer = async () => {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Vite preview exited before becoming ready:\n${serverOutput}`);
    }

    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }

    await delay(250);
  }

  throw new Error(`Vite preview did not become ready:\n${serverOutput}`);
};

const clearDiagnostics = () => {
  diagnostics.length = 0;
};

const assertNoRuntimeErrors = (path) => {
  assert.deepEqual(
    diagnostics,
    [],
    `Unexpected browser diagnostics on ${path}:\n${diagnostics.join("\n")}`,
  );
};

const routeFileName = (path) =>
  (path === "/" ? "home" : path.slice(1)).replaceAll("/", "-");

before(async () => {
  await access(join(appRoot, "dist", "index.html")).catch(() => {
    throw new Error(
      "Build apps/playground before running this test (bun run build, then bun run --filter '@puzzle-ui/playground' build).",
    );
  });
  await access(viteCli).catch(() => {
    throw new Error("Vite is not installed for apps/playground.");
  });

  if (screenshotDirectory) {
    await mkdir(screenshotDirectory, { recursive: true });
  }

  const port = await reservePort();
  baseUrl = `http://127.0.0.1:${port}`;
  server = spawn(
    process.execPath,
    [
      viteCli,
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--strictPort",
    ],
    {
      cwd: appRoot,
      env: { ...process.env },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  server.stdout.on("data", appendServerOutput);
  server.stderr.on("data", appendServerOutput);

  await waitForServer();
  browser = await chromium.launch({
    headless: true,
    args: BROWSER_LAUNCH_ARGS,
  });
  page = await browser.newPage({
    colorScheme: "light",
    deviceScaleFactor: 1,
    locale: "en-US",
    reducedMotion: "reduce",
    timezoneId: "UTC",
    viewport: { width: 1280, height: 800 },
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      diagnostics.push(`console error: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    diagnostics.push(`uncaught page error: ${error.message}`);
  });
  page.on("requestfailed", (request) => {
    diagnostics.push(
      `request failed: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? "unknown error"})`,
    );
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      diagnostics.push(`HTTP ${response.status()}: ${response.url()}`);
    }
  });
});

after(async () => {
  await browser?.close();

  if (!server || server.exitCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([once(server, "exit"), delay(5_000)]);
  if (server.exitCode === null) server.kill("SIGKILL");
});

test("every page renders without runtime errors or horizontal overflow across the viewport matrix", async () => {
  for (const viewport of viewportMatrix) {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });

    for (const route of routes) {
      clearDiagnostics();
      const response = await page.goto(`${baseUrl}${route.path}`, {
        waitUntil: "load",
      });
      assert.equal(response?.status(), 200, `Unexpected HTTP status for ${route.path}`);
      assert.equal(
        new URL(page.url()).pathname,
        route.path,
        `Unexpected redirect while opening ${route.path}`,
      );
      await settlePage(page);
      await page.getByRole("main").waitFor();

      const heading = page.getByRole("heading", { level: 1 });
      assert.equal(await heading.count(), 1, `Expected one page heading on ${route.path}`);
      assert.equal(
        (await heading.textContent())?.trim(),
        route.heading,
        `Unexpected page heading on ${route.path}`,
      );

      const layout = await page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
      }));
      assert.ok(
        layout.documentWidth <= layout.viewportWidth &&
          layout.bodyWidth <= layout.viewportWidth,
        `Horizontal overflow on ${route.path} at ${viewport.width}px: ${JSON.stringify(layout)}`,
      );

      const brokenImages = await page.locator("img").evaluateAll((images) =>
        images
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.currentSrc || image.src),
      );
      assert.deepEqual(brokenImages, [], `Broken images on ${route.path}`);

      if (screenshotDirectory) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: join(
            screenshotDirectory,
            `${routeFileName(route.path)}-${viewport.name}.png`,
          ),
          fullPage: true,
          animations: "disabled",
          caret: "hide",
          scale: "css",
        });
      }

      assertNoRuntimeErrors(route.path);
    }
  }
});

test("primary navigation works by keyboard and at mobile and desktop widths", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/`);

  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement?.classList.contains("skip-link")),
    true,
    "The first keyboard stop should be the skip link.",
  );
  await page.keyboard.press("Tab");

  const menuToggle = page.locator(".site-menu-toggle");
  await menuToggle.click();
  assert.equal(await menuToggle.getAttribute("aria-expanded"), "true");

  const mobileNavigation = page.getByRole("navigation", {
    name: "Primary navigation",
  });
  await mobileNavigation.getByRole("link", { name: "Capabilities" }).click();
  await page.waitForURL("**/services");
  assert.equal(
    await page.getByRole("heading", { level: 1 }).textContent(),
    "A connected set of building blocks.",
  );

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.reload();
  assert.equal(await mobileNavigation.isVisible(), true);
  assert.equal(
    await page.getByRole("button", { name: "Open navigation" }).isVisible(),
    false,
  );
  assert.equal(
    await mobileNavigation.getByRole("link").count(),
    primaryNavigationLinks.length,
  );

  const footerNavigation = page.getByRole("navigation", {
    name: "Footer navigation",
  });
  assert.equal(
    await footerNavigation.getByRole("link").count(),
    primaryNavigationLinks.length - 1,
  );
});

test("feature tabs, FAQs, and journal filters respond to user input", async () => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${baseUrl}/`);

  const sectionsTab = page.getByRole("tab", { name: "Composable sections" });
  await sectionsTab.click();
  assert.equal(await sectionsTab.getAttribute("aria-selected"), "true");

  await page.goto(`${baseUrl}/services`);
  const question = page.getByRole("button", {
    name: "Do page sections include application behavior?",
  });
  await question.focus();
  await page.keyboard.press("Enter");
  assert.equal(await question.getAttribute("aria-expanded"), "true");

  await page.goto(`${baseUrl}/journal`);
  const search = page.getByRole("searchbox", { name: "Search stories" });
  await search.fill("tokens");
  await page.getByRole("status").getByText("1 story found").waitFor();
  await search.clear();
  await page.getByRole("button", { name: "Quality" }).click();
  await page.getByRole("status").getByText("1 story found").waitFor();
  await search.fill("no matching entry");
  await page.getByRole("status").getByText("0 stories found").waitFor();
  await page.getByRole("heading", { name: "No stories match those filters." }).waitFor();
});

test("contact form validates required fields and announces its client-only confirmation", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/contact`);

  const form = page.locator("form");
  assert.equal(await form.evaluate((element) => element.checkValidity()), false);

  await page.getByRole("textbox", { name: "Name" }).fill("Alex Example");
  await page.getByRole("textbox", { name: "Email" }).fill("alex@example.test");
  await page.getByRole("textbox", { name: "Message" }).fill("A sample message.");
  assert.equal(await form.evaluate((element) => element.checkValidity()), true);
  await page.getByRole("button", { name: "Show demo confirmation" }).click();
  await page
    .getByRole("status")
    .getByText("Demo complete. No message was sent or stored.")
    .waitFor();
  assert.equal(await page.getByRole("textbox", { name: "Name" }).inputValue(), "");
});

test("not-found routes have a recovery path and article pages expose breadcrumbs", async () => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${baseUrl}/missing-reference-route`);
  await page.getByRole("heading", { name: routes.at(-1).heading }).waitFor();
  await page.getByRole("link", { name: "Return home" }).click();
  await page.waitForURL(`${baseUrl}/`);

  await page.goto(`${baseUrl}/journal/choosing-the-right-layer`);
  const breadcrumbs = page.getByRole("navigation", { name: "Breadcrumb" });
  assert.equal(await breadcrumbs.getByRole("link").count(), 2);
  assert.equal(
    await page.getByRole("heading", { level: 1 }).textContent(),
    "Choosing the right layer",
  );
});
