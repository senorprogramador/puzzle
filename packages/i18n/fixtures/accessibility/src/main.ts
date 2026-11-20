import { createElement, useState } from "react";
import { createRoot } from "react-dom/client";

import type { ReactNode } from "react";
import { createI18n } from "../../../dist/index.js";
import { createI18nReact } from "../../../dist/react/index.js";

const i18n = createI18n({
  locales: [
    { locale: "en", nativeName: "English", direction: "ltr" },
    { locale: "nl", nativeName: "Nederlands", direction: "ltr" },
    { locale: "ar", nativeName: "العربية", direction: "rtl" },
  ],
  defaultLocale: "en",
  catalogs: {
    en: {
      greeting: "Hello {name}",
      announcement: "Welcome, <strong>{name}</strong>!",
      untrusted: "Untrusted: {payload}",
    },
    nl: {
      greeting: "Hallo {name}",
      announcement: "Welkom, <strong>{name}</strong>!",
      untrusted: "Untrusted: {payload}",
    },
    ar: {
      greeting: "مرحبا {name}",
      announcement: "أهلا <strong>{name}</strong>!",
      untrusted: "Untrusted: {payload}",
    },
  },
});
const {
  FormattedNumber,
  LocaleSwitcher,
  Provider,
  useLocaleAttributes,
  useLocale,
  useRichTranslation,
  useTranslation,
} = createI18nReact(i18n);

const previousTranslators = new Map<string, ReturnType<typeof useTranslation>>();
let providerIsStable = true;

const ProviderStabilityProbe = () => {
  const locale = useLocale();
  const translator = useTranslation();
  const previous = previousTranslators.get(locale);

  if (previous && previous !== translator) {
    providerIsStable = false;
  }

  previousTranslators.set(locale, translator);

  return createElement(
    "output",
    { id: "provider-stability" },
    providerIsStable ? "stable" : "unstable",
  );
};

const LocalizedContent = ({
  onLocaleChange,
  onRerender,
  renderCount,
}: {
  onLocaleChange: (locale: string) => void;
  onRerender: () => void;
  renderCount: number;
}) => {
  const { lang, dir } = useLocaleAttributes();
  const translator = useTranslation();
  const rich = useRichTranslation();

  return createElement(
    "main",
    { lang, dir },
    createElement("button", {
      id: "rerender",
      onClick: onRerender,
      type: "button",
    }, `Rerender ${renderCount}`),
    createElement("p", { id: "language-help" }, "Choose a language."),
    createElement(LocaleSwitcher, {
      id: "language",
      label: "Language",
      name: "locale",
      "aria-describedby": "language-help",
      onLocaleChange,
    }),
    createElement(ProviderStabilityProbe),
    createElement("h1", { id: "greeting" },
      translator.t("greeting", { name: "Ada" }),
    ),
    createElement("p", { id: "announcement" },
      rich("announcement", {
        name: "Ada",
        strong: (content: ReactNode) =>
          createElement("strong", { key: "announcement-strong" }, content),
      }),
    ),
    createElement("p", { id: "number" },
      createElement(FormattedNumber, {
        value: 1234.5,
        options: { maximumFractionDigits: 0 },
      }),
    ),
    createElement(
      "p",
      { id: "untrusted" },
      translator.t("untrusted", {
        payload: "<img src=x onerror=alert(1)>",
      }),
    ),
  );
};

const App = () => {
  const [locale, setLocale] = useState("en");
  const [renderCount, setRenderCount] = useState(0);

  return createElement(
    Provider,
    {
      locale,
      children: createElement(LocalizedContent, {
        onLocaleChange: setLocale,
        onRerender: () => setRenderCount((count) => count + 1),
        renderCount,
      }),
    },
  );
};

const container = document.getElementById("root");

if (!container) {
  throw new Error("Accessibility fixture root was not found.");
}

createRoot(container).render(createElement(App));
