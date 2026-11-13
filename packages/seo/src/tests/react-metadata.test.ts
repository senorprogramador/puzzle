import { createElement } from "react";

import { renderToString } from "react-dom/server";

import { describe, expect, it } from "vitest";

import {
  SeoProvider,
  SeoMetadata,
  SeoHead,
  useSeoConfig,
  useSeoMetadata,
  LDOrganization,
} from "../react";

const config = {
  siteUrl: "https://example.com",
  defaultLocale: "en",
  supportedLocales: ["en", "nl"],
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
  },
};

describe("SEO React context", () => {
  it("throws when useSeoConfig is used outside SeoProvider", () => {
    const Consumer = () => {
      useSeoConfig();

      return null;
    };

    expect(() => renderToString(createElement(Consumer))).toThrow(
      /inside SeoProvider/i,
    );
  });

  it("throws when useSeoMetadata is used outside SeoProvider", () => {
    const Consumer = () => {
      useSeoMetadata();

      return null;
    };

    expect(() => renderToString(createElement(Consumer))).toThrow(
      /inside SeoProvider/i,
    );
  });

  it("exposes normalized config to descendants", () => {
    let receivedSiteUrl: string | undefined;

    const Consumer = () => {
      receivedSiteUrl = useSeoConfig().siteUrl;

      return null;
    };

    renderToString(
      createElement(SeoProvider, {
        config,
        children: createElement(Consumer),
      }),
    );

    expect(receivedSiteUrl).toBe("https://example.com");
  });

  it("exposes provider-level metadata to descendants", () => {
    let receivedTitle: string | undefined;

    const Consumer = () => {
      receivedTitle = useSeoMetadata()?.title;

      return null;
    };

    renderToString(
      createElement(SeoProvider, {
        config,
        metadata: {
          title: "Provider page",
        },
        children: createElement(Consumer),
      }),
    );

    expect(receivedTitle).toBe("Provider page | Example");
  });

  it("exposes route-level metadata to nested descendants", () => {
    let receivedTitle: string | undefined;
    let receivedLocale: string | undefined;

    const Consumer = () => {
      const metadata = useSeoMetadata();

      receivedTitle = metadata?.title;
      receivedLocale = metadata?.locale;

      return null;
    };

    renderToString(
      createElement(SeoProvider, {
        config,
        children: createElement(SeoMetadata, {
          metadata: {
            title: "Over ons",
            locale: "nl",
          },
          children: createElement(Consumer),
        }),
      }),
    );

    expect(receivedTitle).toBe("Over ons | Example");
    expect(receivedLocale).toBe("nl");
  });

  it("allows resolving metadata directly through the hook", () => {
    let receivedTitle: string | undefined;

    const Consumer = () => {
      receivedTitle = useSeoMetadata({
        title: "Direct metadata",
      })?.title;

      return null;
    };

    renderToString(
      createElement(SeoProvider, {
        config,
        children: createElement(Consumer),
      }),
    );

    expect(receivedTitle).toBe("Direct metadata | Example");
  });
});

describe("SEO React SSR metadata", () => {
  it("renders title, description and canonical on the server", () => {
    const html = renderToString(
      createElement(SeoProvider, {
        config,
        metadata: {
          title: "About",
          description: "About this website",
          canonical: "/about",
        },
        children: createElement(SeoHead),
      }),
    );

    expect(html).toContain("<title>About | Example</title>");
    expect(html).toContain(
      '<meta name="description" content="About this website"/>',
    );
    expect(html).toContain(
      '<link rel="canonical" href="https://example.com/about"/>',
    );
  });

  it("renders robots directives on the server", () => {
    const html = renderToString(
      createElement(SeoProvider, {
        config,
        metadata: {
          title: "Private",
          robots: {
            index: false,
            follow: false,
          },
        },
        children: createElement(SeoHead),
      }),
    );

    expect(html).toContain('<meta name="robots" content="noindex, nofollow"/>');
  });

  it("renders Open Graph and Twitter tags on the server", () => {
    const html = renderToString(
      createElement(SeoProvider, {
        config,
        metadata: {
          title: "About",
          description: "About this website",
          openGraph: {
            images: [
              {
                url: "https://example.com/about.webp",
                width: 1200,
                height: 630,
                alt: "About",
              },
            ],
          },
        },
        children: createElement(SeoHead),
      }),
    );

    expect(html).toContain(
      '<meta property="og:title" content="About | Example"/>',
    );
    expect(html).toContain(
      '<meta property="og:image" content="https://example.com/about.webp"/>',
    );
    expect(html).toContain(
      '<meta name="twitter:card" content="summary_large_image"/>',
    );
  });

  it("renders hreflang alternate links on the server", () => {
    const html = renderToString(
      createElement(SeoProvider, {
        config,
        metadata: {
          title: "About",
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
            ],
          },
        },
        children: createElement(SeoHead),
      }),
    );

    // HTML attribute names are case-insensitive; React serializes the prop as hrefLang.
    expect(html).toMatch(/hreflang="en" href="https:\/\/example\.com\/about"/i);
    expect(html).toMatch(
      /hreflang="nl" href="https:\/\/example\.com\/nl\/over-ons"/i,
    );
  });

  it("renders route-level metadata on the server", () => {
    const html = renderToString(
      createElement(SeoProvider, {
        config,
        children: createElement(SeoMetadata, {
          metadata: {
            title: "Route title",
            description: "Route description",
          },
        }),
      }),
    );

    expect(html).toContain("<title>Route title | Example</title>");
    expect(html).toContain(
      '<meta name="description" content="Route description"/>',
    );
  });

  it("renders the central JSON-LD graph on the server", () => {
    const html = renderToString(
      createElement(SeoProvider, {
        config,
        metadata: {
          title: "Example",
        },
        children: createElement(LDOrganization, {
          name: "Example",
          url: "https://example.com",
        }),
      }),
    );

    expect(html).toContain('type="application/ld+json"');

    // Types are serialized as full schema.org IRIs, matching the schema component output.
    expect(html).toContain('"@type":"https://schema.org/Organization"');

    expect(html).toContain('"name":"Example"');
  });
});
