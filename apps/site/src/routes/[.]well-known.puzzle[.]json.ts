import { createFileRoute } from "@tanstack/react-router";

import { projectInformationGET } from "@/lib/project-information";

export const Route = createFileRoute("/.well-known/puzzle.json")({
  server: {
    handlers: {
      GET: projectInformationGET,
    },
  },
});
