import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

import { buildSeoGraph, stringifySeoGraph } from "../core";

import type { SeoNode } from "../core";

import { normalizeSeoUrl } from "../urls";

import { generateSitemap } from "../sitemap";

import { generateRobotsTxt } from "../robots";

import { SeoProvider, LDOrganization } from "../react";

const BASE_URL = "https://example.com";

const config = {
  siteUrl: BASE_URL,
  identity: {
    name: "Puzzle",
    url: BASE_URL,
  },
};

describe("E9.6 Security regression tests", () => {
  describe("JSON-LD serialization", () => {
    it("prevents script termination through user-controlled values", () => {
      const payload = '</script><script>alert("xss")</script>';

      const graph = buildSeoGraph(
        [
          {
            "@type": "WebPage",
            name: payload,
          },
        ],
        {
          baseUrl: BASE_URL,
        },
      );

      const result = stringifySeoGraph(graph, {
        scriptSafe: true,
      });

      expect(result).not.toContain("</script>");
      expect(result).not.toContain("<script>");
      expect(result).toContain("\\u003c/script\\u003e");
    });

    it("escapes HTML-sensitive characters", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "WebPage",
            name: '<tag attr="value"> & content',
          },
        ],
        {
          baseUrl: BASE_URL,
        },
      );

      const result = stringifySeoGraph(graph, {
        scriptSafe: true,
      });

      expect(result).not.toContain("<tag");
      expect(result).not.toContain("</tag>");
      expect(result).toContain("\\u003c");
      expect(result).toContain("\\u0026");
    });

    it("escapes JavaScript line separator characters", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "WebPage",
            name: "Line\u2028Separator\u2029",
          },
        ],
        {
          baseUrl: BASE_URL,
        },
      );

      const result = stringifySeoGraph(graph, {
        scriptSafe: true,
      });

      expect(result).not.toContain("\u2028");
      expect(result).not.toContain("\u2029");
      expect(result).toContain("\\u2028");
      expect(result).toContain("\\u2029");
    });

    it("does not mutate the original graph", () => {
      const node: SeoNode = {
        "@type": "Organization",
        name: "Example",
        description: "Original description",
      };

      const graph = buildSeoGraph([node], {
        baseUrl: BASE_URL,
      });

      const before = JSON.stringify(graph);

      stringifySeoGraph(graph, {
        scriptSafe: true,
      });

      expect(JSON.stringify(graph)).toBe(before);
    });

    it("does not allow prototype pollution through JSON input", () => {
      const node = JSON.parse(
        '{"@type":"Thing","name":"Example","__proto__":{"polluted":true}}',
      ) as SeoNode;

      const graph = buildSeoGraph([node], {
        baseUrl: BASE_URL,
      });

      expect(
        Object.prototype.hasOwnProperty.call(Object.prototype, "polluted"),
      ).toBe(false);

      expect(
        Object.prototype.hasOwnProperty.call(graph["@graph"][0], "polluted"),
      ).toBe(false);
    });

    it("produces deterministic output for repeated serialization", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "Organization",
            name: "Example",
            description: "Example organization",
          },
          {
            "@type": "WebSite",
            name: "Example website",
          },
        ],
        {
          baseUrl: BASE_URL,
        },
      );

      expect(stringifySeoGraph(graph)).toBe(stringifySeoGraph(graph));
    });
  });

  describe("URL security", () => {
    it.each([
      "javascript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "file:///etc/passwd",
      "vbscript:msgbox(1)",
    ])("rejects unsafe protocol: %s", (url) => {
      expect(() =>
        normalizeSeoUrl(url, {
          baseUrl: BASE_URL,
        }),
      ).toThrow();
    });

    it("rejects URLs containing username and password", () => {
      expect(() =>
        normalizeSeoUrl("https://user:password@example.com/private", {
          baseUrl: BASE_URL,
        }),
      ).toThrow(/credentials/i);
    });

    it("rejects external URLs when explicitly disabled", () => {
      expect(() =>
        normalizeSeoUrl("https://attacker.example/path", {
          baseUrl: BASE_URL,
          allowExternal: false,
        }),
      ).toThrow(/external/i);
    });

    it("allows explicitly permitted external HTTPS URLs", () => {
      expect(
        normalizeSeoUrl("https://cdn.example/image.webp", {
          baseUrl: BASE_URL,
          allowExternal: true,
        }),
      ).toBe("https://cdn.example/image.webp");
    });
  });

  describe("Sitemap XML security", () => {
    it("escapes user-controlled XML content", () => {
      const result = generateSitemap({
        baseUrl: BASE_URL,
        entries: [
          {
            url: "/gallery",
            images: [
              {
                url: "https://example.com/image.webp",
                title: '<script>alert("xss")</script>',
                caption: "Image & description",
              },
            ],
          },
        ],
      });

      const xml = result.files[0]?.xml ?? "";

      expect(xml).not.toContain("<script>");
      expect(xml).toContain("&lt;script&gt;");
      expect(xml).toContain("&amp;");
    });

    it("escapes generated sitemap index URLs", () => {
      const result = generateSitemap({
        baseUrl: BASE_URL,
        filename: "sitemap&evil=1",
        maxEntries: 1,
        entries: [{ url: "/first" }, { url: "/second" }],
      });

      expect(result.indexXml).toBeDefined();
      expect(result.indexXml).toContain("&amp;evil=1");
      expect(result.indexXml).not.toContain("&evil=1");
    });

    it("does not allow JavaScript URLs in sitemap entries", () => {
      const result = generateSitemap({
        baseUrl: BASE_URL,
        entries: [
          {
            url: "javascript:alert(1)",
          },
        ],
      });

      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.totalEntries).toBe(0);
    });
  });

  describe("Robots.txt security", () => {
    it("rejects newline injection in user-agent", () => {
      const result = generateRobotsTxt({
        rules: [
          {
            userAgent: "*\nDisallow: /",
          },
        ],
      });

      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.content).toBe("");
    });

    it("rejects newline injection in directives", () => {
      const result = generateRobotsTxt({
        rules: [
          {
            userAgent: "*",
            disallow: ["/private\nAllow: /"],
          },
        ],
      });

      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.content).toBe("");
    });
  });
});

describe("E9.2 / E9.3 React SSR security and isolation", () => {
  it("escapes user-controlled structured data during SSR", () => {
    const payload = '</script><script>alert("xss")</script>';

    const html = renderToStaticMarkup(
      createElement(SeoProvider, {
        config,
        children: createElement(LDOrganization, {
          name: payload,
        }),
      }),
    );

    expect(html).not.toContain('</script><script>alert("xss")');

    expect(html).toContain("\\u003c/script\\u003e");
    expect(html).toContain('type="application/ld+json"');
  });

  it("isolates concurrent server renders", async () => {
    const render = (name: string) =>
      renderToStaticMarkup(
        createElement(SeoProvider, {
          config,
          children: createElement(LDOrganization, {
            name,
          }),
        }),
      );

    const [first, second] = await Promise.all([
      Promise.resolve().then(() => render("Tenant Alpha")),
      Promise.resolve().then(() => render("Tenant Beta")),
    ]);

    expect(first).toContain("Tenant Alpha");
    expect(first).not.toContain("Tenant Beta");

    expect(second).toContain("Tenant Beta");
    expect(second).not.toContain("Tenant Alpha");
  });

  it("does not leak graph data between sequential SSR requests", () => {
    const render = (name: string) =>
      renderToStaticMarkup(
        createElement(SeoProvider, {
          config,
          children: createElement(LDOrganization, {
            name,
          }),
        }),
      );

    const first = render("First request");
    const second = render("Second request");

    expect(first).toContain("First request");
    expect(first).not.toContain("Second request");

    expect(second).toContain("Second request");
    expect(second).not.toContain("First request");
  });

  it("renders a CSP nonce on the JSON-LD script", () => {
    const html = renderToStaticMarkup(
      createElement(SeoProvider, {
        config,
        nonce: "test-csp-nonce",
        children: createElement(LDOrganization, {
          name: "Puzzle",
        }),
      }),
    );

    expect(html).toContain('nonce="test-csp-nonce"');
  });
});
