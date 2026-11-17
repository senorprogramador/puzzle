import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { WorkspaceApp } from "@puzzle-ui/workspace-ui";
import { listWorkspacesForUser } from "@puzzle-ui/workspace/server";

import { SignOutButton } from "@/components/sign-out-button";
import { getServices, getSignedInUser } from "@/lib/auth/services";

export const metadata: Metadata = {
  title: "Workspace dashboard",
  robots: { index: false, follow: false },
};

const DashboardPage = async () => {
  const cookieHeader = (await headers()).get("cookie");
  const [user, services] = await Promise.all([
    getSignedInUser(cookieHeader),
    getServices(),
  ]);

  if (!user) redirect("/sign-in");

  const workspaces = await listWorkspacesForUser({
    storage: services.storage,
    userId: user.id,
  });

  return (
    <>
      <WorkspaceApp
        initialWorkspaces={workspaces.map(
          ({ id, name, slug, description }) => ({
            id,
            name,
            slug,
            description,
          }),
        )}
        userId={user.id}
        userEmail={user.email}
        userName={user.name}
        userImage={user.image}
        topbarActions={<SignOutButton />}
      />
    </>
  );
};

export default DashboardPage;
