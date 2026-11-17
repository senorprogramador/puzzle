import { createFileRoute } from "@tanstack/react-router";

import { EmailChangeVerification } from "@puzzle-ui/workspace-ui";

export const Route = createFileRoute("/verify-email-change")({
  head: () => ({
    meta: [
      { title: "Confirm your new email" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EmailChangeVerification,
});
