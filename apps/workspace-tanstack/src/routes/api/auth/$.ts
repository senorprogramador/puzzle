import { createFileRoute } from "@tanstack/react-router";

import { createTanStackAuthHandler } from "@puzzle-ui/fullstack/auth/tanstack";

import { handleAuthRequest } from "../../../lib/auth/services";

const handleAuth = (request: Request) =>
  handleAuthRequest(request, (auth) =>
    createTanStackAuthHandler({ auth })(request),
  );

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleAuth(request),
      POST: ({ request }) => handleAuth(request),
    },
  },
});
