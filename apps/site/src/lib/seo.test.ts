import { describe, expect, it } from "bun:test";

import { createSeoHead, getCanonicalUrl, SITE_URL } from "./seo";

describe("Puzzle SEO integration", () => {
  it("applies the Puzzle UI title template to documentation pages", () => {
    const head = createSeoHead({
      title: "Getting Started",
      description:
        "Install Puzzle in your React app and build your first interface.",
      canonical: "/docs/getting-started",
      locale: "en-US",
      openGraph: {
        type: "article",
      },
    });

    expect(head.meta).toContainEqual({
      title: "Puzzle UI | Getting Started",
    });
  });

  it("uses the original documentation description", () => {
    const description =
      "Install Puzzle in your React app and build your first interface.";

    const head = createSeoHead({
      title: "Getting Started",
      description,
      canonical: "/docs/getting-started",
    });

    expect(head.meta).toContainEqual({
      name: "description",
      content: description,
    });

    expect(head.meta).toContainEqual({
      property: "og:description",
      content: description,
    });

    expect(head.meta).toContainEqual({
      name: "twitter:description",
      content: description,
    });
  });

  it("generates an absolute canonical URL", () => {
    const head = createSeoHead({
      title: "Getting Started",
      description: "Documentation introduction.",
      canonical: "/docs/getting-started",
    });

    expect(head.links).toContainEqual({
      rel: "canonical",
      href: `${SITE_URL}/docs/getting-started`,
    });
  });

  it("uses the canonical URL for Open Graph", () => {
    const canonical = `${SITE_URL}/docs/getting-started`;

    const head = createSeoHead({
      title: "Getting Started",
      description: "Documentation introduction.",
      canonical,
    });

    expect(head.meta).toContainEqual({
      property: "og:url",
      content: canonical,
    });
  });

  it("enables unrestricted search snippets and large image previews", () => {
    const head = createSeoHead({
      title: "Button",
      description: "An accessible button component.",
      canonical: "/docs/ui/actions/button",
    });

    const hasExpectedRobots = head.meta.some(
      (item) =>
        "name" in item &&
        item.name === "robots" &&
        item.content.includes("index") &&
        item.content.includes("follow") &&
        item.content.includes("max-snippet:-1") &&
        item.content.includes("max-image-preview:large"),
    );

    expect(hasExpectedRobots).toBe(true);
  });

  it("generates Open Graph and Twitter image metadata", () => {
    const head = createSeoHead({
      title: "Button",
      description: "An accessible button component.",
      canonical: "/docs/ui/actions/button",
    });

    expect(
      head.meta.some(
        (item) => "property" in item && item.property === "og:image",
      ),
    ).toBe(true);

    expect(
      head.meta.some(
        (item) =>
          "name" in item &&
          item.name === "twitter:card" &&
          item.content === "summary_large_image",
      ),
    ).toBe(true);

    expect(
      head.meta.some((item) => "name" in item && item.name === "twitter:image"),
    ).toBe(true);
  });

  it("normalizes canonical paths and removes query parameters", () => {
    expect(
      getCanonicalUrl("/docs/getting-started/?utm_source=test#examples"),
    ).toBe(`${SITE_URL}/docs/getting-started`);
  });

  it("always preserves the homepage trailing slash", () => {
    expect(getCanonicalUrl("/")).toBe(`${SITE_URL}/`);
  });

  it("rejects canonical URLs outside the Puzzle domain", () => {
    expect(() => getCanonicalUrl("https://example.com/docs")).toThrow();
  });
});
