import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { chromium, type Browser } from "playwright";

const site = fileURLToPath(new URL("..", import.meta.url));
const server = spawn("node", [`${site}/.output/server/index.mjs`], {
  cwd: site,
  env: { ...process.env, HOST: "127.0.0.1", PORT: "0", NODE_ENV: "production" },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser: Browser | undefined;
let output = "";
const capture = (chunk: Buffer) => {
  output = (output + chunk.toString()).slice(-4000);
};
server.stdout.on("data", capture);
server.stderr.on("data", capture);

const paths = [
  "/docs/ui/utilities/preview",
  ...[
    "hero",
    "features",
    "dashboard",
    "data-display",
    "feedback",
    "navigation",
    "project",
    "settings",
    "product-showcase",
  ].map((component) => `/docs/pieces/components/${component}`),
];

try {
  const origin = await new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Site did not start:\n${output}`));
    }, 30000);
    server.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    server.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Site exited with ${code}:\n${output}`));
    });
    server.stdout.on("data", () => {
      const url = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
      if (url) {
        clearTimeout(timer);
        resolve(url);
      }
    });
  });
  assert.equal((await fetch(origin)).status, 200);
  browser = await chromium.launch();

  for (const width of [390, 800, 1440]) {
    for (const path of paths) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (
          message.type() === "error" &&
          /hydrat|server rendered|did not match/i.test(message.text())
        ) {
          errors.push(message.text());
        }
      });
      let releaseScripts: () => void = () => {};
      const hydrationGate = new Promise<void>((resolve) => {
        releaseScripts = resolve;
      });
      await page.route("**/*", async (route) => {
        const request = route.request();
        if (new URL(request.url()).origin !== origin) {
          await route.abort();
          return;
        }
        if (request.resourceType() === "script") await hydrationGate;
        await route.continue();
      });

      try {
        await page.goto(`${origin}${path}`, { waitUntil: "commit" });
        await page.waitForFunction(() => {
          const viewport = document.querySelector(".puzzle-preview__viewport");
          return viewport && getComputedStyle(viewport).position === "relative";
        });
        await page.evaluate(() => document.fonts.ready.then(() => undefined));
        assert.equal(await page.locator(".puzzle-preview__frame").count(), 0, `${path}: no SSR iframes`);
        assert.equal(await page.locator("[data-preview-placeholder]").count(), 0, `${path}: no SSR example mounts`);
        const getText = () => page.locator(".puzzle-site-docs .prose.flex-1").evaluate((body) => {
          const text = body.cloneNode(true) as HTMLElement;
          text.querySelectorAll(".puzzle-preview").forEach((preview) => preview.remove());
          return text.textContent;
        });
        const serverText = await getText();
        assert.ok(serverText && serverText.trim().length > 100, `${path}: server-rendered documentation`);
        const geometry = await page.evaluateHandle(() => {
          const previews = [...document.querySelectorAll(".puzzle-preview")];
          const state = {
            initial: previews.map((preview) => preview.getBoundingClientRect().height),
            maxShift: 0,
            framesAtLoad: -1,
          };
          window.addEventListener("load", () => {
            state.framesAtLoad = document.querySelectorAll(".puzzle-preview__frame").length;
          }, { once: true });
          const observer = new ResizeObserver(() => {
            previews.forEach((preview, index) => {
              state.maxShift = Math.max(
                state.maxShift,
                Math.abs(preview.getBoundingClientRect().height - state.initial[index]!),
              );
            });
          });
          previews.forEach((preview) => observer.observe(preview));
          return { state, observer };
        });

        releaseScripts();
        await page.waitForLoadState("load");
        const previews = page.locator(".puzzle-preview");
        for (let index = 0; index < await previews.count(); index++) {
          const preview = previews.nth(index);
          await preview.scrollIntoViewIfNeeded();
          await preview.locator(".puzzle-preview__frame").waitFor();
          await preview.getByRole("progressbar", { name: "Loading preview" }).waitFor({ state: "detached" });
        }
        await page.waitForFunction(() => {
          const frames = [...document.querySelectorAll<HTMLIFrameElement>(".puzzle-preview__frame")];
          return frames.length === document.querySelectorAll(".puzzle-preview").length && frames.every((frame) =>
            frame.contentDocument?.querySelector(".puzzle-preview__content"),
          );
        });
        await page.waitForFunction(() => !document.querySelector("[data-preview-placeholder]"));
        await page.evaluate(async () => {
          const frames = [...document.querySelectorAll<HTMLIFrameElement>(".puzzle-preview__frame")];
          await Promise.all(frames.map((frame) => frame.contentDocument!.fonts.ready));
          await new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          });
        });

        const result = await geometry.evaluate(({ state, observer }) => {
          observer.disconnect();
          return { previews: state.initial.length, maxShift: state.maxShift, framesAtLoad: state.framesAtLoad };
        });
        await geometry.dispose();
        assert.ok(result.previews > 0, `${path}: server-rendered previews`);
        assert.deepEqual(errors, [], `${width}px ${path}: browser errors`);
        assert.equal(result.framesAtLoad, 0, `${width}px ${path}: previews did not block window load`);
        assert.equal(await getText(), serverText, `${width}px ${path}: MDX text is unchanged by hydration`);
        assert.ok(
          result.maxShift <= 1,
          `${width}px ${path}: preview height shifted by ${result.maxShift}px`,
        );
        console.log(`${width}px ${path}: ${result.previews} previews, ${result.maxShift}px maximum shift`);
      } finally {
        releaseScripts();
        await page.close();
      }
    }
  }
  console.log("Preview SSR, delayed hydration and iframe layout checks passed.");
} finally {
  await browser?.close();
  if (server.exitCode === null && server.signalCode === null) {
    const exited = once(server, "exit");
    server.kill("SIGTERM");
    const timer = setTimeout(() => server.kill("SIGKILL"), 5000);
    timer.unref();
    await exited;
    clearTimeout(timer);
  }
}
