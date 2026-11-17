import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

import { WorkspaceApp } from "@puzzle-ui/workspace-ui";
import { listWorkspacesForUser } from "@puzzle-ui/workspace/server";

import { SignOutButton } from "../components/sign-out-button";
import { getServices, getSignedInUser } from "../lib/auth/services";

const getDashboardData = createServerFn({ method: "GET" }).handler(
  async () => {
    const user = await getSignedInUser(getRequestHeader("cookie") ?? null);

    if (!user) {
      throw redirect({ to: "/sign-in" });
    }

    const services = await getServices();
    const workspaces = await listWorkspacesForUser({
      storage: services.storage,
      userId: user.id,
    });

    return {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      userImage: user.image,
      workspaces: workspaces.map(({ id, name, slug, description }) => ({
        id,
        name,
        slug,
        description,
      })),
    };
  },
);

const DashboardPage = () => {
  const { userId, userEmail, userName, userImage, workspaces } = Route.useLoaderData();

  return (
    <>
      <WorkspaceApp
        initialWorkspaces={workspaces}
        userId={userId}
        userEmail={userEmail}
        userName={userName}
        userImage={userImage}
        topbarActions={<SignOutButton />}
      />
    </>
  );
};

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Workspace dashboard" }, { name: "robots", content: "noindex" }],
  }),
  loader: () => getDashboardData(),
  component: DashboardPage,
});
