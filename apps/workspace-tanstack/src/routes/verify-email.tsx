import { createFileRoute } from "@tanstack/react-router";

import { VerifyEmailPage } from "../components/verify-email-page";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify your email" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyEmailPage,
});
