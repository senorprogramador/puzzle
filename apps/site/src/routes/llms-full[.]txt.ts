import { createFileRoute } from "@tanstack/react-router";

import { getFullLlmsText } from "@/lib/llms-full";

const textHeaders = {
  "Content-Type": "text/plain; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: () => {
        try {
          return new Response(getFullLlmsText(), {
            headers: {
              ...textHeaders,
              "Cache-Control": "public, max-age=3600, s-maxage=86400",
            },
          });
        } catch (error) {
          console.error("Failed to generate /llms-full.txt:", error);

          return new Response(
            "The full Puzzle documentation could not be generated.",
            {
              status: 500,
              headers: {
                ...textHeaders,
                "Cache-Control": "no-store",
              },
            },
          );
        }
      },
    },
  },
});
