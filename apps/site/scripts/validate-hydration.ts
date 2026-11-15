import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser } from "playwright";

const site = fileURLToPath(new URL("..", import.meta.url));
const server = spawn("node", [resolve(site, ".output/server/index.mjs")], {
  cwd: site,
  env: { ...process.env, NODE_ENV: "production", HOST: "127.0.0.1", PORT: "0", NO_COLOR: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser: Browser | undefined;
let output = "";
const capture = (chunk: Buffer) => {
  output = (output + chunk.toString()).slice(-4000);
};
server.stdout.on("data", capture);
server.stderr.on("data", capture);

try {
  const origin = await new Promise<string>((resolveOrigin, reject) => {
    const timer = setTimeout(() => reject(new Error(`Site did not start:\n${output}`)), 30000);
    const clear = () => clearTimeout(timer);
    server.once("error", (error) => { clear(); reject(error); });
    server.once("exit", (code) => {
      clear();
      reject(new Error(`Site exited with ${code}:\n${output}`));
    });
    server.stdout.on("data", () => {
      const url = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
      if (url) { clear(); resolveOrigin(url); }
    });
  });
  assert.equal((await fetch(`${origin}/docs/getting-started`)).status, 200);
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" &&
        /hydrat|server rendered|did not match|cannot be a descendant|cannot contain a nested/i.test(message.text())) {
      errors.push(message.text());
    }
  });

  const check = async (path: string) => {
    await page.waitForLoadState("networkidle");
    assert.deepEqual(errors, [], `Browser errors on ${path}`);
    await page.waitForFunction((pathname) => {
      const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      const script = document.querySelector('script[type="application/ld+json"]');
      if (canonical?.href !== `https://puzzle-ui.com${pathname}` || !script?.textContent) {
        return false;
      }
      const graph: { "@graph": { "@id"?: string }[] } = JSON.parse(script.textContent);
      return graph["@graph"].some((node) =>
        node["@id"] === `https://puzzle-ui.com${pathname}#webpage`,
      );
    }, path, { timeout: 10000 });
    assert.deepEqual(errors, [], `Browser errors on ${path}`);
    const state = await page.evaluate(() => ({
      titles: document.querySelectorAll("title").length,
      descriptions: document.querySelectorAll('meta[name="description"]').length,
      canonicals: [...document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')]
        .map((link) => link.href),
      openGraph: document.querySelectorAll('meta[property="og:title"]').length,
      twitter: document.querySelectorAll('meta[name="twitter:title"]').length,
      scripts: [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((script) => ({ id: script.id, text: script.textContent })),
    }));
    assert.equal(state.titles, 1, `${path}: title`);
    assert.equal(state.descriptions, 1, `${path}: description`);
    assert.deepEqual(state.canonicals, [`https://puzzle-ui.com${path}`], `${path}: canonical`);
    assert.equal(state.openGraph, 1, `${path}: Open Graph title`);
    assert.equal(state.twitter, 1, `${path}: Twitter title`);
    assert.equal(state.scripts.length, 1, `${path}: JSON-LD script`);
    assert.equal(state.scripts[0]!.id, "puzzle-seo-jsonld");
    const graph: { "@graph": { "@id"?: string }[] } = JSON.parse(state.scripts[0]!.text!);
    const ids = graph["@graph"].map((node) => node["@id"]);
    assert.equal(new Set(ids).size, ids.length, `${path}: unique graph entities`);
    assert.ok(ids.includes(`https://puzzle-ui.com${path}#webpage`), `${path}: active webpage`);
    const webpages = ids.filter((id) => id?.startsWith("https://puzzle-ui.com/docs/") && id.endsWith("#webpage"));
    assert.equal(webpages.length, path === "/" ? 0 : 1, `${path}: no stale route graph`);
  };

  for (const path of [
    "/", "/docs/getting-started", "/docs/tutorials/seo", "/docs/tutorials/auth",
    "/docs/tutorials/storage", "/docs/tutorials",
  ]) {
    const response = await page.goto(`${origin}${path}`);
    assert.equal(response?.status(), 200);
    const html = await response!.text();
    assert.equal((html.match(/<title>/g) ?? []).length, 1, `${path}: SSR title`);
    assert.equal((html.match(/type="application\/ld\+json"/g) ?? []).length, 1, `${path}: SSR graph`);
    await check(path);
  }
  for (const path of ["/docs/tutorials/seo", "/docs/tutorials/storage", "/docs/tutorials/auth"]) {
    await page.locator(`a[href="${path}"]`).first().click();
    await page.waitForURL((url) => url.pathname === path);
    await check(path);
  }
  await page.goBack();
  await check("/docs/tutorials/storage");
  await page.goForward();
  await check("/docs/tutorials/auth");
  await page.reload();
  await check("/docs/tutorials/auth");
  for (const path of ["/", "/docs/getting-started"]) {
    await page.locator(`a[href="${path}"]`).first().click();
    await page.waitForURL((url) => url.pathname === path);
    await check(path);
  }
  console.log("Hydration, navigation, history, reload, metadata and JSON-LD checks passed.");
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
