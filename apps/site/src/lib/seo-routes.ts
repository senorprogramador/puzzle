import { createTanStackSeoRoutes } from "@puzzle-ui/seo/tanstack";

import { source } from "@/lib/source";

import { getCanonicalUrl, HOME_URL, SITE_URL } from "@/lib/seo";

const documentationEntries = source.getPages().map((page) => ({
  url: getCanonicalUrl(page.url),
}));

export const seoRoutes = createTanStackSeoRoutes({
  sitemap: {
    path: "/sitemap.xml",

    cacheControl: "public, max-age=3600, s-maxage=86400",

    sitemap: {
      baseUrl: SITE_URL,
      filename: "sitemap",

      entries: [
        {
          url: HOME_URL,
        },
        ...documentationEntries,
      ],
    },
  },

  robots: {
    path: "/robots.txt",

    cacheControl: "public, max-age=86400, s-maxage=86400",

    robots: {
      rules: [
        {
          userAgent: "*",
          allow: ["/"],
        },
      ],

      sitemap: `${SITE_URL}/sitemap.xml`,
    },
  },
});
