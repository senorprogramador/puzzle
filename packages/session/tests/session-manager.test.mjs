import test from "node:test";
import assert from "node:assert/strict";

import {
  SessionDataManager,
  SessionMigrationManager,
  SessionSecurityError,
  StorageSessionManager,
} from "../dist/index.js";
import { MemoryStorage } from "./fixtures/memory-storage.mjs";

const createHarness = () => {
  const storage = new MemoryStorage();

  let currentTime = new Date("2026-11-09T10:00:00.000Z");

  const sessions = new StorageSessionManager(storage, {
    lifetime: {
      idleTimeoutSeconds: 3600,
      absoluteLifetimeSeconds: 86400,
    },
    maximumSessionsPerUser: 10,
    touchIntervalSeconds: 60,
    clock: () => new Date(currentTime),
  });

  return {
    storage,
    sessions,
    clock: () => new Date(currentTime),
    setTime(value) {
      currentTime = new Date(value);
    },
  };
};

test("creates an anonymous session", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const result = await sessions.create({
    kind: "anonymous",
    userId: null,
  });

  assert.ok(result.session.id);
  assert.ok(result.token);
  assert.equal(result.session.kind, "anonymous");
  assert.equal(result.session.userId, null);
  assert.equal(result.session.revokedAt, null);
});

test("creates an authenticated session", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const result = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  assert.equal(result.session.userId, "user-1");
  assert.equal(result.session.kind, "authenticated");
});

test("rejects authenticated sessions without a user ID", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  await assert.rejects(
    () =>
      sessions.create({
        kind: "authenticated",
        userId: null,
      }),
    /user ID/,
  );
});

test("rejects anonymous sessions with a user ID", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  await assert.rejects(
    () =>
      sessions.create({
        kind: "anonymous",
        userId: "user-1",
      }),
    /cannot have a user ID/,
  );
});

test("validates a stored session token", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  const validated = await sessions.validate(created.token);

  assert.equal(validated.id, created.session.id);
});

test("does not expose raw tokens in persisted records", async () => {
  const { storage, sessions } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  const stored = await storage.findById("sessions", created.session.id);

  assert.notEqual(stored.tokenHash, created.token);
  assert.equal(stored.tokenHash.length > 0, true);
});

test("rejects unknown tokens", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  assert.equal(await sessions.validate("x".repeat(43)), null);
});

test("revokes an individual session", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  await sessions.revoke(created.session.id);

  assert.equal(await sessions.validate(created.token), null);
});

test("revokes every session belonging to a user", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const first = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  const second = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  await sessions.revokeAll("user-1");

  assert.equal(await sessions.validate(first.token), null);
  assert.equal(await sessions.validate(second.token), null);
});

test("rotates a session and invalidates its previous token", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const original = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  const rotated = await sessions.rotate({
    sessionId: original.session.id,
  });

  assert.notEqual(rotated.session.id, original.session.id);
  assert.notEqual(rotated.token, original.token);

  assert.equal(await sessions.validate(original.token), null);
  assert.ok(await sessions.validate(rotated.token));
});

test("lists active sessions with current-device metadata", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const first = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  const devices = await sessions.list("user-1", first.session.id);

  assert.equal(devices.length, 2);
  assert.equal(devices.filter((device) => device.current).length, 1);
});

test("does not validate an expired session", async () => {
  const { sessions, setTime } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  setTime("2026-11-09T12:00:01.000Z");

  assert.equal(await sessions.validate(created.token), null);
});

test("does not validate an absolutely expired session", async () => {
  const { sessions, setTime } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  setTime("2026-11-10T10:00:01.000Z");

  assert.equal(await sessions.validate(created.token), null);
});

test("touches a session after the configured interval", async () => {
  const { sessions, setTime } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  setTime("2026-11-09T10:02:00.000Z");

  const validated = await sessions.validate(created.token);

  assert.ok(validated);
  assert.equal(validated.lastSeenAt.toISOString(), "2026-11-09T10:02:00.000Z");
});

test("does not touch a session when touch is disabled", async () => {
  const { sessions, setTime } = createHarness();

  await sessions.initialize();

  const created = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  setTime("2026-11-09T10:02:00.000Z");

  const validated = await sessions.validate(created.token, { touch: false });

  assert.equal(
    validated.lastSeenAt.toISOString(),
    created.session.lastSeenAt.toISOString(),
  );
});

test("enforces the maximum session limit during concurrent creation", async () => {
  const storage = new MemoryStorage();

  const sessions = new StorageSessionManager(storage, {
    lifetime: {
      idleTimeoutSeconds: 3600,
      absoluteLifetimeSeconds: 86400,
    },
    maximumSessionsPerUser: 3,
    touchIntervalSeconds: 60,
  });

  await sessions.initialize();

  const created = await Promise.all(
    Array.from({ length: 12 }, () =>
      sessions.create({
        kind: "authenticated",
        userId: "concurrent-user",
      }),
    ),
  );

  assert.equal(created.length, 12);

  const devices = await sessions.list("concurrent-user");

  assert.equal(devices.length, 3);

  const allRecords = await storage.findMany("sessions", {
    where: {
      userId: {
        operator: "eq",
        value: "concurrent-user",
      },
    },
  });

  const active = allRecords.filter((session) => session.revokedAt === null);

  assert.equal(active.length, 3);
});

test("does not leave a session behind when atomic creation fails", async () => {
  const storage = new MemoryStorage();

  const sessions = new StorageSessionManager(storage, {
    maximumSessionsPerUser: 3,
  });

  await sessions.initialize();

  storage.failNextBatch = true;

  await assert.rejects(
    () =>
      sessions.create({
        kind: "authenticated",
        userId: "user-1",
      }),
    /Simulated transaction failure/,
  );

  assert.equal(await storage.count("sessions"), 0);

  assert.equal(await storage.count("session_user_locks"), 0);
});

test("does not exceed the session limit when multiple clients race", async () => {
  const storage = new MemoryStorage();

  const firstManager = new StorageSessionManager(storage, {
    maximumSessionsPerUser: 2,
  });

  const secondManager = new StorageSessionManager(storage, {
    maximumSessionsPerUser: 2,
  });

  await firstManager.initialize();
  await secondManager.initialize();

  await Promise.all([
    firstManager.create({
      kind: "authenticated",
      userId: "race-user",
    }),
    secondManager.create({
      kind: "authenticated",
      userId: "race-user",
    }),
    firstManager.create({
      kind: "authenticated",
      userId: "race-user",
    }),
    secondManager.create({
      kind: "authenticated",
      userId: "race-user",
    }),
  ]);

  assert.equal((await firstManager.list("race-user")).length, 2);
});

test("rejects rotation when another request already rotated the session", async () => {
  const { sessions } = createHarness();

  await sessions.initialize();

  const original = await sessions.create({
    kind: "authenticated",
    userId: "user-1",
  });

  const results = await Promise.allSettled([
    sessions.rotate({ sessionId: original.session.id }),
    sessions.rotate({ sessionId: original.session.id }),
  ]);

  assert.equal(
    results.filter((result) => result.status === "fulfilled").length,
    1,
  );

  assert.equal(
    results.filter((result) => result.status === "rejected").length,
    1,
  );

  const devices = await sessions.list("user-1");

  assert.equal(devices.length, 1);
});

test("migrates anonymous session data to a new authenticated session", async () => {
  const { storage, sessions, clock } = createHarness();

  await sessions.initialize();

  const data = new SessionDataManager(storage, {
    clock,
    allowedNamespaces: ["cart", "checkout"],
  });

  await data.initialize();

  const anonymous = await sessions.create({
    kind: "anonymous",
    userId: null,
  });

  await data.set(anonymous.session.id, "cart", "items", [
    { productId: "product-1", quantity: 2 },
  ]);

  const migration = new SessionMigrationManager(storage, {
    clock,
    allowedNamespaces: ["cart", "checkout"],
    idleTimeoutSeconds: 3600,
    absoluteLifetimeSeconds: 86400,
  });

  const result = await migration.migrate({
    anonymousSessionId: anonymous.session.id,
    userId: "user-1",
  });

  assert.equal(result.session.kind, "authenticated");
  assert.equal(result.session.userId, "user-1");
  assert.notEqual(result.session.id, anonymous.session.id);

  assert.equal(await sessions.validate(anonymous.token), null);

  assert.ok(await sessions.validate(result.token));

  assert.deepEqual(await data.get(result.session.id, "cart", "items"), [
    { productId: "product-1", quantity: 2 },
  ]);
});

test("does not migrate namespaces outside the allowlist", async () => {
  const { storage, sessions, clock } = createHarness();

  await sessions.initialize();

  const data = new SessionDataManager(storage, {
    clock,
    allowedNamespaces: ["cart", "admin"],
  });

  await data.initialize();

  const anonymous = await sessions.create({
    kind: "anonymous",
    userId: null,
  });

  await data.set(anonymous.session.id, "cart", "items", [1]);

  await data.set(anonymous.session.id, "admin", "permissions", ["admin"]);

  const migration = new SessionMigrationManager(storage, {
    clock,
    allowedNamespaces: ["cart"],
    idleTimeoutSeconds: 3600,
    absoluteLifetimeSeconds: 86400,
  });

  const result = await migration.migrate({
    anonymousSessionId: anonymous.session.id,
    userId: "user-1",
  });

  assert.deepEqual(await data.get(result.session.id, "cart", "items"), [1]);

  assert.equal(await data.get(result.session.id, "admin", "permissions"), null);
});

test("does not migrate expired session data", async () => {
  const storage = new MemoryStorage();

  let time = new Date("2026-11-09T10:00:00.000Z");

  const sessions = new StorageSessionManager(storage, {
    clock: () => new Date(time),
  });

  await sessions.initialize();

  const data = new SessionDataManager(storage, {
    allowedNamespaces: ["cart"],
    clock: () => new Date(time),
  });

  await data.initialize();

  const anonymous = await sessions.create({
    kind: "anonymous",
    userId: null,
  });

  await data.set(anonymous.session.id, "cart", "active", [1], 3600);

  await data.set(anonymous.session.id, "cart", "expired", [2], 60);

  time = new Date("2026-11-09T10:01:01.000Z");

  const migration = new SessionMigrationManager(storage, {
    allowedNamespaces: ["cart"],
    idleTimeoutSeconds: 3600,
    absoluteLifetimeSeconds: 86400,
    clock: () => new Date(time),
  });

  const result = await migration.migrate({
    anonymousSessionId: anonymous.session.id,
    userId: "user-1",
  });

  assert.deepEqual(await data.get(result.session.id, "cart", "active"), [1]);

  assert.equal(await data.get(result.session.id, "cart", "expired"), null);
});

test("supports custom merge strategies", async () => {
  const { storage, sessions, clock } = createHarness();

  await sessions.initialize();

  const data = new SessionDataManager(storage, {
    clock,
    allowedNamespaces: ["cart"],
  });

  await data.initialize();

  const anonymous = await sessions.create({
    kind: "anonymous",
    userId: null,
  });

  await data.set(anonymous.session.id, "cart", "first", [
    { productId: "a", quantity: 2 },
  ]);

  await data.set(anonymous.session.id, "cart", "second", [
    { productId: "a", quantity: 3 },
  ]);

  const records = await storage.findMany("session_data", {
    where: {
      ownerId: {
        operator: "eq",
        value: anonymous.session.id,
      },
    },
  });

  const migration = new SessionMigrationManager(storage, {
    clock,
    allowedNamespaces: ["cart"],
    idleTimeoutSeconds: 3600,
    absoluteLifetimeSeconds: 86400,

    merge: ({ records }) => {
      const quantities = new Map();

      for (const record of records) {
        for (const item of record.value) {
          quantities.set(
            item.productId,
            (quantities.get(item.productId) ?? 0) + item.quantity,
          );
        }
      }

      return [
        {
          sourceIds: records.map((record) => record.id),
          namespace: "cart",
          key: "items",
          value: [...quantities].map(([productId, quantity]) => ({
            productId,
            quantity,
          })),
          expiresAt: null,
        },
      ];
    },
  });

  const result = await migration.migrate({
    anonymousSessionId: anonymous.session.id,
    userId: "user-1",
  });

  assert.equal(result.migratedRecords, 1);

  assert.deepEqual(await data.get(result.session.id, "cart", "items"), [
    { productId: "a", quantity: 5 },
  ]);

  assert.equal(
    await storage.count("session_data", {
      where: {
        ownerId: {
          operator: "eq",
          value: result.session.id,
        },
      },
    }),
    1,
  );

  assert.equal(records.length, 2);
});

test("rejects repeated migration of the same anonymous session", async () => {
  const { storage, sessions, clock } = createHarness();

  await sessions.initialize();

  const anonymous = await sessions.create({
    kind: "anonymous",
    userId: null,
  });

  const migration = new SessionMigrationManager(storage, {
    clock,
    allowedNamespaces: ["cart"],
    idleTimeoutSeconds: 3600,
    absoluteLifetimeSeconds: 86400,
  });

  const first = await migration.migrate({
    anonymousSessionId: anonymous.session.id,
    userId: "user-1",
  });

  await assert.rejects(
    () =>
      migration.migrate({
        anonymousSessionId: anonymous.session.id,
        userId: "user-1",
      }),
    SessionSecurityError,
  );

  assert.ok(await sessions.validate(first.token));

  assert.equal(
    await storage.count("sessions", {
      where: {
        userId: {
          operator: "eq",
          value: "user-1",
        },
      },
    }),
    1,
  );
});

test("rolls back the entire migration when an atomic operation fails", async () => {
  const { storage, sessions, clock } = createHarness();

  await sessions.initialize();

  const data = new SessionDataManager(storage, {
    clock,
    allowedNamespaces: ["cart"],
  });

  await data.initialize();

  const anonymous = await sessions.create({
    kind: "anonymous",
    userId: null,
  });

  await data.set(anonymous.session.id, "cart", "items", [1]);

  const migration = new SessionMigrationManager(storage, {
    clock,
    allowedNamespaces: ["cart"],
    idleTimeoutSeconds: 3600,
    absoluteLifetimeSeconds: 86400,
  });

  storage.failNextBatch = true;

  await assert.rejects(
    () =>
      migration.migrate({
        anonymousSessionId: anonymous.session.id,
        userId: "user-1",
      }),
    /Simulated transaction failure/,
  );

  assert.ok(await sessions.validate(anonymous.token));

  assert.equal(
    await storage.count("sessions", {
      where: {
        userId: {
          operator: "eq",
          value: "user-1",
        },
      },
    }),
    0,
  );

  assert.deepEqual(await data.get(anonymous.session.id, "cart", "items"), [1]);
});

test("rejects migration callbacks that duplicate target keys", async () => {
  const { storage, sessions, clock } = createHarness();

  await sessions.initialize();

  const anonymous = await sessions.create({
    kind: "anonymous",
    userId: null,
  });

  const data = new SessionDataManager(storage, {
    clock,
    allowedNamespaces: ["cart"],
  });

  await data.initialize();

  await data.set(anonymous.session.id, "cart", "first", [1]);
  await data.set(anonymous.session.id, "cart", "second", [2]);

  const records = await storage.findMany("session_data", {
    where: {
      ownerId: {
        operator: "eq",
        value: anonymous.session.id,
      },
    },
  });

  const migration = new SessionMigrationManager(storage, {
    clock,
    allowedNamespaces: ["cart"],
    idleTimeoutSeconds: 3600,
    absoluteLifetimeSeconds: 86400,

    merge: () =>
      records.map((record) => ({
        sourceIds: [record.id],
        namespace: "cart",
        key: "duplicate",
        value: record.value,
        expiresAt: null,
      })),
  });

  await assert.rejects(
    () =>
      migration.migrate({
        anonymousSessionId: anonymous.session.id,
        userId: "user-1",
      }),
    /duplicate target keys/,
  );

  assert.ok(await sessions.validate(anonymous.token));
});
