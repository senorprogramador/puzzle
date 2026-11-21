import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { extname, resolve, sep } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
let server;
let browser;
let baseUrl;
let browserUnavailable;

const closeServer = async () => {
  if (!server?.listening) return;
  await new Promise((resolveClose) => server.close(resolveClose));
  server = undefined;
};

before(async () => {
  const executablePath = chromium.executablePath();
  try {
    await access(executablePath);
  } catch {
    browserUnavailable = `Playwright Chromium is not installed at ${executablePath}.`;
    return;
  }

  const distRoot = resolve(packageRoot, "dist");
  const fixtureFiles = new Map([
    ["/tests/browser-fixture.html", resolve(packageRoot, "tests/browser-fixture.html")],
    ["/tests/browser-fixture/main.js", resolve(packageRoot, "tests/browser-fixture/main.js")],
    ["/tests/fixtures/finite-duration.webm", resolve(packageRoot, "tests/fixtures/finite-duration.webm")],
  ]);
  server = createServer(async (request, response) => {
    const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
    let filePath = fixtureFiles.get(pathname);
    if (!filePath && pathname.startsWith("/dist/")) {
      const candidate = resolve(packageRoot, `.${pathname}`);
      if (candidate.startsWith(`${distRoot}${sep}`)) filePath = candidate;
    }
    if (!filePath) {
      response.writeHead(404);
      response.end();
      return;
    }
    try {
      const content = await readFile(filePath);
      const extension = extname(filePath);
      response.writeHead(200, {
        "content-type":
          extension === ".html"
            ? "text/html; charset=utf-8"
            : extension === ".js"
              ? "text/javascript; charset=utf-8"
              : extension === ".webm"
                ? "video/webm"
                : "application/octet-stream",
        "cache-control": "no-store",
      });
      response.end(content);
    } catch {
      response.writeHead(404);
      response.end();
    }
  });
  try {
    await new Promise((resolveListen, rejectListen) => {
      server.once("error", rejectListen);
      server.listen(0, "127.0.0.1", resolveListen);
    });
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("The browser fixture server did not expose a local address.");
    }
    baseUrl = `http://127.0.0.1:${address.port}/tests/browser-fixture.html`;
    browser = await chromium.launch({ headless: true });
  } catch (error) {
    await closeServer();
    browserUnavailable =
      error instanceof Error ? error.message : "Playwright Chromium could not launch.";
  }
});

after(async () => {
  await browser?.close();
  await closeServer();
});

const withPage = async (run) => {
  if (browserUnavailable) return null;
  const page = await browser.newPage();
  try {
    await page.goto(baseUrl);
    await page.waitForFunction(() => window.mediaBrowserTest !== undefined);
    return await run(page);
  } finally {
    await page.close();
  }
};

test("in-memory testing adapters load in Node ESM and CommonJS", async () => {
  const esm = await import("@puzzle-ui/media/testing/adapters");
  const cjs = createRequire(import.meta.url)("@puzzle-ui/media/testing/adapters");
  for (const entry of [esm, cjs]) {
    assert.equal(typeof entry.InMemoryMediaObjectStorageAdapter, "function");
    assert.equal(typeof entry.InMemoryMediaProcessingQueueAdapter, "function");
  }
});

test("CommonJS builds do not introduce Node URL dependencies into browser processing", async () => {
  const dist = resolve(packageRoot, "dist");
  const files = (await readdir(dist)).filter((file) => file.endsWith(".cjs"));
  files.push("browser/index.cjs");
  for (const file of files) {
    const source = await readFile(resolve(dist, file), "utf8");
    assert.doesNotMatch(source, /\brequire\(["'](?:node:)?url["']\)/, file);
  }
});

test("resizes images and creates bounded variants with explicit original retention", async (t) => {
  if (browserUnavailable) {
    t.skip(browserUnavailable);
    return;
  }
  const result = await withPage((page) =>
    page.evaluate(() => window.mediaBrowserTest.imageOutputs()),
  );
  assert.ok(result);
  assert.ok(result.resized.width <= 100);
  assert.ok(result.resized.height <= 100);
  assert.ok(result.resized.size > 0);
  assert.equal(result.resized.format, "image/png");
  assert.equal(result.transparentCornerAlpha, 0);
  assert.ok(
    Math.abs(
      result.resized.width / result.resized.height -
        result.source.width / result.source.height,
    ) < 0.03,
  );
  assert.deepEqual(
    result.variants.map(({ name }) => name).sort(),
    ["desktop", "mobile"],
  );
  assert.ok(
    result.variants.every(
      ({ width, height }) => width <= 256 && height <= 256,
    ),
  );
  assert.equal(result.retainedOriginal, true);
  assert.equal(result.omittedOriginal, true);
  assert.deepEqual(result.noUpscale, {
    width: 40,
    height: 20,
    resized: false,
  });
});

test("processes images in a worker and terminates it on abort", async (t) => {
  if (browserUnavailable) {
    t.skip(browserUnavailable);
    return;
  }
  await withPage(async (page) => {
    const workers = [];
    page.on("worker", (worker) => workers.push(worker));
    await page.evaluate(() => {
      window.workerMessages = [];
      window.workerTerminations = 0;
      const OriginalWorker = window.Worker;
      window.Worker = class extends OriginalWorker {
        constructor(...args) {
          super(...args);
          this.addEventListener("message", (event) => {
            window.workerMessages.push(event.data.type);
          });
        }
        terminate() {
          window.workerTerminations += 1;
          super.terminate();
        }
      };
    });
    const result = await page.evaluate(() => window.mediaBrowserTest.workerOutput());
    assert.ok(workers.length > 0, "an image worker was created");
    assert.match(workers[0].url(), /image-worker\.js/);
    assert.equal(result.width, 80);
    assert.equal(result.height, 45);
    assert.equal(result.fileName, "photo.png");
    assert.ok(result.progress.some(({ stage }) => stage === "encode"));
    assert.ok(await page.evaluate(() => window.workerMessages.includes("result")));
    assert.equal(await page.evaluate(() => window.workerMessages.includes("fallback")), false);
    const aborted = await page.evaluate(() => window.mediaBrowserTest.workerOutput(true));
    assert.equal(aborted.error, "AbortError");
    assert.ok(aborted.progress.some(({ stage }) => stage === "decode"));
    assert.equal(await page.evaluate(() => window.workerTerminations), 2);
  });
});

test("surfaces worker execution failures instead of reporting success", async (t) => {
  if (browserUnavailable) {
    t.skip(browserUnavailable);
    return;
  }
  await withPage(async (page) => {
    await page.route("**/image-worker.js", (route) =>
      route.fulfill({
        contentType: "text/javascript",
        body: 'self.postMessage({type:"ready"}); self.onmessage = () => { throw new Error("worker failure"); };',
      }),
    );
    const result = await page.evaluate(() => window.mediaBrowserTest.workerOutput());
    assert.equal(result.error, "MediaProcessingError");
    assert.equal(result.code, "PROCESSING_FAILED");
  });
});

test("falls back when the worker cannot load", async (t) => {
  if (browserUnavailable) {
    t.skip(browserUnavailable);
    return;
  }
  await withPage(async (page) => {
    const warnings = [];
    page.on("console", (message) => {
      if (message.type() === "warning") warnings.push(message.text());
    });
    await page.route("**/image-worker.js", (route) => route.abort());
    const result = await page.evaluate(() => window.mediaBrowserTest.workerOutput());
    assert.equal(result.width, 80);
    assert.equal(result.height, 45);
    assert.ok(warnings.some((warning) => warning.includes("Image worker could not load")));
  });
});

test("exports normalized crops without upscaling and preserves arbitrary profile names", async (t) => {
  if (browserUnavailable) {
    t.skip(browserUnavailable);
    return;
  }
  const result = await withPage((page) =>
    page.evaluate(() => window.mediaBrowserTest.cropOutputs()),
  );
  assert.deepEqual(result.crop, {
    width: 80,
    height: 90,
    originalWidth: 320,
    originalHeight: 180,
    format: "image/png",
    alpha: 0,
  });
  assert.deepEqual(result.unscaled, { width: 160, height: 90 });
  assert.deepEqual(result.plainCrop, { width: 160, height: 90 });
  assert.equal(result.tinyCropCode, "VALIDATION");
  assert.deepEqual(result.names, ["__proto__", "constructor"]);
  assert.deepEqual(result.widths, [50, 60]);
});

test("reads local video metadata, extracts a poster, and revokes object URLs", async (t) => {
  if (browserUnavailable) {
    t.skip(browserUnavailable);
    return;
  }
  const result = await withPage((page) =>
    page.evaluate(() => window.mediaBrowserTest.videoOutputs()),
  );
  assert.ok(result);
  if (!result.supported) {
    t.skip(result.reason);
    return;
  }
  assert.ok(Number.isFinite(result.metadata.duration));
  assert.ok(result.metadata.duration >= 0.9 && result.metadata.duration <= 1.1);
  assert.equal(result.metadata.width, 160);
  assert.equal(result.metadata.height, 90);
  assert.match(result.metadata.mimeType, /^video\/webm/);
  assert.ok(result.poster.width <= 80);
  assert.ok(result.poster.height <= 80);
  assert.ok(result.poster.size > 0);
  assert.equal(result.poster.format, "image/jpeg");
  assert.ok(result.created.length >= 2);
  assert.deepEqual([...result.created].sort(), [...result.revoked].sort());
});

test("rejects corrupt media and revokes URLs on failure and abort", async (t) => {
  if (browserUnavailable) {
    t.skip(browserUnavailable);
    return;
  }
  const result = await withPage((page) =>
    page.evaluate(() => window.mediaBrowserTest.corruptAndAbortCleanup()),
  );
  assert.ok(result);
  assert.equal(result.unsupportedFormat.name, "UnsupportedMediaError");
  assert.equal(result.unsupportedFormat.code, "UNSUPPORTED_MEDIA");
  assert.deepEqual(result.unsupportedFormat.created, []);
  assert.deepEqual(result.unsupportedFormat.revoked, []);
  assert.equal(result.corruptImage.name, "InvalidMediaFileError");
  assert.equal(result.corruptImage.code, "INVALID_FILE");
  assert.ok(result.corruptImage.created.length > 0);
  assert.deepEqual(
    [...result.corruptImage.created].sort(),
    [...result.corruptImage.revoked].sort(),
  );
  assert.equal(result.corruptVideo.name, "InvalidMediaFileError");
  assert.equal(result.corruptVideo.code, "INVALID_FILE");
  assert.deepEqual(
    [...result.corruptVideo.created].sort(),
    [...result.corruptVideo.revoked].sort(),
  );
  assert.equal(result.abortedVideo.name, "AbortError");
  assert.deepEqual(
    [...result.abortedVideo.created].sort(),
    [...result.abortedVideo.revoked].sort(),
  );
});
