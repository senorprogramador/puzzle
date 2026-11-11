import test from "node:test";
import assert from "node:assert/strict";

import {
  AuthConfigurationError,
  StorageRateLimitProvider,
  AUTH_RATE_LIMIT_COLLECTION,
} from "../dist/index.js";

import { MemoryStorage } from "./fixtures/auth-harness.mjs";

const createHarness = async () => {
  const storage = new MemoryStorage();

  let currentTime = new Date("2026-01-01T00:00:00.000Z");

  const provider = new StorageRateLimitProvider(storage, {
    clock: () => new Date(currentTime),
    maximumRetries: 64,
  });

  await provider.initialize();

  return {
    storage,
    provider,
    setTime(value) {
      currentTime = new Date(value);
    },
    advanceTime(milliseconds) {
      currentTime = new Date(currentTime.getTime() + milliseconds);
    },
  };
};

test("enforces rate limits across concurrent requests", async () => {
  const harness = await createHarness();

  const results = await Promise.all(
    Array.from({ length: 6 }, () =>
      harness.provider.consume({
        key: "hmac-sha256:test-login-ip",
        limit: 2,
        windowSeconds: 60,
      }),
    ),
  );

  const allowed = results.filter((result) => result.allowed);
  const rejected = results.filter((result) => !result.allowed);

  assert.equal(allowed.length, 2);
  assert.equal(rejected.length, 4);

  assert.ok(
    results.every(
      (result) =>
        result.remaining >= 0 &&
        result.remaining <= 2 &&
        result.resetAt instanceof Date,
    ),
  );

  const stored = await harness.storage.findById(
    AUTH_RATE_LIMIT_COLLECTION,
    "hmac-sha256:test-login-ip",
  );

  assert.ok(stored);
  assert.equal(stored.count, 6);
  assert.equal(stored.revision, 6);
});

test("resets the rate-limit counter after the configured window", async () => {
  const harness = await createHarness();

  const first = await harness.provider.consume({
    key: "hmac-sha256:test-reset",
    limit: 1,
    windowSeconds: 60,
  });

  assert.equal(first.allowed, true);
  assert.equal(first.remaining, 0);

  const second = await harness.provider.consume({
    key: "hmac-sha256:test-reset",
    limit: 1,
    windowSeconds: 60,
  });

  assert.equal(second.allowed, false);
  assert.equal(second.remaining, 0);

  harness.advanceTime(60_000);

  const third = await harness.provider.consume({
    key: "hmac-sha256:test-reset",
    limit: 1,
    windowSeconds: 60,
  });

  assert.equal(third.allowed, true);
  assert.equal(third.remaining, 0);

  const stored = await harness.storage.findById(
    AUTH_RATE_LIMIT_COLLECTION,
    "hmac-sha256:test-reset",
  );

  assert.equal(stored.count, 1);
  assert.equal(
    stored.resetAt.getTime(),
    Date.parse("2026-01-01T00:02:00.000Z"),
  );
});

test("restarts the rate-limit window when its duration changes", async () => {
  const harness = await createHarness();

  await harness.provider.consume({
    key: "hmac-sha256:test-window-change",
    limit: 1,
    windowSeconds: 60,
  });

  const blocked = await harness.provider.consume({
    key: "hmac-sha256:test-window-change",
    limit: 1,
    windowSeconds: 60,
  });

  assert.equal(blocked.allowed, false);

  const changedWindow = await harness.provider.consume({
    key: "hmac-sha256:test-window-change",
    limit: 1,
    windowSeconds: 120,
  });

  assert.equal(changedWindow.allowed, true);

  const stored = await harness.storage.findById(
    AUTH_RATE_LIMIT_COLLECTION,
    "hmac-sha256:test-window-change",
  );

  assert.equal(stored.count, 1);
  assert.equal(stored.windowSeconds, 120);
  assert.equal(
    stored.resetAt.getTime(),
    Date.parse("2026-01-01T00:02:00.000Z"),
  );
});

test("fails closed when rate-limit storage is unavailable", async () => {
  const harness = await createHarness();

  harness.storage.failNextBatch = true;

  await assert.rejects(
    () =>
      harness.provider.consume({
        key: "hmac-sha256:storage-outage",
        limit: 5,
        windowSeconds: 60,
      }),
    /Simulated atomic batch failure/,
  );

  const recovered = await harness.provider.consume({
    key: "hmac-sha256:storage-outage",
    limit: 5,
    windowSeconds: 60,
  });

  assert.equal(recovered.allowed, true);
  assert.equal(recovered.remaining, 4);

  const stored = await harness.storage.findById(
    AUTH_RATE_LIMIT_COLLECTION,
    "hmac-sha256:storage-outage",
  );

  assert.equal(stored.count, 1);
  assert.equal(stored.revision, 1);
});

test("rejects invalid rate-limit requests", async () => {
  const harness = await createHarness();

  await assert.rejects(
    () =>
      harness.provider.consume({
        key: "",
        limit: 1,
        windowSeconds: 60,
      }),
    AuthConfigurationError,
  );

  await assert.rejects(
    () =>
      harness.provider.consume({
        key: "test",
        limit: 0,
        windowSeconds: 60,
      }),
    AuthConfigurationError,
  );

  await assert.rejects(
    () =>
      harness.provider.consume({
        key: "test",
        limit: 1,
        windowSeconds: 0,
      }),
    AuthConfigurationError,
  );

  await assert.rejects(
    () =>
      harness.provider.consume({
        key: "test",
        limit: 1,
        windowSeconds: Number.NaN,
      }),
    AuthConfigurationError,
  );
});

test("rejects invalid retry configuration", () => {
  assert.throws(
    () =>
      new StorageRateLimitProvider(new MemoryStorage(), {
        maximumRetries: 0,
      }),
    AuthConfigurationError,
  );
});
