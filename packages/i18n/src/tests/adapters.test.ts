import { describe, expect, it } from "vitest";

import { createLocaleRegistry } from "../locale";
import { resolveNextRequestLocale } from "../adapters/next";
import { createReactRouterLocaleLoader } from "../adapters/react-router";
import { createTanStackLocaleLoader } from "../adapters/tanstack";
import { resolveRequestLocale } from "../adapters/request";

const registry = createLocaleRegistry({
  locales: [{ locale: "en" }, { locale: "nl" }, { locale: "fr" }],
  defaultLocale: "en",
});

const routes = {
  about: {
    en: "/about",
    nl: {
      path: "/over-ons",
      aliases: ["/over"],
    },
    fr: "/a-propos",
  },
} as const;

describe("framework request adapters", () => {
  it("resolves request locales from path, cookie, and Accept-Language", () => {
    const request = new Request("https://example.test/nl/about", {
      headers: {
        cookie: "theme=dark; puzzle-locale=fr",
        "accept-language": "en;q=0.9,nl;q=0.8",
      },
    });

    expect(resolveRequestLocale(request, { registry })).toEqual({
      locale: "nl",
      source: "url",
    });
    expect(
      resolveRequestLocale(
        new Request("https://example.test/about", {
          headers: request.headers,
        }),
        { registry },
      ),
    ).toEqual({ locale: "fr", source: "cookie" });
    expect(
      resolveRequestLocale(
        new Request("https://example.test/about", {
          headers: { "accept-language": "fr-CA, en;q=0.7" },
        }),
        { registry },
      ),
    ).toEqual({ locale: "fr", source: "accept-language" });
  });

  it("uses a configured base path when resolving the request URL locale", () => {
    expect(
      resolveRequestLocale(new Request("https://example.test/docs/nl/about"), {
        registry,
        basePath: "/docs",
      }),
    ).toEqual({ locale: "nl", source: "url" });
    expect(() =>
      resolveRequestLocale(new Request("https://example.test/nl/about"), {
        registry,
        basePath: "/docs",
      }),
    ).toThrow(/basePath/);
  });

  it("reports matched, redirected, and unmatched framework route events", () => {
    const events: unknown[] = [];
    const options = {
      registry,
      routes,
      onRoute: (event: unknown) => events.push(event),
    };

    resolveRequestLocale(
      new Request("https://example.test/nl/over-ons"),
      options,
    );
    resolveRequestLocale(
      new Request("https://example.test/nl/over"),
      options,
    );
    resolveRequestLocale(
      new Request("https://example.test/nl/missing"),
      options,
    );

    expect(events).toEqual([
      {
        type: "route",
        pathname: "/over-ons",
        status: "matched",
        locale: "nl",
        routeId: "about",
      },
      {
        type: "route",
        pathname: "/over-ons",
        status: "redirected",
        locale: "nl",
        routeId: "about",
      },
      {
        type: "route",
        pathname: "<unmatched>",
        status: "unmatched",
        locale: "nl",
      },
    ]);
  });

  it("uses asynchronous Next headers with route params as the URL locale", () => {
    const headers = new Headers({
      cookie: "puzzle-locale=fr",
      "accept-language": "en",
    });

    expect(
      resolveNextRequestLocale({
        registry,
        headers,
        urlLocale: "nl",
        pathname: "/nl/over",
        routes,
        onRoute: (event) => {
          expect(event).toMatchObject({
            status: "redirected",
            routeId: "about",
          });
        },
      }),
    ).toEqual({ locale: "nl", source: "url" });
  });

  it("returns loaders compatible with TanStack and React Router request args", () => {
    const request = new Request("https://example.test/about", {
      headers: { "accept-language": "en" },
    });
    const tanStackLoader = createTanStackLocaleLoader({ registry });
    const reactRouterLoader = createReactRouterLocaleLoader({ registry });

    expect(
      tanStackLoader({
        request,
        params: { locale: "nl" },
      }),
    ).toEqual({ locale: "nl", source: "url" });
    expect(
      reactRouterLoader({
        request,
        params: { locale: "fr" },
      }),
    ).toEqual({ locale: "fr", source: "url" });
  });

  it("rejects invalid cookie configuration and ignores malformed cookie values", () => {
    const headers = new Headers({
      cookie: "puzzle-locale=%E0%A4%A",
      "accept-language": "nl",
    });

    expect(() =>
      resolveNextRequestLocale({
        registry,
        headers,
        cookieName: "bad;name",
      }),
    ).toThrow(/Invalid locale cookie name/);
    expect(resolveNextRequestLocale({ registry, headers })).toEqual({
      locale: "nl",
      source: "accept-language",
    });
  });
});
