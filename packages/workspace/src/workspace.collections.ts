import type {
  StorageAdapter,
  StorageCollection,
} from "@puzzle-ui/storage";

import type {
  Activity,
  NotificationPreferences,
  Project,
  ProjectMember,
  Workspace,
  WorkspaceInvitation,
  WorkspaceMember,
  WorkspaceTask,
} from "./models";

import {
  activitySchema,
  notificationPreferencesSchema,
  projectMemberSchema,
  projectSchema,
  workspaceInvitationSchema,
  workspaceMemberSchema,
  workspaceSchema,
  workspaceTaskSchema,
} from "./validation";
import { WORKSPACE_COLLECTIONS } from "./workspace.constants";

const isValid =
  <T>(schema: { safeParse: (value: unknown) => { success: boolean } }) =>
  (value: unknown): value is T =>
    schema.safeParse(value).success;

export const workspaceCollection: StorageCollection<Workspace> = {
  name: WORKSPACE_COLLECTIONS.workspaces,
  schema: { validate: isValid<Workspace>(workspaceSchema) },
  indexes: [
    { name: "workspace_slug_unique", fields: ["slug"], unique: true },
  ],
};

export const workspaceMemberCollection: StorageCollection<WorkspaceMember> = {
  name: WORKSPACE_COLLECTIONS.members,
  schema: { validate: isValid<WorkspaceMember>(workspaceMemberSchema) },
  indexes: [
    {
      name: "workspace_member_unique",
      fields: ["workspaceId", "userId"],
      unique: true,
    },
    { name: "member_user_status", fields: ["userId", "status"] },
  ],
};

export const workspaceInvitationCollection: StorageCollection<WorkspaceInvitation> =
  {
    name: WORKSPACE_COLLECTIONS.invitations,
    schema: {
      validate: isValid<WorkspaceInvitation>(workspaceInvitationSchema),
    },
    indexes: [
      { name: "invitation_token_hash_unique", fields: ["tokenHash"], unique: true },
      { name: "invitation_workspace_email", fields: ["workspaceId", "email"] },
      { name: "invitation_expiration", fields: ["expiresAt"] },
    ],
  };

export const projectCollection: StorageCollection<Project> = {
  name: WORKSPACE_COLLECTIONS.projects,
  schema: { validate: isValid<Project>(projectSchema) },
  indexes: [
    { name: "project_workspace_status", fields: ["workspaceId", "status"] },
    { name: "project_owner", fields: ["ownerId"] },
  ],
};

export const projectMemberCollection: StorageCollection<ProjectMember> = {
  name: WORKSPACE_COLLECTIONS.projectMembers,
  schema: { validate: isValid<ProjectMember>(projectMemberSchema) },
  indexes: [
    {
      name: "project_member_unique",
      fields: ["workspaceId", "projectId", "userId"],
      unique: true,
    },
  ],
};

export const workspaceTaskCollection: StorageCollection<WorkspaceTask> = {
  name: WORKSPACE_COLLECTIONS.tasks,
  schema: { validate: isValid<WorkspaceTask>(workspaceTaskSchema) },
  indexes: [
    { name: "task_workspace_status", fields: ["workspaceId", "status"] },
    { name: "task_project", fields: ["workspaceId", "projectId"] },
    { name: "task_assignee_due", fields: ["assigneeId", "dueAt"] },
  ],
};

export const activityCollection: StorageCollection<Activity> = {
  name: WORKSPACE_COLLECTIONS.activities,
  schema: { validate: isValid<Activity>(activitySchema) },
  indexes: [
    { name: "activity_workspace_created", fields: ["workspaceId", "createdAt"] },
  ],
};

export const notificationPreferencesCollection: StorageCollection<NotificationPreferences> =
  {
    name: WORKSPACE_COLLECTIONS.notificationPreferences,
    schema: {
      validate: isValid<NotificationPreferences>(
        notificationPreferencesSchema,
      ),
    },
    indexes: [
      {
        name: "notification_preferences_user_unique",
        fields: ["workspaceId", "userId"],
        unique: true,
      },
    ],
  };

export const initializeWorkspaceStorage = async (
  storage: StorageAdapter,
): Promise<void> => {
  if (
    !storage.capabilities.uniqueConstraints ||
    !storage.capabilities.atomicBatch
  ) {
    throw new Error(
      "Workspace storage requires unique constraints and atomic batches.",
    );
  }

  await storage.registerCollection(workspaceCollection);
  await storage.registerCollection(workspaceMemberCollection);
  await storage.registerCollection(workspaceInvitationCollection);
  await storage.registerCollection(projectCollection);
  await storage.registerCollection(projectMemberCollection);
  await storage.registerCollection(workspaceTaskCollection);
  await storage.registerCollection(activityCollection);
  await storage.registerCollection(notificationPreferencesCollection);
};
