import {
  StorageConflictError,
  type StorageBatchOperation,
  type StorageComparison,
} from "@puzzle-ui/storage";

import type { Activity, Project, WorkspaceMember, WorkspaceTask } from "../models";
import {
  createWorkspaceTaskInputSchema,
  updateWorkspaceTaskInputSchema,
  workspaceTaskSchema,
  type CreateWorkspaceTaskInput,
  type UpdateWorkspaceTaskInput,
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

const parseTask = (task: unknown): WorkspaceTask => {
  const parsed = workspaceTaskSchema.safeParse(task);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  return parsed.data;
};

const validateTaskRelations = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  projectId: string | null,
  assigneeId: string | null,
): Promise<void> => {
  if (projectId) {
    const project = await context.storage.findOne<Project>(
      WORKSPACE_COLLECTIONS.projects,
      {
        where: {
          id: eq(projectId),
          workspaceId: eq(workspaceId),
        },
      },
    );

    if (!project || project.status === "archived") {
      throw new WorkspaceValidationError([
        "Tasks must belong to an active project in this workspace.",
      ]);
    }
  }

  if (assigneeId) {
    const assignee = await context.storage.findOne<WorkspaceMember>(
      WORKSPACE_COLLECTIONS.members,
      {
        where: {
          workspaceId: eq(workspaceId),
          userId: eq(assigneeId),
          status: eq("active"),
        },
      },
    );

    if (!assignee) {
      throw new WorkspaceValidationError([
        "Task assignee must be an active workspace member.",
      ]);
    }
  }
};

const createActivity = (
  context: WorkspaceServiceContext,
  workspaceId: string,
  taskId: string,
  action:
    | "task.created"
    | "task.updated"
    | "task.status_changed"
    | "task.deleted",
  now: Date,
): Activity => ({
  id: crypto.randomUUID(),
  workspaceId,
  actorUserId: context.userId,
  action,
  entityType: "task",
  entityId: taskId,
  details: {},
  createdAt: now,
  updatedAt: now,
  revision: 0,
});

export const createTask = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  input: CreateWorkspaceTaskInput,
): Promise<WorkspaceTask> => {
  await requireWorkspaceMembership(context, workspaceId);
  const parsed = createWorkspaceTaskInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  const projectId = parsed.data.projectId ?? null;
  const assigneeId = parsed.data.assigneeId ?? null;
  await validateTaskRelations(context, workspaceId, projectId, assigneeId);

  const now = new Date();
  const task = parseTask({
    id: crypto.randomUUID(),
    workspaceId,
    projectId,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    status: parsed.data.status ?? "todo",
    priority: parsed.data.priority ?? "medium",
    assigneeId,
    dueAt: parsed.data.dueAt ?? null,
    createdBy: context.userId,
    createdAt: now,
    updatedAt: now,
    revision: 0,
  });
  const activity = {
    ...createActivity(context, workspaceId, task.id, "task.created", now),
    details: { title: task.title, status: task.status },
  };

  const operations: StorageBatchOperation<WorkspaceTask | Activity>[] = [
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.tasks,
      record: task,
    },
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.activities,
      record: activity,
    },
  ];

  await context.storage.atomicBatch(operations);

  return task;
};

export const listTasks = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  filters: {
    readonly projectId?: string | null;
    readonly status?: WorkspaceTask["status"];
    readonly assigneeId?: string | null;
  } = {},
): Promise<readonly WorkspaceTask[]> => {
  await requireWorkspaceMembership(context, workspaceId);

  return context.storage.findMany<WorkspaceTask>(WORKSPACE_COLLECTIONS.tasks, {
    where: {
      workspaceId: eq(workspaceId),
      ...(filters.projectId !== undefined
        ? { projectId: eq(filters.projectId) }
        : {}),
      ...(filters.status ? { status: eq(filters.status) } : {}),
      ...(filters.assigneeId !== undefined
        ? { assigneeId: eq(filters.assigneeId) }
        : {}),
    },
    orderBy: [{ field: "updatedAt", direction: "desc" }],
  });
};

export const getTask = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  taskId: string,
): Promise<WorkspaceTask> => {
  await requireWorkspaceMembership(context, workspaceId);
  const task = await context.storage.findOne<WorkspaceTask>(
    WORKSPACE_COLLECTIONS.tasks,
    {
      where: {
        id: eq(taskId),
        workspaceId: eq(workspaceId),
      },
    },
  );

  if (!task) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  return task;
};

export const updateTask = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  taskId: string,
  input: UpdateWorkspaceTaskInput,
): Promise<WorkspaceTask> => {
  await requireWorkspaceMembership(context, workspaceId);
  const task = await getTask(context, workspaceId, taskId);
  const parsed = updateWorkspaceTaskInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  const projectId =
    parsed.data.projectId === undefined ? task.projectId : parsed.data.projectId;
  const assigneeId =
    parsed.data.assigneeId === undefined
      ? task.assigneeId
      : parsed.data.assigneeId;
  await validateTaskRelations(context, workspaceId, projectId, assigneeId);

  const now = new Date();
  const updated = parseTask({
    ...task,
    ...parsed.data,
    updatedAt: now,
  });
  const action =
    task.status !== updated.status ? "task.status_changed" : "task.updated";
  const activity = {
    ...createActivity(context, workspaceId, task.id, action, now),
    details: { status: updated.status },
  };

  const operations: StorageBatchOperation<WorkspaceTask | Activity>[] = [
    {
      type: "update",
      collection: WORKSPACE_COLLECTIONS.tasks,
      id: task.id,
      condition: { expectedRevision: task.revision },
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
      throw new WorkspaceConflictError("Task update did not complete.");
    }

    return parseTask(updateResult.record);
  } catch (error) {
    if (error instanceof StorageConflictError) {
      throw new WorkspaceConflictError(
        "Task changed before the update could be saved.",
      );
    }

    throw error;
  }
};

export const deleteTask = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  taskId: string,
): Promise<void> => {
  const member = await requireWorkspaceMembership(context, workspaceId);
  const task = await getTask(context, workspaceId, taskId);

  if (
    member.role !== "owner" &&
    member.role !== "admin" &&
    task.createdBy !== context.userId
  ) {
    throw new WorkspaceAccessError("WORKSPACE_FORBIDDEN");
  }

  const now = new Date();
  const activity = createActivity(
    context,
    workspaceId,
    task.id,
    "task.deleted",
    now,
  );
  const operations: StorageBatchOperation<WorkspaceTask | Activity>[] = [
    {
      type: "delete",
      collection: WORKSPACE_COLLECTIONS.tasks,
      id: task.id,
      condition: { expectedRevision: task.revision },
    },
    {
      type: "insert",
      collection: WORKSPACE_COLLECTIONS.activities,
      record: {
        ...activity,
        details: { title: task.title },
      },
    },
  ];

  try {
    const result = await context.storage.atomicBatch(operations);

    if (result.results[0]?.type !== "delete" || !result.results[0].deleted) {
      throw new WorkspaceConflictError("Task delete did not complete.");
    }
  } catch (error) {
    if (error instanceof StorageConflictError) {
      throw new WorkspaceConflictError(
        "Task changed before it could be deleted.",
      );
    }

    throw error;
  }
};
