import { createFileRoute } from "@tanstack/react-router";

import { seoRoutes } from "@/lib/seo-routes";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: seoRoutes.sitemapGET,
    },
  },
});
