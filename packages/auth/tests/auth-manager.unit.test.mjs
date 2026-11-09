import test from "node:test";
import assert from "node:assert/strict";

import {
  AuthValidationError,
  createRateLimitKey,
  generateAuthId,
  normalizeDisplayName,
  normalizeEmail,
} from "../dist/index.js";

test("normalizes email addresses", () => {
  assert.equal(normalizeEmail("  USER@Example.COM "), "user@example.com");
});

test("rejects invalid email addresses", () => {
  assert.throws(() => normalizeEmail("not-an-email"), AuthValidationError);

  assert.throws(() => normalizeEmail(""), AuthValidationError);

  assert.throws(() => normalizeEmail("missing-domain@"), AuthValidationError);
});

test("normalizes display names", () => {
  assert.equal(normalizeDisplayName("  Example User  "), "Example User");

  assert.equal(normalizeDisplayName(""), null);
  assert.equal(normalizeDisplayName(null), null);
  assert.equal(normalizeDisplayName(undefined), null);
});

test("rejects overly long display names", () => {
  assert.throws(
    () => normalizeDisplayName("a".repeat(101)),
    AuthValidationError,
  );
});

test("generates unique authentication IDs", () => {
  const first = generateAuthId("user");
  const second = generateAuthId("user");

  assert.match(first, /^user_[a-f0-9]{32}$/);
  assert.match(second, /^user_[a-f0-9]{32}$/);
  assert.notEqual(first, second);
});

test("generates deterministic HMAC rate-limit keys", async () => {
  const first = await createRateLimitKey(
    "a-secure-test-secret-with-more-than-32-characters",
    "auth:signIn:email:user@example.com",
  );

  const second = await createRateLimitKey(
    "a-secure-test-secret-with-more-than-32-characters",
    "auth:signIn:email:user@example.com",
  );

  assert.equal(first, second);
  assert.ok(first.startsWith("hmac-sha256:"));
  assert.equal(first.includes("user@example.com"), false);
});

test("generates different rate-limit keys for different secrets", async () => {
  const first = await createRateLimitKey(
    "a-secure-test-secret-with-more-than-32-characters",
    "auth:signIn:email:user@example.com",
  );

  const second = await createRateLimitKey(
    "another-secure-test-secret-with-more-than-32-characters",
    "auth:signIn:email:user@example.com",
  );

  assert.notEqual(first, second);
});
