const CACHE_DURATION_SECONDS = 24 * 60 * 60;

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const createSitemapHandler = (getPaths: () => string[]) => {
  let cache: { origin: string; body: string; expiresAt: number } | undefined;

  return (request: Request): Response => {
    const origin = new URL(request.url).origin;
    const now = Date.now();

    if (!cache || cache.origin !== origin || now >= cache.expiresAt) {
      const locations = new Set(
        getPaths().map((path) => new URL(path, origin).href),
      );
      const entries = [...locations]
        .sort()
        .map((location) => `  <url><loc>${escapeXml(location)}</loc></url>`)
        .join("\n");

      cache = {
        origin,
        body: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
        expiresAt: now + CACHE_DURATION_SECONDS * 1000,
      };
    }

    return new Response(cache.body, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": `public, max-age=${CACHE_DURATION_SECONDS}, s-maxage=${CACHE_DURATION_SECONDS}`,
      },
    });
  };
};
