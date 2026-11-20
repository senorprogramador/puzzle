import { i18n } from "@/lib/i18n/config";
import { resolveRequestLocale } from "@/lib/i18n/request";

const RequestLocalePage = async () => {
  const [resolution, repeatedResolution] = await Promise.all([
    resolveRequestLocale(),
    resolveRequestLocale(),
  ]);
  const translator = i18n.createTranslator(resolution.locale);

  return (
    <main lang={resolution.locale}>
      <h1>{translator.t("request.title")}</h1>
      <p>{translator.t("request.explanation")}</p>
      <p>
        Locale: <output data-testid="request-locale">{resolution.locale}</output>
      </p>
      <p>
        Source: <output data-testid="request-locale-source">{resolution.source}</output>
      </p>
      <p
        data-testid="request-locale-cache"
        data-cache-hit={resolution === repeatedResolution}
      >
        Repeated request lookup returned the same cached resolution.
      </p>
    </main>
  );
};

export default RequestLocalePage;
