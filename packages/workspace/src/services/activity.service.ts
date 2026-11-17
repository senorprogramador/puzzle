import type {
  StorageComparison,
  StorageCursor,
  StoragePage,
} from "@puzzle-ui/storage";

import type { Activity } from "../models";
import { WORKSPACE_COLLECTIONS } from "../workspace.constants";
import {
  WorkspaceValidationError,
  requireWorkspaceMembership,
  type WorkspaceServiceContext,
} from "./workspace.service";

const eq = <T>(value: T): StorageComparison<T> => ({
  operator: "eq",
  value,
});

export const listWorkspaceActivity = async (
  context: WorkspaceServiceContext,
  workspaceId: string,
  options: {
    readonly first?: number;
    readonly after?: StorageCursor;
  } = {},
): Promise<StoragePage<Activity>> => {
  await requireWorkspaceMembership(context, workspaceId);

  const first = options.first ?? 20;

  if (!Number.isInteger(first) || first < 1 || first > 100) {
    throw new WorkspaceValidationError([
      "Activity page size must be an integer from 1 to 100.",
    ]);
  }

  return context.storage.findPage<Activity>(
    WORKSPACE_COLLECTIONS.activities,
    {
      where: { workspaceId: eq(workspaceId) },
      orderBy: [{ field: "createdAt", direction: "desc" }],
      first,
      ...(options.after ? { after: options.after } : {}),
    },
  );
};
