import { describe, expect, it } from "vitest";

import {
  normalizeSeoUrl,
  normalizeSeoOrigin,
  isSameSeoOrigin,
  resolveSeoUrls,
} from "../urls";

import { serializeSitemap, generateSitemap } from "../sitemap";

import { serializeRobotsTxt, generateRobotsTxt } from "../robots";

import { createSitemapHandler, createRobotsHandler } from "../server";

const baseUrl = "https://example.com";

describe("E8.1 URL utilities", () => {
  it("normalizes relative URLs", () => {
    expect(normalizeSeoUrl("/about", { baseUrl })).toBe(
      "https://example.com/about",
    );
  });

  it("normalizes trailing slashes", () => {
    expect(
      normalizeSeoUrl("/about/", {
        baseUrl,
        trailingSlash: "never",
      }),
    ).toBe("https://example.com/about");
  });

  it("preserves query strings and fragments", () => {
    expect(
      normalizeSeoUrl("/search?q=test#results", {
        baseUrl,
      }),
    ).toBe("https://example.com/search?q=test#results");
  });

  it("normalizes the origin", () => {
    expect(normalizeSeoOrigin("https://example.com/path?query=1")).toBe(
      "https://example.com",
    );
  });

  it("rejects unsupported protocols", () => {
    expect(() => normalizeSeoUrl("javascript:alert(1)", { baseUrl })).toThrow();
  });

  it("rejects credentials", () => {
    expect(() =>
      normalizeSeoUrl("https://user:password@example.com"),
    ).toThrow();
  });

  it("rejects external URLs when configured", () => {
    expect(() =>
      normalizeSeoUrl("https://other.com", {
        baseUrl,
        allowExternal: false,
      }),
    ).toThrow();
  });

  it("supports explicit external URLs", () => {
    expect(
      normalizeSeoUrl("https://other.com", {
        baseUrl,
        allowExternal: true,
      }),
    ).toBe("https://other.com/");
  });

  it("compares origins", () => {
    expect(
      isSameSeoOrigin("https://example.com/a", "https://example.com/b"),
    ).toBe(true);
  });

  it("deduplicates and sorts URLs", () => {
    expect(resolveSeoUrls(["/b", "/a", "/b"], { baseUrl })).toEqual([
      "https://example.com/a",
      "https://example.com/b",
    ]);
  });
});

describe("E8.2 Sitemap generation", () => {
  it("generates valid XML", () => {
    const result = serializeSitemap({
      baseUrl,
      entries: [{ url: "/" }],
    });

    expect(result.xml).toContain("<urlset");
    expect(result.xml).toContain("<loc>https://example.com/</loc>");
    expect(result.issues).toHaveLength(0);
  });

  it("escapes XML content", () => {
    const result = serializeSitemap({
      baseUrl,
      entries: [
        {
          url: "/search?q=a&b=c",
        },
      ],
    });

    expect(result.xml).toContain("&amp;");
  });

  it("supports image metadata", () => {
    const result = serializeSitemap({
      baseUrl,
      entries: [
        {
          url: "/gallery",
          images: [
            {
              url: "/image.jpg",
              title: "Example image",
            },
          ],
        },
      ],
    });

    expect(result.xml).toContain("image:image");
    expect(result.xml).toContain("image:title");
  });

  it("supports video metadata", () => {
    const result = serializeSitemap({
      baseUrl,
      entries: [
        {
          url: "/video",
          videos: [
            {
              thumbnailUrl: "/thumbnail.jpg",
              title: "Example video",
              description: "Example description",
            },
          ],
        },
      ],
    });

    expect(result.xml).toContain("video:video");
    expect(result.xml).toContain("video:thumbnail_loc");
  });

  it("supports hreflang alternates", () => {
    const result = serializeSitemap({
      baseUrl,
      entries: [
        {
          url: "/en",
          alternates: [
            {
              locale: "nl",
              url: "/nl",
            },
          ],
        },
      ],
    });

    expect(result.xml).toContain('hreflang="nl"');
    expect(result.xml).toContain('href="https://example.com/nl"');
  });

  it("excludes non-indexable pages", () => {
    const result = serializeSitemap({
      baseUrl,
      entries: [
        { url: "/indexable" },
        { url: "/private", indexable: false },
        { url: "/redirect", redirectTo: "/new" },
        { url: "/not-found", statusCode: 404 },
      ],
    });

    expect(result.entries).toHaveLength(1);
    expect(result.xml).toContain("/indexable");
    expect(result.xml).not.toContain("/private");
  });

  it("detects duplicate URLs", () => {
    const result = serializeSitemap({
      baseUrl,
      entries: [{ url: "/about" }, { url: "/about" }],
    });

    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "DUPLICATE_URL",
      }),
    );
  });

  it("detects invalid priorities", () => {
    const result = serializeSitemap({
      baseUrl,
      entries: [
        {
          url: "/about",
          priority: 2,
        },
      ],
    });

    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "INVALID_PRIORITY",
      }),
    );
  });

  it("splits large sitemaps", () => {
    const entries = Array.from({ length: 5 }, (_, index) => ({
      url: `/page-${index}`,
    }));

    const result = generateSitemap({
      baseUrl,
      entries,
      maxEntries: 2,
    });

    expect(result.files).toHaveLength(3);
    expect(result.totalEntries).toBe(5);
    expect(result.indexXml).toContain("<sitemapindex");
  });

  it("does not create an index for a single sitemap", () => {
    const result = generateSitemap({
      baseUrl,
      entries: [{ url: "/" }],
    });

    expect(result.files).toHaveLength(1);
    expect(result.indexXml).toBeUndefined();
  });

  it("creates deterministic sitemap files", () => {
    const options = {
      baseUrl,
      entries: [{ url: "/b" }, { url: "/a" }],
    };

    const first = generateSitemap(options);
    const second = generateSitemap(options);

    expect(first.files).toEqual(second.files);
  });

  it("validates reciprocal hreflang alternates", () => {
    const result = generateSitemap({
      baseUrl,
      validateAlternates: true,
      entries: [
        {
          url: "/en",
          alternates: [
            {
              locale: "nl",
              url: "/nl",
            },
          ],
        },
        {
          url: "/nl",
          alternates: [
            {
              locale: "en",
              url: "/en",
            },
          ],
        },
      ],
    });

    expect(result.issues).toHaveLength(0);
  });
});

describe("E8.4 Robots generation", () => {
  it("generates robots.txt", () => {
    const result = serializeRobotsTxt({
      rules: [
        {
          userAgent: "*",
          allow: ["/"],
          disallow: ["/private"],
        },
      ],
    });

    expect(result).toContain("User-agent: *");
    expect(result).toContain("Allow: /");
    expect(result).toContain("Disallow: /private");
  });

  it("supports multiple user agents", () => {
    const result = serializeRobotsTxt({
      rules: [
        {
          userAgent: ["Googlebot", "Bingbot"],
          disallow: ["/private"],
        },
      ],
    });

    expect(result).toContain("User-agent: Googlebot");
    expect(result).toContain("User-agent: Bingbot");
  });

  it("supports crawl delay", () => {
    const result = serializeRobotsTxt({
      rules: [
        {
          userAgent: "*",
          crawlDelay: 5,
        },
      ],
    });

    expect(result).toContain("Crawl-delay: 5");
  });

  it("supports sitemap declarations", () => {
    const result = serializeRobotsTxt({
      rules: [{ userAgent: "*" }],
      sitemap: ["https://example.com/sitemap.xml"],
    });

    expect(result).toContain("Sitemap: https://example.com/sitemap.xml");
  });

  it("deduplicates sitemap declarations", () => {
    const result = serializeRobotsTxt({
      rules: [{ userAgent: "*" }],
      sitemap: [
        "https://example.com/sitemap.xml",
        "https://example.com/sitemap.xml",
      ],
    });

    expect(result.match(/Sitemap:/g)).toHaveLength(1);
  });

  it("rejects invalid crawl delays", () => {
    const result = generateRobotsTxt({
      rules: [
        {
          userAgent: "*",
          crawlDelay: -1,
        },
      ],
    });

    expect(result.issues).toHaveLength(1);
    expect(result.content).toBe("");
  });

  it("rejects newline injection", () => {
    const result = generateRobotsTxt({
      rules: [
        {
          userAgent: "*\nDisallow: /",
        },
      ],
    });

    expect(result.issues.length).toBeGreaterThan(0);
  });

  it("ends output with a newline", () => {
    const result = serializeRobotsTxt({
      rules: [{ userAgent: "*" }],
    });

    expect(result.endsWith("\n")).toBe(true);
  });
});

describe("E8.5 Server handlers", () => {
  it("creates a sitemap response", () => {
    const handler = createSitemapHandler({
      sitemap: {
        baseUrl,
        entries: [{ url: "/" }],
      },
    });

    const response = handler();

    expect(response.status).toBe(200);
    expect(response.headers["Content-Type"]).toContain("application/xml");
    expect(response.body).toContain("<urlset");
  });

  it("creates a robots response", () => {
    const handler = createRobotsHandler({
      robots: {
        rules: [
          {
            userAgent: "*",
            allow: ["/"],
          },
        ],
      },
    });

    const response = handler();

    expect(response.status).toBe(200);
    expect(response.headers["Content-Type"]).toContain("text/plain");
    expect(response.body).toContain("User-agent: *");
  });

  it("supports custom cache headers", () => {
    const handler = createRobotsHandler({
      robots: {
        rules: [{ userAgent: "*" }],
      },
      cacheControl: "public, max-age=600",
    });

    expect(handler().headers["Cache-Control"]).toBe("public, max-age=600");
  });
});
