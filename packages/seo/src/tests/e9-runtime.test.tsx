import { PassThrough } from "node:stream";

import { createElement } from "react";

import { renderToPipeableStream } from "react-dom/server";

import { describe, expect, it } from "vitest";

import { SeoProvider, LDOrganization } from "../react";
import { createNextSeoRoutes } from "../next";
import { createTanStackSeoRoutes } from "../tanstack";
import { createReactRouterSeoRoutes } from "../react-router";

import { generateSitemap, sitemapByteLength } from "../sitemap";

const BASE_URL = "https://example.com";

const config = {
  siteUrl: BASE_URL,
  identity: {
    name: "Puzzle",
    url: BASE_URL,
  },
};

const routeOptions = {
  sitemap: {
    sitemap: {
      baseUrl: BASE_URL,
      entries: [{ url: "/" }, { url: "/about" }],
      // Force multiple files so the routes serve a sitemap index.
      maxEntries: 1,
    },
    path: "/sitemap.xml",
  },
  robots: {
    robots: {
      rules: [
        {
          userAgent: "*",
          allow: ["/"],
          disallow: ["/private"],
        },
      ],
    },
    path: "/robots.txt",
  },
};

const createRequest = (path: string) => new Request(`${BASE_URL}${path}`);

const renderStreaming = (name: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const destination = new PassThrough();
    const chunks: Buffer[] = [];

    destination.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    destination.on("error", reject);

    destination.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    let stream: ReturnType<typeof renderToPipeableStream>;

    stream = renderToPipeableStream(
      createElement(SeoProvider, {
        config,
        children: createElement(LDOrganization, {
          name,
          url: BASE_URL,
        }),
      }),
      {
        onAllReady() {
          stream.pipe(destination);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          reject(error);
        },
      },
    );
  });

describe("E9 React streaming SSR", () => {
  it("renders JSON-LD through renderToPipeableStream", async () => {
    const html = await renderStreaming("Streaming Organization");

    expect(html).toContain("Streaming Organization");
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain("https://schema.org/Organization");
  });

  it("keeps concurrent streaming requests isolated", async () => {
    const [alpha, beta] = await Promise.all([
      renderStreaming("Streaming Tenant Alpha"),
      renderStreaming("Streaming Tenant Beta"),
    ]);

    expect(alpha).toContain("Streaming Tenant Alpha");
    expect(alpha).not.toContain("Streaming Tenant Beta");

    expect(beta).toContain("Streaming Tenant Beta");
    expect(beta).not.toContain("Streaming Tenant Alpha");
  });

  it("does not share graph state between subsequent streams", async () => {
    const first = await renderStreaming("First Streaming Request");
    const second = await renderStreaming("Second Streaming Request");

    expect(first).toContain("First Streaming Request");
    expect(first).not.toContain("Second Streaming Request");

    expect(second).toContain("Second Streaming Request");
    expect(second).not.toContain("First Streaming Request");
  });
});

describe("E9 Next.js route integration", () => {
  const routes = createNextSeoRoutes(routeOptions);

  it("serves robots.txt", async () => {
    const response = await routes.robotsGET(createRequest("/robots.txt"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");

    const content = await response.text();

    expect(content).toContain("User-agent: *");
    expect(content).toContain("Disallow: /private");
  });

  it("serves the sitemap index", async () => {
    const response = await routes.sitemapGET(createRequest("/sitemap.xml"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/xml");

    const xml = await response.text();

    expect(xml).toContain("<sitemapindex");
    expect(xml).toContain("sitemap-1.xml");
  });

  it("returns 404 for unknown sitemap files", async () => {
    const response = await routes.sitemapGET(createRequest("/unknown.xml"));

    expect(response.status).toBe(404);
  });
});

describe("E9 TanStack Start route integration", () => {
  const routes = createTanStackSeoRoutes(routeOptions);

  it("serves robots.txt using the route context", async () => {
    const response = await routes.robotsGET({
      request: createRequest("/robots.txt"),
    });

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("User-agent: *");
  });

  it("serves sitemap files using the route context", async () => {
    const response = await routes.sitemapGET({
      request: createRequest("/sitemap.xml"),
    });

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("<sitemapindex");
  });
});

describe("E9 React Router route integration", () => {
  const routes = createReactRouterSeoRoutes(routeOptions);

  it("serves robots.txt using loader arguments", async () => {
    const response = await routes.robotsLoader({
      request: createRequest("/robots.txt"),
      params: {},
      context: {},
    });

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("User-agent: *");
  });

  it("serves sitemap files using loader arguments", async () => {
    const response = await routes.sitemapLoader({
      request: createRequest("/sitemap.xml"),
      params: {},
      context: {},
    });

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("<sitemapindex");
  });

  it("returns 404 for unknown resource routes", async () => {
    const response = await routes.robotsLoader({
      request: createRequest("/unknown.txt"),
      params: {},
      context: {},
    });

    expect(response.status).toBe(404);
  });
});

describe("E9 sitemap generation limits", () => {
  it("splits large sitemaps without exceeding the entry limit", () => {
    const entries = Array.from({ length: 250 }, (_, index) => ({
      url: `/pages/${index}`,
    }));

    const result = generateSitemap({
      baseUrl: BASE_URL,
      entries,
      maxEntries: 50,
    });

    expect(result.totalEntries).toBe(250);
    expect(result.files).toHaveLength(5);

    for (const file of result.files) {
      expect(file.entries.length).toBeLessThanOrEqual(50);
    }

    expect(result.indexXml).toContain("sitemap-1.xml");
    expect(result.indexXml).toContain("sitemap-5.xml");
  });

  it("keeps generated XML within the configured byte limit", () => {
    const result = generateSitemap({
      baseUrl: BASE_URL,
      maxBytes: 1024,
      entries: Array.from({ length: 100 }, (_, index) => ({
        url: `/pages/${index}`,
      })),
    });

    expect(result.totalEntries).toBe(100);

    for (const file of result.files) {
      expect(sitemapByteLength(file.xml)).toBeLessThanOrEqual(1024);
    }
  });

  it("does not silently drop valid entries when splitting", () => {
    const entries = Array.from({ length: 150 }, (_, index) => ({
      url: `/products/${index}`,
    }));

    const result = generateSitemap({
      baseUrl: BASE_URL,
      entries,
      maxEntries: 25,
    });

    const generatedUrls = result.files.flatMap((file) =>
      file.entries.map((entry) => entry.url),
    );

    expect(result.totalEntries).toBe(150);
    expect(new Set(generatedUrls).size).toBe(150);
  });
});
