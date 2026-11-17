import {
  StorageConflictError,
  StorageDuplicateError,
  type StorageBatchOperation,
  type StorageComparison,
} from "@puzzle-ui/storage";

import type { Activity, ProjectMember, WorkspaceMember } from "../models";
import { projectMemberInputSchema, projectMemberSchema } from "../validation";
import { WORKSPACE_COLLECTIONS } from "../workspace.constants";
import {
  WorkspaceAccessError,
  WorkspaceConflictError,
  WorkspaceValidationError,
  requireWorkspaceMembership,
  type WorkspaceServiceContext,
} from "./workspace.service";
import { getProject } from "./project.service";

const eq = <T>(value: T): StorageComparison<T> => ({
  operator: "eq",
  value,
});

const requireProjectManager = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  projectId: string,
) => {
  const member = await requireWorkspaceMembership(context, workspaceId);
  const project = await getProject(context, workspaceId, projectId);

  if (
    member.role !== "owner" &&
    member.role !== "admin" &&
    project.ownerId !== context.userId
  ) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  return project;
};

const createProjectMemberActivity = (
  context: WorkspaceServiceContext,
  workspaceId: string,
  projectId: string,
  action: "project.member_added" | "project.member_removed",
  userId: string,
  now: Date,
): Activity => ({
  id: crypto.randomUUID(),
  workspaceId,
  actorUserId: context.userId,
  action,
  entityType: "project",
  entityId: projectId,
  details: { userId },
  createdAt: now,
  updatedAt: now,
  revision: 0,
});

export const listProjectMembers = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  projectId: string,
): Promise<readonly ProjectMember[]> => {
  await requireWorkspaceMembership(context, workspaceId);
  await getProject(context, workspaceId, projectId);

  return context.storage.findMany<ProjectMember>(
    WORKSPACE_COLLECTIONS.projectMembers,
    {
      where: {
        workspaceId: eq(workspaceId),
        projectId: eq(projectId),
      },
      orderBy: [{ field: "createdAt", direction: "asc" }],
    },
  );
};

export const addProjectMember = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  projectId: string,
  input: unknown,
): Promise<ProjectMember> => {
  await requireProjectManager(context, workspaceId, projectId);
  const parsed = projectMemberInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  const workspaceMember = await context.storage.findOne<WorkspaceMember>(
    WORKSPACE_COLLECTIONS.members,
    {
      where: {
        workspaceId: eq(workspaceId),
        userId: eq(parsed.data.userId),
        status: eq("active"),
      },
    },
  );

  if (!workspaceMember) {
    throw new WorkspaceValidationError([
      "Project members must be active workspace members.",
    ]);
  }

  const now = new Date();
  const projectMember: ProjectMember = {
    id: crypto.randomUUID(),
    workspaceId,
    projectId,
    userId: parsed.data.userId,
    role: parsed.data.role,
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };
  const activity = createProjectMemberActivity(
    context,
    workspaceId,
    projectId,
    "project.member_added",
    projectMember.userId,
    now,
  );
  const operations: StorageBatchOperation<ProjectMember | Activity>[] = [
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.projectMembers,
      record: projectMember,
    },
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.activities,
      record: activity,
    },
  ];

  try {
    await context.storage.atomicBatch(operations);
  } catch (error) {
    if (error instanceof StorageDuplicateError) {
      throw new WorkspaceConflictError(
        "This member already belongs to the project.",
      );
    }

    throw error;
  }

  return projectMemberSchema.parse(projectMember);
};

export const removeProjectMember = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  projectId: string,
  projectMemberId: string,
): Promise<void> => {
  const project = await requireProjectManager(context, workspaceId, projectId);
  const member = await context.storage.findOne<ProjectMember>(
    WORKSPACE_COLLECTIONS.projectMembers,
    {
      where: {
        id: eq(projectMemberId),
        workspaceId: eq(workspaceId),
        projectId: eq(projectId),
      },
    },
  );

  if (!member) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  if (member.userId === project.ownerId) {
    throw new WorkspaceValidationError([
      "The project owner cannot be removed from the project.",
    ]);
  }

  const now = new Date();
  const activity = createProjectMemberActivity(
    context,
    workspaceId,
    projectId,
    "project.member_removed",
    member.userId,
    now,
  );
  const operations: StorageBatchOperation<ProjectMember | Activity>[] = [
    {
      type: "delete",
      collection: WORKSPACE_COLLECTIONS.projectMembers,
      id: member.id,
      condition: { expectedRevision: member.revision },
    },
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.activities,
      record: activity,
    },
  ];

  try {
    const result = await context.storage.atomicBatch(operations);
    const deletion = result.results[0];

    if (deletion?.type !== "delete" || !deletion.deleted) {
      throw new WorkspaceConflictError(
        "Project member removal did not complete.",
      );
    }
  } catch (error) {
    if (error instanceof StorageConflictError) {
      throw new WorkspaceConflictError(
        "Project membership changed before it could be removed.",
      );
    }

    throw error;
  }
};
