import { createFileRoute } from "@tanstack/react-router";

const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  "Sitemap: https://puzzle-ui.com/sitemap.xml",
  "",
].join("\n");

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(robots, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        }),
    },
  },
});
