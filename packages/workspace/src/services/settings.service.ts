import {
  StorageConflictError,
  StorageDuplicateError,
  type StorageBatchOperation,
  type StorageComparison,
} from "@puzzle-ui/storage";

import type { Activity, NotificationPreferences } from "../models";
import {
  notificationPreferencesSchema,
  updateNotificationPreferencesInputSchema,
  type UpdateNotificationPreferencesInput,
} from "../validation";
import { WORKSPACE_COLLECTIONS } from "../workspace.constants";
import {
  WorkspaceConflictError,
  WorkspaceValidationError,
  requireWorkspaceMembership,
  type WorkspaceServiceContext,
} from "./workspace.service";

const eq = <T>(value: T): StorageComparison<T> => ({
  operator: "eq",
  value,
});

const preferenceDetails = (
  input: UpdateNotificationPreferencesInput,
): Record<string, boolean> => {
  const details: Record<string, boolean> = {};

  if (input.emailNotifications !== undefined) {
    details.emailNotifications = input.emailNotifications;
  }

  if (input.activityNotifications !== undefined) {
    details.activityNotifications = input.activityNotifications;
  }

  if (input.productUpdates !== undefined) {
    details.productUpdates = input.productUpdates;
  }

  return details;
};

const parsePreferences = (preferences: unknown): NotificationPreferences => {
  const parsed = notificationPreferencesSchema.safeParse(preferences);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  return parsed.data;
};

export const getNotificationPreferences = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
): Promise<NotificationPreferences | null> => {
  await requireWorkspaceMembership(context, workspaceId);

  return context.storage.findOne<NotificationPreferences>(
    WORKSPACE_COLLECTIONS.notificationPreferences,
    {
      where: {
        workspaceId: eq(workspaceId),
        userId: eq(context.userId),
      },
    },
  );
};

export const updateNotificationPreferences = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  input: UpdateNotificationPreferencesInput,
): Promise<NotificationPreferences> => {
  await requireWorkspaceMembership(context, workspaceId);
  const parsed = updateNotificationPreferencesInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new WorkspaceValidationError(
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  const existing = await context.storage.findOne<NotificationPreferences>(
    WORKSPACE_COLLECTIONS.notificationPreferences,
    {
      where: {
        workspaceId: eq(workspaceId),
        userId: eq(context.userId),
      },
    },
  );
  const now = new Date();
  const preferences = parsePreferences({
    id: existing?.id ?? crypto.randomUUID(),
    workspaceId,
    userId: context.userId,
    emailNotifications:
      parsed.data.emailNotifications ?? existing?.emailNotifications ?? true,
    activityNotifications:
      parsed.data.activityNotifications ??
      existing?.activityNotifications ??
      true,
    productUpdates:
      parsed.data.productUpdates ?? existing?.productUpdates ?? false,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    revision: existing?.revision ?? 0,
  });
  const activity: Activity = {
    id: crypto.randomUUID(),
    workspaceId,
    actorUserId: context.userId,
    action: "settings.updated",
    entityType: "settings",
    entityId: context.userId,
    details: preferenceDetails(parsed.data),
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };
  const operations: StorageBatchOperation<
    NotificationPreferences | Activity
  >[] = existing
    ? [
        {
          type: "update",
          collection: WORKSPACE_COLLECTIONS.notificationPreferences,
          id: existing.id,
          condition: { expectedRevision: existing.revision },
          changes: { ...parsed.data, updatedAt: now },
        },
        {
          type: "insert",
          collection: WORKSPACE_COLLECTIONS.activities,
          record: activity,
        },
      ]
    : [
        {
          type: "insert",
          collection: WORKSPACE_COLLECTIONS.notificationPreferences,
          record: preferences,
        },
        {
          type: "insert",
          collection: WORKSPACE_COLLECTIONS.activities,
          record: activity,
        },
      ];

  try {
    const result = await context.storage.atomicBatch(operations);

    if (!existing) return preferences;

    const updateResult = result.results[0];

    if (updateResult?.type !== "update" || !updateResult.record) {
      throw new WorkspaceConflictError(
        "Notification preferences update did not complete.",
      );
    }

    return parsePreferences(updateResult.record);
  } catch (error) {
    if (
      error instanceof StorageConflictError ||
      error instanceof StorageDuplicateError
    ) {
      throw new WorkspaceConflictError(
        "Notification preferences changed before the update could be saved.",
      );
    }

    throw error;
  }
};
