import {
  StorageConflictError,
  StorageDuplicateError,
  type StorageAdapter,
  type StorageCursor,
} from "@puzzle-ui/storage";
import * as z from "zod/v4";

import {
  WorkspaceAccessError,
  WorkspaceConflictError,
  WorkspaceValidationError,
  createWorkspace,
  getWorkspace,
  listWorkspacesForUser,
  updateWorkspace,
} from "./services/workspace.service";
import type { WorkspaceInvitation } from "./models";
import {
  createProject,
  getProject,
  listProjects,
  updateProject,
} from "./services/project.service";
import {
  addProjectMember,
  listProjectMembers,
  removeProjectMember,
} from "./services/project-member.service";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from "./services/task.service";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "./services/settings.service";
import { listWorkspaceActivity } from "./services/activity.service";
import {
  acceptWorkspaceInvitation,
  createWorkspaceInvitation,
  listWorkspaceInvitations,
  listWorkspaceMembers,
  revokeWorkspaceInvitation,
} from "./services/invitation.service";
import {
  removeWorkspaceMember,
  updateWorkspaceMemberRole,
} from "./services/member.service";
import {
  acceptWorkspaceInvitationInputSchema,
  createProjectInputSchema,
  createWorkspaceInputSchema,
  createWorkspaceInvitationInputSchema,
  createWorkspaceTaskInputSchema,
  projectStatusSchema,
  projectMemberInputSchema,
  taskStatusSchema,
  updateNotificationPreferencesInputSchema,
  updateProjectInputSchema,
  updateWorkspaceInputSchema,
  updateWorkspaceMemberRoleInputSchema,
  updateWorkspaceTaskInputSchema,
} from "./validation";

export type WorkspaceApiIdentity = {
  readonly userId: string;
  readonly email: string;
  readonly emailVerified: boolean;
};

export type WorkspaceInvitationDelivery = {
  readonly email: string;
  readonly workspaceName: string;
  readonly invitationUrl: string;
};

export type WorkspaceApiOptions = {
  readonly storage: StorageAdapter;
  readonly invitationBaseUrl: string;
  readonly authenticate: (
    request: Request,
  ) => Promise<WorkspaceApiIdentity | null>;
  readonly protectMutation: (request: Request) => Response | null;
  readonly deliverInvitation?: (
    invitation: WorkspaceInvitationDelivery,
  ) => Promise<void>;
};

const noStore = { "Cache-Control": "no-store" };
const acceptInvitationTokenSchema = acceptWorkspaceInvitationInputSchema.pick({
  token: true,
});

const json = (
  body: unknown,
  status = 200,
  headers: HeadersInit = {},
): Response =>
  Response.json(body, {
    status,
    headers: { ...noStore, ...headers },
  });

const notFound = () =>
  json(
    { error: { code: "NOT_FOUND", message: "Workspace resource not found." } },
    404,
  );

const methodNotAllowed = (allowed: readonly string[]) =>
  json(
    { error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed." } },
    405,
    { Allow: allowed.join(", ") },
  );

const invalidInput = (issues: readonly string[]) =>
  json(
    {
      error: {
        code: "INVALID_INPUT",
        message: "Request input is invalid.",
        issues,
      },
    },
    400,
  );

const parseBody = async <T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<{ readonly value: T } | { readonly response: Response }> => {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { response: invalidInput(["Request body must be valid JSON."]) };
    }

    throw error;
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return {
      response: invalidInput(parsed.error.issues.map((issue) => issue.message)),
    };
  }

  return { value: parsed.data };
};

const decodePath = (pathname: string): readonly string[] | null => {
  try {
    return pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => decodeURIComponent(segment));
  } catch {
    return null;
  }
};

const mapError = (error: unknown): Response => {
  if (error instanceof WorkspaceAccessError) {
    const status = error.code === "WORKSPACE_NOT_FOUND" ? 404 : 403;

    return json(
      { error: { code: error.code, message: error.message } },
      status,
    );
  }

  if (error instanceof WorkspaceValidationError) {
    return invalidInput(error.issues);
  }

  if (
    error instanceof WorkspaceConflictError ||
    error instanceof StorageConflictError ||
    error instanceof StorageDuplicateError
  ) {
    return json({ error: { code: "CONFLICT", message: error.message } }, 409);
  }

  console.error("Workspace API request failed:", error);

  return json(
    {
      error: {
        code: "WORKSPACE_UNAVAILABLE",
        message: "The workspace request could not be completed.",
      },
    },
    500,
  );
};

const getQueryStatus = <T>(
  value: string | null,
  schema: z.ZodType<T>,
):
  | { readonly kind: "value"; readonly value: T | undefined }
  | { readonly kind: "response"; readonly response: Response } => {
  if (!value) return { kind: "value", value: undefined };

  const parsed = schema.safeParse(value);

  return parsed.success
    ? { kind: "value", value: parsed.data }
    : {
        kind: "response",
        response: invalidInput(["The requested status is invalid."]),
      };
};

const createWorkspaceContext = (
  storage: StorageAdapter,
  identity: WorkspaceApiIdentity,
) => ({ storage, userId: identity.userId });

const createWorkspaceInvitationUrl = (
  baseUrl: string,
  token: string,
): string => {
  const url = new URL("/invitations/accept", baseUrl);
  url.searchParams.set("token", token);
  return url.toString();
};

const toInvitationSummary = (invitation: WorkspaceInvitation) => ({
  id: invitation.id,
  workspaceId: invitation.workspaceId,
  email: invitation.email,
  role: invitation.role,
  expiresAt: invitation.expiresAt,
  acceptedAt: invitation.acceptedAt,
  revokedAt: invitation.revokedAt,
  createdAt: invitation.createdAt,
  updatedAt: invitation.updatedAt,
  revision: invitation.revision,
});

const revokeAfterDeliveryFailure = async (
  context: ReturnType<typeof createWorkspaceContext>,
  workspaceId: string,
  invitationId: string,
): Promise<void> => {
  try {
    await revokeWorkspaceInvitation(context, workspaceId, invitationId);
  } catch (error) {
    console.error("Failed to revoke an undelivered workspace invitation:", {
      workspaceId,
      invitationId,
      error,
    });
  }
};

const createHandler = (options: WorkspaceApiOptions) => {
  const invitationBaseUrl = new URL(options.invitationBaseUrl);

  if (
    invitationBaseUrl.origin !== options.invitationBaseUrl ||
    !["http:", "https:"].includes(invitationBaseUrl.protocol)
  ) {
    throw new Error("Workspace invitation base URL must be an exact origin.");
  }

  return async (request: Request): Promise<Response> => {
    const method = request.method.toUpperCase();
    const mutating = !["GET", "HEAD", "OPTIONS"].includes(method);

    if (mutating) {
      const protectedResponse = options.protectMutation(request);

      if (protectedResponse) return protectedResponse;
    }

    let identity: WorkspaceApiIdentity | null;

    try {
      identity = await options.authenticate(request);
    } catch (error) {
      console.error("Workspace identity could not be verified:", error);

      return json(
        {
          error: {
            code: "AUTH_UNAVAILABLE",
            message: "Authentication is temporarily unavailable.",
          },
        },
        503,
      );
    }

    if (!identity?.userId) {
      return json(
        { error: { code: "UNAUTHENTICATED", message: "Sign in is required." } },
        401,
      );
    }

    const context = createWorkspaceContext(options.storage, identity);
    const segments = decodePath(new URL(request.url).pathname);

    if (!segments) return notFound();

    try {
      if (
        segments.length === 3 &&
        segments[0] === "api" &&
        segments[1] === "invitations" &&
        segments[2] === "accept"
      ) {
        if (method !== "POST") return methodNotAllowed(["POST"]);
        if (!identity.emailVerified) {
          return json(
            {
              error: {
                code: "VERIFIED_EMAIL_REQUIRED",
                message:
                  "A verified email address is required to accept an invitation.",
              },
            },
            403,
          );
        }

        const parsed = await parseBody(request, acceptInvitationTokenSchema);
        if ("response" in parsed) return parsed.response;

        const member = await acceptWorkspaceInvitation(
          context,
          parsed.value.token,
          identity.email,
        );
        return json({ member }, 201);
      }

      if (
        segments[0] !== "api" ||
        segments[1] !== "workspaces" ||
        segments.length < 2
      ) {
        return notFound();
      }

      if (segments.length === 2) {
        if (method === "GET") {
          return json({ workspaces: await listWorkspacesForUser(context) });
        }

        if (method === "POST") {
          const parsed = await parseBody(request, createWorkspaceInputSchema);
          if ("response" in parsed) return parsed.response;

          return json(
            { workspace: await createWorkspace(context, parsed.value) },
            201,
          );
        }

        return methodNotAllowed(["GET", "POST"]);
      }

      const workspaceId = segments[2];
      if (!workspaceId) return notFound();

      if (segments.length === 3) {
        if (method === "GET") {
          return json({ workspace: await getWorkspace(context, workspaceId) });
        }

        if (method === "PATCH") {
          const parsed = await parseBody(request, updateWorkspaceInputSchema);
          if ("response" in parsed) return parsed.response;

          return json({
            workspace: await updateWorkspace(
              context,
              workspaceId,
              parsed.value,
            ),
          });
        }

        return methodNotAllowed(["GET", "PATCH"]);
      }

      const resource = segments[3];

      if (resource === "projects" && segments.length === 4) {
        if (method === "GET") {
          const status = getQueryStatus(
            new URL(request.url).searchParams.get("status"),
            projectStatusSchema,
          );
          if (status.kind === "response") return status.response;

          return json({
            projects: await listProjects(context, workspaceId, status.value),
          });
        }

        if (method === "POST") {
          const parsed = await parseBody(request, createProjectInputSchema);
          if ("response" in parsed) return parsed.response;

          return json(
            {
              project: await createProject(context, workspaceId, parsed.value),
            },
            201,
          );
        }

        return methodNotAllowed(["GET", "POST"]);
      }

      if (resource === "projects" && segments.length === 5) {
        const projectId = segments[4];
        if (!projectId) return notFound();

        if (method === "GET") {
          return json({
            project: await getProject(context, workspaceId, projectId),
          });
        }

        if (method === "PATCH") {
          const parsed = await parseBody(request, updateProjectInputSchema);
          if ("response" in parsed) return parsed.response;

          return json({
            project: await updateProject(
              context,
              workspaceId,
              projectId,
              parsed.value,
            ),
          });
        }

        return methodNotAllowed(["GET", "PATCH"]);
      }

      if (
        resource === "projects" &&
        segments.length === 6 &&
        segments[5] === "members"
      ) {
        const projectId = segments[4];
        if (!projectId) return notFound();

        if (method === "GET") {
          return json({
            members: await listProjectMembers(context, workspaceId, projectId),
          });
        }

        if (method === "POST") {
          const parsed = await parseBody(request, projectMemberInputSchema);
          if ("response" in parsed) return parsed.response;

          return json(
            {
              member: await addProjectMember(
                context,
                workspaceId,
                projectId,
                parsed.value,
              ),
            },
            201,
          );
        }

        return methodNotAllowed(["GET", "POST"]);
      }

      if (
        resource === "projects" &&
        segments.length === 7 &&
        segments[5] === "members"
      ) {
        const projectId = segments[4];
        const projectMemberId = segments[6];
        if (!projectId || !projectMemberId) return notFound();
        if (method !== "DELETE") return methodNotAllowed(["DELETE"]);

        await removeProjectMember(
          context,
          workspaceId,
          projectId,
          projectMemberId,
        );
        return json({ status: "project-member-removed" });
      }

      if (resource === "tasks" && segments.length === 4) {
        if (method === "GET") {
          const url = new URL(request.url);
          const status = getQueryStatus(
            url.searchParams.get("status"),
            taskStatusSchema,
          );
          if (status.kind === "response") return status.response;

          return json({
            tasks: await listTasks(context, workspaceId, {
              ...(status.value ? { status: status.value } : {}),
              ...(url.searchParams.has("projectId")
                ? { projectId: url.searchParams.get("projectId") }
                : {}),
              ...(url.searchParams.has("assigneeId")
                ? { assigneeId: url.searchParams.get("assigneeId") }
                : {}),
            }),
          });
        }

        if (method === "POST") {
          const parsed = await parseBody(
            request,
            createWorkspaceTaskInputSchema,
          );
          if ("response" in parsed) return parsed.response;

          return json(
            {
              task: await createTask(context, workspaceId, parsed.value),
            },
            201,
          );
        }

        return methodNotAllowed(["GET", "POST"]);
      }

      if (resource === "tasks" && segments.length === 5) {
        const taskId = segments[4];
        if (!taskId) return notFound();

        if (method === "GET") {
          return json({ task: await getTask(context, workspaceId, taskId) });
        }

        if (method === "PATCH") {
          const parsed = await parseBody(
            request,
            updateWorkspaceTaskInputSchema,
          );
          if ("response" in parsed) return parsed.response;

          return json({
            task: await updateTask(context, workspaceId, taskId, parsed.value),
          });
        }

        if (method === "DELETE") {
          await deleteTask(context, workspaceId, taskId);
          return json({ status: "task-deleted" });
        }

        return methodNotAllowed(["GET", "PATCH", "DELETE"]);
      }

      if (resource === "members" && segments.length === 4) {
        if (method !== "GET") return methodNotAllowed(["GET"]);

        return json({
          members: await listWorkspaceMembers(context, workspaceId),
        });
      }

      if (resource === "members" && segments.length === 5) {
        const memberId = segments[4];
        if (!memberId) return notFound();

        if (method === "PATCH") {
          const parsed = await parseBody(
            request,
            updateWorkspaceMemberRoleInputSchema,
          );
          if ("response" in parsed) return parsed.response;

          return json({
            member: await updateWorkspaceMemberRole(
              context,
              workspaceId,
              memberId,
              parsed.value,
            ),
          });
        }

        if (method === "DELETE") {
          return json({
            member: await removeWorkspaceMember(context, workspaceId, memberId),
          });
        }

        return methodNotAllowed(["PATCH", "DELETE"]);
      }

      if (resource === "invitations" && segments.length === 4) {
        if (method === "GET") {
          const invitations = await listWorkspaceInvitations(
            context,
            workspaceId,
          );

          return json({
            invitations: invitations.map(toInvitationSummary),
          });
        }

        if (method === "POST") {
          if (!options.deliverInvitation) {
            return json(
              {
                error: {
                  code: "INVITATION_DELIVERY_UNAVAILABLE",
                  message: "Workspace invitation delivery is not configured.",
                },
              },
              503,
            );
          }

          const parsed = await parseBody(
            request,
            createWorkspaceInvitationInputSchema,
          );
          if ("response" in parsed) return parsed.response;

          const workspace = await getWorkspace(context, workspaceId);
          const created = await createWorkspaceInvitation(
            context,
            workspaceId,
            parsed.value,
          );

          try {
            await options.deliverInvitation({
              email: created.invitation.email,
              workspaceName: workspace.name,
              invitationUrl: createWorkspaceInvitationUrl(
                invitationBaseUrl.origin,
                created.token,
              ),
            });
          } catch (error) {
            await revokeAfterDeliveryFailure(
              context,
              workspaceId,
              created.invitation.id,
            );
            console.error("Workspace invitation delivery failed:", {
              workspaceId,
              invitationId: created.invitation.id,
              errorName: error instanceof Error ? error.name : "UnknownError",
            });

            return json(
              {
                error: {
                  code: "INVITATION_DELIVERY_FAILED",
                  message: "The invitation could not be delivered.",
                },
              },
              502,
            );
          }

          return json(
            { invitation: toInvitationSummary(created.invitation) },
            201,
          );
        }

        return methodNotAllowed(["GET", "POST"]);
      }

      if (resource === "invitations" && segments.length === 5) {
        if (method !== "DELETE") return methodNotAllowed(["DELETE"]);
        const invitationId = segments[4];
        if (!invitationId) return notFound();

        await revokeWorkspaceInvitation(context, workspaceId, invitationId);

        return json({ revoked: true });
      }

      if (resource === "preferences" && segments.length === 4) {
        if (method === "GET") {
          return json({
            preferences: await getNotificationPreferences(context, workspaceId),
          });
        }

        if (method === "PATCH") {
          const parsed = await parseBody(
            request,
            updateNotificationPreferencesInputSchema,
          );
          if ("response" in parsed) return parsed.response;

          return json({
            preferences: await updateNotificationPreferences(
              context,
              workspaceId,
              parsed.value,
            ),
          });
        }

        return methodNotAllowed(["GET", "PATCH"]);
      }

      if (resource === "activity" && segments.length === 4) {
        if (method !== "GET") return methodNotAllowed(["GET"]);

        const url = new URL(request.url);
        const firstValue = url.searchParams.get("first");
        const first = firstValue === null ? 20 : Number(firstValue);

        if (!Number.isInteger(first) || first < 1 || first > 100) {
          return invalidInput([
            "The activity page size must be from 1 to 100.",
          ]);
        }

        const afterValue = url.searchParams.get("after");
        const after: StorageCursor | undefined = afterValue
          ? { value: afterValue }
          : undefined;

        return json({
          activity: await listWorkspaceActivity(context, workspaceId, {
            first,
            ...(after ? { after } : {}),
          }),
        });
      }

      return notFound();
    } catch (error) {
      return mapError(error);
    }
  };
};

export { createHandler as createWorkspaceApiHandler };
