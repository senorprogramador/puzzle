import { describe, expect, it, mock } from "bun:test";

import { HOME_URL, getCanonicalUrl, SITE_URL } from "./seo";

const documentationUrls = ["/docs/getting-started", "/docs/ui/actions/button"];
mock.module("@/lib/source", () => ({
  source: {
    getPages: () => documentationUrls.map((url) => ({ url })),
  },
}));

const { seoRoutes } = await import("./seo-routes");

describe("SEO routes", () => {
  it("includes the homepage and every documentation page once in the sitemap", async () => {
    const response = await seoRoutes.sitemapGET({
      request: new Request(`${SITE_URL}/sitemap.xml`),
    });
    const xml = await response.text();
    const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) =>
      (match[1] ?? "").replaceAll("&amp;", "&"),
    );
    const expectedUrls = [
      HOME_URL,
      ...documentationUrls.map(getCanonicalUrl),
    ].sort();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/xml");
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.sort()).toEqual(expectedUrls);
  });

  it("allows crawling and advertises the sitemap in robots.txt", async () => {
    const response = await seoRoutes.robotsGET({
      request: new Request(`${SITE_URL}/robots.txt`),
    });
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(body).toMatch(/^User-agent:\s*\*\s*[\r\n]+Allow:\s*\/\s*$/m);
    expect(body).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
    expect(body).not.toMatch(/^Disallow:\s*\//im);
  });
});
