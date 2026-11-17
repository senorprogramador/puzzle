import type {
  StorageAdapter,
  StorageBatchOperation,
  StorageComparison,
} from "@puzzle-ui/storage";
import { StorageConflictError } from "@puzzle-ui/storage";

import type {
  Activity,
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from "../models";
import {
  createWorkspaceInputSchema,
  updateWorkspaceInputSchema,
  workspaceSchema,
  type CreateWorkspaceInput,
  type UpdateWorkspaceInput,
} from "../validation";
import { WORKSPACE_COLLECTIONS } from "../workspace.constants";

export type WorkspaceServiceContext = {
  readonly storage: StorageAdapter;
  readonly userId: string;
};

export class WorkspaceAccessError extends Error {
  readonly code: "WORKSPACE_FORBIDDEN" | "WORKSPACE_NOT_FOUND";

  constructor(code: WorkspaceAccessError["code"]) {
    super(
      code === "WORKSPACE_FORBIDDEN"
        ? "You do not have access to this workspace."
        : "Workspace not found.",
    );
    this.name = "WorkspaceAccessError";
    this.code = code;
  }
}

export class WorkspaceValidationError extends Error {
  readonly issues: readonly string[];

  constructor(issues: readonly string[]) {
    super("Workspace input is invalid.");
    this.name = "WorkspaceValidationError";
    this.issues = issues;
  }
}

export class WorkspaceConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkspaceConflictError";
  }
}

const eq = <T>(value: T): StorageComparison<T> => ({
  operator: "eq",
  value,
});

export const requireWorkspaceMembership = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
): Promise<WorkspaceMember> => {
  if (!context.userId) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  const member = await context.storage.findOne<WorkspaceMember>(
    WORKSPACE_COLLECTIONS.members,
    {
      where: {
        workspaceId: eq(workspaceId),
        userId: eq(context.userId),
        status: eq("active"),
      },
    },
  );

  if (!member) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  return member;
};

export const requireWorkspaceRole = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  roles: readonly WorkspaceRole[],
): Promise<WorkspaceMember> => {
  const member = await requireWorkspaceMembership(context, workspaceId);

  if (!roles.includes(member.role)) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  return member;
};

export const listWorkspacesForUser = async (
  context: WorkspaceServiceContext,
): Promise<readonly Workspace[]> => {
  if (!context.userId) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  const memberships = await context.storage.findMany<WorkspaceMember>(
    WORKSPACE_COLLECTIONS.members,
    {
      where: {
        userId: eq(context.userId),
        status: eq("active"),
      },
    },
  );

  if (memberships.length === 0) {
    return [];
  }

  return context.storage.findMany<Workspace>(WORKSPACE_COLLECTIONS.workspaces, {
    where: {
      id: { operator: "in", value: memberships.map(({ workspaceId }) => workspaceId) },
    },
    orderBy: [{ field: "name", direction: "asc" }],
  });
};

export const getWorkspace = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
): Promise<Workspace> => {
  await requireWorkspaceMembership(context, workspaceId);
  const workspace = await context.storage.findById<Workspace>(
    WORKSPACE_COLLECTIONS.workspaces,
    workspaceId,
  );

  if (!workspace) {
    throw new WorkspaceAccessError("WORKSPACE_NOT_FOUND");
  }

  return workspace;
};

export const createWorkspace = async (
  context: WorkspaceServiceContext,
  input: CreateWorkspaceInput,
): Promise<Workspace> => {
  if (!context.userId) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  const parsed = createWorkspaceInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  const now = new Date();
  const workspace: Workspace = {
    id: crypto.randomUUID(),
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description ?? null,
    createdBy: context.userId,
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };
  const owner: WorkspaceMember = {
    id: crypto.randomUUID(),
    workspaceId: workspace.id,
    userId: context.userId,
    role: "owner",
    status: "active",
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };
  const activity: Activity = {
    id: crypto.randomUUID(),
    workspaceId: workspace.id,
    actorUserId: context.userId,
    action: "workspace.created",
    entityType: "workspace",
    entityId: workspace.id,
    details: { slug: workspace.slug },
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };

  const operations: StorageBatchOperation<
    Workspace | WorkspaceMember | Activity
  >[] = [
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.workspaces,
      record: workspace,
    },
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.members,
      record: owner,
    },
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.activities,
      record: activity,
    },
  ];

  await context.storage.atomicBatch(operations);

  return workspace;
};

export const updateWorkspace = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  input: UpdateWorkspaceInput,
): Promise<Workspace> => {
  await requireWorkspaceRole(context, workspaceId, ["owner", "admin"]);
  const workspace = await context.storage.findById<Workspace>(
    WORKSPACE_COLLECTIONS.workspaces,
    workspaceId,
  );

  if (!workspace) {
    throw new WorkspaceAccessError("WORKSPACE_NOT_FOUND");
  }

  const parsed = updateWorkspaceInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  const now = new Date();
  const updated = workspaceSchema.safeParse({
    ...workspace,
    ...parsed.data,
    updatedAt: now,
  });

  if (!updated.success) {
    throw new WorkspaceValidationError(
      updated.error.issues.map((issue) => issue.message),
    );
  }

  const activity: Activity = {
    id: crypto.randomUUID(),
    workspaceId,
    actorUserId: context.userId,
    action: "workspace.updated",
    entityType: "workspace",
    entityId: workspace.id,
    details: { fields: Object.keys(parsed.data).join(",") },
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };
  const operations: StorageBatchOperation<Workspace | Activity>[] = [
    {
      type: "update",
      collection: WORKSPACE_COLLECTIONS.workspaces,
      id: workspace.id,
      condition: { expectedRevision: workspace.revision },
      changes: { ...parsed.data, updatedAt: now },
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
      throw new WorkspaceConflictError("Workspace update did not complete.");
    }

    const saved = workspaceSchema.safeParse(updateResult.record);

    if (!saved.success) {
      throw new WorkspaceValidationError(
        saved.error.issues.map((issue) => issue.message),
      );
    }

    return saved.data;
  } catch (error) {
    if (error instanceof StorageConflictError) {
      throw new WorkspaceConflictError(
        "Workspace changed before the update could be saved.",
      );
    }

    throw error;
  }
};
