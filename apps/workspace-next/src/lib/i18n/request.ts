import { cache } from "react";
import { cookies, headers } from "next/headers";

import { resolveLocale } from "@puzzle-ui/i18n";

import { localeRegistry } from "./locales";

export const resolveRequestLocale = cache(async (urlLocale?: string) => {
  const [requestHeaders, cookieStore] = await Promise.all([
    headers(),
    cookies(),
  ]);

  return resolveLocale({
    registry: localeRegistry,
    urlLocale,
    cookie: cookieStore.get("puzzle-locale")?.value,
    acceptLanguage: requestHeaders.get("accept-language") ?? undefined,
  });
});
