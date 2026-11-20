import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type { LocaleDefinition } from "@puzzle-ui/i18n";
import Link from "next/link";

import { LocaleProvider } from "@/lib/i18n/client";
import { localeRegistry } from "@/lib/i18n/locales";

type LocalizedLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return localeRegistry.locales.map(
    (definition: LocaleDefinition) => ({ locale: definition.locale }),
  );
}

const LocalizedLayout = async ({
  children,
  params,
}: LocalizedLayoutProps) => {
  const { locale: routeLocale } = await params;
  const locale = localeRegistry.resolve(routeLocale);

  if (!locale) {
    notFound();
  }

  return (
    <LocaleProvider locale={locale}>
      <div lang={locale} dir={localeRegistry.get(locale)?.direction ?? "ltr"}>
        <nav aria-label="Localized examples">
          <Link href="/localized/en">English</Link>
          {" · "}
          <Link href="/localized/fr">Français</Link>
          {" · "}
          <Link href="/locale-request">Request locale example</Link>
        </nav>
        {children}
      </div>
    </LocaleProvider>
  );
};

export default LocalizedLayout;
