import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

import { normalizeSeoConfig } from "../context";

import { resolveSeoMetadata, resolveSeoRobots } from "../metadata";

import { SeoHead, SeoMetadata, SeoProvider } from "../react";

const BASE_URL = "https://example.com";

const config = normalizeSeoConfig({
  siteUrl: BASE_URL,
  defaultLocale: "en",
  supportedLocales: ["en", "nl", "de"],
  title: {
    template: "%s | Puzzle",
    default: "Default",
  },
  identity: {
    name: "Puzzle",
    description: "Puzzle UI library",
    url: BASE_URL,
  },
});

const renderSeo = (
  children: React.ReactNode,
  metadata?: Parameters<typeof SeoProvider>[0]["metadata"],
): string =>
  renderToStaticMarkup(
    createElement(SeoProvider, {
      config: {
        siteUrl: BASE_URL,
        defaultLocale: "en",
        supportedLocales: ["en", "nl", "de"],
        title: {
          template: "%s | Puzzle",
          default: "Default",
        },
        identity: {
          name: "Puzzle",
          description: "Puzzle UI library",
        },
      },
      metadata,
      children,
    }),
  );

describe("E6 — Metadata", () => {
  describe("Title", () => {
    it("uses the page title", () => {
      const result = resolveSeoMetadata(
        {
          title: "About",
        },
        config,
      );

      expect(result.title).toBe("About | Puzzle");
    });

    it("uses the configured default title", () => {
      const result = resolveSeoMetadata({}, config);

      expect(result.title).toBe("Default");
    });

    it("uses the site identity as the fallback", () => {
      const fallback = normalizeSeoConfig({
        siteUrl: BASE_URL,
        identity: {
          name: "My Website",
        },
      });

      expect(resolveSeoMetadata({}, fallback).title).toBe("My Website");
    });

    it("does not apply the title template to default titles", () => {
      const result = resolveSeoMetadata({}, config);

      expect(result.title).toBe("Default");
      expect(result.title).not.toBe("Default | Puzzle");
    });
  });

  describe("Description", () => {
    it("uses page descriptions", () => {
      const result = resolveSeoMetadata(
        {
          description: "Page description",
        },
        config,
      );

      expect(result.description).toBe("Page description");
    });

    it("falls back to site identity description", () => {
      const result = resolveSeoMetadata({}, config);

      expect(result.description).toBe("Puzzle UI library");
    });

    it("supports config metadata defaults", () => {
      const customConfig = normalizeSeoConfig({
        siteUrl: BASE_URL,
        metadata: {
          title: "Configured title",
          description: "Configured description",
        },
      });

      const result = resolveSeoMetadata({}, customConfig);

      expect(result.title).toBe("Configured title");
      expect(result.description).toBe("Configured description");
    });
  });

  describe("Canonical", () => {
    it("does not invent a canonical URL when no page URL is known", () => {
      const result = resolveSeoMetadata({}, config);

      expect(result.canonical).toBeUndefined();
    });

    it("normalizes relative canonical URLs", () => {
      const result = resolveSeoMetadata(
        {
          canonical: "/about",
        },
        config,
      );

      expect(result.canonical).toBe(`${BASE_URL}/about`);
    });

    it("normalizes trailing slashes", () => {
      const result = resolveSeoMetadata(
        {
          canonical: "/about/",
        },
        config,
      );

      expect(result.canonical).toBe(`${BASE_URL}/about`);
    });

    it("rejects unsafe canonical URLs", () => {
      expect(() =>
        resolveSeoMetadata(
          {
            canonical: "javascript:alert(1)",
          },
          config,
        ),
      ).toThrow();
    });

    it("rejects canonical URLs containing credentials", () => {
      expect(() =>
        resolveSeoMetadata(
          {
            canonical: "https://user:password@example.com/page",
          },
          config,
        ),
      ).toThrow(/credentials/i);
    });
  });

  describe("Locale", () => {
    it("uses the provider default locale", () => {
      const result = resolveSeoMetadata({}, config);

      expect(result.locale).toBe("en");
    });

    it("supports a page-level locale override", () => {
      const result = resolveSeoMetadata(
        {
          locale: "nl",
        },
        config,
      );

      expect(result.locale).toBe("nl");
    });

    it("normalizes locale casing", () => {
      const result = resolveSeoMetadata(
        {
          locale: "NL-nl",
        },
        config,
      );

      expect(result.locale).toBe("nl-NL");
    });

    it("rejects unsupported locales", () => {
      expect(() =>
        resolveSeoMetadata(
          {
            locale: "fr",
          },
          config,
        ),
      ).toThrow(/Unsupported SEO page locale/);
    });

    it("rejects invalid locales", () => {
      expect(() =>
        resolveSeoMetadata(
          {
            locale: "invalid_locale",
          },
          config,
        ),
      ).toThrow(/Invalid SEO page locale/);
    });
  });

  describe("Open Graph", () => {
    it("uses resolved page metadata as defaults", () => {
      const result = resolveSeoMetadata(
        {
          title: "About",
          description: "About Puzzle",
        },
        config,
      );

      expect(result.openGraph).toMatchObject({
        title: "About | Puzzle",
        description: "About Puzzle",
        type: "website",
        url: `${BASE_URL}/`,
        siteName: "Puzzle",
        locale: "en",
      });
    });

    it("allows explicit Open Graph overrides", () => {
      const result = resolveSeoMetadata(
        {
          title: "About",
          openGraph: {
            title: "Social title",
            description: "Social description",
            type: "article",
            url: "/social",
          },
        },
        config,
      );

      expect(result.openGraph).toMatchObject({
        title: "Social title",
        description: "Social description",
        type: "article",
        url: `${BASE_URL}/social`,
      });
    });

    it("normalizes Open Graph image URLs", () => {
      const result = resolveSeoMetadata(
        {
          openGraph: {
            images: [
              {
                url: "/images/social.png",
                width: 1200,
                height: 630,
                alt: "Puzzle",
              },
            ],
          },
        },
        config,
      );

      expect(result.openGraph.images?.[0]).toMatchObject({
        url: `${BASE_URL}/images/social.png`,
        width: 1200,
        height: 630,
        alt: "Puzzle",
      });
    });

    it("rejects invalid image dimensions", () => {
      expect(() =>
        resolveSeoMetadata(
          {
            openGraph: {
              images: [
                {
                  url: "/social.png",
                  width: -1,
                },
              ],
            },
          },
          config,
        ),
      ).toThrow(/width must be a positive integer/);
    });

    it("rejects unsafe Open Graph URLs", () => {
      expect(() =>
        resolveSeoMetadata(
          {
            openGraph: {
              url: "javascript:alert(1)",
            },
          },
          config,
        ),
      ).toThrow();
    });
  });

  describe("Twitter / X", () => {
    it("defaults to summary_large_image", () => {
      const result = resolveSeoMetadata({}, config);

      expect(result.twitter.card).toBe("summary_large_image");
    });

    it("inherits Open Graph images", () => {
      const result = resolveSeoMetadata(
        {
          openGraph: {
            images: [
              {
                url: "/social.png",
                alt: "Puzzle",
              },
            ],
          },
        },
        config,
      );

      expect(result.twitter.images).toEqual([`${BASE_URL}/social.png`]);
    });

    it("allows explicit Twitter image overrides", () => {
      const result = resolveSeoMetadata(
        {
          twitter: {
            images: ["/twitter.png"],
          },
        },
        config,
      );

      expect(result.twitter.images).toEqual([`${BASE_URL}/twitter.png`]);
    });

    it("rejects unsafe Twitter image URLs", () => {
      expect(() =>
        resolveSeoMetadata(
          {
            twitter: {
              images: ["javascript:alert(1)"],
            },
          },
          config,
        ),
      ).toThrow();
    });

    it("supports Twitter image alt text", () => {
      const result = resolveSeoMetadata(
        {
          twitter: {
            imageAlt: "Twitter image",
          },
        },
        config,
      );

      expect(result.twitter.imageAlt).toBe("Twitter image");
    });
  });

  describe("Hreflang", () => {
    it("resolves alternate language URLs", () => {
      const result = resolveSeoMetadata(
        {
          alternates: {
            alternates: [
              {
                locale: "en",
                url: "/en/about",
              },
              {
                locale: "nl",
                url: "/nl/over",
              },
              {
                locale: "x-default",
                url: "/about",
              },
            ],
          },
        },
        config,
      );

      expect(result.alternates?.alternates).toEqual([
        {
          locale: "en",
          url: `${BASE_URL}/en/about`,
        },
        {
          locale: "nl",
          url: `${BASE_URL}/nl/over`,
        },
        {
          locale: "x-default",
          url: `${BASE_URL}/about`,
        },
      ]);
    });

    it("rejects duplicate alternate locales", () => {
      expect(() =>
        resolveSeoMetadata(
          {
            alternates: {
              alternates: [
                {
                  locale: "en",
                  url: "/en",
                },
                {
                  locale: "en",
                  url: "/english",
                },
              ],
            },
          },
          config,
        ),
      ).toThrow(/Duplicate hreflang locale/);
    });

    it("rejects unsupported alternate locales", () => {
      expect(() =>
        resolveSeoMetadata(
          {
            alternates: {
              alternates: [
                {
                  locale: "fr",
                  url: "/fr",
                },
              ],
            },
          },
          config,
        ),
      ).toThrow(/Unsupported hreflang locale/);
    });
  });

  describe("Robots", () => {
    it("defaults to index and follow", () => {
      expect(
        resolveSeoRobots(
          {
            robots: {},
          },
          config,
        ),
      ).toBe("index, follow");
    });

    it("supports noindex and nofollow", () => {
      expect(
        resolveSeoRobots(
          {
            robots: {
              index: false,
              follow: false,
            },
          },
          config,
        ),
      ).toBe("noindex, nofollow");
    });

    it("supports all preview directives", () => {
      expect(
        resolveSeoRobots(
          {
            robots: {
              index: false,
              noarchive: true,
              nosnippet: true,
              maxSnippet: 160,
              maxImagePreview: "large",
              maxVideoPreview: 10,
            },
          },
          config,
        ),
      ).toBe(
        "noindex, follow, noarchive, nosnippet, " +
          "max-snippet:160, max-image-preview:large, " +
          "max-video-preview:10",
      );
    });

    it("supports -1 preview limits", () => {
      expect(
        resolveSeoRobots(
          {
            robots: {
              maxSnippet: -1,
              maxVideoPreview: -1,
            },
          },
          config,
        ),
      ).toBe("index, follow, max-snippet:-1, max-video-preview:-1");
    });

    it("rejects invalid preview values", () => {
      expect(() =>
        resolveSeoRobots(
          {
            robots: {
              maxSnippet: -2,
            },
          },
          config,
        ),
      ).toThrow(/maxSnippet/);

      expect(() =>
        resolveSeoRobots(
          {
            robots: {
              maxVideoPreview: 1.5,
            },
          },
          config,
        ),
      ).toThrow(/maxVideoPreview/);
    });

    it("uses configured robots defaults", () => {
      const customConfig = normalizeSeoConfig({
        siteUrl: BASE_URL,
        defaults: {
          robots: "noindex, nofollow",
        },
      });

      expect(resolveSeoRobots({}, customConfig)).toBe("noindex, nofollow");
    });

    it("prefers metadata robots defaults", () => {
      const customConfig = normalizeSeoConfig({
        siteUrl: BASE_URL,
        defaults: {
          robots: "noindex",
        },
        metadata: {
          robots: "index, follow",
        },
      });

      expect(resolveSeoRobots({}, customConfig)).toBe("index, follow");
    });
  });

  describe("SSR output", () => {
    it("renders metadata in server-rendered HTML", () => {
      const html = renderSeo(
        createElement(SeoMetadata, {
          metadata: {
            title: "About",
            description: "About Puzzle",
            canonical: "/about",
          },
        }),
      );

      expect(html).toContain("<title>About | Puzzle</title>");
      expect(html).toContain('name="description" content="About Puzzle"');
      expect(html).toContain(`rel="canonical" href="${BASE_URL}/about"`);
    });

    it("renders Open Graph and Twitter metadata", () => {
      const html = renderSeo(
        createElement(SeoMetadata, {
          metadata: {
            title: "About",
            openGraph: {
              images: [
                {
                  url: "/social.png",
                  width: 1200,
                  height: 630,
                  alt: "Puzzle",
                },
              ],
            },
          },
        }),
      );

      expect(html).toContain('property="og:title"');
      expect(html).toContain('property="og:image"');
      expect(html).toContain('property="og:image:width"');
      expect(html).toContain('name="twitter:card"');
      expect(html).toContain('name="twitter:image"');
    });

    it("renders hreflang links", () => {
      const html = renderSeo(
        createElement(SeoMetadata, {
          metadata: {
            alternates: {
              alternates: [
                {
                  locale: "en",
                  url: "/en",
                },
                {
                  locale: "nl",
                  url: "/nl",
                },
              ],
            },
          },
        }),
      );

      // HTML attribute names are case-insensitive; React serializes the prop as hrefLang.
      expect(html.toLowerCase()).toContain(`hreflang="en" href="${BASE_URL}/en"`);

      expect(html.toLowerCase()).toContain(`hreflang="nl" href="${BASE_URL}/nl"`);
    });

    it("supports SeoHead with provider metadata", () => {
      const html = renderSeo(createElement(SeoHead), {
        title: "Home",
      });

      expect(html).toContain("<title>Home | Puzzle</title>");
    });

    it("does not render metadata without an active metadata context", () => {
      const html = renderSeo(createElement(SeoHead));

      expect(html).toContain("<title>Default</title>");
    });
  });
});
