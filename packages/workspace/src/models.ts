import type { StorageRecord } from "@puzzle-ui/storage";

export type Workspace = StorageRecord & {
  readonly name: string;
  readonly slug: string;
  readonly description: string | null;
  readonly createdBy: string;
};

export type WorkspaceRole = "owner" | "admin" | "member";
export type WorkspaceMemberStatus = "active" | "suspended";

export type WorkspaceMember = StorageRecord & {
  readonly workspaceId: string;
  readonly userId: string;
  readonly role: WorkspaceRole;
  readonly status: WorkspaceMemberStatus;
  readonly joinedAt: Date;
};

export type InvitationRole = "admin" | "member";

export type WorkspaceInvitation = StorageRecord & {
  readonly workspaceId: string;
  readonly email: string;
  readonly role: InvitationRole;
  readonly tokenHash: string;
  readonly expiresAt: Date;
  readonly acceptedAt: Date | null;
  readonly revokedAt: Date | null;
};

export type ProjectStatus = "active" | "completed" | "archived";

export type Project = StorageRecord & {
  readonly workspaceId: string;
  readonly name: string;
  readonly description: string | null;
  readonly status: ProjectStatus;
  readonly color: string | null;
  readonly startDate: Date | null;
  readonly endDate: Date | null;
  readonly ownerId: string;
};

export type ProjectMember = StorageRecord & {
  readonly workspaceId: string;
  readonly projectId: string;
  readonly userId: string;
  readonly role: "manager" | "member";
};

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type WorkspaceTask = StorageRecord & {
  readonly workspaceId: string;
  readonly projectId: string | null;
  readonly title: string;
  readonly description: string | null;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly assigneeId: string | null;
  readonly dueAt: Date | null;
  readonly createdBy: string;
};

export type ActivityAction =
  | "workspace.created"
  | "workspace.updated"
  | "project.created"
  | "project.updated"
  | "project.archived"
  | "project.member_added"
  | "project.member_removed"
  | "task.created"
  | "task.updated"
  | "task.status_changed"
  | "task.deleted"
  | "member.added"
  | "member.role_changed"
  | "member.removed"
  | "invitation.created"
  | "invitation.sent"
  | "invitation.revoked"
  | "settings.updated";

export type Activity = StorageRecord & {
  readonly workspaceId: string;
  readonly actorUserId: string;
  readonly action: ActivityAction;
  readonly entityType: "workspace" | "project" | "task" | "member" | "settings";
  readonly entityId: string;
  readonly details: Readonly<Record<string, string | number | boolean | null>>;
};

export type NotificationPreferences = StorageRecord & {
  readonly workspaceId: string;
  readonly userId: string;
  readonly emailNotifications: boolean;
  readonly activityNotifications: boolean;
  readonly productUpdates: boolean;
};
