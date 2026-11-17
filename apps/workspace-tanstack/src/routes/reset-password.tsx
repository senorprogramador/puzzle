import { createFileRoute } from "@tanstack/react-router";

import { PasswordResetCompletionPage } from "../components/password-reset-pages";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Choose a new password" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PasswordResetCompletionPage,
});
