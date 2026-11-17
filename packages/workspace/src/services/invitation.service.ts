import {
  StorageConflictError,
  StorageDuplicateError,
  type StorageBatchOperation,
  type StorageComparison,
} from "@puzzle-ui/storage";

import type {
  Activity,
  Workspace,
  WorkspaceInvitation,
  WorkspaceMember,
} from "../models";
import {
  acceptWorkspaceInvitationInputSchema,
  createWorkspaceInvitationInputSchema,
  workspaceInvitationSchema,
  type CreateWorkspaceInvitationInput,
} from "../validation";
import { WORKSPACE_COLLECTIONS } from "../workspace.constants";
import {
  WorkspaceAccessError,
  WorkspaceConflictError,
  WorkspaceValidationError,
  requireWorkspaceMembership,
  requireWorkspaceRole,
  type WorkspaceServiceContext,
} from "./workspace.service";

const INVITATION_LIFETIME_SECONDS = 60 * 60 * 24 * 7;

const eq = <T>(value: T): StorageComparison<T> => ({
  operator: "eq",
  value,
});

const generateInvitationToken = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
};

const hashInvitationToken = async (token: string): Promise<string> => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
};

const parseInvitation = (invitation: unknown): WorkspaceInvitation => {
  const parsed = workspaceInvitationSchema.safeParse(invitation);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  return parsed.data;
};

export type CreatedWorkspaceInvitation = {
  readonly invitation: WorkspaceInvitation;
  readonly token: string;
};

export const createWorkspaceInvitation = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  input: CreateWorkspaceInvitationInput,
): Promise<CreatedWorkspaceInvitation> => {
  await requireWorkspaceRole(context, workspaceId, ["owner", "admin"]);
  const parsed = createWorkspaceInvitationInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  const now = new Date();
  const existing = await context.storage.findOne<WorkspaceInvitation>(
    WORKSPACE_COLLECTIONS.invitations,
    {
      where: {
        workspaceId: eq(workspaceId),
        email: eq(parsed.data.email),
        acceptedAt: eq(null),
        revokedAt: eq(null),
        expiresAt: { operator: "gt", value: now },
      },
    },
  );

  if (existing) {
    throw new WorkspaceConflictError(
      "An active invitation already exists for this email.",
    );
  }

  const token = generateInvitationToken();
  const invitation = parseInvitation({
    id: crypto.randomUUID(),
    workspaceId,
    email: parsed.data.email,
    role: parsed.data.role,
    tokenHash: await hashInvitationToken(token),
    expiresAt: new Date(now.getTime() + INVITATION_LIFETIME_SECONDS * 1000),
    acceptedAt: null,
    revokedAt: null,
    createdAt: now,
    updatedAt: now,
    revision: 0,
  });
  const activity: Activity = {
    id: crypto.randomUUID(),
    workspaceId,
    actorUserId: context.userId,
    action: "invitation.created",
    entityType: "member",
    entityId: invitation.id,
    details: { email: invitation.email, role: invitation.role },
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };
  const operations: StorageBatchOperation<WorkspaceInvitation | Activity>[] = [
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.invitations,
      record: invitation,
    },
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.activities,
      record: activity,
    },
  ];

  await context.storage.atomicBatch(operations);

  return { invitation, token };
};

export const listWorkspaceMembers = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
): Promise<readonly WorkspaceMember[]> => {
  await requireWorkspaceMembership(context, workspaceId);

  return context.storage.findMany<WorkspaceMember>(
    WORKSPACE_COLLECTIONS.members,
    {
      where: {
        workspaceId: eq(workspaceId),
        status: eq("active"),
      },
      orderBy: [{ field: "joinedAt", direction: "asc" }],
    },
  );
};

export const listWorkspaceInvitations = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
): Promise<readonly WorkspaceInvitation[]> => {
  await requireWorkspaceRole(context, workspaceId, ["owner", "admin"]);

  return context.storage.findMany<WorkspaceInvitation>(
    WORKSPACE_COLLECTIONS.invitations,
    {
      where: { workspaceId: eq(workspaceId) },
      orderBy: [{ field: "createdAt", direction: "desc" }],
    },
  );
};

export const acceptWorkspaceInvitation = async (
  context: WorkspaceServiceContext,
  token: string,
  verifiedEmail: string,
): Promise<WorkspaceMember> => {
  if (!context.userId) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  const parsedInput = acceptWorkspaceInvitationInputSchema.safeParse({
    token,
    verifiedEmail,
  });

  if (!parsedInput.success) {
    throw new WorkspaceValidationError(
      parsedInput.error.issues.map((issue) => issue.message),
    );
  }

  const invitation = await context.storage.findOne<WorkspaceInvitation>(
    WORKSPACE_COLLECTIONS.invitations,
    {
      where: {
        tokenHash: eq(await hashInvitationToken(parsedInput.data.token)),
      },
    },
  );

  if (
    !invitation ||
    invitation.email !== parsedInput.data.verifiedEmail ||
    invitation.acceptedAt ||
    invitation.revokedAt ||
    invitation.expiresAt.getTime() <= Date.now()
  ) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  const workspace = await context.storage.findById<Workspace>(
    WORKSPACE_COLLECTIONS.workspaces,
    invitation.workspaceId,
  );

  if (!workspace) {
    throw new WorkspaceAccessError("WORKSPACE_NOT_FOUND");
  }

  const now = new Date();
  const member: WorkspaceMember = {
    id: crypto.randomUUID(),
    workspaceId: invitation.workspaceId,
    userId: context.userId,
    role: invitation.role,
    status: "active",
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };
  const activity: Activity = {
    id: crypto.randomUUID(),
    workspaceId: invitation.workspaceId,
    actorUserId: context.userId,
    action: "member.added",
    entityType: "member",
    entityId: member.id,
    details: { role: member.role },
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };
  const operations: StorageBatchOperation<
    WorkspaceInvitation | WorkspaceMember | Activity
  >[] = [
    {
      type: "update",
      collection: WORKSPACE_COLLECTIONS.invitations,
      id: invitation.id,
      condition: { expectedRevision: invitation.revision },
      changes: { acceptedAt: now, updatedAt: now },
    },
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.members,
      record: member,
    },
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.activities,
      record: activity,
    },
  ];

  try {
    const result = await context.storage.atomicBatch(operations);
    const updateResult = result.results[0];

    if (updateResult?.type !== "update" || !updateResult.record) {
      throw new WorkspaceConflictError("Invitation acceptance did not complete.");
    }

    return member;
  } catch (error) {
    if (
      error instanceof StorageConflictError ||
      error instanceof StorageDuplicateError
    ) {
      throw new WorkspaceConflictError(
        "Invitation is no longer available for acceptance.",
      );
    }

    throw error;
  }
};

export const revokeWorkspaceInvitation = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  invitationId: string,
): Promise<void> => {
  await requireWorkspaceRole(context, workspaceId, ["owner", "admin"]);
  const invitation = await context.storage.findOne<WorkspaceInvitation>(
    WORKSPACE_COLLECTIONS.invitations,
    {
      where: {
        id: eq(invitationId),
        workspaceId: eq(workspaceId),
      },
    },
  );

  if (!invitation || invitation.acceptedAt || invitation.revokedAt) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  const now = new Date();
  const activity: Activity = {
    id: crypto.randomUUID(),
    workspaceId,
    actorUserId: context.userId,
    action: "invitation.revoked",
    entityType: "member",
    entityId: invitation.id,
    details: { invitationRevoked: true },
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };
  const operations: StorageBatchOperation<WorkspaceInvitation | Activity>[] = [
    {
      type: "update",
      collection: WORKSPACE_COLLECTIONS.invitations,
      id: invitation.id,
      condition: { expectedRevision: invitation.revision },
      changes: { revokedAt: now, updatedAt: now },
    },
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.activities,
      record: activity,
    },
  ];

  try {
    const result = await context.storage.atomicBatch(operations);
    const updateResult = result.results[0];

    if (updateResult?.type !== "update" || !updateResult.record) {
      throw new WorkspaceConflictError("Invitation revocation did not complete.");
    }
  } catch (error) {
    if (error instanceof StorageConflictError) {
      throw new WorkspaceConflictError(
        "Invitation changed before it could be revoked.",
      );
    }

    throw error;
  }
};
