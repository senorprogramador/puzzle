import { describe, expect, it } from "vitest";

import {
  normalizeSeoConfig,
  normalizeSeoPath,
  resolveSeoUrl,
} from "../context";

import { resolveSeoMetadata, resolveSeoRobots } from "../metadata";

import type { SeoConfig } from "../context";

const createConfig = (overrides: Partial<SeoConfig> = {}) =>
  normalizeSeoConfig({
    siteUrl: "https://example.com",
    defaultLocale: "en",
    supportedLocales: ["en", "nl", "es"],
    title: {
      default: "Example",
      template: "%s | Example",
    },
    defaults: {
      description: "Default description",
      robots: "index, follow",
    },
    identity: {
      name: "Example",
      description: "Example website",
    },
    ...overrides,
  });

describe("normalizeSeoConfig", () => {
  it("normalizes the site URL", () => {
    const config = createConfig({
      siteUrl: "https://example.com/path/?query=1#section",
    });

    expect(config.siteUrl).toBe("https://example.com");
  });

  it("rejects invalid site URLs", () => {
    expect(() =>
      createConfig({
        siteUrl: "not-a-url",
      }),
    ).toThrow(/siteUrl/i);
  });

  it("rejects non-HTTP protocols", () => {
    expect(() =>
      createConfig({
        siteUrl: "ftp://example.com",
      }),
    ).toThrow(/HTTP/i);
  });

  it("rejects URLs containing credentials", () => {
    expect(() =>
      createConfig({
        siteUrl: "https://user:password@example.com",
      }),
    ).toThrow(/credentials/i);
  });

  it("normalizes locale identifiers", () => {
    const config = createConfig({
      defaultLocale: "en-us",
      supportedLocales: ["en-us", "nl-nl"],
    });

    expect(config.defaultLocale).toBe("en-US");
    expect(config.supportedLocales).toEqual(["en-US", "nl-NL"]);
  });

  it("rejects invalid locale identifiers", () => {
    expect(() =>
      createConfig({
        defaultLocale: "invalid_locale",
      }),
    ).toThrow(/locale/i);
  });

  it("adds the default locale to supported locales", () => {
    const config = createConfig({
      defaultLocale: "en",
      supportedLocales: ["nl", "es"],
    });

    expect(config.supportedLocales).toContain("en");
  });

  it("uses default values when optional values are omitted", () => {
    const config = normalizeSeoConfig({
      siteUrl: "https://example.com",
    });

    expect(config.defaultLocale).toBe("en");
    expect(config.supportedLocales).toEqual(["en"]);
    expect(config.trailingSlash).toBe("never");
    expect(config.title?.separator).toBe(" | ");
  });

  it("rejects title templates without a placeholder", () => {
    expect(() =>
      createConfig({
        title: {
          template: "Example website",
        },
      }),
    ).toThrow(/%s/);
  });
});

describe("normalizeSeoPath", () => {
  it("adds a trailing slash when configured", () => {
    expect(normalizeSeoPath("/about", "always")).toBe("/about/");
  });

  it("removes a trailing slash when configured", () => {
    expect(normalizeSeoPath("/about/", "never")).toBe("/about");
  });

  it("preserves trailing slashes when configured", () => {
    expect(normalizeSeoPath("/about/", "preserve")).toBe("/about/");
  });

  it("keeps the root path as root", () => {
    expect(normalizeSeoPath("/", "always")).toBe("/");
  });
});

describe("resolveSeoUrl", () => {
  it("resolves relative URLs against the site URL", () => {
    const config = createConfig();

    expect(resolveSeoUrl("/about", config)).toBe("https://example.com/about");
  });

  it("applies the configured trailing slash to internal URLs", () => {
    const config = createConfig({
      trailingSlash: "always",
    });

    expect(resolveSeoUrl("/about", config)).toBe("https://example.com/about/");
  });

  it("does not modify external URLs", () => {
    const config = createConfig({
      trailingSlash: "always",
    });

    expect(resolveSeoUrl("https://other.example/about", config)).toBe(
      "https://other.example/about",
    );
  });

  it("rejects unsafe URL protocols", () => {
    const config = createConfig();

    expect(() => resolveSeoUrl("javascript:alert(1)", config)).toThrow(/HTTP/i);
  });
});

describe("resolveSeoMetadata", () => {
  it("uses the configured default locale", () => {
    const config = createConfig();

    const metadata = resolveSeoMetadata({}, config);

    expect(metadata.locale).toBe("en");
  });

  it("uses a page-level locale", () => {
    const config = createConfig();

    const metadata = resolveSeoMetadata(
      {
        locale: "nl",
        title: "Over ons",
      },
      config,
    );

    expect(metadata.locale).toBe("nl");
    expect(metadata.openGraph?.locale).toBe("nl");
  });

  it("rejects unsupported page locales", () => {
    const config = createConfig();

    expect(() =>
      resolveSeoMetadata(
        {
          locale: "fr",
        },
        config,
      ),
    ).toThrow(/Unsupported SEO page locale/i);
  });

  it("resolves title templates", () => {
    const config = createConfig();

    const metadata = resolveSeoMetadata(
      {
        title: "About",
      },
      config,
    );

    expect(metadata.title).toBe("About | Example");
  });

  it("uses the default title when the page title is missing", () => {
    const config = createConfig();

    const metadata = resolveSeoMetadata({}, config);

    expect(metadata.title).toBe("Example");
  });

  it("uses default descriptions", () => {
    const config = createConfig();

    const metadata = resolveSeoMetadata({}, config);

    expect(metadata.description).toBe("Default description");
  });

  it("resolves canonical URLs", () => {
    const config = createConfig();

    const metadata = resolveSeoMetadata(
      {
        canonical: "/about",
      },
      config,
    );

    expect(metadata.canonical).toBe("https://example.com/about");
  });

  it("resolves the configured canonical fallback", () => {
    const config = createConfig({
      defaults: {
        canonical: "/default",
      },
    });

    const metadata = resolveSeoMetadata({}, config);

    expect(metadata.canonical).toBe("https://example.com/default");
  });

  it("resolves hreflang alternate URLs", () => {
    const config = createConfig();

    const metadata = resolveSeoMetadata(
      {
        locale: "en",
        alternates: {
          alternates: [
            {
              locale: "en",
              url: "/about",
            },
            {
              locale: "nl",
              url: "/nl/over-ons",
            },
            {
              locale: "es",
              url: "https://example.com/es/acerca",
            },
          ],
        },
      },
      config,
    );

    expect(metadata.alternates?.alternates).toEqual([
      {
        locale: "en",
        url: "https://example.com/about",
      },
      {
        locale: "nl",
        url: "https://example.com/nl/over-ons",
      },
      {
        locale: "es",
        url: "https://example.com/es/acerca",
      },
    ]);
  });

  it("supports x-default hreflang", () => {
    const config = createConfig();

    const metadata = resolveSeoMetadata(
      {
        alternates: {
          alternates: [
            {
              locale: "x-default",
              url: "/",
            },
          ],
        },
      },
      config,
    );

    expect(metadata.alternates?.alternates[0]?.locale).toBe("x-default");
  });

  it("rejects unsupported hreflang locales", () => {
    const config = createConfig();

    expect(() =>
      resolveSeoMetadata(
        {
          alternates: {
            alternates: [
              {
                locale: "fr",
                url: "/fr/about",
              },
            ],
          },
        },
        config,
      ),
    ).toThrow(/Unsupported hreflang locale/i);
  });

  it("rejects duplicate hreflang locales", () => {
    const config = createConfig();

    expect(() =>
      resolveSeoMetadata(
        {
          alternates: {
            alternates: [
              {
                locale: "en",
                url: "/about",
              },
              {
                locale: "en",
                url: "/en/about",
              },
            ],
          },
        },
        config,
      ),
    ).toThrow(/Duplicate hreflang locale/i);
  });

  it("resolves Open Graph metadata", () => {
    const config = createConfig();

    const metadata = resolveSeoMetadata(
      {
        title: "About",
        description: "About this site",
        openGraph: {
          type: "article",
        },
      },
      config,
    );

    expect(metadata.openGraph).toMatchObject({
      title: "About | Example",
      description: "About this site",
      type: "article",
      siteName: "Example",
      locale: "en",
    });
  });

  it("resolves Twitter metadata", () => {
    const config = createConfig();

    const metadata = resolveSeoMetadata(
      {
        title: "About",
        description: "About this site",
        openGraph: {
          images: [
            {
              url: "https://example.com/about.webp",
            },
          ],
        },
      },
      config,
    );

    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "About | Example",
      description: "About this site",
      images: ["https://example.com/about.webp"],
    });
  });
});

describe("resolveSeoRobots", () => {
  it("uses the configured default robots directive", () => {
    const config = createConfig();

    expect(resolveSeoRobots({}, config)).toBe("index, follow");
  });

  it("resolves page-level robots directives", () => {
    const config = createConfig();

    expect(
      resolveSeoRobots(
        {
          robots: {
            index: false,
            follow: false,
            noarchive: true,
            nosnippet: true,
            maxSnippet: 120,
            maxImagePreview: "large",
            maxVideoPreview: 0,
          },
        },
        config,
      ),
    ).toBe(
      "noindex, nofollow, noarchive, nosnippet, " +
        "max-snippet:120, max-image-preview:large, max-video-preview:0",
    );
  });
});
