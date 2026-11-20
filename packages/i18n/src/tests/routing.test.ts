import { describe, expect, it } from "vitest";

import { createLocaleRegistry } from "../locale";
import { createLocalizedRouting } from "../routing";

const createRouting = (prefixDefaultLocale = false) =>
  createLocalizedRouting({
    registry: createLocaleRegistry({
      locales: [{ locale: "en" }, { locale: "nl" }, { locale: "fr" }],
      defaultLocale: "en",
    }),
    prefixDefaultLocale,
  });

const routes = {
  home: {
    en: "/",
    nl: "/",
    fr: "/",
  },
  about: {
    en: "/about",
    nl: "/over-ons",
    fr: "/a-propos",
  },
  product: {
    en: "/products/:id",
    nl: {
      path: "/producten/:slug",
      aliases: ["/item/:slug"],
    },
    fr: "/produits/:id",
  },
} as const;

const createRouteMapRouting = (
  options: {
    prefixDefaultLocale?: boolean;
    basePath?: string;
    origins?: Readonly<Record<string, string>>;
  } = {},
) =>
  createLocalizedRouting({
    registry: createLocaleRegistry({
      locales: [{ locale: "en" }, { locale: "nl" }, { locale: "fr" }],
      defaultLocale: "en",
    }),
    routes,
    ...options,
  });

describe("localized routing", () => {
  it("matches and localizes paths while preserving query and hash", () => {
    const routing = createRouting();

    expect(routing.match("/nl/about?tab=profile#bio")).toEqual({
      locale: "nl",
      pathname: "/about",
      search: "?tab=profile",
      hash: "#bio",
      matchedPrefix: true,
    });
    expect(routing.localize("/nl/about?tab=profile#bio", "fr")).toBe(
      "/fr/about?tab=profile#bio",
    );
    expect(routing.localize("/fr/about", "en")).toBe("/about");
  });

  it("can prefix the default locale and localize the root path", () => {
    const routing = createRouting(true);

    expect(routing.localize("/", "en")).toBe("/en");
    expect(routing.localize("/about", "nl")).toBe("/nl/about");
  });

  it("applies a validated base path consistently to matching and generated paths", () => {
    const routing = createLocalizedRouting({
      registry: createLocaleRegistry({
        locales: [{ locale: "en" }, { locale: "nl" }],
        defaultLocale: "en",
      }),
      basePath: "/docs/",
      routes: {
        about: { en: "/about", nl: "/over-ons" },
      },
    });

    expect(routing.match("/docs/nl/over-ons")).toEqual({
      locale: "nl",
      pathname: "/over-ons",
      search: "",
      hash: "",
      matchedPrefix: true,
    });
    expect(routing.match("/docs")).toMatchObject({
      locale: "en",
      pathname: "/",
    });
    expect(routing.localize("/docs/nl/over-ons?tab=team", "en")).toBe(
      "/docs/about?tab=team",
    );
    expect(routing.alternatePaths("/docs/about")).toEqual({
      en: "/docs/about",
      nl: "/docs/nl/over-ons",
    });
    expect(routing.localizeRoute("about", "nl")).toBe("/docs/nl/over-ons");
    expect(() => routing.match("/outside/docs/about")).toThrow(/basePath/);
    expect(() =>
      createLocalizedRouting({
        registry: createLocaleRegistry({
          locales: [{ locale: "en" }],
          defaultLocale: "en",
        }),
        basePath: "/safe//path",
      }),
    ).toThrow(/basePath/);
    expect(() =>
      createLocalizedRouting({
        registry: createLocaleRegistry({
          locales: [{ locale: "en" }],
          defaultLocale: "en",
        }),
        basePath: "/safe?next=/",
      }),
    ).toThrow(/basePath/);
  });

  it("returns localized alternates for every registered locale", () => {
    expect(createRouting().alternatePaths("/about")).toEqual({
      en: "/about",
      nl: "/nl/about",
      fr: "/fr/about",
    });
  });

  it("rejects external and protocol-relative URLs", () => {
    const routing = createRouting();

    expect(() => routing.localize("//example.com/path", "nl")).toThrow(
      /same-origin/,
    );
    expect(() => routing.match("https://example.com/path")).toThrow(
      /same-origin/,
    );
  });

  it("matches route IDs and returns canonical redirect targets for aliases", () => {
    const routing = createRouteMapRouting();

    expect(routing.matchRoute("/nl/item/tea?size=large#details")).toEqual({
      locale: "nl",
      pathname: "/item/tea",
      search: "?size=large",
      hash: "#details",
      matchedPrefix: true,
      routeId: "product",
      params: { slug: "tea" },
      isAlias: true,
      canonicalPath: "/nl/producten/tea?size=large#details",
      redirectTo: "/nl/producten/tea?size=large#details",
    });
  });

  it("localizes parameterized routes and preserves search and hash", () => {
    const routing = createRouteMapRouting();

    expect(
      routing.localize("/nl/producten/caf%C3%A9?sort=price#details", "fr"),
    ).toBe("/fr/produits/caf%C3%A9?sort=price#details");
    expect(
      routing.localizeRoute(
        "product",
        "nl",
        { slug: "café" },
        { search: "?ref=home", hash: "#reviews" },
      ),
    ).toBe("/nl/producten/caf%C3%A9?ref=home#reviews");
  });

  it("generates alternate locale links for mapped and dynamic routes", () => {
    const routing = createRouteMapRouting();

    expect(routing.alternatePaths("/nl/over-ons?tab=team#staff")).toEqual({
      en: "/about?tab=team#staff",
      nl: "/nl/over-ons?tab=team#staff",
      fr: "/fr/a-propos?tab=team#staff",
    });
    expect(
      routing.alternateRoutePaths(
        "product",
        { id: 12 },
        { search: "?campaign=spring" },
      ),
    ).toEqual({
      en: "/products/12?campaign=spring",
      nl: "/nl/producten/12?campaign=spring",
      fr: "/fr/produits/12?campaign=spring",
    });
  });

  it("uses configured locale origins for matches and localized links", () => {
    const routing = createRouteMapRouting({
      basePath: "/docs",
      origins: {
        en: "https://en.example.test",
        nl: "https://nl.example.test",
      },
    });

    expect(
      routing.match("https://nl.example.test/docs/over-ons?tab=team"),
    ).toEqual({
      locale: "nl",
      pathname: "/over-ons",
      search: "?tab=team",
      hash: "",
      matchedPrefix: false,
    });
    expect(routing.localize("/docs/about?tab=team", "nl")).toBe(
      "https://nl.example.test/docs/over-ons?tab=team",
    );
    expect(routing.localize("/docs/nl/over-ons", "en")).toBe(
      "https://en.example.test/docs/about",
    );
    expect(() => routing.match("https://outside.example.test/about")).toThrow(
      /external origin/,
    );
    expect(() => routing.match("https://nl.example.test/docs/en/about")).toThrow(
      /does not match/,
    );
  });

  it("rejects unsafe route inputs, origins, aliases, and parameter values", () => {
    const routing = createRouteMapRouting();

    for (const path of [
      "/about%",
      "/about%2fadmin",
      "/about%5Cadmin",
      "/%2e%2e/private",
      "/%252e%252e/private",
      "/nested%252fadmin",
      "/nested\\admin",
      "/nl/%2E%2e/private",
      "/nl//outside.example.test",
      "/about?next=%ZZ",
      "//outside.example.test/about",
      "https://outside.example.test/about",
    ]) {
      expect(() => routing.match(path), path).toThrow();
    }

    expect(() =>
      createLocalizedRouting({
        registry: createLocaleRegistry({
          locales: [{ locale: "en" }],
          defaultLocale: "en",
        }),
        origins: { en: "https://user:pass@example.test" },
      }),
    ).toThrow(/Invalid locale origin|bare HTTP\(S\) origins/);

    expect(() =>
      createLocalizedRouting({
        registry: createLocaleRegistry({
          locales: [{ locale: "en" }],
          defaultLocale: "en",
        }),
        routes: {
          unsafe: {
            en: {
              path: "/safe",
              aliases: ["//outside.example.test/path"],
            },
          },
        },
      }),
    ).toThrow();

    expect(() =>
      routing.localizeRoute("product", "nl", { slug: "../admin" }),
    ).toThrow(/Unsafe value/);
    expect(() =>
      routing.localizeRoute("product", "nl", { slug: "a/b" }),
    ).toThrow(/Unsafe value/);
    expect(() =>
      routing.localizeRoute("product", "en", { id: "%252fadmin" }),
    ).toThrow(/Unsafe value/);
    expect(() =>
      routing.localizeRoute("product", "nl", { slug: "tea" }, {
        search: "?next=%ZZ",
      }),
    ).toThrow();
  });
});
