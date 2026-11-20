import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { createI18n } from "../runtime";
import { createI18nDiagnostics, I18nDevTools } from "../devtools";

describe("i18n development diagnostics", () => {
  it("collects bounded runtime events and renders an accessible panel", () => {
    const diagnostics = createI18nDiagnostics({
      maxEvents: 2,
      clock: () => new Date("2025-01-01T00:00:00.000Z"),
    });
    const i18n = createI18n({
      locales: [{ locale: "en" }, { locale: "fr" }],
      defaultLocale: "en",
      catalogs: { en: { title: "Title" }, fr: {} },
      onEvent: diagnostics.record,
    });

    i18n.createTranslator("fr").t("title");
    diagnostics.record({
      type: "missing-key",
      key: "missing",
      locale: "fr",
    });

    expect(diagnostics.getSnapshot().map(({ type }) => type)).toEqual([
      "fallback",
      "missing-key",
    ]);

    const markup = renderToStaticMarkup(
      createElement(I18nDevTools, { diagnostics }),
    );

    expect(markup).toContain("i18n diagnostics (2)");
    expect(markup).toContain("aria-label=\"Internationalization diagnostic events\"");
    expect(markup).toContain("fell back from fr to en");
  });

  it("notifies subscribers and clears collected events", () => {
    const diagnostics = createI18nDiagnostics();
    let notifications = 0;
    const unsubscribe = diagnostics.subscribe(() => {
      notifications += 1;
    });

    diagnostics.record({
      type: "missing-key",
      key: "title",
      locale: "en",
    });
    diagnostics.clear();
    unsubscribe();
    diagnostics.record({
      type: "missing-key",
      key: "other",
      locale: "en",
    });

    expect(notifications).toBe(2);
    expect(diagnostics.getSnapshot()).toHaveLength(1);
    expect(diagnostics.getSnapshot()[0]).toMatchObject({ key: "other" });
  });

  it("renders route events emitted by framework locale loaders", () => {
    const diagnostics = createI18nDiagnostics();
    diagnostics.record({
      type: "route",
      pathname: "/nl/over",
      status: "redirected",
      locale: "nl",
      routeId: "about",
    });

    const markup = renderToStaticMarkup(
      createElement(I18nDevTools, { diagnostics }),
    );

    expect(markup).toContain("Route redirected for nl at /nl/over (about)");
  });
});
