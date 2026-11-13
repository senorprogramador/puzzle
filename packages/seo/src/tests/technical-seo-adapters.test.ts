import { describe, expect, it } from "vitest";

import { createNextSeoRoutes } from "../next";
import { createTanStackSeoRoutes } from "../tanstack";
import { createReactRouterSeoRoutes } from "../react-router";

import type { SeoRouteOptions } from "../server";

const baseUrl = "https://example.com";

const createOptions = (): SeoRouteOptions => ({
  sitemap: {
    sitemap: {
      baseUrl,
      entries: Array.from({ length: 3 }, (_, index) => ({
        url: `/page-${index + 1}`,
        lastModified: "2026-01-01",
      })),
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
});

const createRequest = (pathname: string): Request =>
  new Request(`${baseUrl}${pathname}`);

const expectSitemapResponse = async (
  response: Response,
  expectedContent: string,
) => {
  expect(response).toBeInstanceOf(Response);
  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toContain("application/xml");
  expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");

  const body = await response.text();

  expect(body).toContain("<urlset");
  expect(body).toContain(expectedContent);
};

const expectSitemapIndexResponse = async (response: Response) => {
  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toContain("application/xml");

  const body = await response.text();

  expect(body).toContain("<sitemapindex");
  expect(body).toContain("sitemap-1.xml");
  expect(body).toContain("sitemap-2.xml");
  expect(body).toContain("sitemap-3.xml");
};

const expectRobotsResponse = async (response: Response) => {
  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toContain("text/plain");

  const body = await response.text();

  expect(body).toContain("User-agent: *");
  expect(body).toContain("Disallow: /admin");
};

describe("Next.js SEO adapter", () => {
  it("serves the sitemap index through the dynamic sitemap route", async () => {
    const routes = createNextSeoRoutes(createOptions());

    await expectSitemapIndexResponse(
      await routes.sitemapGET(createRequest("/sitemap.xml")),
    );
  });

  it("serves every generated sitemap file through the same route", async () => {
    const routes = createNextSeoRoutes(createOptions());

    await expectSitemapResponse(
      await routes.sitemapGET(createRequest("/sitemap-1.xml")),
      "/page-1",
    );

    await expectSitemapResponse(
      await routes.sitemapGET(createRequest("/sitemap-2.xml")),
      "/page-2",
    );

    await expectSitemapResponse(
      await routes.sitemapGET(createRequest("/sitemap-3.xml")),
      "/page-3",
    );
  });

  it("returns 404 for unknown sitemap files", async () => {
    const routes = createNextSeoRoutes(createOptions());

    const response = await routes.sitemapGET(createRequest("/sitemap-99.xml"));

    expect(response.status).toBe(404);
  });

  it("serves robots.txt through its static route", async () => {
    const routes = createNextSeoRoutes(createOptions());

    await expectRobotsResponse(
      await routes.robotsGET(createRequest("/robots.txt")),
    );
  });
});

describe("TanStack Start SEO adapter", () => {
  it("serves the sitemap index through the dynamic sitemap route", async () => {
    const routes = createTanStackSeoRoutes(createOptions());

    await expectSitemapIndexResponse(
      await routes.sitemapGET({
        request: createRequest("/sitemap.xml"),
      }),
    );
  });

  it("serves every generated sitemap file through the same route", async () => {
    const routes = createTanStackSeoRoutes(createOptions());

    await expectSitemapResponse(
      await routes.sitemapGET({
        request: createRequest("/sitemap-1.xml"),
      }),
      "/page-1",
    );

    await expectSitemapResponse(
      await routes.sitemapGET({
        request: createRequest("/sitemap-2.xml"),
      }),
      "/page-2",
    );

    await expectSitemapResponse(
      await routes.sitemapGET({
        request: createRequest("/sitemap-3.xml"),
      }),
      "/page-3",
    );
  });

  it("returns 404 for unknown sitemap files", async () => {
    const routes = createTanStackSeoRoutes(createOptions());

    const response = await routes.sitemapGET({
      request: createRequest("/sitemap-99.xml"),
    });

    expect(response.status).toBe(404);
  });

  it("serves robots.txt through its static route", async () => {
    const routes = createTanStackSeoRoutes(createOptions());

    await expectRobotsResponse(
      await routes.robotsGET({
        request: createRequest("/robots.txt"),
      }),
    );
  });
});

describe("React Router SEO adapter", () => {
  it("serves the sitemap index through the dynamic sitemap route", async () => {
    const routes = createReactRouterSeoRoutes(createOptions());

    await expectSitemapIndexResponse(
      await routes.sitemapLoader({
        request: createRequest("/sitemap.xml"),
        params: {
          seoFile: "sitemap.xml",
        },
        context: {},
      }),
    );
  });

  it("serves every generated sitemap file through the same route", async () => {
    const routes = createReactRouterSeoRoutes(createOptions());

    await expectSitemapResponse(
      await routes.sitemapLoader({
        request: createRequest("/sitemap-1.xml"),
        params: {
          seoFile: "sitemap-1.xml",
        },
        context: {},
      }),
      "/page-1",
    );

    await expectSitemapResponse(
      await routes.sitemapLoader({
        request: createRequest("/sitemap-2.xml"),
        params: {
          seoFile: "sitemap-2.xml",
        },
        context: {},
      }),
      "/page-2",
    );

    await expectSitemapResponse(
      await routes.sitemapLoader({
        request: createRequest("/sitemap-3.xml"),
        params: {
          seoFile: "sitemap-3.xml",
        },
        context: {},
      }),
      "/page-3",
    );
  });

  it("returns 404 for unknown sitemap files", async () => {
    const routes = createReactRouterSeoRoutes(createOptions());

    const response = await routes.sitemapLoader({
      request: createRequest("/sitemap-99.xml"),
      params: {
        seoFile: "sitemap-99.xml",
      },
      context: {},
    });

    expect(response.status).toBe(404);
  });

  it("serves robots.txt through its static route", async () => {
    const routes = createReactRouterSeoRoutes(createOptions());

    await expectRobotsResponse(
      await routes.robotsLoader({
        request: createRequest("/robots.txt"),
        params: {},
        context: {},
      }),
    );
  });
});
