import test from "node:test";
import assert from "node:assert/strict";

import { SessionDataManager } from "../dist/index.js";

import { MemoryStorage } from "./fixtures/memory-storage.mjs";

const createHarness = () => {
  const storage = new MemoryStorage();

  let time = new Date("2026-11-09T10:00:00.000Z");

  const data = new SessionDataManager(storage, {
    allowedNamespaces: ["cart", "checkout"],
    defaultTtlSeconds: 3600,
    maximumValueBytes: 1024,
    maximumRetries: 20,
    clock: () => new Date(time),
  });

  return {
    storage,
    data,
    setTime(value) {
      time = new Date(value);
    },
  };
};

test("stores and retrieves session data", async () => {
  const { data } = createHarness();

  await data.initialize();

  await data.set("session-1", "cart", "items", [
    { id: "product-1", quantity: 2 },
  ]);

  assert.deepEqual(await data.get("session-1", "cart", "items"), [
    { id: "product-1", quantity: 2 },
  ]);
});

test("updates an existing key instead of creating duplicates", async () => {
  const { storage, data } = createHarness();

  await data.initialize();

  await data.set("session-1", "cart", "items", [1]);
  await data.set("session-1", "cart", "items", [1, 2]);

  assert.equal(await storage.count("session_data"), 1);

  assert.deepEqual(await data.get("session-1", "cart", "items"), [1, 2]);
});

test("allows concurrent writes to the same key", async () => {
  const { storage, data } = createHarness();

  await data.initialize();

  await Promise.all(
    Array.from({ length: 10 }, (_, index) =>
      data.set("session-1", "cart", "items", { version: index }),
    ),
  );

  assert.equal(await storage.count("session_data"), 1);

  const value = await data.get("session-1", "cart", "items");

  assert.ok(value.version >= 0 && value.version < 10);
});

test("expires data after its TTL", async () => {
  const { data, setTime } = createHarness();

  await data.initialize();

  await data.set("session-1", "cart", "items", [1], 60);

  setTime("2026-11-09T10:01:01.000Z");

  assert.equal(await data.get("session-1", "cart", "items"), null);
});

test("removes expired records", async () => {
  const { data, setTime } = createHarness();

  await data.initialize();

  await data.set("session-1", "cart", "items", [1], 60);

  await data.set("session-1", "checkout", "state", { step: 1 }, 3600);

  setTime("2026-11-09T10:01:01.000Z");

  assert.equal(await data.removeExpired(), 1);
});

test("rejects unapproved namespaces", async () => {
  const { data } = createHarness();

  await data.initialize();

  await assert.rejects(
    () => data.set("session-1", "admin", "permissions", ["admin"]),
    /not allowed/,
  );
});

test("rejects values that exceed the size limit", async () => {
  const { data } = createHarness();

  await data.initialize();

  await assert.rejects(
    () => data.set("session-1", "cart", "items", "x".repeat(2048)),
    /maximum allowed size/,
  );
});

test("rejects unserializable values", async () => {
  const { data } = createHarness();

  await data.initialize();

  const circular = {};
  circular.self = circular;

  await assert.rejects(
    () => data.set("session-1", "cart", "items", circular),
    /JSON serializable/,
  );
});

test("isolates data between session owners", async () => {
  const { data } = createHarness();

  await data.initialize();

  await data.set("session-1", "cart", "items", [1]);
  await data.set("session-2", "cart", "items", [2]);

  assert.deepEqual(await data.get("session-1", "cart", "items"), [1]);

  assert.deepEqual(await data.get("session-2", "cart", "items"), [2]);
});

test("removes a key without affecting other keys", async () => {
  const { data } = createHarness();

  await data.initialize();

  await data.set("session-1", "cart", "items", [1]);
  await data.set("session-1", "cart", "coupon", "SAVE10");

  await data.remove("session-1", "cart", "items");

  assert.equal(await data.get("session-1", "cart", "items"), null);

  assert.equal(await data.get("session-1", "cart", "coupon"), "SAVE10");
});
