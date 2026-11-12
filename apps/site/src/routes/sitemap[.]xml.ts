import { createFileRoute } from "@tanstack/react-router";
import { source } from "@/lib/source";
import { createSitemapHandler } from "@/lib/sitemap";

const sitemap = createSitemapHandler(
  () => ["/", ...source.getPages().map((page) => page.url)],
  {
    siteUrl: "https://puzzle-ui.com",
  },
);

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => sitemap(request),
    },
  },
});
