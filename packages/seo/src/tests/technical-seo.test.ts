import { describe, expect, it } from "vitest";

import {
  createSitemapHandler,
  createRobotsHandler,
  createSeoRouteHandlers,
} from "../server";

import { createNextSeoRoutes } from "../next";
import { createTanStackSeoRoutes } from "../tanstack";
import { createReactRouterSeoRoutes } from "../react-router";

import { generateSitemap, serializeSitemap } from "../sitemap";

import { generateRobotsTxt, serializeRobotsTxt } from "../robots";

import {
  normalizeSeoOrigin,
  normalizeSeoPath,
  normalizeSeoUrl,
  resolveSeoUrls,
} from "../urls";

import type { SeoRouteOptions } from "../server";

const baseUrl = "https://example.com";

const createEntries = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    url: `https://example.com/page-${index + 1}`,
    lastModified: "2026-01-01",
  }));

const createOptions = (
  overrides: Partial<SeoRouteOptions> = {},
): SeoRouteOptions => ({
  sitemap: {
    sitemap: {
      baseUrl,
      entries: createEntries(2),
      maxEntries: 1,
    },
  },
  robots: {
    robots: {
      rules: [
        {
          userAgent: "*",
          allow: ["/"],
          disallow: ["/admin"],
        },
      ],
      sitemap: `${baseUrl}/sitemap.xml`,
    },
  },
  ...overrides,
});

const createRequest = (pathname: string): Request =>
  new Request(`https://example.com${pathname}`);

describe("SEO URL utilities", () => {
  it("normalizes the origin", () => {
    expect(normalizeSeoOrigin("https://example.com/path?q=1")).toBe(
      "https://example.com",
    );
  });

  it("rejects invalid origins", () => {
    expect(() => normalizeSeoOrigin("javascript:alert(1)")).toThrow();
  });

  it("normalizes paths without trailing slashes by default", () => {
    expect(normalizeSeoPath("/about/")).toBe("/about");
  });

  it("supports always trailing slashes", () => {
    expect(normalizeSeoPath("/about", "always")).toBe("/about/");
  });

  it("normalizes relative URLs against a base URL", () => {
    expect(
      normalizeSeoUrl("/about/", {
        baseUrl,
      }),
    ).toBe("https://example.com/about");
  });

  it("rejects external URLs when external URLs are disabled", () => {
    expect(() =>
      normalizeSeoUrl("https://other.example/about", {
        baseUrl,
        allowExternal: false,
      }),
    ).toThrow();
  });

  it("rejects URLs containing credentials", () => {
    expect(() =>
      normalizeSeoUrl("https://user:password@example.com", {
        baseUrl,
      }),
    ).toThrow();
  });

  it("resolves, deduplicates and sorts URLs", () => {
    expect(
      resolveSeoUrls(["/z", "/a", "/z"], {
        baseUrl,
      }),
    ).toEqual(["https://example.com/a", "https://example.com/z"]);
  });
});

describe("Sitemap generation", () => {
  it("generates a valid sitemap document", () => {
    const result = serializeSitemap({
      baseUrl,
      entries: [
        {
          url: "/about",
          lastModified: "2026-01-01",
        },
      ],
    });

    expect(result.issues).toHaveLength(0);
    expect(result.xml).toContain("<urlset");
    expect(result.xml).toContain("<loc>https://example.com/about</loc>");
  });

  it("escapes XML values", () => {
    const result = serializeSitemap({
      baseUrl,
      entries: [
        {
          url: "/search?q=a&amp;b",
        },
      ],
    });

    expect(result.xml).toContain("&amp;amp;");
  });

  it("excludes non-indexable entries", () => {
    const result = serializeSitemap({
      baseUrl,
      entries: [
        {
          url: "/public",
        },
        {
          url: "/private",
          indexable: false,
        },
      ],
    });

    expect(result.entries).toHaveLength(1);
    expect(result.xml).not.toContain("/private");
  });

  it("excludes non-200 and redirect entries", () => {
    const result = serializeSitemap({
      baseUrl,
      entries: [
        {
          url: "/success",
          statusCode: 200,
        },
        {
          url: "/not-found",
          statusCode: 404,
        },
        {
          url: "/redirect",
          redirectTo: "/success",
        },
      ],
    });

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]?.url).toContain("/success");
  });

  it("reports duplicate URLs", () => {
    const result = serializeSitemap({
      baseUrl,
      entries: [{ url: "/about" }, { url: "/about/" }],
    });

    expect(result.issues.some((issue) => issue.code === "DUPLICATE_URL")).toBe(
      true,
    );
  });

  it("splits sitemap files by entry count", () => {
    const result = generateSitemap({
      baseUrl,
      entries: createEntries(3),
      maxEntries: 1,
    });

    expect(result.files).toHaveLength(3);
    expect(result.totalEntries).toBe(3);
    expect(result.indexXml).toContain("<sitemapindex");
    expect(result.indexUrl).toBe("https://example.com/sitemap.xml");
  });

  it("does not generate an index for a single sitemap file", () => {
    const result = generateSitemap({
      baseUrl,
      entries: createEntries(1),
    });

    expect(result.files).toHaveLength(1);
    expect(result.indexXml).toBeUndefined();
    expect(result.indexUrl).toBeUndefined();
  });

  it("rejects invalid entry limits", () => {
    expect(() =>
      generateSitemap({
        baseUrl,
        entries: [],
        maxEntries: 50_001,
      }),
    ).toThrow();
  });

  it("rejects invalid byte limits", () => {
    expect(() =>
      generateSitemap({
        baseUrl,
        entries: [],
        maxBytes: 100,
      }),
    ).toThrow();
  });
});

describe("Robots.txt generation", () => {
  it("serializes rules and sitemap references", () => {
    const content = serializeRobotsTxt({
      rules: [
        {
          userAgent: "*",
          allow: ["/"],
          disallow: ["/admin"],
        },
      ],
      sitemap: `${baseUrl}/sitemap.xml`,
    });

    expect(content).toContain("User-agent: *");
    expect(content).toContain("Allow: /");
    expect(content).toContain("Disallow: /admin");
    expect(content).toContain(`Sitemap: ${baseUrl}/sitemap.xml`);
  });

  it("deduplicates sitemap references", () => {
    const content = serializeRobotsTxt({
      rules: [{ userAgent: "*" }],
      sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/sitemap.xml`],
    });

    expect(content.match(/Sitemap:/g)).toHaveLength(1);
  });

  it("reports invalid rules", () => {
    const result = generateRobotsTxt({
      rules: [
        {
          userAgent: "",
        },
      ],
    });

    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.content).toBe("");
  });

  it("rejects newline injection in paths", () => {
    const result = generateRobotsTxt({
      rules: [
        {
          userAgent: "*",
          disallow: ["/admin\nAllow: /"],
        },
      ],
    });

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "INVALID_ROBOTS_PATH",
        }),
      ]),
    );
  });
});

describe("Sitemap HTTP handler", () => {
  it("serves the sitemap index at the configured path", () => {
    const handler = createSitemapHandler(createOptions().sitemap);

    const response = handler(createRequest("/sitemap.xml"));

    expect(response.status).toBe(200);
    expect(response.headers["Content-Type"]).toContain("application/xml");
    expect(response.body).toContain("<sitemapindex");
  });

  it("serves individual sitemap files", () => {
    const handler = createSitemapHandler(createOptions().sitemap);

    const first = handler(createRequest("/sitemap-1.xml"));
    const second = handler(createRequest("/sitemap-2.xml"));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(first.body).toContain("/page-1");
    expect(second.body).toContain("/page-2");
    expect(first.body).toContain("<urlset");
  });

  it("returns 404 for unknown sitemap files", () => {
    const handler = createSitemapHandler(createOptions().sitemap);

    const response = handler(createRequest("/sitemap-99.xml"));

    expect(response.status).toBe(404);
    expect(response.headers["Cache-Control"]).toBe("no-store");
  });

  it("serves a single sitemap directly without an index", () => {
    const options = createOptions({
      sitemap: {
        sitemap: {
          baseUrl,
          entries: createEntries(1),
        },
      },
    });

    const handler = createSitemapHandler(options.sitemap);
    const response = handler(createRequest("/sitemap.xml"));

    expect(response.status).toBe(200);
    expect(response.body).toContain("<urlset");
    expect(response.body).not.toContain("<sitemapindex");
  });

  it("supports a custom index path", () => {
    const options = createOptions({
      sitemap: {
        sitemap: {
          baseUrl,
          entries: createEntries(2),
          maxEntries: 1,
        },
        path: "/seo-index.xml",
      },
    });

    const handler = createSitemapHandler(options.sitemap);

    expect(handler(createRequest("/seo-index.xml")).status).toBe(200);
    expect(handler(createRequest("/sitemap.xml")).status).toBe(404);
  });

  it("returns 500 for invalid sitemap configuration", () => {
    const handler = createSitemapHandler({
      sitemap: {
        baseUrl,
        entries: [],
        maxEntries: 50_001,
      },
    });

    const response = handler(createRequest("/sitemap.xml"));

    expect(response.status).toBe(500);
    expect(response.headers["Cache-Control"]).toBe("no-store");
  });

  it("supports requests without a Request argument", () => {
    const handler = createSitemapHandler(createOptions().sitemap);
    const response = handler();

    expect(response.status).toBe(200);
    expect(response.body).toContain("<sitemapindex");
  });
});

describe("Robots HTTP handler", () => {
  it("serves robots.txt", () => {
    const handler = createRobotsHandler(createOptions().robots);
    const response = handler(createRequest("/robots.txt"));

    expect(response.status).toBe(200);
    expect(response.headers["Content-Type"]).toContain("text/plain");
    expect(response.body).toContain("User-agent: *");
  });

  it("returns 404 for an incorrect route", () => {
    const handler = createRobotsHandler(createOptions().robots);
    const response = handler(createRequest("/robots"));

    expect(response.status).toBe(404);
  });

  it("supports a custom robots path", () => {
    const handler = createRobotsHandler({
      ...createOptions().robots,
      path: "/crawler-rules.txt",
    });

    expect(handler(createRequest("/crawler-rules.txt")).status).toBe(200);
    expect(handler(createRequest("/robots.txt")).status).toBe(404);
  });

  it("returns 500 for invalid robots configuration", () => {
    const handler = createRobotsHandler({
      robots: {
        rules: [],
      },
    });

    const response = handler(createRequest("/robots.txt"));

    expect(response.status).toBe(500);
    expect(response.headers["Cache-Control"]).toBe("no-store");
  });
});

describe("Framework-independent HTTP route handlers", () => {
  it("returns native Response instances", async () => {
    const routes = createSeoRouteHandlers(createOptions());

    const sitemap = await routes.sitemap(createRequest("/sitemap.xml"));
    const robots = await routes.robots(createRequest("/robots.txt"));

    expect(sitemap).toBeInstanceOf(Response);
    expect(robots).toBeInstanceOf(Response);

    expect(sitemap.status).toBe(200);
    expect(robots.status).toBe(200);
  });

  it("preserves response headers", async () => {
    const routes = createSeoRouteHandlers(createOptions());

    const response = await routes.sitemap(createRequest("/sitemap.xml"));

    expect(response.headers.get("Content-Type")).toContain("application/xml");

    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });
});

describe("Next.js adapter", () => {
  it("provides GET handlers for sitemap and robots", async () => {
    const routes = createNextSeoRoutes(createOptions());

    const sitemap = await routes.sitemapGET(createRequest("/sitemap.xml"));

    const robots = await routes.robotsGET(createRequest("/robots.txt"));

    expect(sitemap.status).toBe(200);
    expect(robots.status).toBe(200);
  });
});

describe("TanStack Start adapter", () => {
  it("accepts the server route handler context", async () => {
    const routes = createTanStackSeoRoutes(createOptions());

    const sitemap = await routes.sitemapGET({
      request: createRequest("/sitemap.xml"),
    });

    const robots = await routes.robotsGET({
      request: createRequest("/robots.txt"),
    });

    expect(sitemap.status).toBe(200);
    expect(robots.status).toBe(200);
  });
});

describe("React Router adapter", () => {
  it("provides resource route loaders", async () => {
    const routes = createReactRouterSeoRoutes(createOptions());

    const sitemap = await routes.sitemapLoader({
      request: createRequest("/sitemap.xml"),
      params: {},
      context: {},
    });

    const robots = await routes.robotsLoader({
      request: createRequest("/robots.txt"),
      params: {},
      context: {},
    });

    expect(sitemap.status).toBe(200);
    expect(robots.status).toBe(200);
  });
});
