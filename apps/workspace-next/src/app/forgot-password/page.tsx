import type { Metadata } from "next";

import { PasswordResetRequestPage } from "@/components/password-reset-pages";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default PasswordResetRequestPage;
