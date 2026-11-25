import { describe, expect, it } from "bun:test";

import {
  StorageConflictError,
  resolveStorageId,
  type StorageAdapter,
  type StorageBatchOperation,
  type StorageBatchResult,
  type StorageCursorQuery,
  type StoragePage,
  type StorageQuery,
  type StorageRecord,
  type StorageInsert,
  type StorageUpdate,
} from "@puzzle-ui/storage";

import {
  WorkspaceAccessError,
  WorkspaceConflictError,
  WorkspaceValidationError,
  createWorkspace,
  requireWorkspaceMembership,
  updateWorkspace,
} from "../src/services/workspace.service";
import {
  addProjectMember,
  removeProjectMember,
} from "../src/services/project-member.service";
import {
  createProject,
  getProject,
} from "../src/services/project.service";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../src/services/task.service";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../src/services/settings.service";
import { listWorkspaceActivity } from "../src/services/activity.service";
import {
  acceptWorkspaceInvitation,
  createWorkspaceInvitation,
} from "../src/services/invitation.service";
import {
  removeWorkspaceMember,
  updateWorkspaceMemberRole,
} from "../src/services/member.service";
import { seedWorkspaceDemo } from "../src/services/seed.service";
import {
  createWorkspaceApiHandler,
  type WorkspaceApiOptions,
} from "../src/http";
import type {
  NotificationPreferences,
  Project,
  ProjectMember,
  Workspace,
  WorkspaceMember,
  WorkspaceTask,
} from "../src/models";
import {
  createProjectInputSchema,
  createWorkspaceInputSchema,
  workspaceInvitationSchema,
  workspaceTaskSchema,
} from "../src/validation";
import { initializeWorkspaceStorage } from "../src/workspace.collections";

const capabilities = {
  transactions: false,
  atomicBatch: true,
  conditionalWrites: true,
  uniqueConstraints: true,
  upsert: true,
  cursorPagination: true,
  migrations: false,
  ttlIndexes: true,
};

const createStorage = (atomicBatch = true) => {
  let registeredCollections = 0;
  let batchCollections: readonly string[] = [];
  let batchOperations: readonly StorageBatchOperation<StorageRecord>[] = [];
  const storageCapabilities = { ...capabilities, atomicBatch };

  const storage: StorageAdapter = {
    capabilities: storageCapabilities,
    getCapabilities: () => ({ capabilities: storageCapabilities }),
    registerCollection: async () => {
      registeredCollections += 1;
    },
    findById: async <T extends StorageRecord>() => null,
    findOne: async <T extends StorageRecord>() => null,
    findMany: async <T extends StorageRecord>(
      _collection: string,
      _query?: StorageQuery<T>,
    ) => [],
    findPage: async <T extends StorageRecord>(
      _collection: string,
      _query: StorageCursorQuery<T>,
    ): Promise<StoragePage<T>> => ({
      items: [],
      nextCursor: null,
      hasNextPage: false,
    }),
    insert: async <T extends StorageRecord>(
      _collection: string,
      _record: StorageInsert<T>,
    ): Promise<T> => {
      throw new Error("Not implemented in test storage.");
    },
    upsert: async <T extends StorageRecord>(
      _collection: string,
      _query: StorageQuery<T>,
      _record: StorageInsert<T>,
    ): Promise<T> => {
      throw new Error("Not implemented in test storage.");
    },
    update: async <T extends StorageRecord>(
      _collection: string,
      _id: string,
      _changes: StorageUpdate<T>,
    ) => null,
    updateMany: async () => 0,
    delete: async () => false,
    deleteMany: async () => 0,
    exists: async () => false,
    count: async () => 0,
    atomicBatch: async <T extends StorageRecord>(
      operations: readonly StorageBatchOperation<T>[],
    ): Promise<StorageBatchResult<T>> => {
      batchCollections = operations.map(({ collection }) => collection);
      batchOperations = operations as readonly StorageBatchOperation<StorageRecord>[];
      return { results: [] };
    },
  };

  return {
    storage,
    get registeredCollections() {
      return registeredCollections;
    },
    get batchCollections() {
      return batchCollections;
    },
    get batchOperations() {
      return batchOperations;
    },
  };
};

const createAuthorizedStorage = (
  records: Readonly<
    Record<string, StorageRecord | readonly StorageRecord[]>
  >,
) => {
  const testStorage = createStorage();
  const recordsFor = (collection: string): readonly StorageRecord[] => {
    const recordsInCollection = records[collection];

    if (!recordsInCollection) return [];

    return Array.isArray(recordsInCollection)
      ? recordsInCollection
      : [recordsInCollection];
  };
  const storage: StorageAdapter = {
    ...testStorage.storage,
    findById: async <T extends StorageRecord>(
      collection: string,
      id: string,
    ) => {
      const record = recordsFor(collection).find(
        (candidate) => candidate.id === id,
      );

      return record?.id === id ? (record as T) : null;
    },
    findOne: async <T extends StorageRecord>(
      collection: string,
      query: StorageQuery<T>,
    ) => {
      const where = query.where as Record<string, unknown> | undefined;
      return (
        recordsFor(collection).find((record) =>
          Object.entries(where ?? {}).every(([field, filter]) => {
            if (
              !filter ||
              typeof filter !== "object" ||
              !("operator" in filter) ||
              !("value" in filter)
            ) {
              return true;
            }

            const comparison = filter as { operator: string; value: unknown };
            const value = record[field as keyof StorageRecord];

            if (comparison.operator === "eq") {
              return value === comparison.value;
            }

            if (
              comparison.operator === "in" &&
              Array.isArray(comparison.value)
            ) {
              return comparison.value.includes(value);
            }

            return true;
          }),
        ) as T | undefined
      ) ?? null;
    },
    atomicBatch: async <T extends StorageRecord>(
      operations: readonly StorageBatchOperation<T>[],
    ): Promise<StorageBatchResult<T>> => {
      await testStorage.storage.atomicBatch(operations);

      return {
        results: operations.map((operation) => {
          if (operation.type === "update") {
            const record = recordsFor(operation.collection).find(
              (candidate) => candidate.id === operation.id,
            );

            return {
              type: "update",
              record: record
                ? ({
                    ...record,
                    ...operation.changes,
                    revision: record.revision + 1,
                  } as T)
                : null,
            };
          }

          if (operation.type === "insert") {
            const now = new Date();
            return {
              type: "insert",
              record: {
                ...operation.record,
                id: resolveStorageId(operation.record.id),
                createdAt: operation.record.createdAt ?? now,
                updatedAt: operation.record.updatedAt ?? now,
                revision: operation.record.revision ?? 1,
              } as T,
            };
          }

          return { type: "delete", deleted: true };
        }),
      };
    },
  };

  return {
    storage,
    get batchCollections() {
      return testStorage.batchCollections;
    },
    get batchOperations() {
      return testStorage.batchOperations;
    },
  };
};

describe("Workspace validation", () => {
  it("accepts normalized workspace input and rejects unsafe slugs", () => {
    expect(
      createWorkspaceInputSchema.safeParse({
        name: "  Product Team  ",
        slug: "product-team",
        description: "Shared project space",
      }).success,
    ).toBe(true);

    expect(
      createWorkspaceInputSchema.safeParse({
        name: "Product Team",
        slug: "Product Team",
      }).success,
    ).toBe(false);
  });

  it("validates invitation email and expiry types", () => {
    const now = new Date();
    const result = workspaceInvitationSchema.safeParse({
      id: "invite-1",
      workspaceId: "workspace-1",
      email: "not-an-email",
      role: "member",
      tokenHash: "hashed-token",
      expiresAt: now,
      acceptedAt: null,
      revokedAt: null,
      createdAt: now,
      updatedAt: now,
      revision: 0,
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown task states and malformed dates", () => {
    const now = new Date();
    const result = workspaceTaskSchema.safeParse({
      id: "task-1",
      workspaceId: "workspace-1",
      projectId: null,
      title: "Ship release",
      description: null,
      status: "blocked",
      priority: "urgent",
      assigneeId: null,
      dueAt: "tomorrow",
      createdBy: "user-1",
      createdAt: now,
      updatedAt: now,
      revision: 0,
    });

    expect(result.success).toBe(false);
  });

  it("accepts ISO date form values and rejects reversed project dates", () => {
    const parsed = createProjectInputSchema.safeParse({
      name: "Website refresh",
      startDate: "2025-01-02",
      endDate: "2025-02-02",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.startDate).toBeInstanceOf(Date);
      expect(parsed.data.endDate).toBeInstanceOf(Date);
    }

    expect(
      createProjectInputSchema.safeParse({
        name: "Website refresh",
        startDate: "2025-02-02",
        endDate: "2025-01-02",
      }).success,
    ).toBe(false);
  });
});

describe("Workspace storage and services", () => {
  it("registers separate Workspace collections", async () => {
    const testStorage = createStorage();
    await initializeWorkspaceStorage(testStorage.storage);

    expect(testStorage.registeredCollections).toBe(8);
  });

  it("fails initialization when atomic batches are unavailable", async () => {
    const testStorage = createStorage(false);

    await expect(
      initializeWorkspaceStorage(testStorage.storage),
    ).rejects.toThrow(
      "Workspace storage requires unique constraints and atomic batches.",
    );
    expect(testStorage.registeredCollections).toBe(0);
  });

  it("seeds one workspace with five projects and twenty tasks atomically", async () => {
    const testStorage = createStorage();

    const result = await seedWorkspaceDemo(testStorage.storage, {
      ownerUserId: "owner-1",
      memberUserIds: ["admin-1", "member-1"],
    });

    expect(result.status).toBe("created");
    expect(
      testStorage.batchOperations.filter(
        (operation) => operation.collection === "projects",
      ),
    ).toHaveLength(5);
    expect(
      testStorage.batchOperations.filter(
        (operation) => operation.collection === "tasks",
      ),
    ).toHaveLength(20);
    expect(
      testStorage.batchOperations.filter(
        (operation) => operation.collection === "activities",
      ),
    ).toHaveLength(28);
    expect(
      testStorage.batchOperations
        .filter((operation) => operation.collection === "workspaces")
        .map((operation) => operation.record.id),
    ).toEqual(["workspace-demo"]);
    expect(
      testStorage.batchOperations
        .filter((operation) => operation.collection === "projects")
        .map((operation) => operation.record.id),
    ).toEqual([
      "project-demo-website-refresh",
      "project-demo-customer-onboarding",
      "project-demo-mobile-launch",
      "project-demo-analytics-foundation",
      "project-demo-design-system",
    ]);

    const firstSeedIds = testStorage.batchOperations.map(
      (operation) => `${operation.collection}:${operation.record.id}`,
    );
    await seedWorkspaceDemo(testStorage.storage, {
      ownerUserId: "owner-1",
      memberUserIds: ["admin-1", "member-1"],
    });
    expect(
      testStorage.batchOperations.map(
        (operation) => `${operation.collection}:${operation.record.id}`,
      ),
    ).toEqual(firstSeedIds);
  });

  it("creates the workspace, owner, and audit event atomically", async () => {
    const testStorage = createStorage();
    const workspace = await createWorkspace(
      { storage: testStorage.storage, userId: "user-1" },
      { name: "Product Team", slug: "product-team" },
    );

    expect(workspace.createdBy).toBe("user-1");
    expect(workspace.description).toBeNull();
    expect(testStorage.batchCollections).toEqual([
      "workspaces",
      "workspaceMembers",
      "activities",
    ]);
  });

  it("updates workspaces atomically for owners and admins", async () => {
    const now = new Date();
    const member: WorkspaceMember = {
      id: "member-1",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "owner",
      status: "active",
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
      revision: 3,
    };
    const workspace = {
      id: "workspace-1",
      name: "Product Team",
      slug: "product-team",
      description: null,
      createdBy: "user-1",
      createdAt: now,
      updatedAt: now,
      revision: 3,
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: member,
      workspaces: workspace,
    });

    const updated = await updateWorkspace(
      { storage: testStorage.storage, userId: "user-1" },
      "workspace-1",
      { name: "Platform Team" },
    );

    expect(updated.name).toBe("Platform Team");
    expect(testStorage.batchCollections).toEqual([
      "workspaces",
      "activities",
    ]);
    expect(testStorage.batchOperations[0]).toMatchObject({
      type: "update",
      condition: { expectedRevision: 3 },
    });
  });

  describe("Workspace API", () => {
    const identity = {
      userId: "user-1",
      email: "user@example.com",
      emailVerified: true,
    };

    const createHandler = (
      options: {
        readonly storage?: StorageAdapter;
        readonly authenticate?: () => Promise<typeof identity | null>;
        readonly protectMutation?: () => Response | null;
        readonly deliverInvitation?: WorkspaceApiOptions["deliverInvitation"];
      } = {},
    ) => {
      const storage = options.storage ?? createStorage().storage;

      return createWorkspaceApiHandler({
        storage,
        invitationBaseUrl: "https://workspace.example",
        authenticate: options.authenticate ?? (async () => identity),
        protectMutation: options.protectMutation ?? (() => null),
        ...(options.deliverInvitation
          ? { deliverInvitation: options.deliverInvitation }
          : {}),
      });
    };

    it("requires a verified identity and avoids caching workspace responses", async () => {
      const handler = createHandler({
        authenticate: async () => null,
      });
      const response = await handler(
        new Request("https://workspace.example/api/workspaces"),
      );

      expect(response.status).toBe(401);
      expect(response.headers.get("Cache-Control")).toBe("no-store");
    });

    it("rejects state-changing requests when origin protection fails", async () => {
      let authenticated = false;
      const handler = createHandler({
        authenticate: async () => {
          authenticated = true;
          return identity;
        },
        protectMutation: () =>
          Response.json({ error: { code: "CSRF_REJECTED" } }, { status: 403 }),
      });
      const response = await handler(
        new Request("https://workspace.example/api/workspaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Team", slug: "team" }),
        }),
      );

      expect(response.status).toBe(403);
      expect(authenticated).toBe(false);
    });

    it("validates request bodies before calling workspace services", async () => {
      const response = await createHandler()(
        new Request("https://workspace.example/api/workspaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: " ", slug: "bad slug" }),
        }),
      );

      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({
        error: { code: "INVALID_INPUT" },
      });
    });

    it("requires a verified email before accepting an invitation", async () => {
      const handler = createHandler({
        authenticate: async () => ({ ...identity, emailVerified: false }),
      });
      const response = await handler(
        new Request("https://workspace.example/api/invitations/accept", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: "secret-token" }),
        }),
      );

      expect(response.status).toBe(403);
      expect(await response.json()).toMatchObject({
        error: { code: "VERIFIED_EMAIL_REQUIRED" },
      });
    });

    it("delivers invitation tokens only to the server provider", async () => {
      const now = new Date();
      const workspace: Workspace = {
        id: "workspace-1",
        name: "Product Team",
        slug: "product-team",
        description: null,
        createdBy: "user-1",
        createdAt: now,
        updatedAt: now,
        revision: 0,
      };
      const owner: WorkspaceMember = {
        id: "member-1",
        workspaceId: workspace.id,
        userId: identity.userId,
        role: "owner",
        status: "active",
        joinedAt: now,
        createdAt: now,
        updatedAt: now,
        revision: 0,
      };
      const testStorage = createAuthorizedStorage({
        workspaces: workspace,
        workspaceMembers: owner,
      });
      const sentLinks: string[] = [];
      const handler = createHandler({
        storage: testStorage.storage,
        deliverInvitation: async ({ invitationUrl }) => {
          sentLinks.push(invitationUrl);
        },
      });
      const response = await handler(
        new Request("https://workspace.example/api/workspaces/workspace-1/invitations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "invitee@example.com",
            role: "member",
          }),
        }),
      );
      const body = (await response.json()) as {
        invitation: Record<string, unknown>;
      };

      expect(response.status).toBe(201);
      expect(body).not.toHaveProperty("token");
      expect(body.invitation).not.toHaveProperty("tokenHash");
      expect(sentLinks).toHaveLength(1);
      const token = new URL(sentLinks[0] ?? "").searchParams.get("token");
      expect(token).toBeTruthy();
      if (token) expect(JSON.stringify(body)).not.toContain(token);
    });
  });

  it("rejects unauthorized workspace access", async () => {
    const { storage } = createStorage();

    await expect(
      requireWorkspaceMembership(
        { storage, userId: "user-2" },
        "workspace-owned-by-another-user",
      ),
    ).rejects.toBeInstanceOf(WorkspaceAccessError);
  });

  it("creates projects with an audit event in the same batch", async () => {
    const member: WorkspaceMember = {
      id: "member-1",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "owner",
      status: "active",
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: member,
    });

    const project = await createProject(
      { storage: testStorage.storage, userId: "user-1" },
      "workspace-1",
      { name: "Launch" },
    );

    expect(project.ownerId).toBe("user-1");
    expect(project.status).toBe("active");
    expect(testStorage.batchCollections).toEqual([
      "projects",
      "projectMembers",
      "activities",
    ]);
    expect(testStorage.batchOperations[2]).toMatchObject({
      type: "insert",
      collection: "activities",
      record: { workspaceId: "workspace-1", entityId: project.id },
    });
  });

  it("adds project members only for active workspace members", async () => {
    const owner: WorkspaceMember = {
      id: "owner-membership",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "owner",
      status: "active",
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const member: WorkspaceMember = {
      ...owner,
      id: "member-membership",
      userId: "user-2",
      role: "member",
    };
    const project: Project = {
      id: "project-1",
      workspaceId: "workspace-1",
      name: "Launch",
      description: null,
      status: "active",
      color: null,
      startDate: null,
      endDate: null,
      ownerId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: [owner, member],
      projects: project,
    });

    const projectMember = await addProjectMember(
      { storage: testStorage.storage, userId: owner.userId },
      "workspace-1",
      project.id,
      { userId: member.userId, role: "member" },
    );

    expect(projectMember.userId).toBe(member.userId);
    expect(testStorage.batchOperations[0]).toMatchObject({
      type: "insert",
      collection: "projectMembers",
    });
    expect(testStorage.batchOperations[1]).toMatchObject({
      type: "insert",
      record: { action: "project.member_added", entityId: project.id },
    });
  });

  it("removes project members atomically while retaining the project owner", async () => {
    const owner: WorkspaceMember = {
      id: "owner-membership",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "owner",
      status: "active",
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const project: Project = {
      id: "project-1",
      workspaceId: "workspace-1",
      name: "Launch",
      description: null,
      status: "active",
      color: null,
      startDate: null,
      endDate: null,
      ownerId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const projectMember: ProjectMember = {
      id: "project-member-1",
      workspaceId: "workspace-1",
      projectId: project.id,
      userId: "user-2",
      role: "member",
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 1,
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: owner,
      projects: project,
      projectMembers: projectMember,
    });

    await removeProjectMember(
      { storage: testStorage.storage, userId: owner.userId },
      "workspace-1",
      project.id,
      projectMember.id,
    );

    expect(testStorage.batchOperations[0]).toMatchObject({
      type: "delete",
      collection: "projectMembers",
      id: projectMember.id,
      condition: { expectedRevision: 1 },
    });
    expect(testStorage.batchOperations[1]).toMatchObject({
      type: "insert",
      record: { action: "project.member_removed", entityId: project.id },
    });
  });

  it("prevents reading projects from another workspace", async () => {
    const member: WorkspaceMember = {
      id: "member-1",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "member",
      status: "active",
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const project: Project = {
      id: "project-1",
      workspaceId: "workspace-2",
      name: "Private project",
      description: null,
      status: "active",
      color: null,
      startDate: null,
      endDate: null,
      ownerId: "user-2",
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: member,
      projects: project,
    });

    await expect(
      getProject(
        { storage: testStorage.storage, userId: "user-1" },
        "workspace-1",
        "project-1",
      ),
    ).rejects.toBeInstanceOf(WorkspaceAccessError);
  });

  it("accepts a hashed invitation only for the matching verified email", async () => {
    const now = new Date();
    const member: WorkspaceMember = {
      id: "member-1",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "owner",
      status: "active",
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
      revision: 0,
    };
    const issuedStorage = createAuthorizedStorage({
      workspaceMembers: member,
    });
    const { invitation, token } = await createWorkspaceInvitation(
      { storage: issuedStorage.storage, userId: "user-1" },
      "workspace-1",
      { email: "  NEW@EXAMPLE.COM ", role: "member" },
    );
    const workspace: Workspace = {
      id: "workspace-1",
      name: "Product Team",
      slug: "product-team",
      description: null,
      createdBy: "user-1",
      createdAt: now,
      updatedAt: now,
      revision: 0,
    };
    const acceptedStorage = createAuthorizedStorage({
      invitations: invitation,
      workspaces: workspace,
    });

    expect(invitation.email).toBe("new@example.com");
    expect(invitation.tokenHash).not.toBe(token);

    const acceptedMember = await acceptWorkspaceInvitation(
      { storage: acceptedStorage.storage, userId: "user-2" },
      token,
      "new@example.com",
    );

    expect(acceptedMember.userId).toBe("user-2");
    expect(acceptedMember.role).toBe("member");
    expect(acceptedStorage.batchCollections).toEqual([
      "invitations",
      "workspaceMembers",
      "activities",
    ]);
  });

  it("allows owners to change member roles with an audit event", async () => {
    const now = new Date();
    const owner: WorkspaceMember = {
      id: "owner-membership",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "owner",
      status: "active",
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
      revision: 0,
    };
    const member: WorkspaceMember = {
      ...owner,
      id: "member-membership",
      userId: "user-2",
      role: "member",
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: [owner, member],
    });

    const updated = await updateWorkspaceMemberRole(
      { storage: testStorage.storage, userId: "user-1" },
      "workspace-1",
      member.id,
      { role: "admin" },
    );

    expect(updated.role).toBe("admin");
    expect(testStorage.batchCollections).toEqual([
      "workspaceMembers",
      "activities",
    ]);
    expect(testStorage.batchOperations[1]).toMatchObject({
      type: "insert",
      record: { action: "member.role_changed", entityId: member.id },
    });
  });

  it("allows an owner to suspend a member but never remove the owner", async () => {
    const now = new Date();
    const owner: WorkspaceMember = {
      id: "owner-membership",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "owner",
      status: "active",
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
      revision: 0,
    };
    const member: WorkspaceMember = {
      ...owner,
      id: "member-membership",
      userId: "user-2",
      role: "member",
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: [owner, member],
    });

    const suspended = await removeWorkspaceMember(
      { storage: testStorage.storage, userId: "user-1" },
      "workspace-1",
      member.id,
    );

    expect(suspended.status).toBe("suspended");
    await expect(
      removeWorkspaceMember(
        { storage: testStorage.storage, userId: "user-1" },
        "workspace-1",
        owner.id,
      ),
    ).rejects.toBeInstanceOf(WorkspaceAccessError);
  });

  it("creates tasks with defaults and a workspace-scoped activity", async () => {
    const member: WorkspaceMember = {
      id: "member-1",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "member",
      status: "active",
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: member,
    });

    const task = await createTask(
      { storage: testStorage.storage, userId: "user-1" },
      "workspace-1",
      { title: "Review launch plan" },
    );

    expect(task.status).toBe("todo");
    expect(task.priority).toBe("medium");
    expect(testStorage.batchCollections).toEqual(["tasks", "activities"]);
  });

  it("updates task status atomically with a status-change activity", async () => {
    const member: WorkspaceMember = {
      id: "member-1",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "member",
      status: "active",
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const task: WorkspaceTask = {
      id: "task-1",
      workspaceId: "workspace-1",
      projectId: null,
      title: "Review launch plan",
      description: null,
      status: "todo",
      priority: "medium",
      assigneeId: null,
      dueAt: null,
      createdBy: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 2,
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: member,
      tasks: task,
    });

    const updated = await updateTask(
      { storage: testStorage.storage, userId: "user-1" },
      "workspace-1",
      "task-1",
      { status: "done" },
    );

    expect(updated.status).toBe("done");
    expect(testStorage.batchOperations[0]).toMatchObject({
      type: "update",
      condition: { expectedRevision: 2 },
    });
    expect(testStorage.batchOperations[1]).toMatchObject({
      type: "insert",
      record: { action: "task.status_changed", workspaceId: "workspace-1" },
    });
  });

  it("deletes a task atomically and records the deletion", async () => {
    const member: WorkspaceMember = {
      id: "member-1",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "member",
      status: "active",
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const task: WorkspaceTask = {
      id: "task-1",
      workspaceId: "workspace-1",
      projectId: null,
      title: "Remove obsolete task",
      description: null,
      status: "todo",
      priority: "low",
      assigneeId: null,
      dueAt: null,
      createdBy: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 1,
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: member,
      tasks: task,
    });

    await deleteTask(
      { storage: testStorage.storage, userId: "user-1" },
      "workspace-1",
      task.id,
    );

    expect(testStorage.batchOperations[0]).toMatchObject({
      type: "delete",
      collection: "tasks",
      id: task.id,
      condition: { expectedRevision: 1 },
    });
    expect(testStorage.batchOperations[1]).toMatchObject({
      type: "insert",
      record: { action: "task.deleted", entityId: task.id },
    });
  });

  it("does not allow a member to delete another member's task", async () => {
    const member: WorkspaceMember = {
      id: "member-2",
      workspaceId: "workspace-1",
      userId: "user-2",
      role: "member",
      status: "active",
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const task: WorkspaceTask = {
      id: "task-1",
      workspaceId: "workspace-1",
      projectId: null,
      title: "Another user's task",
      description: null,
      status: "todo",
      priority: "low",
      assigneeId: null,
      dueAt: null,
      createdBy: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: member,
      tasks: task,
    });

    await expect(
      deleteTask(
        { storage: testStorage.storage, userId: "user-2" },
        "workspace-1",
        task.id,
      ),
    ).rejects.toBeInstanceOf(WorkspaceAccessError);
    expect(testStorage.batchOperations).toEqual([]);
  });

  it("maps task update conflicts to a Workspace conflict", async () => {
    const member: WorkspaceMember = {
      id: "member-1",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "member",
      status: "active",
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const task: WorkspaceTask = {
      id: "task-1",
      workspaceId: "workspace-1",
      projectId: null,
      title: "Review launch plan",
      description: null,
      status: "todo",
      priority: "medium",
      assigneeId: null,
      dueAt: null,
      createdBy: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: member,
      tasks: task,
    });
    const storage: StorageAdapter = {
      ...testStorage.storage,
      atomicBatch: async () => {
        throw new StorageConflictError();
      },
    };

    await expect(
      updateTask(
        { storage, userId: "user-1" },
        "workspace-1",
        "task-1",
        { status: "done" },
      ),
    ).rejects.toBeInstanceOf(WorkspaceConflictError);
  });

  it("updates notification preferences with an atomic settings activity", async () => {
    const now = new Date();
    const member: WorkspaceMember = {
      id: "member-1",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "member",
      status: "active",
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
      revision: 0,
    };
    const preferences: NotificationPreferences = {
      id: "preferences-1",
      workspaceId: "workspace-1",
      userId: "user-1",
      emailNotifications: true,
      activityNotifications: true,
      productUpdates: false,
      createdAt: now,
      updatedAt: now,
      revision: 1,
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: member,
      notificationPreferences: preferences,
    });

    const updated = await updateNotificationPreferences(
      { storage: testStorage.storage, userId: "user-1" },
      "workspace-1",
      { emailNotifications: false },
    );

    expect(updated.emailNotifications).toBe(false);
    expect(testStorage.batchCollections).toEqual([
      "notificationPreferences",
      "activities",
    ]);
    expect(testStorage.batchOperations[0]).toMatchObject({
      type: "update",
      condition: { expectedRevision: 1 },
    });
    await expect(
      getNotificationPreferences(
        { storage: testStorage.storage, userId: "user-2" },
        "workspace-1",
      ),
    ).rejects.toBeInstanceOf(WorkspaceAccessError);
  });

  it("lists activity only after workspace membership is verified", async () => {
    const member: WorkspaceMember = {
      id: "member-1",
      workspaceId: "workspace-1",
      userId: "user-1",
      role: "member",
      status: "active",
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 0,
    };
    const testStorage = createAuthorizedStorage({
      workspaceMembers: member,
    });

    const page = await listWorkspaceActivity(
      { storage: testStorage.storage, userId: "user-1" },
      "workspace-1",
    );

    expect(page.items).toEqual([]);
    expect(page.hasNextPage).toBe(false);
    await expect(
      listWorkspaceActivity(
        { storage: testStorage.storage, userId: "user-2" },
        "workspace-1",
      ),
    ).rejects.toBeInstanceOf(WorkspaceAccessError);
  });

  it("rejects unauthenticated and invalid workspace creation", async () => {
    const { storage } = createStorage();

    await expect(
      createWorkspace({ storage, userId: "" }, {
        name: "Product Team",
        slug: "product-team",
      }),
    ).rejects.toBeInstanceOf(WorkspaceAccessError);

    await expect(
      createWorkspace({ storage, userId: "user-1" }, {
        name: " ",
        slug: "bad slug",
      }),
    ).rejects.toBeInstanceOf(WorkspaceValidationError);
  });
});
