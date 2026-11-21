import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { chromium, type Browser } from "playwright";

const site = fileURLToPath(new URL("..", import.meta.url));
const paths = [
  "/",
  "/docs",
  "/docs/core",
  "/docs/ui",
  "/docs/ui/actions",
  "/docs/ui/data-display",
  "/docs/ui/editors",
  "/docs/ui/forms",
  "/docs/ui/layout",
  "/docs/ui/navigation",
  "/docs/ui/overlays",
  "/docs/ui/typography",
  "/docs/ui/utilities",
  "/docs/ui/forms/text-input",
  "/docs/pieces",
  "/docs/pieces/components/marketing",
  "/docs/tutorials/theme",
];
const widths = [320, 375, 768, 1024, 1440, 1920];
const categoryPaths = new Set(paths.filter((path) => /^\/docs\/ui\/[^/]+$/.test(path)));

const startSite = async () => {
  const server = spawn("node", [`${site}/.output/server/index.mjs`], {
    cwd: site,
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      PORT: "0",
      NODE_ENV: "production",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  const capture = (chunk: Buffer) => {
    output = (output + chunk.toString()).slice(-4000);
    const origin = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
    if (origin) resolveOrigin(origin);
  };
  let resolveOrigin: (origin: string) => void = () => {};
  const originPromise = new Promise<string>((resolve, reject) => {
    resolveOrigin = resolve;
    const timer = setTimeout(
      () => reject(new Error(`Documentation server did not start:\n${output}`)),
      30000,
    );
    server.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    server.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Documentation server exited with ${code}:\n${output}`));
    });
    server.stdout?.on("data", capture);
    server.stderr?.on("data", capture);
  });

  try {
    return { origin: await originPromise, server };
  } catch (error) {
    server.kill("SIGTERM");
    throw error;
  }
};

const stopSite = async (server: ReturnType<typeof spawn>) => {
  if (server.exitCode !== null || server.signalCode !== null) return;
  const exited = once(server, "exit");
  server.kill("SIGTERM");
  const timer = setTimeout(() => server.kill("SIGKILL"), 5000);
  timer.unref();
  await exited;
  clearTimeout(timer);
};

let browser: Browser | undefined;
let server: ReturnType<typeof spawn> | undefined;

try {
  const started = await startSite();
  server = started.server;
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 320, height: 1000 } });
  const pageErrors: Array<{ path: string; message: string }> = [];
  let activePath = "initial page";
  page.on("pageerror", (error) =>
    pageErrors.push({ path: activePath, message: error.message }),
  );

  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });

    for (const path of paths) {
      activePath = path;
      const response = await page.goto(`${started.origin}${path}`, {
        waitUntil: "networkidle",
      });
      assert.equal(response?.status(), 200, `${path} returns HTTP 200`);

      const geometry = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
      }));
      assert.ok(
        geometry.document <= geometry.viewport,
        `${path} has no horizontal page overflow at ${width}px (${geometry.document}px)`,
      );

      if (categoryPaths.has(path)) {
        const grid = page.locator(".puzzle-component-catalog");
        assert.ok((await grid.count()) > 0, `${path} renders its catalog`);
        const columns = await grid.evaluate(
          (element) =>
            getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/)
              .length,
        );
        const expectedColumns = width < 768 ? 1 : width < 1024 ? 2 : 3;
        assert.equal(
          columns,
          expectedColumns,
          `${path} uses ${expectedColumns} catalog columns at ${width}px`,
        );

        const cardLinks = grid.locator("a");
        assert.ok((await cardLinks.count()) > 0, `${path} has linked cards`);
        const firstCard = cardLinks.first();
        const cardName = await firstCard.innerText();
        assert.ok(cardName.trim().length > 0, `${path} card has a name`);
        await firstCard.focus();
        await page.keyboard.press("Tab");
        const focusedLinkHasVisibleFocus = await page.evaluate(() => {
          const active = document.activeElement;
          if (!(active instanceof HTMLAnchorElement)) return false;
          const style = getComputedStyle(active);
          return (
            active.matches(":focus-visible") &&
            style.outlineStyle !== "none" &&
            Number.parseFloat(style.outlineWidth) > 0
          );
        });
        assert.ok(
          focusedLinkHasVisibleFocus,
          `${path} catalog cards retain visible keyboard focus`,
        );
      }

      assert.deepEqual(
        pageErrors.filter((error) => error.path === path),
        [],
        `${path} hydrates without browser errors`,
      );

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      assert.ok(canonical, `${path} has a canonical URL`);
    }
  }

  const errorsOutsideCatalogPages = pageErrors.filter(
    (error) => !categoryPaths.has(error.path),
  );
  if (errorsOutsideCatalogPages.length > 0) {
    console.warn(
      "Browser errors observed outside the new UI category routes:",
      errorsOutsideCatalogPages,
    );
  }
  console.log(
    `Validated ${paths.length} routes at ${widths.length} viewport widths.`,
  );
} finally {
  await browser?.close();
  if (server) await stopSite(server);
}
