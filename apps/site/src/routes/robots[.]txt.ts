import { createFileRoute } from "@tanstack/react-router";

import { seoRoutes } from "@/lib/seo-routes";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: seoRoutes.robotsGET,
    },
  },
});
