import { hash } from "@node-rs/argon2";
import {
  AUTH_CREDENTIAL_COLLECTION,
  AUTH_USER_COLLECTION,
  initializeAuthStorage,
  type AuthUserStorageRecord,
  type PasswordCredentialStorageRecord,
  type PasswordHash,
} from "@puzzle-ui/auth";
import { MongoClient, type Db } from "mongodb";
import { MongoStorageAdapter } from "@puzzle-ui/storage-mongodb";

import { initializeWorkspaceStorage } from "../src/workspace.collections";
import { seedWorkspaceDemo } from "../src/services/seed.service";
import { WORKSPACE_COLLECTIONS } from "../src/workspace.constants";

const DEMO_PASSWORD = "demouser1234";
const passwordParameters = { memoryCost: 65536, timeCost: 3, parallelism: 1 };
const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);

type SeedIdentity = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
};

const seedIdentities: readonly SeedIdentity[] = [
  {
    id: "demo-user",
    email: "demo@puzzle-ui.com",
    name: "Puzzle Demo",
  },
  {
    id: "demo-user-alex",
    email: "alex@puzzle-ui.com",
    name: "Alex Morgan",
  },
  {
    id: "demo-user-jordan",
    email: "jordan@puzzle-ui.com",
    name: "Jordan Lee",
  },
];

const required = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const eq = <const T>(value: T) => ({ operator: "eq" as const, value });

const ensureSeedUser = async (
  storage: MongoStorageAdapter,
  identity: SeedIdentity,
  now: Date,
): Promise<AuthUserStorageRecord> => {
  const normalizedEmail = identity.email.toLowerCase();
  const existing = await storage.findOne<AuthUserStorageRecord>(
    AUTH_USER_COLLECTION,
    { where: { normalizedEmail: eq(normalizedEmail) } },
  );

  if (existing) {
    const updated = await storage.update<AuthUserStorageRecord>(
      AUTH_USER_COLLECTION,
      existing.id,
      {
        email: identity.email,
        normalizedEmail,
        emailVerifiedAt: existing.emailVerifiedAt ?? now,
        name: identity.name,
        image: null,
        deactivatedAt: null,
        updatedAt: now,
      },
    );

    if (!updated) {
      throw new Error(`Could not update demo user ${identity.email}.`);
    }

    return updated;
  }

  const idCollision = await storage.findById<AuthUserStorageRecord>(
    AUTH_USER_COLLECTION,
    identity.id,
  );

  if (idCollision) {
    throw new Error(
      `Cannot create demo user ${identity.email}; user ID ${identity.id} is already in use.`,
    );
  }

  const record: AuthUserStorageRecord = {
    id: identity.id,
    email: identity.email,
    normalizedEmail,
    emailVerifiedAt: now,
    name: identity.name,
    image: null,
    deactivatedAt: null,
    sessionsInvalidatedAt: null,
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };

  return storage.insert<AuthUserStorageRecord>(AUTH_USER_COLLECTION, record);
};

const ensureDemoCredential = async (
  storage: MongoStorageAdapter,
  userId: string,
  now: Date,
): Promise<void> => {
  const passwordHash: PasswordHash = {
    hash: await hash(DEMO_PASSWORD, passwordParameters),
    algorithm: "argon2id",
    parameters: passwordParameters,
  };
  const existing = await storage.findOne<PasswordCredentialStorageRecord>(
    AUTH_CREDENTIAL_COLLECTION,
    { where: { userId: eq(userId), kind: eq("password") } },
  );

  if (existing) {
    const updated = await storage.update<PasswordCredentialStorageRecord>(
      AUTH_CREDENTIAL_COLLECTION,
      existing.id,
      { passwordHash, passwordUpdatedAt: now, revokedAt: null, updatedAt: now },
    );

    if (!updated) {
      throw new Error("Could not update the demo account password.");
    }

    return;
  }

  const credential: PasswordCredentialStorageRecord = {
    id: `demo-password-${userId}`,
    userId,
    kind: "password",
    passwordHash,
    passwordUpdatedAt: now,
    revokedAt: null,
    createdAt: now,
    updatedAt: now,
    revision: 0,
  };

  await storage.insert<PasswordCredentialStorageRecord>(
    AUTH_CREDENTIAL_COLLECTION,
    credential,
  );
};

const clearWorkspaceCollections = async (
  storage: MongoStorageAdapter,
): Promise<number> => {
  const collectionNames = Object.values(WORKSPACE_COLLECTIONS);
  let deletedRecords = 0;

  for (const name of collectionNames) {
    deletedRecords += await storage.deleteMany(name, {});
  }

  return deletedRecords;
};

const run = async (): Promise<void> => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("The demo seed is disabled when NODE_ENV=production.");
  }

  if (process.env.WORKSPACE_DEMO_RESET !== "yes") {
    throw new Error(
      "The demo reset must be explicitly enabled by the local development script.",
    );
  }

  const uri = required("MONGODB_URI");
  const databaseName = required("MONGODB_DATABASE");
  const parsedUri = new URL(uri);

  if (
    parsedUri.protocol !== "mongodb:" ||
    !localHosts.has(parsedUri.hostname) ||
    !["workspace_next", "workspace_tanstack"].includes(databaseName)
  ) {
    throw new Error(
      "The demo reset only supports the local workspace_next or workspace_tanstack database; other databases are never cleared.",
    );
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(databaseName);
    const storage = new MongoStorageAdapter({
      database,
      client,
      transactionsEnabled: true,
    });

    await initializeAuthStorage(storage);
    await initializeWorkspaceStorage(storage);

    const now = new Date();
    const users = await Promise.all(
      seedIdentities.map((identity) => ensureSeedUser(storage, identity, now)),
    );
    const demoUser = users[0];

    if (!demoUser) {
      throw new Error("The demo account could not be initialized.");
    }

    await ensureDemoCredential(storage, demoUser.id, now);

    const deletedRecords = await clearWorkspaceCollections(storage);
    const result = await seedWorkspaceDemo(storage, {
      ownerUserId: demoUser.id,
      memberUserIds: users.slice(1).map((user) => user.id),
    });

    if (result.status !== "created") {
      throw new Error(
        `Workspace reset did not create a fresh demo workspace (${result.workspaceId}).`,
      );
    }

    console.log(
      `Reset ${deletedRecords} workspace records and seeded ${users.length} demo users, five projects, and twenty tasks. Auth users and sessions were preserved.`,
    );
    console.log("Demo sign-in: demo@puzzle-ui.com");
  } finally {
    await client.close();
  }
};

run().catch((error: unknown) => {
  console.error(
    "Workspace demo reset failed:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
