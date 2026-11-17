import type { Metadata } from "next";

import { VerifyEmailPage } from "@/components/verify-email-page";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: { index: false, follow: false },
};

export default VerifyEmailPage;
