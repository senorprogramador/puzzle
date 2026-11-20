import { createLocaleRegistry } from "@puzzle-ui/i18n";

import type { LocaleDefinition } from "@puzzle-ui/i18n";

export const localeDefinitions = [
  { locale: "en", name: "English", nativeName: "English" },
  { locale: "fr", name: "French", nativeName: "Français" },
] as const satisfies readonly LocaleDefinition[];

export const localeRegistry = createLocaleRegistry({
  locales: localeDefinitions,
  defaultLocale: "en",
});
