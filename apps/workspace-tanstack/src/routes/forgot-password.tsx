import { createFileRoute } from "@tanstack/react-router";

import { PasswordResetRequestPage } from "../components/password-reset-pages";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PasswordResetRequestPage,
});
