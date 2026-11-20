import { describe, expect, it } from "vitest";

import type { SeoPageMetadata } from "@puzzle-ui/seo/metadata";
import { createLocaleRegistry } from "../locale";
import {
  createLocalizedSeoMetadata,
  validateLocalizedSeo,
  withStructuredDataLocale,
} from "../seo";
import {
  createLocalizedSitemapEntries,
  generateLocalizedSitemap,
} from "../seo/sitemap";

describe("localized SEO metadata", () => {
  const registry = createLocaleRegistry({
    locales: [{ locale: "en" }, { locale: "nl" }],
    defaultLocale: "en",
  });

  it("returns canonical and hreflang values compatible with Puzzle SEO", () => {
    const metadata: SeoPageMetadata = createLocalizedSeoMetadata({
        registry,
        baseUrl: "https://example.com",
        locale: "nl",
        path: "/articles/hello",
        localizedPaths: {
          en: "/articles/hello",
          nl: "/artikelen/hallo",
        },
      });

    expect(metadata).toEqual({
      locale: "nl",
      canonical: "https://example.com/nl/artikelen/hallo",
      openGraph: {
        locale: "nl",
        url: "https://example.com/nl/artikelen/hallo",
      },
      alternates: {
        alternates: [
          { locale: "en", url: "https://example.com/articles/hello" },
          { locale: "nl", url: "https://example.com/nl/artikelen/hallo" },
          { locale: "x-default", url: "https://example.com/articles/hello" },
        ],
      },
    });
  });

  it("rejects unsafe base URLs and unsupported locales", () => {
    expect(() =>
      createLocalizedSeoMetadata({
        registry,
        baseUrl: "https://user:pass@example.com",
        locale: "en",
        path: "/",
      }),
    ).toThrow(/credentials/);
    expect(() =>
      createLocalizedSeoMetadata({
        registry,
        baseUrl: "https://example.com",
        locale: "fr",
        path: "/",
      }),
    ).toThrow(/Unsupported locale/);
    expect(() =>
      createLocalizedSeoMetadata({
        registry,
        baseUrl: "https://example.com",
        locale: "en",
        path: "/articles/hello?preview=1",
      }),
    ).toThrow(/query or fragment/);
  });

  it("uses locale-specific origins for canonical and alternate URLs", () => {
    const metadata = createLocalizedSeoMetadata({
      registry,
      baseUrl: "https://example.com",
      baseUrls: { nl: "https://example.nl" },
      locale: "nl",
      path: "/articles/hello",
    });

    expect(metadata.canonical).toBe("https://example.nl/nl/articles/hello");
    expect(metadata.alternates.alternates).toEqual([
      { locale: "en", url: "https://example.com/articles/hello" },
      { locale: "nl", url: "https://example.nl/nl/articles/hello" },
      { locale: "x-default", url: "https://example.com/articles/hello" },
    ]);
  });

  it("adds localized Open Graph values and supports deployment base paths", () => {
    const metadata = createLocalizedSeoMetadata({
      registry,
      baseUrl: "https://example.com",
      basePath: "/docs",
      locale: "nl",
      path: "/articles/hello",
      localizedPaths: { en: "/articles/hello", nl: "/artikelen/hallo" },
      title: "Hallo",
      description: "Een pagina",
      openGraph: { type: "article" },
    });

    expect(metadata.canonical).toBe(
      "https://example.com/docs/nl/artikelen/hallo",
    );
    expect(metadata.openGraph).toEqual({
      type: "article",
      locale: "nl",
      url: "https://example.com/docs/nl/artikelen/hallo",
      title: "Hallo",
      description: "Een pagina",
    });
  });

  it("validates localized paths, canonical conflicts, and missing alternates", () => {
    const issues = validateLocalizedSeo({
      registry,
      baseUrl: "https://example.com",
      pages: [
        {
          id: "about",
          path: "/about",
          localizedPaths: { en: "/about", nl: "/about" },
        },
        {
          id: "duplicate",
          path: "/elsewhere",
          localizedPaths: { en: "/about", nl: "/anders" },
          canonicalUrls: { en: "https://wrong.example/about" },
        },
        {
          id: "english-only",
          path: "/only-en",
          localizedPaths: { en: "/only-en" },
        },
      ],
    });

    expect(issues.map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        "duplicate-canonical",
        "canonical-mismatch",
        "missing-locale-path",
      ]),
    );
  });

  it("adds a canonical BCP 47 language to Schema.org data and rejects conflicts", () => {
    expect(
      withStructuredDataLocale({ "@type": "Article", headline: "Title" }, "nl-nl"),
    ).toEqual({
      "@type": "Article",
      headline: "Title",
      inLanguage: "nl-NL",
    });
    expect(() =>
      withStructuredDataLocale({ inLanguage: "en" }, "nl"),
    ).toThrow(/conflicting language/);
    expect(() =>
      withStructuredDataLocale(
        { url: "https://example.com/elsewhere" },
        "nl",
        "https://example.com/about",
      ),
    ).toThrow(/does not match the canonical URL/);
    expect(
      withStructuredDataLocale(
        { url: "https://example.com/about" },
        "nl",
        "https://example.com/about",
      ),
    ).toEqual({
      url: "https://example.com/about",
      inLanguage: "nl",
    });
  });

  it("reports invalid, duplicate, missing, and mismatched hreflang values", () => {
    const issues = validateLocalizedSeo({
      registry,
      baseUrl: "https://example.com",
      pages: [{
        id: "about",
        path: "/about",
        localizedPaths: { en: "/about", nl: "/over-ons" },
        hreflangAlternates: [
          { locale: "en", url: "https://example.com/wrong" },
          { locale: "en", url: "https://example.com/about" },
          { locale: "xx", url: "https://example.com/xx/about" },
        ],
      }],
    });

    expect(issues.map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        "duplicate-hreflang",
        "invalid-hreflang",
        "missing-hreflang",
        "hreflang-mismatch",
      ]),
    );
  });

  it("generates reciprocal localized sitemap entries through Puzzle SEO", () => {
    const result = generateLocalizedSitemap({
      registry,
      baseUrl: "https://example.com",
      validateAlternates: true,
      pages: [
        {
          path: "/articles/hello",
          localizedPaths: {
            en: "/articles/hello",
            nl: "/artikelen/hallo",
          },
          entry: { changeFrequency: "monthly", priority: 0.8 },
        },
      ],
    });

    expect(result.totalEntries).toBe(2);
    expect(result.issues).toEqual([]);
    expect(result.files[0]?.xml).toContain('hreflang="en"');
    expect(result.files[0]?.xml).toContain('hreflang="nl"');
    expect(result.files[0]?.xml).toContain("/artikelen/hallo");
  });

  it("includes the configured base path in localized sitemap URLs", () => {
    const entries = createLocalizedSitemapEntries({
      registry,
      baseUrl: "https://example.com",
      basePath: "/docs",
      pages: [{ path: "/articles/hello" }],
    });

    expect(entries[1]?.url).toBe(
      "https://example.com/docs/nl/articles/hello",
    );
  });

  it("rejects unsafe sitemap origins and unknown localized path keys", () => {
    expect(() =>
      createLocalizedSitemapEntries({
        registry,
        baseUrl: "https://user:password@example.com",
        pages: [{ path: "/about" }],
      }),
    ).toThrow();

    expect(() =>
      createLocalizedSitemapEntries({
        registry,
        baseUrl: "https://example.com",
        pages: [
          {
            path: "/about",
            localizedPaths: { xx: "/about" },
          },
        ],
      }),
    ).toThrow(/unsupported locale/);
  });

  it("supports locale-specific sitemap origins only with explicit external URL permission", () => {
    const options = {
      registry,
      baseUrl: "https://example.com",
      baseUrls: { nl: "https://example.nl" },
      pages: [{ path: "/articles/hello" }],
      validateAlternates: true,
    };

    expect(() => generateLocalizedSitemap(options)).toThrow(
      /allowExternalUrls/,
    );

    const result = generateLocalizedSitemap({
      ...options,
      allowExternalUrls: true,
    });

    expect(result.issues).toEqual([]);
    expect(result.files[0]?.xml).toContain("https://example.nl/nl/articles/hello");
  });
});
