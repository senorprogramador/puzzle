import { resolveLocale } from "@puzzle-ui/i18n";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { localeRegistry } from "./lib/i18n/locales";

const localizedPath = "/localized";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname !== localizedPath && pathname !== `${localizedPath}/`) {
    return NextResponse.next();
  }

  const { locale } = resolveLocale({
    registry: localeRegistry,
    cookie: request.cookies.get("puzzle-locale")?.value,
    acceptLanguage: request.headers.get("accept-language") ?? undefined,
  });
  const destination = request.nextUrl.clone();
  destination.pathname = `${localizedPath}/${locale}`;

  return NextResponse.redirect(destination);
}

export const config = {
  matcher: ["/localized/:path*"],
};
