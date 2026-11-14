import { createFileRoute } from "@tanstack/react-router";

import { source } from "@/lib/source";

import { createFromSource } from "fumadocs-core/search/server";

const server = createFromSource(source);

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const response = await server.GET(request);

        const headers = new Headers(response.headers);

        headers.set("X-Robots-Tag", "noindex, nofollow");

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      },
    },
  },
});
