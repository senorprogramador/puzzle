import type { Metadata } from "next";

import { EmailChangeVerification } from "@puzzle-ui/workspace-ui";

export const metadata: Metadata = {
  title: "Confirm your new email",
  robots: { index: false, follow: false },
};

const VerifyEmailChangePage = () => <EmailChangeVerification />;

export default VerifyEmailChangePage;
