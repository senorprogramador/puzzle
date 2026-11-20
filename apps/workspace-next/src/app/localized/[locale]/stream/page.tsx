import { Suspense } from "react";
import { notFound } from "next/navigation";

import { i18n } from "@/lib/i18n/config";
import { resolveRequestLocale } from "@/lib/i18n/request";
import { localeRegistry } from "@/lib/i18n/locales";

type StreamPageProps = {
  params: Promise<{ locale: string }>;
};

type StreamedLocaleContentProps = {
  locale: string;
};

const StreamedLocaleContent = async ({
  locale,
}: StreamedLocaleContentProps) => {
  const resolution = await resolveRequestLocale(locale);
  await new Promise<void>((resolve) => setTimeout(resolve, 350));

  return (
    <p data-testid="localized-stream-content" data-locale={resolution.locale}>
      {i18n.createTranslator(resolution.locale).t("stream.content")}
    </p>
  );
};

const LocalizedStreamPage = async ({ params }: StreamPageProps) => {
  const { locale: routeLocale } = await params;
  const locale = localeRegistry.resolve(routeLocale);

  if (!locale) {
    notFound();
  }

  const translator = i18n.createTranslator(locale);

  return (
    <main lang={locale}>
      <h1>{translator.t("stream.title")}</h1>
      <p data-testid="localized-stream-shell">
        {translator.t("stream.shell")}
      </p>
      <Suspense
        fallback={
          <p role="status" data-testid="localized-stream-fallback">
            Loading localized content…
          </p>
        }
      >
        <StreamedLocaleContent locale={locale} />
      </Suspense>
    </main>
  );
};

export default LocalizedStreamPage;
