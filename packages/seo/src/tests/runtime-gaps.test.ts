import { describe, expect, it } from "vitest";

import { createReactRouterSeoRoutes } from "../react-router";
import { createRobotsHandler, createSeoRouteHandlers, createSitemapHandler } from "../server";
import { formatSeoDiagnostics, inspectSeoGraph } from "../testing";

import type { SeoRouteOptions } from "../server";
import type { SeoGraph } from "../core";
import type { SeoValidationReport } from "../validation/types";

const baseUrl = "https://example.com";

const options: SeoRouteOptions = {
  sitemap: {
    sitemap: {
      baseUrl,
      entries: [{ url: "/" }, { url: "/about" }],
      maxEntries: 1,
    },
  },
  robots: {
    robots: {
      rules: [{ userAgent: "*", allow: ["/"] }],
    },
  },
};

const issue = (
  severity: "error" | "warning" | "info",
  source: SeoValidationReport["issues"][number]["source"],
  code: string,
  location: { path?: string; nodeId?: string },
) => ({
  severity,
  source,
  code,
  message: `${code} message`,
  ...location,
  suggestion: `${code} suggestion`,
  docsUrl: `https://docs.example.com/${code}`,
});

describe("SEO server route gaps", () => {
  it("uses method-independent handlers and preserves configured response headers", async () => {
    const routes = createSeoRouteHandlers({
      ...options,
      sitemap: {
        ...options.sitemap,
        path: "seo//index.xml",
        cacheControl: "public, max-age=120",
      },
      robots: {
        ...options.robots,
        path: "/crawl/rules.txt",
        cacheControl: "public, max-age=60",
      },
    });

    const sitemap = await routes.sitemap(
      new Request(`${baseUrl}/seo/index.xml`, { method: "POST" }),
    );
    const robots = await routes.robots(
      new Request(`${baseUrl}/crawl/rules.txt`, { method: "PUT" }),
    );

    expect(sitemap.status).toBe(200);
    expect(sitemap.headers.get("Content-Type")).toContain("application/xml");
    expect(sitemap.headers.get("Cache-Control")).toBe("public, max-age=120");
    expect(sitemap.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(robots.status).toBe(200);
    expect(robots.headers.get("Content-Type")).toContain("text/plain");
    expect(robots.headers.get("Cache-Control")).toBe("public, max-age=60");
  });

  it("returns no-store 404 responses for malformed and unknown route paths", async () => {
    const routes = createReactRouterSeoRoutes(options);
    const unknownPaths = [
      `${baseUrl}/sitemap-%E0%A4%A.xml`,
      `${baseUrl}/robots.txt/extra`,
    ];

    const sitemap = await routes.sitemapLoader({
      request: new Request(unknownPaths[0]!),
      params: { seoFile: "sitemap-%E0%A4%A.xml" },
      context: {},
    });
    const robots = await routes.robotsLoader({
      request: new Request(unknownPaths[1]!),
      params: {},
      context: {},
    });

    expect(sitemap.status).toBe(404);
    expect(sitemap.headers.get("Cache-Control")).toBe("no-store");
    expect(robots.status).toBe(404);
    expect(robots.headers.get("Cache-Control")).toBe("no-store");
  });

  it("treats an invalid request URL as an omitted route path", () => {
    const handler = createSitemapHandler(options.sitemap);
    const response = handler({ url: "not a URL" } as Request);

    expect(response.status).toBe(200);
    expect(response.body).toContain("<sitemapindex");
  });

  it("returns generation issues and thrown failures as non-cacheable server errors", () => {
    const invalidSitemap = createSitemapHandler({
      sitemap: {
        baseUrl,
        entries: [],
        maxEntries: 50_001,
      },
    })();
    const invalidRobots = createRobotsHandler({
      robots: { rules: [] },
    })();

    const thrownSitemap = createSitemapHandler({
      sitemap: new Proxy(
        {},
        {
          get() {
            throw new Error("sitemap exploded");
          },
        },
      ) as never,
    })();
    const thrownRobots = createRobotsHandler({
      robots: new Proxy(
        {},
        {
          get() {
            throw new Error("robots exploded");
          },
        },
      ) as never,
    })();

    for (const response of [
      invalidSitemap,
      invalidRobots,
      thrownSitemap,
      thrownRobots,
    ]) {
      expect(response.status).toBe(500);
      expect(response.headers["Cache-Control"]).toBe("no-store");
      expect(response.headers["X-Content-Type-Options"]).toBe("nosniff");
    }

    expect(thrownSitemap.body).toBe("sitemap exploded");
    expect(thrownRobots.body).toBe("robots exploded");
  });
});

describe("SEO diagnostics and graph inspection gaps", () => {
  it("reports paths, grouped counts, and per-issue source and severity", () => {
    const report: SeoValidationReport = {
      valid: false,
      mode: "strict",
      issues: [
        issue("error", "graph", "MISSING_NODE", { path: "$.publisher" }),
        issue("warning", "schema", "UNKNOWN_PROPERTY", {
          nodeId: "https://example.com/#page",
        }),
        issue("info", "metadata", "OPTIONAL_FIELD", {}),
      ],
      summary: { errors: 1, warnings: 1, infos: 1, total: 3 },
    };

    const formatted = formatSeoDiagnostics(report);

    expect(formatted).toContain("[ERROR] — [graph] — MISSING_NODE");
    expect(formatted).toContain("Path: $.publisher");
    expect(formatted).toContain("Path: https://example.com/#page");
    expect(formatted).toContain("Suggestion: UNKNOWN_PROPERTY suggestion");
    expect(formatted).toContain("Documentation: https://docs.example.com/OPTIONAL_FIELD");
    expect(formatted).toContain("Mode: strict");
    expect(formatted).toContain("Errors: 1");
    expect(formatted).toContain("Warnings: 1");
    expect(formatted).toContain("Info: 1");
  });

  it("omits paths, suggestions, and summaries independently", () => {
    const report: SeoValidationReport = {
      valid: true,
      mode: "warn",
      issues: [issue("warning", "graph", "CHECK", { nodeId: "node-1" })],
      summary: { errors: 0, warnings: 1, infos: 0, total: 1 },
    };

    expect(formatSeoDiagnostics(report, { includePaths: false })).not.toContain(
      "Path:",
    );
    expect(
      formatSeoDiagnostics(report, { includeSuggestions: false }),
    ).not.toContain("Suggestion:");
    expect(
      formatSeoDiagnostics(report, { includeSummary: false }),
    ).not.toContain("SEO validation:");
  });

  it("returns an empty, valid inspection for an empty graph", () => {
    const result = inspectSeoGraph({ "@graph": [] });

    expect(result).toEqual({
      nodeCount: 0,
      typeCounts: {},
      nodes: [],
      references: [],
      unresolvedReferences: [],
      valid: true,
    });
  });

  it("summarizes multiple nodes, normalized types, properties, and local paths", () => {
    const graph: SeoGraph = {
      "@graph": [
        {
          "@id": `${baseUrl}/#page`,
          "@type": ["https://schema.org/WebPage", "Thing"],
          name: "Home",
          publisher: { "@id": `${baseUrl}/#organization` },
          __puzzleInternal: true,
        },
        {
          "@id": `${baseUrl}/#organization`,
          "@type": "https://schema.org/Organization",
          name: "Example",
        },
      ],
    };

    const result = inspectSeoGraph(graph, { baseUrl });

    expect(result.nodeCount).toBe(2);
    expect(result.typeCounts).toEqual({
      Organization: 1,
      Thing: 1,
      WebPage: 1,
    });
    expect(result.nodes[0]).toEqual({
      id: `${baseUrl}/#page`,
      types: ["Thing", "WebPage"],
      properties: ["@id", "@type", "name", "publisher"],
    });
    expect(result.references).toEqual([`${baseUrl}/#organization`]);
    expect(result.unresolvedReferences).toEqual([]);
    expect(result.valid).toBe(true);
  });
});
