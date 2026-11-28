import * as z from "zod/v4";

const storageRecordSchema = {
  id: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  revision: z.number().int().nonnegative(),
  revokedAt: z.date().nullable().optional(),
};

const nullableDateInputSchema = z
  .union([
    z.date(),
    z.iso.datetime().transform((value) => new Date(value)),
    z.iso.date().transform((value) => new Date(`${value}T00:00:00.000Z`)),
  ])
  .nullable();

export const workspaceRoleSchema = z.enum(["owner", "admin", "member"]);
export const taskStatusSchema = z.enum([
  "todo",
  "in_progress",
  "review",
  "done",
]);
export const taskPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);
export const projectStatusSchema = z.enum(["active", "completed", "archived"]);

export const workspaceSchema = z.object({
  ...storageRecordSchema,
  name: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(63)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(2000).nullable(),
  createdBy: z.string().min(1),
});

export const projectMemberInputSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["manager", "member"]),
});

export const updateWorkspaceMemberRoleInputSchema = z.object({
  role: z.enum(["admin", "member"]),
});

export const workspaceMemberSchema = z.object({
  ...storageRecordSchema,
  workspaceId: z.string().min(1),
  userId: z.string().min(1),
  role: workspaceRoleSchema,
  status: z.enum(["active", "suspended"]),
  joinedAt: z.date(),
});

export const workspaceInvitationSchema = z.object({
  ...storageRecordSchema,
  workspaceId: z.string().min(1),
  email: z.email(),
  role: z.enum(["admin", "member"]),
  tokenHash: z.string().min(1),
  expiresAt: z.date(),
  acceptedAt: z.date().nullable(),
  revokedAt: z.date().nullable(),
});

export const projectSchema = z.object({
  ...storageRecordSchema,
  workspaceId: z.string().min(1),
  name: z.string().trim().min(1).max(160),
  description: z.string().max(4000).nullable(),
  status: z.enum(["active", "completed", "archived"]),
  color: z.string().max(32).nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  ownerId: z.string().min(1),
});

export const projectMemberSchema = z.object({
  ...storageRecordSchema,
  workspaceId: z.string().min(1),
  projectId: z.string().min(1),
  userId: z.string().min(1),
  role: z.enum(["manager", "member"]),
});

export const workspaceTaskSchema = z.object({
  ...storageRecordSchema,
  workspaceId: z.string().min(1),
  projectId: z.string().min(1).nullable(),
  title: z.string().trim().min(1).max(200),
  description: z.string().max(4000).nullable(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  assigneeId: z.string().min(1).nullable(),
  dueAt: z.date().nullable(),
  createdBy: z.string().min(1),
});

export const activitySchema = z.object({
  ...storageRecordSchema,
  workspaceId: z.string().min(1),
  actorUserId: z.string().min(1),
  action: z.enum([
    "workspace.created",
    "workspace.updated",
    "project.created",
    "project.updated",
    "project.archived",
    "project.member_added",
    "project.member_removed",
    "task.created",
    "task.updated",
    "task.status_changed",
    "task.deleted",
    "member.added",
    "member.role_changed",
    "member.removed",
    "invitation.created",
    "invitation.sent",
    "invitation.revoked",
    "settings.updated",
  ]),
  entityType: z.enum(["workspace", "project", "task", "member", "settings"]),
  entityId: z.string().min(1),
  details: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
  ),
});

export const notificationPreferencesSchema = z.object({
  ...storageRecordSchema,
  workspaceId: z.string().min(1),
  userId: z.string().min(1),
  emailNotifications: z.boolean(),
  activityNotifications: z.boolean(),
  productUpdates: z.boolean(),
});

export const createWorkspaceInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(63)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(2000).optional(),
});

export const updateWorkspaceInputSchema = createWorkspaceInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one workspace field must be provided.",
  });

export const createProjectInputSchema = z
  .object({
    name: z.string().trim().min(1).max(160),
    description: z.string().trim().max(4000).nullable().optional(),
    color: z.string().trim().max(32).nullable().optional(),
    startDate: nullableDateInputSchema.optional(),
    endDate: nullableDateInputSchema.optional(),
  })
  .refine(
    ({ startDate, endDate }) =>
      !startDate || !endDate || endDate.getTime() >= startDate.getTime(),
    { message: "Project end date cannot be before its start date." },
  );

export const updateProjectInputSchema = z
  .object({
    name: z.string().trim().min(1).max(160).optional(),
    description: z.string().trim().max(4000).nullable().optional(),
    status: projectStatusSchema.optional(),
    color: z.string().trim().max(32).nullable().optional(),
    startDate: nullableDateInputSchema.optional(),
    endDate: nullableDateInputSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one project field must be provided.",
  });

export const createWorkspaceTaskInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(4000).nullable().optional(),
  projectId: z.string().min(1).nullable().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: z.string().min(1).nullable().optional(),
  dueAt: nullableDateInputSchema.optional(),
});

export const updateWorkspaceTaskInputSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(4000).nullable().optional(),
    projectId: z.string().min(1).nullable().optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    assigneeId: z.string().min(1).nullable().optional(),
    dueAt: nullableDateInputSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one task field must be provided.",
  });

export const updateNotificationPreferencesInputSchema = z
  .object({
    emailNotifications: z.boolean().optional(),
    activityNotifications: z.boolean().optional(),
    productUpdates: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one notification preference must be provided.",
  });

export const createWorkspaceInvitationInputSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email())
    .transform((email) => email.toLowerCase()),
  role: z.enum(["admin", "member"]),
});

export const acceptWorkspaceInvitationInputSchema = z.object({
  token: z
    .string()
    .min(32)
    .max(128)
    .regex(/^[A-Za-z0-9_-]+$/),
  verifiedEmail: z
    .string()
    .trim()
    .pipe(z.email())
    .transform((email) => email.toLowerCase()),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceInputSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceInputSchema>;
export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;
export type CreateWorkspaceTaskInput = z.infer<
  typeof createWorkspaceTaskInputSchema
>;
export type UpdateWorkspaceTaskInput = z.infer<
  typeof updateWorkspaceTaskInputSchema
>;
export type UpdateNotificationPreferencesInput = z.infer<
  typeof updateNotificationPreferencesInputSchema
>;
export type CreateWorkspaceInvitationInput = z.infer<
  typeof createWorkspaceInvitationInputSchema
>;
export type UpdateWorkspaceMemberRoleInput = z.infer<
  typeof updateWorkspaceMemberRoleInputSchema
>;
export type AcceptWorkspaceInvitationInput = z.infer<
  typeof acceptWorkspaceInvitationInputSchema
>;
