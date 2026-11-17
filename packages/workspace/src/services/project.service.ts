import {
  StorageConflictError,
  type StorageBatchOperation,
  type StorageComparison,
} from "@puzzle-ui/storage";

import type {
  Activity,
  Project,
  ProjectMember,
  ProjectStatus,
} from "../models";
import {
  createProjectInputSchema,
  projectSchema,
  updateProjectInputSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
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

const createActivity = (
  context: WorkspaceServiceContext,
  workspaceId: string,
  projectId: string,
  action: "project.created" | "project.updated" | "project.archived",
  now: Date,
): Activity => ({
  id: crypto.randomUUID(),
  workspaceId,
  actorUserId: context.userId,
  action,
  entityType: "project",
  entityId: projectId,
  details: {},
  createdAt: now,
  updatedAt: now,
  revision: 0,
});

const parseProject = (project: unknown): Project => {
  const parsed = projectSchema.safeParse(project);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  return parsed.data;
};

export const createProject = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  input: CreateProjectInput,
): Promise<Project> => {
  const member = await requireWorkspaceMembership(context, workspaceId);
  const parsed = createProjectInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  const now = new Date();
  const project = parseProject({
    id: crypto.randomUUID(),
    workspaceId,
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    status: "active",
    color: parsed.data.color ?? null,
    startDate: parsed.data.startDate ?? null,
    endDate: parsed.data.endDate ?? null,
    ownerId: context.userId,
    createdAt: now,
    updatedAt: now,
    revision: 0,
  });
  const activity = {
    ...createActivity(context, workspaceId, project.id, "project.created", now),
    details: { name: project.name, creatorRole: member.role },
  };
  const projectMember: ProjectMember = {
    id: crypto.randomUUID(),
    workspaceId,
    projectId: project.id,
    userId: context.userId,
    role: "manager",
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };

  const operations: StorageBatchOperation<
    Project | ProjectMember | Activity
  >[] = [
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.projects,
      record: project,
    },
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

  await context.storage.atomicBatch(operations);

  return project;
};

export const listProjects = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  status?: ProjectStatus,
): Promise<readonly Project[]> => {
  await requireWorkspaceMembership(context, workspaceId);

  return context.storage.findMany<Project>(WORKSPACE_COLLECTIONS.projects, {
    where: {
      workspaceId: eq(workspaceId),
      ...(status ? { status: eq(status) } : {}),
    },
    orderBy: [{ field: "updatedAt", direction: "desc" }],
  });
};

export const getProject = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  projectId: string,
): Promise<Project> => {
  await requireWorkspaceMembership(context, workspaceId);
  const project = await context.storage.findOne<Project>(
    WORKSPACE_COLLECTIONS.projects,
    {
      where: {
        id: eq(projectId),
        workspaceId: eq(workspaceId),
      },
    },
  );

  if (!project) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  return project;
};

export const updateProject = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  projectId: string,
  input: UpdateProjectInput,
): Promise<Project> => {
  await requireWorkspaceMembership(context, workspaceId);
  const project = await getProject(context, workspaceId, projectId);
  const parsed = updateProjectInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  const now = new Date();
  const updated = parseProject({
    ...project,
    ...parsed.data,
    updatedAt: now,
  });
  const action =
    project.status !== "archived" && updated.status === "archived"
      ? "project.archived"
      : "project.updated";
  const activity = {
    ...createActivity(context, workspaceId, project.id, action, now),
    details: { status: updated.status },
  };

  const operations: StorageBatchOperation<Project | Activity>[] = [
    {
      type: "update",
      collection: WORKSPACE_COLLECTIONS.projects,
      id: project.id,
      condition: { expectedRevision: project.revision },
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
      throw new WorkspaceConflictError("Project update did not complete.");
    }

    return parseProject(updateResult.record);
  } catch (error) {
    if (error instanceof StorageConflictError) {
      throw new WorkspaceConflictError(
        "Project changed before the update could be saved.",
      );
    }

    throw error;
  }
};
