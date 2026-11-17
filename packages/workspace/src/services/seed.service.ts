import type { StorageAdapter, StorageBatchOperation } from "@puzzle-ui/storage";

import type {
  Activity,
  NotificationPreferences,
  Project,
  ProjectMember,
  Workspace,
  WorkspaceMember,
  WorkspaceTask,
} from "../models";
import { WORKSPACE_COLLECTIONS } from "../workspace.constants";

const DEMO_SLUG = "puzzle-workspace-demo";
const DEMO_WORKSPACE_ID = "workspace-demo";

const projects = [
  {
    id: "project-demo-website-refresh",
    name: "Website refresh",
    description: "Refresh the marketing site and improve product discovery.",
    status: "active",
    color: "blue",
  },
  {
    id: "project-demo-customer-onboarding",
    name: "Customer onboarding",
    description: "Make the first-week experience clear and useful.",
    status: "active",
    color: "green",
  },
  {
    id: "project-demo-mobile-launch",
    name: "Mobile launch",
    description: "Prepare the companion mobile experience for release.",
    status: "active",
    color: "violet",
  },
  {
    id: "project-demo-analytics-foundation",
    name: "Analytics foundation",
    description: "Build reliable product analytics and reporting.",
    status: "completed",
    color: "amber",
  },
  {
    id: "project-demo-design-system",
    name: "Design system",
    description: "Document and evolve shared product patterns.",
    status: "active",
    color: "rose",
  },
] as const;

const taskTitles = [
  "Review current navigation",
  "Map the onboarding journey",
  "Draft release notes",
  "Prepare accessibility checks",
  "Update component examples",
  "Confirm project milestones",
  "Review copy with stakeholders",
  "Create responsive layouts",
  "Validate account recovery",
  "Add analytics events",
  "Test invitation acceptance",
  "Document empty states",
  "Improve task filtering",
  "Audit keyboard interactions",
  "Review data retention",
  "Prepare launch checklist",
  "Check dark theme contrast",
  "Update team guide",
  "Verify mobile navigation",
  "Share the project summary",
] as const;

const eq = <T>(value: T) => ({ operator: "eq" as const, value });

const recordFields = (id: string, now: Date) => ({
  id,
  createdAt: now,
  updatedAt: now,
  revision: 0,
});

const createActivity = (
  id: string,
  workspaceId: string,
  actorUserId: string,
  action: Activity["action"],
  entityType: Activity["entityType"],
  entityId: string,
  details: Activity["details"],
  createdAt: Date,
): Activity => ({
  ...recordFields(id, createdAt),
  workspaceId,
  actorUserId,
  action,
  entityType,
  entityId,
  details,
});

export type SeedWorkspaceDemoResult =
  | { readonly status: "created"; readonly workspaceId: string }
  | { readonly status: "already-exists"; readonly workspaceId: string };

export const seedWorkspaceDemo = async (
  storage: StorageAdapter,
  input: {
    readonly ownerUserId: string;
    readonly memberUserIds: readonly string[];
  },
): Promise<SeedWorkspaceDemoResult> => {
  const existing = await storage.findOne<Workspace>(
    WORKSPACE_COLLECTIONS.workspaces,
    { where: { slug: eq(DEMO_SLUG) } },
  );

  if (existing) {
    return { status: "already-exists", workspaceId: existing.id };
  }

  const memberUserIds = [
    input.ownerUserId,
    ...new Set(input.memberUserIds.filter((id) => id !== input.ownerUserId)),
  ];

  if (!input.ownerUserId || memberUserIds.length < 3) {
    throw new Error(
      "The demo seed requires an owner and at least two additional verified users.",
    );
  }

  const now = new Date();
  const workspaceId = DEMO_WORKSPACE_ID;
  const workspace: Workspace = {
    ...recordFields(workspaceId, now),
    name: "Puzzle Workspace Demo",
    slug: DEMO_SLUG,
    description: "A shared workspace for trying projects, tasks, and team workflows.",
    createdBy: input.ownerUserId,
  };
  const members: WorkspaceMember[] = memberUserIds.map((userId, index) => ({
    ...recordFields(`${workspaceId}-member-${userId}`, now),
    workspaceId,
    userId,
    role: index === 0 ? "owner" : index === 1 ? "admin" : "member",
    status: "active",
    joinedAt: now,
  }));
  const seededProjects: Project[] = projects.map((project, index) => {
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - (30 - index * 3));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 45);

    return {
      ...recordFields(project.id, now),
      workspaceId,
      name: project.name,
      description: project.description,
      status: project.status,
      color: project.color,
      startDate,
      endDate,
      ownerId: input.ownerUserId,
    };
  });
  const projectMembers: ProjectMember[] = seededProjects.flatMap((project) =>
    members.map((member, index) => ({
      ...recordFields(`${project.id}-member-${member.userId}`, now),
      workspaceId,
      projectId: project.id,
      userId: member.userId,
      role: index === 0 ? "manager" : "member",
    })),
  );
  const seededTasks: WorkspaceTask[] = taskTitles.map((title, index) => {
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - (index % 12));
    const dueAt = new Date(now);
    dueAt.setDate(dueAt.getDate() + index - 8);

    return {
      ...recordFields(`task-demo-${String(index + 1).padStart(2, "0")}`, createdAt),
      workspaceId,
      projectId: seededProjects[index % seededProjects.length]!.id,
      title,
      description: `Coordinate ${title.toLowerCase()} with the project team.`,
      status: (["todo", "in_progress", "review", "done"] as const)[index % 4]!,
      priority: (["low", "medium", "high", "urgent"] as const)[index % 4]!,
      assigneeId: members[index % members.length]!.userId,
      dueAt,
      createdBy: input.ownerUserId,
    };
  });
  const preferences: NotificationPreferences[] = members.map((member) => ({
    ...recordFields(`${workspaceId}-preferences-${member.userId}`, now),
    workspaceId,
    userId: member.userId,
    emailNotifications: true,
    activityNotifications: true,
    productUpdates: false,
  }));
  const activities: Activity[] = [
    createActivity(
      `${workspaceId}-activity-created`,
      workspaceId,
      input.ownerUserId,
      "workspace.created",
      "workspace",
      workspaceId,
      { slug: DEMO_SLUG, source: "demo-seed" },
      now,
    ),
    ...seededProjects.map((project) =>
      createActivity(
        `${workspaceId}-activity-${project.id}`,
        workspaceId,
        input.ownerUserId,
        "project.created",
        "project",
        project.id,
        { name: project.name },
        now,
      ),
    ),
    ...seededTasks.map((task) =>
      createActivity(
        `${workspaceId}-activity-${task.id}`,
        workspaceId,
        task.createdBy,
        "task.created",
        "task",
        task.id,
        { title: task.title, status: task.status },
        task.createdAt,
      ),
    ),
    ...members.slice(1).map((member) =>
      createActivity(
        `${workspaceId}-activity-${member.userId}`,
        workspaceId,
        input.ownerUserId,
        "member.added",
        "member",
        member.id,
        { role: member.role },
        now,
      ),
    ),
  ];
  const operations: StorageBatchOperation<
    | Workspace
    | WorkspaceMember
    | Project
    | ProjectMember
    | WorkspaceTask
    | NotificationPreferences
    | Activity
  >[] = [
    { type: "insert", collection: WORKSPACE_COLLECTIONS.workspaces, record: workspace },
    ...members.map((record) => ({
      type: "insert" as const,
      collection: WORKSPACE_COLLECTIONS.members,
      record,
    })),
    ...seededProjects.map((record) => ({
      type: "insert" as const,
      collection: WORKSPACE_COLLECTIONS.projects,
      record,
    })),
    ...projectMembers.map((record) => ({
      type: "insert" as const,
      collection: WORKSPACE_COLLECTIONS.projectMembers,
      record,
    })),
    ...seededTasks.map((record) => ({
      type: "insert" as const,
      collection: WORKSPACE_COLLECTIONS.tasks,
      record,
    })),
    ...preferences.map((record) => ({
      type: "insert" as const,
      collection: WORKSPACE_COLLECTIONS.notificationPreferences,
      record,
    })),
    ...activities.map((record) => ({
      type: "insert" as const,
      collection: WORKSPACE_COLLECTIONS.activities,
      record,
    })),
  ];

  await storage.atomicBatch(operations);

  return { status: "created", workspaceId };
};
