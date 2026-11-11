import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { createSitemapHandler } from "./sitemap";

afterEach(() => {
  mock.restore();
});

const request = (origin = "https://puzzle.example") =>
  new Request(`${origin}/sitemap.xml`);

describe("sitemap", () => {
  it("generates an XML sitemap with unique, sorted absolute URLs", async () => {
    const handler = createSitemapHandler(() => [
      "/docs/ui",
      "/",
      "/docs/ui",
      "/docs/getting-started",
    ]);
    const response = handler(request());

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "application/xml; charset=utf-8",
    );
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=86400, s-maxage=86400",
    );
    expect(await response.text()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        "  <url><loc>https://puzzle.example/</loc></url>\n" +
        "  <url><loc>https://puzzle.example/docs/getting-started</loc></url>\n" +
        "  <url><loc>https://puzzle.example/docs/ui</loc></url>\n" +
        "</urlset>\n",
    );
  });

  it("escapes XML characters in URLs", async () => {
    const handler = createSitemapHandler(() => ["/docs?q=one&next=two"]);
    expect(await handler(request()).text()).toContain(
      "<loc>https://puzzle.example/docs?q=one&amp;next=two</loc>",
    );
  });

  it("reuses the generated response until exactly 24 hours have passed", async () => {
    const clock = spyOn(Date, "now").mockReturnValue(1000);
    const getPaths = mock(() => ["/"]);
    const handler = createSitemapHandler(getPaths);
    const body = await handler(request()).text();

    clock.mockReturnValue(1000 + 86400 * 1000 - 1);
    expect(await handler(request()).text()).toBe(body);
    expect(getPaths).toHaveBeenCalledTimes(1);

    getPaths.mockReturnValue(["/", "/docs/ui"]);
    clock.mockReturnValue(1000 + 86400 * 1000);
    expect(await handler(request()).text()).toContain(
      "https://puzzle.example/docs/ui",
    );
    expect(getPaths).toHaveBeenCalledTimes(2);
  });

  it("does not serve another origin's cached URLs", async () => {
    const handler = createSitemapHandler(() => ["/"]);
    await handler(request()).text();
    const body = await handler(request("https://other.example")).text();

    expect(body).toContain("https://other.example/");
    expect(body).not.toContain("https://puzzle.example/");
  });

  it("propagates generation errors and does not cache failures", async () => {
    const getPaths = mock((): string[] => {
      throw new Error("Unable to load documentation");
    });
    const handler = createSitemapHandler(getPaths);

    expect(() => handler(request())).toThrow("Unable to load documentation");
    getPaths.mockReturnValue(["/"]);
    expect(await handler(request()).text()).toContain("https://puzzle.example/");
    expect(getPaths).toHaveBeenCalledTimes(2);
  });
});
