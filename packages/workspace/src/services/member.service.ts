import {
  StorageConflictError,
  type StorageBatchOperation,
  type StorageComparison,
} from "@puzzle-ui/storage";

import type { Activity, WorkspaceMember } from "../models";
import {
  updateWorkspaceMemberRoleInputSchema,
  workspaceMemberSchema,
  type UpdateWorkspaceMemberRoleInput,
} from "../validation";
import { WORKSPACE_COLLECTIONS } from "../workspace.constants";
import {
  WorkspaceAccessError,
  WorkspaceConflictError,
  WorkspaceValidationError,
  requireWorkspaceMembership,
  type WorkspaceServiceContext,
} from "./workspace.service";

const eq = <T>(value: T): StorageComparison<T> => ({
  operator: "eq",
  value,
});

const findWorkspaceMember = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  memberId: string,
): Promise<WorkspaceMember> => {
  const member = await context.storage.findOne<WorkspaceMember>(
    WORKSPACE_COLLECTIONS.members,
    {
      where: {
        id: eq(memberId),
        workspaceId: eq(workspaceId),
      },
    },
  );

  if (!member || member.status !== "active") {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  return member;
};

const saveMemberChange = async (
  context: WorkspaceServiceContext,
  member: WorkspaceMember,
  changes: Partial<Pick<WorkspaceMember, "role" | "status">>,
  action: "member.role_changed" | "member.removed",
  details: Activity["details"],
): Promise<WorkspaceMember> => {
  const now = new Date();
  const parsed = workspaceMemberSchema.safeParse({
    ...member,
    ...changes,
    updatedAt: now,
  });

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  const activity: Activity = {
    id: crypto.randomUUID(),
    workspaceId: member.workspaceId,
    actorUserId: context.userId,
    action,
    entityType: "member",
    entityId: member.id,
    details,
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };
  const operations: StorageBatchOperation<WorkspaceMember | Activity>[] = [
    {
      type: "update",
      collection: WORKSPACE_COLLECTIONS.members,
      id: member.id,
      condition: { expectedRevision: member.revision },
      changes: { ...changes, updatedAt: now },
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
      throw new WorkspaceConflictError("Workspace member update did not complete.");
    }

    const updated = workspaceMemberSchema.safeParse(updateResult.record);

    if (!updated.success) {
      throw new WorkspaceValidationError(
        updated.error.issues.map((issue) => issue.message),
      );
    }

    return updated.data;
  } catch (error) {
    if (error instanceof StorageConflictError) {
      throw new WorkspaceConflictError(
        "Workspace member changed before the update could be saved.",
      );
    }

    throw error;
  }
};

export const updateWorkspaceMemberRole = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  memberId: string,
  input: UpdateWorkspaceMemberRoleInput,
): Promise<WorkspaceMember> => {
  const actor = await requireWorkspaceMembership(context, workspaceId);
  const parsed = updateWorkspaceMemberRoleInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  const member = await findWorkspaceMember(context, workspaceId, memberId);

  if (
    (actor.role !== "owner" && actor.role !== "admin") ||
    member.role === "owner" ||
    (actor.role === "admin" && member.role !== "member")
  ) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  if (member.role === parsed.data.role) {
    throw new WorkspaceValidationError(["Member already has that role."]);
  }

  return saveMemberChange(
    context,
    member,
    { role: parsed.data.role },
    "member.role_changed",
    { role: parsed.data.role },
  );
};

export const removeWorkspaceMember = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  memberId: string,
): Promise<WorkspaceMember> => {
  const actor = await requireWorkspaceMembership(context, workspaceId);
  const member = await findWorkspaceMember(context, workspaceId, memberId);
  const isSelf = member.userId === context.userId;
  const canRemoveOther =
    actor.role === "owner" ||
    (actor.role === "admin" && member.role === "member");

  if (
    member.role === "owner" ||
    (!isSelf && !canRemoveOther)
  ) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  return saveMemberChange(
    context,
    member,
    { status: "suspended" },
    "member.removed",
    { selfRemoval: isSelf },
  );
};
