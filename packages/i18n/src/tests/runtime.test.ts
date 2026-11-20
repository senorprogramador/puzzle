import { describe, expect, it, vi } from "vitest";

import {
  createI18n,
  formatMessage,
  formatRichMessage,
} from "../runtime";

const createTestI18n = (onFallback?: (event: unknown) => void) =>
  createI18n({
    locales: [
      { locale: "en" },
      { locale: "nl" },
      { locale: "fr-CA", fallbacks: ["fr"] },
      { locale: "fr" },
    ],
    defaultLocale: "en",
    fallbackLocale: "en",
    catalogs: {
      en: {
        greeting: "Hello {name}",
        items: "{count, plural, one {# item} other {# items}}",
        nested: { title: "Welcome" },
        shared: "Fallback",
      },
      nl: {
        greeting: "Hallo {name}",
        items: "{count, plural, one {# artikel} other {# artikelen}}",
        nested: { title: "Welkom" },
      },
      fr: {
        greeting: "Bonjour {name}",
        items: "{count, plural, one {# article} other {# articles}}",
        nested: { title: "Bienvenue" },
      },
      "fr-CA": {
        greeting: "Allô {name}",
        items: "{count, plural, one {# article} other {# articles}}",
        nested: { title: "Bienvenue" },
      },
    },
    onFallback,
  });

describe("translation runtime", () => {
  it("formats ICU interpolation and plural messages with locale rules", () => {
    const i18n = createTestI18n();
    const english = i18n.createTranslator("en");
    const dutch = i18n.createTranslator("nl");

    expect(english.t("greeting", { name: "Ada" })).toBe("Hello Ada");
    expect(english.t("items", { count: 1 })).toBe("1 item");
    expect(english.t("items", { count: 3 })).toBe("3 items");
    expect(dutch.t("items", { count: 3 })).toBe("3 artikelen");
    expect(english.t("nested.title")).toBe("Welcome");
  });

  it("uses configured and regional fallbacks and reports their use", () => {
    const onFallback = vi.fn();
    const i18n = createTestI18n(onFallback);
    const frenchCanadian = i18n.createTranslator("fr-CA");

    expect(frenchCanadian.t("shared")).toBe("Fallback");
    expect(onFallback).toHaveBeenCalledWith({
      key: "shared",
      requestedLocale: "fr-CA",
      resolvedLocale: "en",
    });
  });

  it("isolates locale-specific translators across concurrent requests", async () => {
    const i18n = createTestI18n();
    const results = await Promise.all(
      Array.from({ length: 60 }, async (_, index) => {
        const locale = index % 2 === 0 ? "en" : "nl";
        const translator = i18n.createTranslator(locale);
        await Promise.resolve();
        return translator.t("greeting", { name: String(index) });
      }),
    );

    expect(results[0]).toBe("Hello 0");
    expect(results[1]).toBe("Hallo 1");
    expect(results[58]).toBe("Hello 58");
    expect(results[59]).toBe("Hallo 59");
  });

  it("takes an immutable catalog snapshot for each runtime", () => {
    const catalogs = { en: { title: "Before" } };
    const i18n = createI18n({
      locales: [{ locale: "en" }],
      defaultLocale: "en",
      catalogs,
    });

    catalogs.en.title = "After";

    expect(i18n.createTranslator("en").t("title")).toBe("Before");
    expect(() => {
      (i18n.catalogs.en as { title: string }).title = "Mutated";
    }).toThrow();
  });

  it("returns missing keys and can report them without leaking request locale state", () => {
    const onMissing = vi.fn();
    const i18n = createI18n({
      locales: [{ locale: "en" }],
      defaultLocale: "en",
      catalogs: { en: { title: "Title" } },
      onMissingKey: onMissing,
    });

    expect(i18n.createTranslator("en").t("missing" as "title")).toBe("missing");
    expect(onMissing).toHaveBeenCalledWith({ key: "missing", locale: "en" });
    expect(() => i18n.createTranslator("xx")).toThrow(/Unsupported locale/);
  });

  it("formats standalone ICU messages", () => {
    expect(formatMessage("{count, number}", "en", { count: 1200 })).toBe(
      "1,200",
    );
  });

  it("formats rich ICU messages into caller-provided nodes", () => {
    type TestNode = {
      type: "strong" | "em";
      children: (string | TestNode)[];
    };
    const i18n = createI18n({
      locales: [{ locale: "en" }],
      defaultLocale: "en",
      catalogs: {
        en: {
          announcement: "Welcome, <strong>{name}</strong>!",
        },
      },
    });
    const translator = i18n.createTranslator("en");
    const richText = translator.rich<"announcement", TestNode>("announcement", {
        name: "Ada",
        strong: (children): TestNode => ({ type: "strong", children }),
      });

    expect(richText).toEqual([
      "Welcome, ",
      { type: "strong", children: ["Ada"] },
      "!",
    ]);
    expect(
      formatRichMessage<TestNode>("Hello <em>{name}</em>", "en", {
        name: "Ada",
        em: (children): TestNode => ({ type: "em", children }),
      }),
    ).toEqual(["Hello ", { type: "em", children: ["Ada"] }]);
  });

  it("loads namespaces for a locale and its fallback chain into existing translators", async () => {
    const loader = {
      load: vi.fn(async (locale: string, namespace: string) => ({
        title:
          locale === "nl"
            ? "Dashboard"
            : `${namespace} {name}`,
      })),
    };
    const i18n = createI18n({
      locales: [{ locale: "en" }, { locale: "nl" }],
      defaultLocale: "en",
      catalogs: {
        en: { common: { greeting: "Hello" }, dashboard: { title: "" } },
        nl: { common: { greeting: "Hallo" }, dashboard: { title: "" } },
      },
      namespaceLoader: loader,
    });
    const translator = i18n.createTranslator("nl");

    await Promise.all([
      i18n.loadNamespace("nl", "dashboard"),
      i18n.loadNamespace("nl", "dashboard"),
    ]);

    expect(loader.load).toHaveBeenCalledTimes(2);
    expect(loader.load).toHaveBeenNthCalledWith(
      1,
      "nl",
      "dashboard",
      expect.any(AbortSignal),
    );
    expect(loader.load).toHaveBeenNthCalledWith(
      2,
      "en",
      "dashboard",
      expect.any(AbortSignal),
    );
    expect(i18n.isNamespaceLoaded("nl", "dashboard")).toBe(true);
    expect(translator.t("dashboard.title")).toBe("Dashboard");
    expect(translator.t("common.greeting")).toBe("Hallo");
    expect(i18n.catalogs.nl?.dashboard).toEqual({
      title: "Dashboard",
    });
  });

  it("surfaces namespace loader errors and aborts", async () => {
    const failure = new Error("Catalog unavailable");
    const i18n = createI18n({
      locales: [{ locale: "en" }],
      defaultLocale: "en",
      catalogs: { en: { dashboard: { title: "" } } },
      namespaceLoader: {
        async load() {
          throw failure;
        },
      },
    });

    await expect(i18n.loadNamespace("en", "dashboard")).rejects.toBe(failure);
    expect(i18n.isNamespaceLoaded("en", "dashboard")).toBe(false);
    await expect(i18n.loadNamespace("en", "../dashboard")).rejects.toThrow(
      /Invalid translation namespace/,
    );
  });

  it("shares request-local namespace loads without letting one caller cancel another", async () => {
    const loader = vi.fn(
      (_locale: string, _namespace: string, signal?: AbortSignal) =>
        new Promise<{ title: string }>((resolve, reject) => {
          const timer = setTimeout(() => resolve({ title: "Dashboard" }), 10);
          signal?.addEventListener(
            "abort",
            () => {
              clearTimeout(timer);
              reject(signal.reason);
            },
            { once: true },
          );
        }),
    );
    const options = {
      locales: [{ locale: "en" }],
      defaultLocale: "en",
      catalogs: { en: { dashboard: { title: "" } } },
      namespaceLoader: { load: loader },
    };
    const firstRequest = createI18n(options);
    const first = new AbortController();
    const second = new AbortController();
    const firstLoad = firstRequest.loadNamespace("en", "dashboard", {
      signal: first.signal,
    });
    const secondLoad = firstRequest.loadNamespace("en", "dashboard", {
      signal: second.signal,
    });

    first.abort(new Error("first render cancelled"));
    await expect(firstLoad).rejects.toThrow("first render cancelled");
    await expect(secondLoad).resolves.toBeUndefined();
    expect(loader).toHaveBeenCalledTimes(1);
    expect(firstRequest.catalogs.en?.dashboard).toEqual({
      title: "Dashboard",
    });

    const secondRequest = createI18n(options);
    await secondRequest.loadNamespace("en", "dashboard");
    expect(loader).toHaveBeenCalledTimes(2);
    expect(secondRequest.catalogs.en?.dashboard).toEqual({
      title: "Dashboard",
    });
  });

  it("aborts shared namespace work after every waiting render is cancelled", async () => {
    let loaderSignal: AbortSignal | undefined;
    const loader = vi.fn(
      (_locale: string, _namespace: string, signal?: AbortSignal) =>
        new Promise<{ title: string }>((_resolve, reject) => {
          loaderSignal = signal;
          signal?.addEventListener(
            "abort",
            () => reject(signal.reason),
            { once: true },
          );
        }),
    );
    const i18n = createI18n({
      locales: [{ locale: "en" }],
      defaultLocale: "en",
      catalogs: { en: { dashboard: { title: "" } } },
      namespaceLoader: { load: loader },
    });
    const first = new AbortController();
    const second = new AbortController();
    const firstLoad = i18n.loadNamespace("en", "dashboard", {
      signal: first.signal,
    });
    const secondLoad = i18n.loadNamespace("en", "dashboard", {
      signal: second.signal,
    });

    await vi.waitFor(() => expect(loader).toHaveBeenCalledTimes(1));
    first.abort(new Error("first cancelled"));
    second.abort(new Error("second cancelled"));

    await expect(firstLoad).rejects.toThrow("first cancelled");
    await expect(secondLoad).rejects.toThrow("second cancelled");
    expect(loaderSignal?.aborted).toBe(true);
    expect(i18n.isNamespaceLoaded("en", "dashboard")).toBe(false);
  });
});
