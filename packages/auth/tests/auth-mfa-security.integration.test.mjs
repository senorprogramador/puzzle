import test from "node:test";
import assert from "node:assert/strict";

import {
  StorageAuthManager,
  StorageAuthMfaManager,
  WebCryptoAuthSecretProtector,
  AUTH_MFA_FACTOR_COLLECTION,
  AUTH_MFA_CHALLENGE_COLLECTION,
  generateTotpCode,
} from "../dist/index.js";

import {
  MemoryStorage,
  FakePasswordHasher,
  FakeRateLimitProvider,
  FakeSessionManager,
} from "./fixtures/auth-harness.mjs";

const RATE_LIMIT_SECRET = "test-only-mfa-security-rate-limit-secret-000000";

const PASSWORD = "correct-horse-battery-staple";

const createHarness = async () => {
  let currentTime = new Date("2026-01-01T00:00:00.000Z");

  const clock = () => new Date(currentTime);

  const storage = new MemoryStorage();
  const passwordHasher = new FakePasswordHasher();
  const rateLimitProvider = new FakeRateLimitProvider();
  const sessions = new FakeSessionManager();

  const secretProtector = new WebCryptoAuthSecretProtector({
    currentKeyId: "test-key",
    keys: {
      "test-key": new Uint8Array(32).fill(42),
    },
  });

  const mfa = new StorageAuthMfaManager(
    {
      storage,
      sessions,
      passwordHasher,
      rateLimitProvider,
      secretProtector,
    },
    {
      rateLimitKeySecret: RATE_LIMIT_SECRET,
      issuer: "Puzzle Test",
      requireVerifiedEmail: false,
      clock,
    },
  );

  await mfa.initialize();

  const auth = new StorageAuthManager(
    {
      storage,
      passwordHasher,
      rateLimitProvider,
      sessions,
      mfa,
    },
    {
      rateLimitKeySecret: RATE_LIMIT_SECRET,
      requireVerifiedEmail: false,
      clock,
    },
  );

  await auth.initialize();

  const registered = await auth.register({
    email: "security@example.com",
    password: PASSWORD,
    name: "Security User",
    ipAddress: "127.0.0.1",
  });

  const advanceTime = (milliseconds) => {
    currentTime = new Date(currentTime.getTime() + milliseconds);
  };

  const createCurrentTotpCode = (secret) =>
    generateTotpCode(secret, currentTime.getTime(), {
      digits: 6,
      periodSeconds: 30,
    });

  return {
    auth,
    mfa,
    storage,
    sessions,
    rateLimitProvider,
    registered,
    advanceTime,
    createCurrentTotpCode,
  };
};

const enrollTotp = async (harness) => {
  const started = await harness.mfa.beginTotpEnrollment({
    sessionToken: harness.registered.token,
    currentPassword: PASSWORD,
    ipAddress: "127.0.0.1",
    label: "Security test authenticator",
  });

  const code = await harness.createCurrentTotpCode(started.secret);

  const completed = await harness.mfa.verifyTotpEnrollment({
    sessionToken: harness.registered.token,
    factorId: started.factorId,
    code,
    ipAddress: "127.0.0.1",
  });

  assert.equal(completed.factor.status, "active");
  assert.equal(completed.recoveryCodes.length, 10);

  return {
    started,
    completed,
  };
};

const signInWithPassword = async (harness) => {
  const result = await harness.auth.signIn({
    email: "security@example.com",
    password: PASSWORD,
    ipAddress: "127.0.0.1",
  });

  assert.equal(result.status, "mfa-pending");

  return result;
};

test("expired MFA challenges cannot be used to authenticate", async () => {
  const harness = await createHarness();

  const enrollment = await enrollTotp(harness);

  await harness.auth.signOut(harness.registered.token);

  const pending = await signInWithPassword(harness);

  const code = await harness.createCurrentTotpCode(enrollment.started.secret);

  harness.advanceTime(301_000);

  const sessionsBefore = harness.sessions.sessions.size;

  await assert.rejects(() =>
    harness.mfa.verifySignInTotp({
      challengeToken: pending.challengeToken,
      code,
      ipAddress: "127.0.0.1",
    }),
  );

  assert.equal(harness.sessions.sessions.size, sessionsBefore);
});

test("MFA verification is rejected when the rate limiter denies the request", async () => {
  const harness = await createHarness();

  const enrollment = await enrollTotp(harness);

  await harness.auth.signOut(harness.registered.token);

  const pending = await signInWithPassword(harness);

  const code = await harness.createCurrentTotpCode(enrollment.started.secret);

  const sessionsBefore = harness.sessions.sessions.size;

  harness.rateLimitProvider.denyNext = true;

  await assert.rejects(() =>
    harness.mfa.verifySignInTotp({
      challengeToken: pending.challengeToken,
      code,
      ipAddress: "127.0.0.1",
    }),
  );

  assert.equal(harness.sessions.sessions.size, sessionsBefore);
});

test("repeated invalid TOTP attempts consume the challenge at the configured limit", async () => {
  const harness = await createHarness();

  const enrollment = await enrollTotp(harness);

  await harness.auth.signOut(harness.registered.token);

  harness.advanceTime(30_000);

  const pending = await signInWithPassword(harness);
  const sessionsBefore = harness.sessions.sessions.size;
  const challenge = await harness.storage.findById(
    AUTH_MFA_CHALLENGE_COLLECTION,
    pending.challengeId,
  );

  for (let attempt = 0; attempt < challenge.maximumAttempts; attempt++) {
    await assert.rejects(() =>
      harness.mfa.verifySignInTotp({
        challengeToken: pending.challengeToken,
        code: "invalid",
        ipAddress: "127.0.0.1",
      }),
    );
  }

  const consumedChallenge = await harness.storage.findById(
    AUTH_MFA_CHALLENGE_COLLECTION,
    pending.challengeId,
  );

  assert.equal(consumedChallenge.attemptCount, challenge.maximumAttempts);
  assert.ok(consumedChallenge.consumedAt instanceof Date);

  const validCode = await harness.createCurrentTotpCode(
    enrollment.started.secret,
  );

  await assert.rejects(() =>
    harness.mfa.verifySignInTotp({
      challengeToken: pending.challengeToken,
      code: validCode,
      ipAddress: "127.0.0.1",
    }),
  );

  assert.equal(harness.sessions.sessions.size, sessionsBefore);
  assert.equal(await harness.sessions.validate(harness.registered.token), null);
});

test("a recovery code can only be consumed once across concurrent challenges", async () => {
  const harness = await createHarness();

  const enrollment = await enrollTotp(harness);

  const recoveryCode = enrollment.completed.recoveryCodes[0];

  await harness.auth.signOut(harness.registered.token);

  const firstChallenge = await signInWithPassword(harness);
  const secondChallenge = await signInWithPassword(harness);

  assert.notEqual(
    firstChallenge.challengeToken,
    secondChallenge.challengeToken,
  );

  const results = await Promise.allSettled([
    harness.mfa.verifySignInRecoveryCode({
      challengeToken: firstChallenge.challengeToken,
      code: recoveryCode,
      ipAddress: "127.0.0.1",
    }),
    harness.mfa.verifySignInRecoveryCode({
      challengeToken: secondChallenge.challengeToken,
      code: recoveryCode,
      ipAddress: "127.0.0.1",
    }),
  ]);

  assert.equal(
    results.filter((result) => result.status === "fulfilled").length,
    1,
  );

  assert.equal(
    results.filter((result) => result.status === "rejected").length,
    1,
  );
});

test("removing the last factor invalidates outstanding sign-in challenges", async () => {
  const harness = await createHarness();

  const enrollment = await enrollTotp(harness);

  const pending = await signInWithPassword(harness);

  await harness.mfa.removeFactor({
    sessionToken: harness.registered.token,
    factorId: enrollment.completed.factor.id,
    currentPassword: PASSWORD,
    ipAddress: "127.0.0.1",
  });

  const code = await harness.createCurrentTotpCode(enrollment.started.secret);

  await assert.rejects(() =>
    harness.mfa.verifySignInTotp({
      challengeToken: pending.challengeToken,
      code,
      ipAddress: "127.0.0.1",
    }),
  );

  const factors = await harness.storage.findMany(AUTH_MFA_FACTOR_COLLECTION, {
    where: {
      userId: {
        operator: "eq",
        value: harness.registered.user.id,
      },
    },
  });

  assert.equal(factors.length, 0);
});

test("encrypted TOTP secrets reject modified ciphertext", async () => {
  const protector = new WebCryptoAuthSecretProtector({
    currentKeyId: "test-key",
    keys: {
      "test-key": new Uint8Array(32).fill(42),
    },
  });

  const encrypted = await protector.encrypt("JBSWY3DPEHPK3PXP");

  const modifiedCiphertext = {
    ...encrypted,
    ciphertext:
      (encrypted.ciphertext[0] === "A" ? "B" : "A") +
      encrypted.ciphertext.slice(1),
  };

  await assert.rejects(() => protector.decrypt(modifiedCiphertext));
});

test("encrypted TOTP secrets reject unknown encryption key IDs", async () => {
  const protector = new WebCryptoAuthSecretProtector({
    currentKeyId: "test-key",
    keys: {
      "test-key": new Uint8Array(32).fill(42),
    },
  });

  const encrypted = await protector.encrypt("JBSWY3DPEHPK3PXP");

  await assert.rejects(() =>
    protector.decrypt({
      ...encrypted,
      keyId: "retired-key",
    }),
  );
});

test("encrypted TOTP secrets cannot be decrypted with a different key", async () => {
  const originalProtector = new WebCryptoAuthSecretProtector({
    currentKeyId: "test-key",
    keys: {
      "test-key": new Uint8Array(32).fill(42),
    },
  });

  const differentProtector = new WebCryptoAuthSecretProtector({
    currentKeyId: "test-key",
    keys: {
      "test-key": new Uint8Array(32).fill(84),
    },
  });

  const encrypted = await originalProtector.encrypt("JBSWY3DPEHPK3PXP");

  await assert.rejects(() => differentProtector.decrypt(encrypted));
});
