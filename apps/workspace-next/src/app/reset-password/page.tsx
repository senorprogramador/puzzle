import type { Metadata } from "next";

import { PasswordResetCompletionPage } from "@/components/password-reset-pages";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

export default PasswordResetCompletionPage;
