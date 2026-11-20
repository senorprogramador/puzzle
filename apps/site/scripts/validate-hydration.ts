import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser } from "playwright";

import { COLOR_THEMES, DEFAULT_COLOR_SCHEME } from "@puzzle-ui/theme";

import {
  AUTHOR,
  AUTHOR_ID,
  PUBLISHER_ID,
  SITE_DESCRIPTION,
  SITE_URL,
} from "../src/lib/seo";
import { WEBSITE_TEMPLATES } from "../src/components/theme-studio/theme-studio-model";

type GraphNode = {
  "@id"?: string;
  "@type"?: string | string[];
  author?: { "@id"?: string };
  publisher?: { "@id"?: string };
  description?: string;
  codeRepository?: string;
  programmingLanguage?: string;
  runtimePlatform?: string;
  license?: string;
  item?: unknown;
  itemListElement?: Array<{ "@id"?: string; item?: unknown; name?: unknown }>;
};

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

const extractVisibleText = (html: string): string =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

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
  const indexResponse = await fetch(`${origin}/llms.txt`);
  assert.equal(indexResponse.status, 200, "/llms.txt status");
  assert.match(indexResponse.headers.get("content-type") ?? "", /^text\/plain/);
  assert.equal(
    indexResponse.headers.get("cache-control"),
    "public, max-age=3600, s-maxage=86400",
    "/llms.txt cache policy",
  );
  const indexText = await indexResponse.text();
  const indexUrls = [...indexText.matchAll(/\]\((https:\/\/puzzle-ui\.com\/[^)]+)\)/g)]
    .map((match) => match[1]!);
  assert.equal(new Set(indexUrls).size, indexUrls.length, "/llms.txt unique links");
  assert.match(indexText, /## Package overviews/);
  assert.match(indexText, /https:\/\/puzzle-ui\.com\/docs\/storage/);
  assert.match(indexText, /https:\/\/puzzle-ui\.com\/llms-full\.txt/);

  const fullDocsResponse = await fetch(`${origin}/llms-full.txt`);
  assert.equal(fullDocsResponse.status, 200, "/llms-full.txt status");
  assert.match(fullDocsResponse.headers.get("content-type") ?? "", /^text\/plain/);
  assert.equal(
    fullDocsResponse.headers.get("cache-control"),
    "public, max-age=3600, s-maxage=86400",
    "/llms-full.txt cache policy",
  );
  const fullDocsText = await fullDocsResponse.text();
  const repeatedFullDocs = await fetch(`${origin}/llms-full.txt`);
  assert.equal(await repeatedFullDocs.text(), fullDocsText, "/llms-full.txt deterministic");
  const sourceUrls = [...fullDocsText.matchAll(/^Source: (.+)$/gm)]
    .map((match) => match[1]!);
  assert.ok(sourceUrls.length > 100, "/llms-full.txt includes public documentation");
  assert.equal(new Set(sourceUrls).size, sourceUrls.length, "/llms-full.txt unique sources");
  assert.ok(sourceUrls.includes(`${SITE_URL}/docs/storage`));
  assert.match(fullDocsText, /```(?:tsx?|bash|sh)/);
  assert.match(fullDocsText, new RegExp(`${SITE_URL}/docs/`));
  const docsPaths = sourceUrls.map((sourceUrl) => {
    const url = new URL(sourceUrl);
    assert.equal(url.origin, SITE_URL, `documentation source origin: ${sourceUrl}`);
    assert.ok(
      url.pathname === "/docs" || url.pathname.startsWith("/docs/"),
      `documentation source path: ${sourceUrl}`,
    );
    return url.pathname;
  });
  assert.equal(new Set(docsPaths).size, docsPaths.length, "unique documentation paths");

  const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
  assert.equal(sitemapResponse.status, 200, "/sitemap.xml status");
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /^application\/xml/);
  const sitemapText = await sitemapResponse.text();
  const sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1]!);
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "sitemap unique URLs");
  assert.equal(sitemapUrls.length, sourceUrls.length + 1, "sitemap includes docs and homepage");
  assert.ok(sitemapUrls.includes(`${SITE_URL}/`), "sitemap homepage");
  for (const sourceUrl of sourceUrls) {
    assert.ok(sitemapUrls.includes(sourceUrl), `sitemap includes ${sourceUrl}`);
  }

  for (const path of docsPaths) {
    const response = await fetch(`${origin}${path}`);
    assert.equal(response.status, 200, `${path}: direct HTTP status`);
    assert.match(
      response.headers.get("content-type") ?? "",
      /^text\/html/,
      `${path}: HTML content type`,
    );
    assert.equal(
      response.headers.get("cache-control"),
      "public, max-age=86400, s-maxage=86400",
      `${path}: CDN cache policy`,
    );
    const html = await response.text();
    assert.equal((html.match(/<title>/g) ?? []).length, 1, `${path}: SSR title`);
    assert.match(html, /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/i, `${path}: SSR page heading`);
    assert.match(
      html,
      /class="[^"]*\bprose\b[^"]*\bflex-1\b[^"]*"/,
      `${path}: SSR Fumadocs content container`,
    );
    assert.doesNotMatch(html, /<header\b[^>]*id="nd-subnav"/i, `${path}: no Fumadocs subnav`);
    assert.match(html, /type="application\/ld\+json"/, `${path}: SSR structured data`);
    assert.ok(
      html.includes(`${SITE_URL}${path}`),
      `${path}: canonical URL is present in the original HTML`,
    );
    assert.ok(
      extractVisibleText(html).length > 100,
      `${path}: documentation content is server-rendered`,
    );

    const googlebotResponse = await fetch(`${origin}${path}`, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    });
    assert.equal(googlebotResponse.status, 200, `${path}: Googlebot HTTP status`);
    assert.equal(
      googlebotResponse.headers.get("cache-control"),
      response.headers.get("cache-control"),
      `${path}: Googlebot cache policy`,
    );
    assert.equal(
      extractVisibleText(await googlebotResponse.text()),
      extractVisibleText(html),
      `${path}: Googlebot receives the same rendered content`,
    );
  }

  const robotsResponse = await fetch(`${origin}/robots.txt`);
  assert.equal(robotsResponse.status, 200, "/robots.txt status");
  assert.match(robotsResponse.headers.get("content-type") ?? "", /^text\/plain/);
  const robotsText = await robotsResponse.text();
  assert.ok(
    robotsText.split(/\r?\n/).includes(`Sitemap: ${SITE_URL}/sitemap.xml`),
    "robots.txt sitemap reference",
  );

  assert.equal((await fetch(`${origin}/docs/getting-started`)).status, 200);
  browser = await chromium.launch();
  for (const component of [undefined, "code-showcase", "product-showcase"]) {
    const path = component ? `/docs/pieces/components/${component}` : "/docs/getting-started";
    const page = await browser.newPage();
    await page.route("**/*", (route) =>
      new URL(route.request().url()).origin === origin ? route.continue() : route.abort(),
    );
    await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
    const assets = await page.evaluate(() =>
      performance.getEntriesByType("resource").map((entry) => new URL(entry.name).pathname),
    );
    for (const isolated of ["code-showcase", "product-showcase", "pricing", "date-picker"]) {
      const matches = assets.filter((asset) =>
        new RegExp(`/assets/${isolated}[-.]`).test(asset),
      );
      if (isolated === component) {
        assert.ok(matches.some((asset) => asset.endsWith(".css")), `${path}: required example styles load`);
        assert.ok(matches.some((asset) => asset.endsWith(".js")), `${path}: required example JavaScript loads`);
      } else {
        assert.deepEqual(matches, [], `${path}: does not load unused ${isolated} JavaScript or CSS`);
      }
    }
    if (!component) {
      await page.locator('a[href="/docs/ui/actions/button"]').first().click();
      await page.waitForURL((url) => url.pathname === "/docs/ui/actions/button");
      const preview = page.locator(".puzzle-preview").first();
      await preview.scrollIntoViewIfNeeded();
      await preview.frameLocator("iframe").getByRole("button", { name: "Click me", exact: true }).waitFor();
    }
    await page.close();
  }
  const noJsContext = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await noJsContext.newPage();
  await noJsPage.goto(origin);
  assert.equal(await noJsPage.locator(".home-component-fallback a").count(), 16);
  for (const path of docsPaths) {
    const response = await noJsPage.goto(`${origin}${path}`);
    assert.equal(response?.status(), 200, `${path}: JavaScript-disabled status`);
    assert.ok(await noJsPage.locator("h1").count(), `${path}: JavaScript-disabled heading`);
    const docsContent = noJsPage.locator(".puzzle-site-docs .prose.flex-1");
    assert.equal(await docsContent.count(), 1, `${path}: JavaScript-disabled content container`);
    assert.ok(
      (await docsContent.innerText()).trim().length > 100,
      `${path}: JavaScript-disabled content`,
    );
  }
  await noJsContext.close();

  const lazyPage = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const carouselRequests: string[] = [];
  lazyPage.on("request", (request) => {
    if (/\/(?:home-component-carousel|carousel)-[^/]+\.(?:js|css)(?:\?|$)/.test(request.url())) {
      carouselRequests.push(request.url());
    }
  });
  const homeResponse = await lazyPage.goto(origin);
  const homeHtml = await homeResponse!.text();
  assert.match(homeHtml, /home-component-fallback/, "component links are server-rendered");
  await lazyPage.waitForLoadState("networkidle");
  assert.deepEqual(carouselRequests, [], "carousel assets are not requested initially");
  assert.equal(await lazyPage.locator(".home-component-fallback a").count(), 16);
  await lazyPage.locator(".home-component-carousel-container").scrollIntoViewIfNeeded();
  await lazyPage.getByRole("button", { name: "Next component panels" }).waitFor();
  assert.ok(carouselRequests.some((url) => /home-component-carousel-.*\.js/.test(url)));
  assert.ok(carouselRequests.some((url) => /carousel-.*\.css/.test(url)));
  await lazyPage.getByRole("button", { name: "Next component panels" }).click();
  await lazyPage.close();

  const focusedPage = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  let releaseCarousel!: () => void;
  const carouselGate = new Promise<void>((resolveGate) => { releaseCarousel = resolveGate; });
  await focusedPage.route(/\/home-component-carousel-[^/]+\.js$/, async (route) => {
    await carouselGate;
    await route.continue();
  });
  await focusedPage.goto(origin);
  const fallbackLink = focusedPage.locator(".home-component-fallback a").first();
  await fallbackLink.focus();
  releaseCarousel();
  await focusedPage.waitForLoadState("networkidle");
  assert.equal(await fallbackLink.evaluate((element) => element === document.activeElement), true);
  assert.equal(await focusedPage.locator(".home-component-fallback a").count(), 16);
  await fallbackLink.blur();
  await focusedPage.getByRole("button", { name: "Next component panels" }).waitFor();
  await focusedPage.close();

  const failedPage = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const loadErrors: string[] = [];
  failedPage.on("console", (message) => {
    if (message.type() === "error") loadErrors.push(message.text());
  });
  await failedPage.route(/\/home-component-carousel-[^/]+\.js$/, (route) => route.abort());
  await failedPage.goto(origin);
  await failedPage.locator(".home-component-carousel-container").scrollIntoViewIfNeeded();
  await failedPage.waitForLoadState("networkidle");
  assert.equal(await failedPage.locator(".home-component-fallback a").count(), 16);
  assert.ok(loadErrors.some((message) => message.includes("Failed to load the home component carousel")));
  await failedPage.close();

  const noObserverPage = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await noObserverPage.addInitScript(() => { Reflect.deleteProperty(window, "IntersectionObserver"); });
  await noObserverPage.goto(origin);
  await noObserverPage.getByRole("button", { name: "Next component panels" }).waitFor();
  await noObserverPage.close();

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
    if (path !== "/") {
      const docsContent = page.locator(".puzzle-site-docs .prose.flex-1");
      await docsContent.waitFor({ state: "attached" });
      assert.equal(await docsContent.count(), 1, `${path}: hydrated content container`);
      assert.equal(await page.locator("header#nd-subnav").count(), 0, `${path}: no Fumadocs subnav`);
      assert.ok(
        (await docsContent.innerText()).trim().length > 100,
        `${path}: hydrated documentation content`,
      );
    }
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
      authors: document.querySelectorAll('meta[name="author"]').length,
      author: document.querySelector<HTMLMetaElement>('meta[name="author"]')?.content,
      canonicals: [...document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')]
        .map((link) => link.href),
      openGraph: document.querySelectorAll('meta[property="og:title"]').length,
      twitter: document.querySelectorAll('meta[name="twitter:title"]').length,
      scripts: [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((script) => ({ id: script.id, text: script.textContent })),
    }));
    assert.equal(state.titles, 1, `${path}: title`);
    assert.equal(state.descriptions, 1, `${path}: description`);
    assert.equal(state.authors, 1, `${path}: author metadata`);
    assert.equal(state.author, AUTHOR.name, `${path}: author`);
    assert.deepEqual(state.canonicals, [`${SITE_URL}${path}`], `${path}: canonical`);
    assert.equal(state.openGraph, 1, `${path}: Open Graph title`);
    assert.equal(state.twitter, 1, `${path}: Twitter title`);
    assert.equal(state.scripts.length, 1, `${path}: JSON-LD script`);
    assert.equal(state.scripts[0]!.id, "puzzle-seo-jsonld");
    const graph: { "@graph": GraphNode[] } = JSON.parse(state.scripts[0]!.text!);
    const ids = graph["@graph"].map((node) => node["@id"]);
    assert.equal(new Set(ids).size, ids.length, `${path}: unique graph entities`);
    assert.ok(ids.includes(`${SITE_URL}${path}#webpage`), `${path}: active webpage`);
    assert.ok(ids.includes(AUTHOR_ID), `${path}: shared Person entity`);
    assert.ok(ids.includes(PUBLISHER_ID), `${path}: shared Organization entity`);
    if (path !== "/") {
      const breadcrumbs = graph["@graph"].find(
        (node) => node["@id"] === `${SITE_URL}${path}#breadcrumbs`,
      );
      assert.ok(breadcrumbs, `${path}: breadcrumb structured data`);
      const breadcrumbItems = (breadcrumbs.itemListElement ?? []).map((item) =>
        item["@id"]
          ? graph["@graph"].find((node) => node["@id"] === item["@id"])
          : item,
      );
      assert.ok(
        breadcrumbItems.some((item) => item?.item === `${SITE_URL}${path}`),
        `${path}: current page appears in its breadcrumbs`,
      );
      if (path !== "/docs" && path.startsWith("/docs/")) {
        assert.ok(
          breadcrumbItems.some((item) => item?.item === `${SITE_URL}/docs`),
          `${path}: documentation overview appears in its breadcrumbs`,
        );
      }
    }
    const webpages = ids.filter(
      (id) =>
        (id === `${SITE_URL}/docs#webpage` ||
          id?.startsWith(`${SITE_URL}/docs/`)) &&
        id.endsWith("#webpage"),
    );
    assert.equal(webpages.length, path === "/" ? 0 : 1, `${path}: no stale route graph`);

    if (path === "/") {
      const software = graph["@graph"].find(
        (node) => node["@id"] === `${SITE_URL}/#software`,
      );
      assert.ok(software, "homepage SoftwareSourceCode entity");
      assert.equal(software["@type"], "https://schema.org/SoftwareSourceCode");
      assert.equal(software.description, SITE_DESCRIPTION);
      assert.equal(software.codeRepository, "https://github.com/senorprogramador/puzzle");
      assert.equal(software.programmingLanguage, "TypeScript");
      assert.equal(software.runtimePlatform, "React");
      assert.equal(software.license, "https://opensource.org/license/mit/");
      assert.equal(software.author?.["@id"], AUTHOR_ID);
      assert.equal(software.publisher?.["@id"], PUBLISHER_ID);
      assert.ok(
        await page.locator('link[rel="alternate"][href="/llms-full.txt"]').count(),
        "homepage full documentation alternate link",
      );
    } else {
      const article = graph["@graph"].find(
        (node) => node["@id"] === `${SITE_URL}${path}#article`,
      );
      assert.ok(article, `${path}: TechArticle entity`);
      assert.equal(article.author?.["@id"], AUTHOR_ID);
      assert.equal(article.publisher?.["@id"], PUBLISHER_ID);
    }
  };

  for (const path of ["/", ...docsPaths]) {
    const response = await page.goto(`${origin}${path}`);
    assert.equal(response?.status(), 200);
    const html = await response!.text();
    assert.equal((html.match(/<title>/g) ?? []).length, 1, `${path}: SSR title`);
    assert.equal((html.match(/type="application\/ld\+json"/g) ?? []).length, 1, `${path}: SSR graph`);
    await check(path);
  }
  await page.goto(`${origin}/docs/tutorials`);
  await check("/docs/tutorials");
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

  const themeStudioPath = "/theme-studio";
  const themeStudioResponse = await fetch(`${origin}${themeStudioPath}`);
  assert.equal(themeStudioResponse.status, 200, "Theme Studio direct HTTP status");
  const themeStudioHtml = await themeStudioResponse.text();
  assert.match(themeStudioHtml, /<title>[^<]*Theme Studio[^<]*<\/title>/);
  assert.match(themeStudioHtml, /<h1[^>]*>Theme Studio<\/h1>/);
  assert.match(themeStudioHtml, /data-puzzle-theme-scope-style/);
  assert.ok(
    themeStudioHtml.includes(
      `--puzzle-color-scheme-light-primary: ${DEFAULT_COLOR_SCHEME.light.primary}`,
    ),
    "Theme Studio server-renders the package default palette in a local scope",
  );

  const studioPage = await browser.newPage();
  const studioErrors: string[] = [];
  studioPage.on("pageerror", (error) => studioErrors.push(error.message));
  studioPage.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydrat|server rendered|did not match|cannot be a descendant|cannot contain a nested/i.test(
        message.text(),
      )
    ) {
      studioErrors.push(message.text());
    }
  });
  await studioPage.goto(`${origin}${themeStudioPath}`, {
    waitUntil: "networkidle",
  });
  assert.equal(
    await studioPage.locator(".theme-studio__preset-card").count(),
    Object.keys(COLOR_THEMES).length + 1,
    "Theme Studio displays every registry entry and the package default",
  );
  const rootThemeStyle = await studioPage
    .locator('style[data-puzzle-theme="true"]')
    .textContent();
  await studioPage.getByRole("button", { name: "Restaurant", exact: true }).click();
  await studioPage.getByRole("button", { name: "About", exact: true }).click();
  await studioPage.locator(".theme-studio__preset-card").nth(1).click();

  const firstThemeId = Object.keys(COLOR_THEMES)[0];
  if (firstThemeId === undefined) {
    throw new Error("The Theme package has no color presets.");
  }
  const firstTheme = COLOR_THEMES[firstThemeId as keyof typeof COLOR_THEMES];
  const preview = studioPage.locator(".theme-studio__website");
  assert.equal(await preview.getAttribute("data-template"), "restaurant");
  assert.equal(await preview.getAttribute("data-preview-page"), "about");
  assert.equal(
    await studioPage.locator(".theme-studio__preset-card").nth(1).getAttribute("aria-pressed"),
    "true",
  );

  const localThemeStyle = studioPage.locator(
    "style[data-puzzle-theme-scope-style]",
  );
  assert.ok(
    (await localThemeStyle.textContent())?.includes(
      `--puzzle-color-scheme-light-primary: ${firstTheme.light.primary}`,
    ),
    "the selected preset is applied by the local Theme provider",
  );
  await studioPage.getByRole("button", { name: "Dark", exact: true }).click();
  assert.ok(
    (await localThemeStyle.textContent())?.includes(
      `--puzzle-color-scheme-dark-primary: ${firstTheme.dark.primary}`,
    ),
    "the selected preset supplies its supported dark-mode colors",
  );
  await studioPage.getByLabel("primary dark color").evaluate((element) => {
    const input = element as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;

    if (!setter) throw new Error("Color input value setter is unavailable.");

    setter.call(input, "#123456");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await studioPage
    .locator(".theme-studio__status")
    .filter({ hasText: "Customized" })
    .waitFor();
  assert.ok(
    (await localThemeStyle.textContent())?.includes(
      "--puzzle-color-scheme-dark-primary: #123456",
    ),
    "custom token overrides update the live preview",
  );
  assert.match(
    await studioPage.locator(".theme-studio__code-panel pre").innerText(),
    /"primary": "#123456"/,
    "custom token overrides appear in generated code",
  );
  assert.equal(
    rootThemeStyle,
    await studioPage.locator('style[data-puzzle-theme="true"]').textContent(),
    "Theme Studio leaves the parent site theme unchanged",
  );

  await studioPage.getByRole("button", { name: "Restore preset" }).click();
  assert.doesNotMatch(
    await studioPage.locator(".theme-studio__code-panel pre").innerText(),
    /tokens=/,
    "restoring a preset removes token overrides from generated code",
  );
  let selectedThemeIndex = 0;
  for (const template of WEBSITE_TEMPLATES) {
    await studioPage
      .getByRole("button", { name: template.label, exact: true })
      .click();
    assert.equal(
      await preview.getAttribute("data-template"),
      template.id,
      `${template.label}: template selection updates the preview`,
    );
    assert.equal(
      await studioPage
        .locator(".theme-studio__preset-card")
        .nth(selectedThemeIndex + 1)
        .getAttribute("aria-pressed"),
      "true",
      `${template.label}: template selection preserves the color theme`,
    );

    for (const [index, identifier] of Object.keys(COLOR_THEMES).entries()) {
      await studioPage
        .locator(".theme-studio__preset-card")
        .nth(index + 1)
        .click();
      selectedThemeIndex = index;
      const preset = COLOR_THEMES[identifier as keyof typeof COLOR_THEMES];
      const css = await localThemeStyle.textContent();

      assert.equal(
        await preview.getAttribute("data-template"),
        template.id,
        `${template.label} + ${identifier}: selected template is retained`,
      );
      assert.equal(
        await preview.getAttribute("data-preview-page"),
        "about",
        `${template.label} + ${identifier}: selected page is retained`,
      );
      assert.ok(
        css?.includes(
          `--puzzle-color-scheme-light-primary: ${preset.light.primary}`,
        ),
        `${template.label} + ${identifier}: light preset colors are applied`,
      );
      assert.ok(
        css?.includes(
          `--puzzle-color-scheme-dark-primary: ${preset.dark.primary}`,
        ),
        `${template.label} + ${identifier}: dark preset colors are applied`,
      );
    }
  }

  await studioPage.setViewportSize({ width: 390, height: 844 });
  const presetCardBox = await studioPage
    .locator(".theme-studio__preset-card")
    .nth(1)
    .boundingBox();
  assert.ok(
    presetCardBox && presetCardBox.width >= 160 && presetCardBox.height >= 140,
    "mobile preset cards remain large enough to select",
  );
  const presetListSize = await studioPage
    .locator(".theme-studio__preset-list")
    .evaluate((element) => ({
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }));
  assert.ok(
    presetListSize.scrollWidth > presetListSize.clientWidth,
    "mobile presets are available in a horizontally scrollable collection",
  );
  const templateListSize = await studioPage
    .locator(".theme-studio__template-list")
    .evaluate((element) => ({
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }));
  assert.ok(
    templateListSize.scrollWidth > templateListSize.clientWidth,
    "mobile website templates remain horizontally scrollable",
  );
  await studioPage.getByRole("button", { name: "Reset to package default" }).click();
  assert.doesNotMatch(
    await studioPage.locator(".theme-studio__code-panel pre").innerText(),
    /colorTheme=/,
    "resetting to the package default removes built-in preset selection",
  );
  assert.deepEqual(studioErrors, [], "Theme Studio hydrates without browser errors");
  await studioPage.close();

  console.log("Page-scoped assets, hydration, navigation, history, reload, metadata and JSON-LD checks passed.");
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
