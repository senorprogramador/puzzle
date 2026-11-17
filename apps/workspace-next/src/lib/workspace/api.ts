import { createWorkspaceApiHandler } from "@puzzle-ui/workspace/server";

import {
  getServices,
  getWorkspaceIdentity,
  protectWorkspaceMutation,
} from "@/lib/auth/services";
import { getEnvironmentVariable } from "@/lib/auth/environment";
import { getInvitationDelivery } from "@/lib/auth/email";

const handleWorkspaceApiRequest = async (request: Request): Promise<Response> => {
  try {
    const services = await getServices();
    const invitationBaseUrl = getEnvironmentVariable("APP_ORIGIN");

    if (!invitationBaseUrl) {
      throw new Error("Missing server configuration: APP_ORIGIN");
    }

    const deliverInvitation = getInvitationDelivery();
    const handler = createWorkspaceApiHandler({
      storage: services.storage,
      invitationBaseUrl,
      authenticate: (incomingRequest) =>
        getWorkspaceIdentity(incomingRequest.headers.get("cookie")),
      protectMutation: protectWorkspaceMutation,
      ...(deliverInvitation ? { deliverInvitation } : {}),
    });

    return await handler(request);
  } catch (error) {
    console.error("Puzzle Workspace is unavailable:", error);

    return Response.json(
      {
        error: {
          code: "WORKSPACE_UNAVAILABLE",
          message: "Puzzle Workspace is not available. Check the server logs.",
        },
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
};

export { handleWorkspaceApiRequest };
