import type { Metadata } from "next";

import { InvitationAcceptance } from "@puzzle-ui/workspace-ui";

export const metadata: Metadata = {
  title: "Accept workspace invitation",
  robots: { index: false, follow: false },
};

const AcceptInvitationPage = () => <InvitationAcceptance />;

export default AcceptInvitationPage;
