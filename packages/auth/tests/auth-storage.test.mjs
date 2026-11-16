import test from "node:test";
import assert from "node:assert/strict";

import {
  AUTH_ACTION_TOKEN_COLLECTION,
  AUTH_AUDIT_COLLECTION,
  AUTH_CREDENTIAL_COLLECTION,
  AUTH_MFA_CHALLENGE_COLLECTION,
  AUTH_MFA_FACTOR_COLLECTION,
  AUTH_RATE_LIMIT_COLLECTION,
  AUTH_RECOVERY_CODE_COLLECTION,
  AUTH_USER_COLLECTION,
  initializeAuthStorage,
} from "../dist/index.js";

import { MemoryStorage } from "./fixtures/auth-harness.mjs";

test("registers all authentication collections with defaults and indexes", async () => {
  const storage = new MemoryStorage();

  await initializeAuthStorage(storage);

  assert.deepEqual([...storage.definitions.keys()], [
    AUTH_USER_COLLECTION,
    AUTH_CREDENTIAL_COLLECTION,
    AUTH_ACTION_TOKEN_COLLECTION,
    AUTH_AUDIT_COLLECTION,
    AUTH_RATE_LIMIT_COLLECTION,
    AUTH_MFA_FACTOR_COLLECTION,
    AUTH_MFA_CHALLENGE_COLLECTION,
    AUTH_RECOVERY_CODE_COLLECTION,
  ]);
  assert.ok(
    storage.definitions
      .get(AUTH_USER_COLLECTION)
      .indexes.some((index) => index.name === "normalized_email_unique" && index.unique),
  );
  assert.ok(
    storage.definitions
      .get(AUTH_ACTION_TOKEN_COLLECTION)
      .indexes.some((index) => index.name === "token_hash_unique" && index.unique),
  );
  assert.ok(
    storage.definitions
      .get(AUTH_MFA_CHALLENGE_COLLECTION)
      .indexes.some((index) => index.name === "mfa_challenge_token_unique" && index.unique),
  );
});

test("supports custom authentication collection names", async () => {
  const storage = new MemoryStorage();

  await initializeAuthStorage(storage, {
    usersCollection: "users",
    credentialsCollection: "credentials",
    actionTokensCollection: "action_tokens",
    auditCollection: "audit",
    rateLimitsCollection: "rate_limits",
    factorsCollection: "factors",
    challengesCollection: "challenges",
    recoveryCodesCollection: "recovery_codes",
  });

  assert.deepEqual([...storage.definitions.keys()], [
    "users",
    "credentials",
    "action_tokens",
    "audit",
    "rate_limits",
    "factors",
    "challenges",
    "recovery_codes",
  ]);
});

test("supports concurrent initialization calls", async () => {
  const storage = new MemoryStorage();

  await Promise.all([
    initializeAuthStorage(storage),
    initializeAuthStorage(storage),
  ]);

  assert.equal(storage.definitions.size, 8);
});

test("rejects adapters without required atomic and uniqueness capabilities", async () => {
  const storage = new MemoryStorage();
  storage.capabilities.atomicBatch = false;

  await assert.rejects(
    () => initializeAuthStorage(storage),
    /requires unique constraints and atomic batches/,
  );
  assert.equal(storage.definitions.size, 0);
});
