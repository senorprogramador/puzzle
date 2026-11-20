import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { access, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";

import { chromium } from "playwright";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const nextCli = join(appRoot, "node_modules", "next", "dist", "bin", "next");
let nextServer;
let browser;
let baseUrl;
let serverOutput = "";

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
    if (nextServer.exitCode !== null) {
      throw new Error(`Next.js exited before becoming ready:\n${serverOutput}`);
    }

    try {
      const response = await fetch(`${baseUrl}/rendering`);
      if (response.ok) return;
    } catch {}

    await delay(250);
  }

  throw new Error(`Next.js did not become ready:\n${serverOutput}`);
};

const readFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return readFiles(path);
      return entry.name.endsWith(".js") ? [await readFile(path, "utf8")] : [];
    }),
  );

  return nested.flat();
};

before(async () => {
  await access(join(appRoot, ".next", "BUILD_ID")).catch(() => {
    throw new Error("Run the workspace-next production build before this test.");
  });

  const port = await reservePort();
  baseUrl = `http://127.0.0.1:${port}`;
  nextServer = spawn(process.execPath, [nextCli, "start", "-p", String(port)], {
    cwd: appRoot,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  nextServer.stdout.on("data", appendServerOutput);
  nextServer.stderr.on("data", appendServerOutput);

  await waitForServer();
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser?.close();

  if (!nextServer || nextServer.exitCode !== null) return;
  nextServer.kill("SIGTERM");
  await Promise.race([once(nextServer, "exit"), delay(5_000)]);
  if (nextServer.exitCode === null) nextServer.kill("SIGKILL");
});

test("App Router preserves server output, streams Suspense content, and hydrates deferred UI", async () => {
  const response = await fetch(`${baseUrl}/rendering`);
  assert.equal(response.status, 200);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    chunks.push(decoder.decode(value, { stream: true }));
  }
  chunks.push(decoder.decode());

  const html = chunks.join("");
  const fallbackChunk = chunks.findIndex((chunk) =>
    chunk.includes("streaming-fallback"),
  );
  const streamedContentChunk = chunks.findIndex((chunk) =>
    chunk.includes("rendering-streamed-content"),
  );

  assert.match(html, /data-testid="rendering-hero"/);
  assert.match(html, /data-testid="rendering-static-content"/);
  assert.match(html, /data-testid="rendering-ssr-content"/);
  assert.match(html, /rel="preload"[^>]*as="image"/);
  for (const profile of ["conservative", "balanced", "aggressive", "custom"]) {
    assert.match(
      html,
      new RegExp(`data-testid="optimization-profile-content-${profile}"`),
    );
  }
  assert.match(html, /data-testid="optimization-profile-critical"/);
  assert.notEqual(fallbackChunk, -1, "The Suspense fallback should be in the stream.");
  assert.ok(
    streamedContentChunk > fallbackChunk,
    "The Server Component should stream after its Suspense fallback.",
  );

  const noJavaScriptPage = await browser.newPage({ javaScriptEnabled: false });
  await noJavaScriptPage.goto(`${baseUrl}/rendering`);
  assert.equal(await noJavaScriptPage.getByTestId("rendering-static-content").count(), 1);
  assert.equal(await noJavaScriptPage.getByTestId("rendering-hero").count(), 1);
  assert.equal(await noJavaScriptPage.getByRole("main").count(), 1);
  assert.equal(
    await noJavaScriptPage.getByRole("region", { name: "Testimonials" }).count(),
    1,
  );
  assert.equal(await noJavaScriptPage.getByRole("contentinfo").count(), 1);
  await noJavaScriptPage.close();

  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  const hydrationErrors = [];
  const scriptRequests = new Set();
  page.on("request", (request) => {
    if (
      request.resourceType() === "script" &&
      request.url().includes("/_next/static/chunks/")
    ) {
      scriptRequests.add(request.url());
    }
  });
  page.on("pageerror", (error) => hydrationErrors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydration|did not match|server rendered/i.test(message.text())
    ) {
      hydrationErrors.push(message.text());
    }
  });

  await page.goto(`${baseUrl}/rendering`);
  await page.waitForFunction(
    () => document.querySelector('[data-testid="rendering-hydrated"]')?.dataset.hydrated === "true",
  );
  for (const profile of ["conservative", "balanced", "aggressive", "custom"]) {
    assert.equal(
      await page.getByTestId(`optimization-profile-content-${profile}`).count(),
      1,
    );
  }
  assert.equal(await page.getByTestId("optimization-profile-critical").count(), 1);
  assert.equal(await page.getByTestId("rendering-client-slot-content").count(), 1);
  assert.equal(await page.locator('[data-testid^="rendering-scroll-section-"]').count(), 16);
  assert.equal(await page.getByRole("main").count(), 1);
  assert.equal(
    await page.getByRole("navigation", { name: "Rendering test navigation" }).count(),
    1,
  );
  assert.equal(
    await page.getByRole("region", { name: "Testimonials" }).count(),
    1,
  );
  assert.equal(await page.getByRole("contentinfo").count(), 1);
  assert.equal(await page.getByTestId("gallery-boundary-fallback").count(), 1);
  assert.equal(await page.getByTestId("dynamic-gallery").count(), 0);

  const scriptRequestsBeforeActivation = new Set(scriptRequests);
  const galleryBoundary = page.getByTestId("deferred-gallery");
  await galleryBoundary.evaluate((element) => {
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top - window.innerHeight - 100);
  });
  await page.getByTestId("dynamic-gallery").waitFor();
  assert.ok(
    (await galleryBoundary.evaluate((element) => element.getBoundingClientRect().top)) >
      (await page.evaluate(() => window.innerHeight)),
    "The gallery should activate while it is still near, but outside, the viewport.",
  );
  assert.ok(
    [...scriptRequests].some((url) => !scriptRequestsBeforeActivation.has(url)),
    "The dynamic Client Component should load its chunk after proximity activation.",
  );
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByTestId("dynamic-gallery").waitFor();
  assert.equal(await page.getByRole("img", { name: "Puzzle gallery preview" }).count(), 1);
  await page.getByRole("button", { name: "Increase gallery count" }).click();
  assert.equal(await page.getByTestId("gallery-count").textContent(), "Gallery count: 1");

  const mapRequestsBeforeActivation = new Set(scriptRequests);
  let markMapRequestStarted;
  const mapRequestStarted = new Promise((resolve) => {
    markMapRequestStarted = resolve;
  });
  let releaseMapResponse;
  const mapResponseGate = new Promise((resolve) => {
    releaseMapResponse = resolve;
  });
  let holdMapRequest = true;
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (request.url().includes("rendering-map-resource")) {
      if (holdMapRequest) {
        holdMapRequest = false;
        markMapRequestStarted();
        await mapResponseGate;
        await route.abort("failed");
      } else {
        await route.fulfill({
          status: 200,
          contentType: "text/plain",
          body: "ok",
        });
      }
      return;
    }

    await route.continue();
  });
  await page.getByTestId("deferred-map-container").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Load interactive map" }).click();
  await mapRequestStarted;
  await page.getByTestId("map-loading").waitFor();
  releaseMapResponse();
  await page.getByTestId("map-error").waitFor();
  const retryMapButton = page.getByRole("button", { name: "Retry map loading" });
  await page.keyboard.press("Tab");
  assert.equal(
    await retryMapButton.evaluate((element) => element === document.activeElement),
    true,
    "Keyboard focus should reach the map retry action after a network failure.",
  );
  await page.keyboard.press("Enter");
  await page.getByTestId("interactive-map").waitFor();
  await page.unroute("**/*");
  assert.ok(
    [...scriptRequests].some((url) => !mapRequestsBeforeActivation.has(url)),
    "The interactive map module should load after the resource request is retried.",
  );
  await page.getByRole("button", { name: "Zoom in map" }).click();
  assert.equal(await page.getByTestId("map-zoom").textContent(), "Map zoom: 2");

  await page.getByRole("button", { name: "Trigger deferred load error" }).click();
  await page.getByTestId("deferred-load-error").waitFor();
  assert.equal(await page.getByTestId("deferred-load-attempts").textContent(), "1");
  const retryFailingLoad = page.getByRole("button", { name: "Retry failing load" });
  await page.keyboard.press("Tab");
  assert.equal(
    await retryFailingLoad.evaluate((element) => element === document.activeElement),
    true,
  );
  await page.keyboard.press("Enter");
  await page.waitForFunction(
    () => document.querySelectorAll('[data-testid="dynamic-gallery"]').length === 2,
  );
  assert.equal(await page.locator('[data-testid="dynamic-gallery"]').count(), 2);
  assert.equal(await page.getByTestId("deferred-load-error").count(), 0);

  await page.getByRole("link", { name: "Open rendering navigation target" }).click();
  await page.getByTestId("rendering-navigation-target").waitFor();
  await page.goBack();
  await page.getByTestId("rendering-hero").waitFor();
  await page.getByRole("link", { name: "Open rendering error scenario" }).click();
  await page.getByTestId("next-route-error").waitFor();
  await page.getByRole("button", { name: "Retry rendering route" }).click();
  await page.getByTestId("next-route-error").waitFor();
  await page.goBack();
  await page.getByTestId("rendering-hero").waitFor();
  assert.deepEqual(hydrationErrors, []);
  await page.close();

  const clientBundles = await readFiles(join(appRoot, ".next", "static", "chunks"));
  assert.equal(
    clientBundles.some((bundle) =>
      bundle.includes("This content is rendered by a Server Component."),
    ),
    false,
    "Server Component implementation text must not be included in client bundles.",
  );
});
