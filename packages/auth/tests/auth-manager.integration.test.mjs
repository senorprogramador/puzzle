import test from "node:test";
import assert from "node:assert/strict";

import {
  AuthAccountConflictError,
  AuthConfigurationError,
  AuthInvalidCredentialsError,
  AuthRateLimitError,
  AuthSessionError,
  AuthValidationError,
} from "../dist/index.js";

import { createAuthHarness } from "./fixtures/auth-harness.mjs";

const registrationInput = {
  email: "user@example.com",
  password: "a-secure-password",
  name: "Example User",
  ipAddress: "192.0.2.10",
};

const signInInput = {
  email: "user@example.com",
  password: "a-secure-password",
  ipAddress: "192.0.2.10",
};

test("registers a user and creates an authenticated session", async () => {
  const { auth, storage, sessions } = await createAuthHarness();

  const result = await auth.register(registrationInput);

  assert.equal(result.user.email, "user@example.com");
  assert.equal(result.user.name, "Example User");
  assert.equal(result.user.emailVerifiedAt, null);

  assert.equal(result.session.userId, result.user.id);
  assert.equal(result.session.kind, "authenticated");

  assert.ok(result.token);

  assert.equal(await storage.count("auth_users"), 1);
  assert.equal(await storage.count("auth_credentials"), 1);

  assert.ok(await sessions.validate(result.token));
});

test("normalizes the email before storing the user", async () => {
  const { auth, storage } = await createAuthHarness();

  const result = await auth.register({
    ...registrationInput,
    email: "  USER@Example.COM  ",
  });

  assert.equal(result.user.email, "user@example.com");

  const user = await storage.findById("auth_users", result.user.id);

  assert.equal(user.normalizedEmail, "user@example.com");
});

test("does not expose internal storage fields through the public user", async () => {
  const { auth } = await createAuthHarness();

  const result = await auth.register(registrationInput);

  assert.equal(Object.hasOwn(result.user, "normalizedEmail"), false);

  assert.equal(Object.hasOwn(result.user, "passwordHash"), false);
});

test("persists a password hash instead of the plaintext password", async () => {
  const { auth, storage } = await createAuthHarness();

  await auth.register(registrationInput);

  const credentials = storage.collections.get("auth_credentials");
  const credential = [...credentials.values()][0];

  assert.ok(credential);

  assert.notEqual(credential.passwordHash.hash, registrationInput.password);

  assert.equal(credential.passwordHash.algorithm, "argon2id");

  assert.equal(
    credential.passwordHash.hash,
    `test-hash:${registrationInput.password}`,
  );
});

test("creates user and password credential atomically", async () => {
  const { auth, storage } = await createAuthHarness();

  storage.failNextBatch = true;

  await assert.rejects(
    () => auth.register(registrationInput),
    /Simulated atomic batch failure/,
  );

  assert.equal(await storage.count("auth_users"), 0);
  assert.equal(await storage.count("auth_credentials"), 0);
});

test("rejects duplicate normalized email addresses", async () => {
  const { auth, storage, sessions } = await createAuthHarness();

  await auth.register(registrationInput);

  await assert.rejects(
    () =>
      auth.register({
        ...registrationInput,
        email: "USER@EXAMPLE.COM",
      }),
    AuthAccountConflictError,
  );

  assert.equal(await storage.count("auth_users"), 1);
  assert.equal(await storage.count("auth_credentials"), 1);

  // The duplicate registration must not create another session.
  assert.equal(sessions.sequence, 1);
});

test("handles concurrent registration for the same email", async () => {
  const { auth, storage, sessions } = await createAuthHarness();

  const results = await Promise.allSettled([
    auth.register(registrationInput),
    auth.register(registrationInput),
  ]);

  const successful = results.filter((result) => result.status === "fulfilled");

  const rejected = results.filter((result) => result.status === "rejected");

  assert.equal(successful.length, 1);
  assert.equal(rejected.length, 1);

  assert.ok(rejected[0].reason instanceof AuthAccountConflictError);

  assert.equal(await storage.count("auth_users"), 1);
  assert.equal(await storage.count("auth_credentials"), 1);
  assert.equal(sessions.sequence, 1);
});

test("requires initialization before registration", async () => {
  const { storage, passwordHasher, rateLimitProvider, sessions } =
    await createAuthHarness();

  const { StorageAuthManager } = await import("../dist/index.js");

  const auth = new StorageAuthManager(
    {
      storage,
      passwordHasher,
      rateLimitProvider,
      sessions,
    },
    {
      rateLimitKeySecret: "test-only-auth-rate-limit-secret-000000",
    },
  );

  await assert.rejects(
    () => auth.register(registrationInput),
    AuthConfigurationError,
  );
});

test("rejects invalid passwords during registration", async () => {
  const { auth, storage } = await createAuthHarness();

  await assert.rejects(
    () =>
      auth.register({
        ...registrationInput,
        password: "short",
      }),
    AuthValidationError,
  );

  assert.equal(await storage.count("auth_users"), 0);
});

test("rejects invalid client IP addresses", async () => {
  const { auth } = await createAuthHarness();

  await assert.rejects(
    () =>
      auth.register({
        ...registrationInput,
        ipAddress: "",
      }),
    AuthValidationError,
  );
});

test("applies registration rate limits", async () => {
  const { auth, storage, rateLimitProvider } = await createAuthHarness();

  rateLimitProvider.denyNext = true;

  await assert.rejects(
    () => auth.register(registrationInput),
    AuthRateLimitError,
  );

  assert.equal(rateLimitProvider.calls.length, 1);
  assert.equal(await storage.count("auth_users"), 0);
});

test("does not expose email addresses or IP addresses in rate-limit keys", async () => {
  const { auth, rateLimitProvider } = await createAuthHarness();

  await auth.register(registrationInput);

  for (const call of rateLimitProvider.calls) {
    assert.equal(call.key.includes(registrationInput.email), false);

    assert.equal(call.key.includes(registrationInput.ipAddress), false);

    assert.ok(call.key.startsWith("hmac-sha256:"));
  }
});

test("signs in using normalized email addresses", async () => {
  const { auth } = await createAuthHarness();

  await auth.register(registrationInput);

  const result = await auth.signIn({
    ...signInInput,
    email: " USER@EXAMPLE.COM ",
  });

  assert.equal(result.user.email, "user@example.com");
  assert.equal(result.session.userId, result.user.id);
  assert.equal(result.session.kind, "authenticated");
});

test("rejects incorrect passwords with a generic error", async () => {
  const { auth } = await createAuthHarness();

  await auth.register(registrationInput);

  await assert.rejects(
    () =>
      auth.signIn({
        ...signInInput,
        password: "incorrect-password",
      }),
    AuthInvalidCredentialsError,
  );
});

test("rejects unknown accounts with the same credentials error", async () => {
  const { auth } = await createAuthHarness();

  await assert.rejects(
    () =>
      auth.signIn({
        email: "unknown@example.com",
        password: "a-secure-password",
        ipAddress: "192.0.2.10",
      }),
    AuthInvalidCredentialsError,
  );
});

test("verifies passwords even when an account does not exist", async () => {
  const { auth, passwordHasher } = await createAuthHarness();

  await assert.rejects(
    () =>
      auth.signIn({
        email: "unknown@example.com",
        password: "a-secure-password",
        ipAddress: "192.0.2.10",
      }),
    AuthInvalidCredentialsError,
  );

  assert.equal(passwordHasher.verifyCalls.length, 1);
});

test("applies sign-in rate limits", async () => {
  const { auth, rateLimitProvider } = await createAuthHarness();

  await auth.register(registrationInput);

  rateLimitProvider.denyNext = true;

  await assert.rejects(() => auth.signIn(signInInput), AuthRateLimitError);
});

test("fails closed when the rate-limit provider is unavailable", async () => {
  const { storage, passwordHasher, sessions } = await createAuthHarness();

  const { StorageAuthManager } = await import("../dist/index.js");

  const auth = new StorageAuthManager(
    {
      storage,
      passwordHasher,
      sessions,
      rateLimitProvider: {
        async consume() {
          throw new Error("Rate limiter unavailable");
        },
      },
    },
    {
      rateLimitKeySecret: "test-only-auth-rate-limit-secret-000000",
    },
  );

  await auth.initialize();

  await assert.rejects(
    () => auth.register(registrationInput),
    /rate limiter is unavailable/,
  );

  assert.equal(await storage.count("auth_users"), 0);
});

test("retrieves the current user from a valid session", async () => {
  const { auth } = await createAuthHarness();

  const registered = await auth.register(registrationInput);

  const user = await auth.getCurrentUser(registered.token);

  assert.equal(user.id, registered.user.id);
  assert.equal(user.email, registered.user.email);
});

test("returns null for invalid sessions", async () => {
  const { auth } = await createAuthHarness();

  assert.equal(await auth.getCurrentUser("invalid-session"), null);
});

test("returns authenticated state for valid sessions", async () => {
  const { auth } = await createAuthHarness();

  const registered = await auth.register(registrationInput);

  const state = await auth.getAuthState(registered.token);

  assert.deepEqual(state, {
    status: "authenticated",
    userId: registered.user.id,
    sessionId: registered.session.id,
  });
});

test("returns unauthenticated state for invalid sessions", async () => {
  const { auth } = await createAuthHarness();

  assert.deepEqual(await auth.getAuthState("invalid-session"), {
    status: "unauthenticated",
  });
});

test("signs out the current session", async () => {
  const { auth, sessions } = await createAuthHarness();

  const registered = await auth.register(registrationInput);

  await auth.signOut(registered.token);

  assert.equal(await sessions.validate(registered.token), null);

  assert.equal(await auth.getCurrentUser(registered.token), null);
});

test("sign out is safe for unknown tokens", async () => {
  const { auth } = await createAuthHarness();

  await assert.doesNotReject(() => auth.signOut("unknown-token"));
});

test("signs out all sessions belonging to a user", async () => {
  const { auth, sessions } = await createAuthHarness();

  const first = await auth.register(registrationInput);

  const second = await auth.signIn(signInInput);

  assert.ok(await sessions.validate(first.token));
  assert.ok(await sessions.validate(second.token));

  await auth.signOutEverywhere(first.user.id);

  assert.equal(await sessions.validate(first.token), null);
  assert.equal(await sessions.validate(second.token), null);
});

test("keeps a valid account when session creation fails", async () => {
  const { auth, storage, sessions } = await createAuthHarness();

  sessions.failNextCreate = true;

  await assert.rejects(
    () => auth.register(registrationInput),
    AuthSessionError,
  );

  assert.equal(await storage.count("auth_users"), 1);
  assert.equal(await storage.count("auth_credentials"), 1);

  // The account remains usable after the temporary session failure.
  const result = await auth.signIn(signInInput);

  assert.equal(result.user.email, "user@example.com");
  assert.ok(result.token);
});

test("rejects an uninitialized manager with a clear error", async () => {
  const { storage, passwordHasher, rateLimitProvider, sessions } =
    await createAuthHarness();

  const { StorageAuthManager } = await import("../dist/index.js");

  const manager = new StorageAuthManager(
    {
      storage,
      passwordHasher,
      rateLimitProvider,
      sessions,
    },
    {
      rateLimitKeySecret: "test-only-auth-rate-limit-secret-000000",
    },
  );

  await assert.rejects(() => manager.getCurrentUser("token"), /initialized/);
});
