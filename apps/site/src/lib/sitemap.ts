const CACHE_DURATION_SECONDS = 24 * 60 * 60;

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

type SitemapHandlerOptions = {
  siteUrl: string;
  cacheDurationSeconds?: number;
};

export const createSitemapHandler = (
  getPaths: () => string[],
  options: SitemapHandlerOptions,
) => {
  const { siteUrl, cacheDurationSeconds = CACHE_DURATION_SECONDS } = options;

  const origin = new URL(siteUrl).origin;

  let cache:
    | {
        body: string;
        expiresAt: number;
      }
    | undefined;

  return (_request: Request): Response => {
    const now = Date.now();

    if (!cache || now >= cache.expiresAt) {
      const locations = new Set(
        getPaths().map((path) => new URL(path, origin).href),
      );

      const entries = [...locations]
        .sort()
        .map((location) => `  <url><loc>${escapeXml(location)}</loc></url>`)
        .join("\n");

      cache = {
        body: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          entries,
          "</urlset>",
          "",
        ].join("\n"),
        expiresAt: now + cacheDurationSeconds * 1000,
      };
    }

    return new Response(cache.body, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": `public, max-age=${cacheDurationSeconds}, s-maxage=${cacheDurationSeconds}`,
      },
    });
  };
};
