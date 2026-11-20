import { describe, expect, it } from "vitest";

import { createI18n } from "../index";

const i18n = createI18n({
  locales: [{ locale: "en" }],
  defaultLocale: "en",
  catalogs: {
    en: {
      greeting: "Hello {name}",
      section: { title: "Welcome" },
    },
  },
});

const translator = i18n.createTranslator("en");

const validateTypes = () => {
  translator.t("greeting", { name: "Ada" });
  translator.t("section.title");

  // @ts-expect-error Unknown translation keys are rejected.
  translator.t("unknown");
  // @ts-expect-error Required interpolation values are enforced.
  translator.t("greeting");
  // @ts-expect-error Nested keys must use their complete path.
  translator.t("section");
};

void validateTypes;

describe("public type contract", () => {
  it("translates nested and interpolated catalog messages", () => {
    expect(translator.t("greeting", { name: "Ada" })).toBe("Hello Ada");
    expect(translator.t("section.title")).toBe("Welcome");
  });
});
