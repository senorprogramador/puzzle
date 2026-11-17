import { createFileRoute } from "@tanstack/react-router";

import { handleWorkspaceApiRequest } from "../../lib/workspace/api";

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      DELETE: ({ request }) => handleWorkspaceApiRequest(request),
      GET: ({ request }) => handleWorkspaceApiRequest(request),
      PATCH: ({ request }) => handleWorkspaceApiRequest(request),
      POST: ({ request }) => handleWorkspaceApiRequest(request),
    },
  },
});
