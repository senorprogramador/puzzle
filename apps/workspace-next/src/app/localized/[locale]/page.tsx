import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { i18n } from "@/lib/i18n/config";
import { localeRegistry } from "@/lib/i18n/locales";

import { ClientGreeting } from "./client-greeting";

type LocalizedPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: LocalizedPageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params;
  const locale = localeRegistry.resolve(routeLocale);

  if (!locale) {
    notFound();
  }

  const translator = i18n.createTranslator(locale);
  const title = translator.t("metadata.title");
  const description = translator.t("metadata.description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
  };
}

const LocalizedPage = async ({ params }: LocalizedPageProps) => {
  const { locale: routeLocale } = await params;
  const locale = localeRegistry.resolve(routeLocale);

  if (!locale) {
    notFound();
  }

  const translator = i18n.createTranslator(locale);

  return (
    <main>
      <h1>{translator.t("page.title")}</h1>
      <p data-testid="localized-server-message">
        {translator.t("page.server")}
      </p>
      <ClientGreeting />
      <Link href={`/localized/${locale}/stream`}>
        Open localized streaming example
      </Link>
    </main>
  );
};

export default LocalizedPage;
