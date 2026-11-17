import { createFileRoute } from "@tanstack/react-router";

import { InvitationAcceptance } from "@puzzle-ui/workspace-ui";

export const Route = createFileRoute("/invitations/accept")({
  head: () => ({
    meta: [
      { title: "Accept workspace invitation" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InvitationAcceptance,
});
