import test from "node:test";
import assert from "node:assert/strict";

import {
  AuthConfigurationError,
  AuthInvalidCredentialsError,
  Pbkdf2PasswordHasher,
  StorageAuthManager,
} from "../dist/index.js";

import {
  FakeRateLimitProvider,
  FakeSessionManager,
  MemoryStorage,
} from "./fixtures/auth-harness.mjs";

const pepper = new Uint8Array(32).fill(7);

test("hashes passwords as salted PBKDF2-SHA256", async () => {
  const hasher = new Pbkdf2PasswordHasher({ pepper });

  const first = await hasher.hash("a-secure-password");
  const second = await hasher.hash("a-secure-password");

  assert.equal(first.algorithm, "pbkdf2-sha256");
  assert.match(first.hash, /^\$pbkdf2-sha256\$i=100000\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/);
  assert.deepEqual(first.parameters, {
    iterations: 100000,
    pepper: "hmac-sha256",
  });
  assert.notEqual(first.hash, second.hash);
});

test("verifies only the original password", async () => {
  const hasher = new Pbkdf2PasswordHasher({ pepper });
  const stored = await hasher.hash("a-secure-password");

  assert.equal(await hasher.verify("a-secure-password", stored), true);
  assert.equal(await hasher.verify("a-secure-passworD", stored), false);
  assert.equal(await hasher.verify("", stored), false);
});

test("cannot verify a hash without the original pepper", async () => {
  const stored = await new Pbkdf2PasswordHasher({ pepper }).hash(
    "a-secure-password",
  );

  const otherPepper = new Pbkdf2PasswordHasher({
    pepper: new Uint8Array(32).fill(8),
  });

  assert.equal(await otherPepper.verify("a-secure-password", stored), false);
});

test("rejects weak configuration", () => {
  assert.throws(
    () => new Pbkdf2PasswordHasher({ pepper: new Uint8Array(31) }),
    AuthConfigurationError,
  );

  assert.throws(
    () => new Pbkdf2PasswordHasher({ pepper, iterations: 99_999 }),
    AuthConfigurationError,
  );
});

test("rejects malformed and foreign hashes", async () => {
  const hasher = new Pbkdf2PasswordHasher({ pepper });

  await assert.rejects(
    () =>
      hasher.verify("password", {
        algorithm: "argon2id",
        hash: "$argon2id$v=19$m=19456,t=2,p=1$c2FsdA$aGFzaA",
        parameters: {},
      }),
    AuthConfigurationError,
  );

  await assert.rejects(
    () =>
      hasher.verify("password", {
        algorithm: "pbkdf2-sha256",
        hash: "$pbkdf2-sha256$i=1$c2FsdA$aGFzaA",
        parameters: {},
      }),
    AuthConfigurationError,
  );
});

test("requests a rehash when the iteration count increases", async () => {
  const stored = await new Pbkdf2PasswordHasher({ pepper }).hash("password");

  assert.equal(new Pbkdf2PasswordHasher({ pepper }).needsRehash(stored), false);
  assert.equal(
    new Pbkdf2PasswordHasher({ pepper, iterations: 600_000 }).needsRehash(
      stored,
    ),
    true,
  );
  assert.equal(
    new Pbkdf2PasswordHasher({ pepper }).needsRehash({
      algorithm: "argon2id",
      hash: "$argon2id$",
      parameters: {},
    }),
    true,
  );
});

test("registers and signs in with StorageAuthManager", async () => {
  const auth = new StorageAuthManager(
    {
      storage: new MemoryStorage(),
      passwordHasher: new Pbkdf2PasswordHasher({ pepper }),
      rateLimitProvider: new FakeRateLimitProvider(),
      sessions: new FakeSessionManager(),
    },
    {
      rateLimitKeySecret: "test-only-auth-rate-limit-secret-000000",
    },
  );

  await auth.initialize();

  await auth.register({
    email: "user@example.com",
    password: "a-secure-password",
    name: "Example User",
    ipAddress: "192.0.2.10",
  });

  const signedIn = await auth.signIn({
    email: "user@example.com",
    password: "a-secure-password",
    ipAddress: "192.0.2.10",
  });

  assert.equal(signedIn.user.email, "user@example.com");

  await assert.rejects(
    () =>
      auth.signIn({
        email: "user@example.com",
        password: "the-wrong-password",
        ipAddress: "192.0.2.10",
      }),
    AuthInvalidCredentialsError,
  );
});
