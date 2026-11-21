import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser, type Page } from "playwright";
import { getDocumentationInventory } from "../src/lib/documentation-inventory";
import { items } from "../src/components/layout/sidebar/index";
import { findNavigationPath } from "../src/components/layout/sidebar/helpers";
import type { TreeViewItem } from "../src/components/layout/sidebar/types";
import { SITE_URL } from "../src/lib/seo";

type GraphNode = {
  "@id"?: string;
  item?: string;
  itemListElement?: Array<{ "@id"?: string; item?: string }>;
};

const pages = getDocumentationInventory();
const flatten = (nodes: TreeViewItem[]): TreeViewItem[] =>
  nodes.flatMap((node) => [node, ...flatten(node.children ?? [])]);
const nodes = flatten(items);
const baselinePath = process.env.PUZZLE_NAVIGATION_BASELINE;
if (baselinePath) {
  const baseline: {
    pages: typeof pages;
    entries: Array<{ id: string; href?: string }>;
  } = JSON.parse(await readFile(baselinePath, "utf8"));
  assert.deepEqual(pages, baseline.pages.map(({ path, url, title }) => ({ path, url, title })),
    "original documentation paths, URLs and titles remain unchanged");
  for (const entry of baseline.entries) {
    const node = nodes.find((node) => node.id === entry.id);
    assert.ok(node, `original navigation ID preserved: ${entry.id}`);
    assert.equal(node.href, entry.href, `original href preserved: ${entry.id}`);
  }
}

const site = fileURLToPath(new URL("..", import.meta.url));
const server = spawn("node", [resolve(site, ".output/server/index.mjs")], {
  cwd: site,
  env: { ...process.env, NODE_ENV: "production", HOST: "127.0.0.1", PORT: "0", NO_COLOR: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser: Browser | undefined;
let output = "";
const capture = (chunk: Buffer) => { output = (output + chunk.toString()).slice(-4000); };
server.stdout.on("data", capture);
server.stderr.on("data", capture);

const shotDirectory = process.env.PUZZLE_NAVIGATION_SCREENSHOT_DIR;
if (shotDirectory) await mkdir(shotDirectory, { recursive: true });

try {
  const origin = await new Promise<string>((resolveOrigin, reject) => {
    const timer = setTimeout(() => reject(new Error(`Site did not start:\n${output}`)), 30000);
    server.once("error", (error) => { clearTimeout(timer); reject(error); });
    server.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Site exited with ${code}:\n${output}`));
    });
    server.stdout.on("data", () => {
      const url = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
      if (url) { clearTimeout(timer); resolveOrigin(url); }
    });
  });

  const llmsResponse = await fetch(`${origin}/llms-full.txt`);
  assert.equal(llmsResponse.status, 200);
  const llms = await llmsResponse.text();
  const sourceUrls = [...llms.matchAll(/^Source: (.+)$/gm)].map((match) => match[1]!);
  assert.deepEqual(sourceUrls.sort(), pages.map((page) => `${SITE_URL}${page.url}`).sort(),
    "file inventory matches actual documentation source URLs");
  const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();

  for (const page of pages) {
    const response = await fetch(`${origin}${page.url}`, { redirect: "manual" });
    assert.equal(response.status, 200, `${page.url}: directly accessible without redirects`);
    const html = await response.text();
    assert.match(html, /<h1(?:\s[^>]*)?>/, `${page.url}: server-rendered content`);
    const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)]
      .map((match) => match[0].match(/href="([^"]+)"/)?.[1]);
    assert.deepEqual(canonicals, [`${SITE_URL}${page.url}`], `${page.url}: original canonical`);
    assert.ok(sitemap.includes(`<loc>${SITE_URL}${page.url}</loc>`), `${page.url}: sitemap entry`);
    const navigation = html.match(/<nav\b[^>]*aria-label="Documentation"[^>]*>[\s\S]*?<\/nav>/)?.[0];
    assert.ok(navigation, `${page.url}: documentation landmark`);
    assert.equal((navigation.match(/aria-current="page"/g) ?? []).length, 1,
      `${page.url}: exactly one active navigation link`);
    const activeHref = navigation.match(
      /<a\b(?=[^>]*aria-current="page")[^>]*href="([^"]+)"/,
    )?.[1];
    assert.equal(activeHref, page.url, `${page.url}: exact active destination`);
    const json: Array<GraphNode & { "@graph"?: GraphNode[] }> = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      .map((match) => JSON.parse(match[1]!));
    const graph = json.flatMap((value) => value["@graph"] ?? [value]);
    const breadcrumbs = graph.find((node) => node["@id"] === `${SITE_URL}${page.url}#breadcrumbs`);
    assert.ok(breadcrumbs, `${page.url}: breadcrumb schema`);
    const breadcrumbUrls = (breadcrumbs.itemListElement ?? []).map((item) =>
      item["@id"] ? graph.find((node) => node["@id"] === item["@id"])?.item : item.item,
    );
    assert.equal(breadcrumbUrls.at(-1), `${SITE_URL}${page.url}`);
    for (const url of breadcrumbUrls) {
      assert.ok(url && (url === `${SITE_URL}/` || sourceUrls.includes(url)),
        `${page.url}: breadcrumb uses an actual canonical page`);
    }
  }

  browser = await chromium.launch();
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const errors: string[] = [];
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat|server rendered|did not match/i.test(message.text())) {
      errors.push(message.text());
    }
  });

  const item = (id: string) => page.locator(`[data-tree-item-id="${id}"]`);
  const row = (id: string) => item(id).locator(":scope > .puzzle-tree__row");
  const goto = async (url: string) => {
    await page.goto(`${origin}${url}`, { waitUntil: "networkidle" });
    await page.getByRole("navigation", { name: "Documentation", exact: true }).waitFor();
  };
  const checkActive = async (url: string) => {
    const path = findNavigationPath(items, url);
    const active = row(path.at(-1)!.id);
    assert.equal(await active.getAttribute("aria-current"), "page");
    for (const ancestor of path.slice(0, -1)) {
      assert.equal(await item(ancestor.id).getAttribute("aria-expanded"), "true");
    }
  };
  const screenshot = async (page: Page, name: string) => {
    if (shotDirectory) await page.screenshot({ path: resolve(shotDirectory, `${name}.png`) });
  };

  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await goto("/docs/pieces/components/dashboard");
    const toggle = page.getByRole("button", { name: "Documentation menu" });
    if (width < 768) {
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
      assert.equal(await page.locator(".puzzle-site-sidebar__panel").getAttribute("inert"), "",
        "closed mobile tree is inert");
      await toggle.click();
    } else {
      assert.equal(await toggle.isVisible(), false);
    }
    await checkActive("/docs/pieces/components/dashboard");
    const tree = page.getByRole("tree", { name: "Documentation pages" });
    assert.equal(await tree.locator(":scope > [role=treeitem]").count(), 6);
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > window.innerWidth,
    );
    assert.equal(overflow, false, `${width}: no horizontal overflow`);
    const activeRect = await row("pieces-dashboard").boundingBox();
    assert.ok(activeRect && activeRect.x >= 0 && activeRect.x + activeRect.width <= width);
    if (width >= 768) {
      assert.ok(activeRect.y >= 0 && activeRect.y + activeRect.height <= 900,
        `${width}: deep active page stays visible`);
    } else {
      const nav = page.getByRole("navigation", { name: "Documentation", exact: true });
      const targets = await nav.locator(".puzzle-tree__row").evaluateAll((rows) =>
        rows.every((row) => row.getBoundingClientRect().height >= 44),
      );
      assert.equal(targets, true, `${width}: touch-friendly rows`);
      await row("pieces-overview").click();
      await page.waitForURL((url) => url.pathname === "/docs/pieces");
      assert.equal(await toggle.getAttribute("aria-expanded"), "false",
        "navigation closes the mobile menu");
      await toggle.click();
      await row("pieces-overview").click();
      assert.equal(await toggle.getAttribute("aria-expanded"), "false",
        "selecting the current page also closes the menu");
      await goto("/docs/pieces/components/dashboard");
      await toggle.click();
    }
    const lightBackground = await page.locator(".puzzle-site-sidebar").evaluate((element) =>
      getComputedStyle(element).backgroundColor,
    );
    const themeStyle = page.locator('style[data-puzzle-theme="true"]').first();
    await themeStyle.evaluate((element) => element.setAttribute("data-theme", "dark"));
    await page.waitForFunction((background) => {
      const sidebar = document.querySelector(".puzzle-site-sidebar");
      return sidebar && getComputedStyle(sidebar).backgroundColor !== background;
    }, lightBackground);
    await screenshot(page, `navigation-${width}-dark`);
    await themeStyle.evaluate((element) => element.setAttribute("data-theme", "light"));
    await page.waitForFunction((background) => {
      const sidebar = document.querySelector(".puzzle-site-sidebar");
      return sidebar && getComputedStyle(sidebar).backgroundColor === background;
    }, lightBackground);
    await screenshot(page, `navigation-${width}-light`);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await goto("/docs/ui/actions/button");
  await checkActive("/docs/ui/actions/button");
  await row("foundations").click();
  assert.equal(await item("foundations").getAttribute("aria-expanded"), "true");
  assert.equal(await item("ui-composition").getAttribute("aria-expanded"), "true");
  await row("ui-actions").locator("[data-tree-toggle]").click();
  assert.equal(new URL(page.url()).pathname, "/docs/ui/actions/button",
    "category arrow expands without navigating");
  assert.equal(await item("ui-actions").getAttribute("aria-expanded"), "false");
  await row("ui-actions").locator("[data-tree-toggle]").click();
  await row("ui-actions").click();
  await page.waitForURL((url) => url.pathname === "/docs/ui/actions");
  await checkActive("/docs/ui/actions");
  assert.equal(await item("foundations").getAttribute("aria-expanded"), "true");
  assert.equal(await row("ui-overview").getAttribute("aria-current"), null);

  await item("ui-actions").focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await item("ui-button-group").evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("ArrowDown");
  assert.equal(await item("ui-button").evaluate((element) => element === document.activeElement), true);
  assert.equal(await item("ui-button").evaluate((element) =>
    getComputedStyle(element.querySelector(".puzzle-tree__row")!).outlineStyle,
  ), "solid", "keyboard focus is visible");
  await page.keyboard.press("Enter");
  await page.waitForURL((url) => url.pathname === "/docs/ui/actions/button");
  await checkActive("/docs/ui/actions/button");
  await page.keyboard.press("Home");
  assert.equal(await item("getting-started-section").evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("Enter");
  assert.equal(await item("getting-started-section").getAttribute("aria-expanded"), "true");
  await page.keyboard.press("ArrowRight");
  assert.equal(await item("documentation-overview").evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("ArrowLeft");
  assert.equal(await item("getting-started-section").evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("ArrowLeft");
  assert.equal(await item("getting-started-section").getAttribute("aria-expanded"), "false");
  await page.keyboard.press("Tab");
  assert.equal(await page.getByRole("tree").evaluate((element) => element.contains(document.activeElement)), false,
    "Tab leaves the tree without a keyboard trap");

  const fullTextResponse = await fetch(`${origin}/api/search?query=MFA`);
  assert.equal(fullTextResponse.status, 200);
  assert.match(fullTextResponse.headers.get("x-robots-tag") ?? "", /noindex/);
  const fullTextResults: Array<{ id: string; type: string; url: string }> = await fullTextResponse.json();
  assert.ok(fullTextResults.length, "existing full-text search remains available");
  assert.equal(new Set(fullTextResults.map((result) => result.id)).size, fullTextResults.length);
  for (const result of fullTextResults) {
    assert.ok(pages.some((page) => page.url === result.url.split("#")[0]),
      `full-text search links to an original page: ${result.url}`);
  }

  for (const [query, url] of [
    ["Auth", "/docs/auth"],
    ["MFA", "/docs/auth/mfa"],
    ["UI components", "/docs/ui"],
    ["Page Sections", "/docs/pieces"],
    ["Theme tokens", "/docs/theme/tokens"],
  ]) {
    const title = pages.find((page) => page.url === url)!.title;
    const search = page.getByRole("combobox", { name: "Search documentation" });
    await search.fill(query!);
    await page.getByRole("option").filter({ hasText: title }).first().click();
    await page.waitForURL((location) => location.pathname === url);
    await checkActive(url!);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await goto("/docs/auth/mfa");
  const toggle = page.getByRole("button", { name: "Documentation menu" });
  await toggle.click();
  await page.getByRole("combobox", { name: "Search documentation" }).fill("Theme tokens");
  await page.getByRole("option").filter({
    hasText: pages.find((page) => page.url === "/docs/theme/tokens")!.title,
  }).first().click();
  await page.waitForURL((url) => url.pathname === "/docs/theme/tokens");
  assert.equal(await toggle.getAttribute("aria-expanded"), "false", "mobile search dismisses menu");
  await page.goBack({ waitUntil: "networkidle" });
  await toggle.click();
  await checkActive("/docs/auth/mfa");

  assert.deepEqual(errors, [], "no browser or hydration errors");
  console.log(`Navigation verified: ${pages.length} original URLs, canonical breadcrumbs, sitemap, source inventory, six groups, exact active states, expansion, keyboard, search and five viewport sizes.`);
} finally {
  await browser?.close();
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await once(server, "exit");
  }
}
