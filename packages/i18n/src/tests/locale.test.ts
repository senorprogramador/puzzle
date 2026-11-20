import { describe, expect, it } from "vitest";

import {
  createLocaleRegistry,
  isValidLocale,
  resolveLocale,
} from "../locale";

describe("createLocaleRegistry", () => {
  it("canonicalizes locales, resolves aliases, and builds regional fallback chains", () => {
    const registry = createLocaleRegistry({
      locales: [
        { locale: "en", aliases: ["en-US"] },
        { locale: "nl" },
        { locale: "fr", fallbacks: ["nl"] },
        { locale: "fr-CA", fallbacks: ["fr"] },
      ],
      defaultLocale: "en",
      fallbackLocale: "nl",
    });

    expect(registry.resolve("FR-ca")).toBe("fr-CA");
    expect(registry.resolve("en-US")).toBe("en");
    expect(registry.fallbackChain("fr-CA")).toEqual(["fr-CA", "fr", "nl", "en"]);
    expect(registry.get("nl")?.locale).toBe("nl");
  });

  it("rejects duplicate locales and unsupported defaults or fallbacks", () => {
    expect(
      () =>
        createLocaleRegistry({
          locales: [{ locale: "en" }, { locale: "en" }],
          defaultLocale: "en",
        }),
    ).toThrow(/Duplicate locale/);

    expect(() =>
      createLocaleRegistry({
        locales: [{ locale: "en" }],
        defaultLocale: "fr",
      }),
    ).toThrow(/Default locale/);

    expect(() =>
      createLocaleRegistry({
        locales: [{ locale: "en" }],
        defaultLocale: "en",
        fallbackLocale: "fr",
      }),
    ).toThrow(/Fallback locale/);

    expect(() =>
      createLocaleRegistry({
        locales: [
          { locale: "en" },
          { locale: "en-GB", aliases: ["en"] },
        ],
        defaultLocale: "en",
      }),
    ).toThrow(/conflicts with supported locale/);
  });

  it("falls back to a supported base language before an unrelated regional variant", () => {
    const registry = createLocaleRegistry({
      locales: [{ locale: "en" }, { locale: "en-US" }],
      defaultLocale: "en",
    });

    expect(registry.resolve("en-AU")).toBe("en");
  });

  it("validates BCP 47 tags without throwing for user input", () => {
    expect(isValidLocale("en-GB")).toBe(true);
    expect(isValidLocale("not_a_locale")).toBe(false);
  });
});

describe("resolveLocale", () => {
  it("uses explicit, URL, preference, cookie, Accept-Language, and browser priority", () => {
    const registry = createLocaleRegistry({
      locales: [{ locale: "en" }, { locale: "nl" }, { locale: "fr" }],
      defaultLocale: "en",
    });

    expect(
      resolveLocale({
        registry,
        explicit: "missing",
        urlLocale: "nl",
        userPreference: "fr",
        cookie: "en",
        acceptLanguage: "fr;q=0.9,nl;q=0.8",
        browserLocale: "en",
      }),
    ).toEqual({ locale: "nl", source: "url" });

    expect(
      resolveLocale({
        registry,
        acceptLanguage: "de;q=0.9,fr;q=0.8,en;q=0.7",
      }),
    ).toEqual({ locale: "fr", source: "accept-language" });
  });
});
