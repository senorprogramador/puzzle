import test from "node:test";
import assert from "node:assert/strict";

import { StorageAuthStepUpManager } from "../dist/index.js";

import { MemoryStorage, FakeSessionManager } from "./fixtures/auth-harness.mjs";

const createUser = () => ({
  id: "user-1",
  email: "user@example.com",
  emailVerifiedAt: new Date(),
  name: "Test User",
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const toAuthSession = (session) => ({
  id: session.id,
  userId: session.userId,
  kind: "authenticated",
  createdAt: session.createdAt,
  lastSeenAt: session.lastSeenAt,
  expiresAt: session.expiresAt,
  revokedAt: session.revokedAt,
});

const createHarness = async () => {
  const storage = new MemoryStorage();
  const sessions = new FakeSessionManager();

  const current = await sessions.create({
    userId: "user-1",
    kind: "authenticated",
  });

  const challenge = {
    status: "mfa-pending",
    challengeId: "mfa-challenge-1",
    challengeToken: "a".repeat(64),
    expiresAt: new Date(Date.now() + 300_000),
    availableFactors: ["totp", "passkey", "recovery-code"],
  };

  let verificationCalls = 0;

  const createVerifiedSession = async () => {
    verificationCalls++;

    const created = await sessions.create({
      userId: "user-1",
      kind: "authenticated",
      metadata: {
        authenticationMethod: "totp",
        mfaVerifiedAt: new Date().toISOString(),
      },
    });

    return {
      user: createUser(),
      session: toAuthSession(created.session),
      token: created.token,
    };
  };

  const mfa = {
    async getPendingAuthState(token) {
      if (token !== challenge.challengeToken) {
        return null;
      }

      return {
        status: "mfa-pending",
        userId: "user-1",
        challengeId: challenge.challengeId,
        expiresAt: challenge.expiresAt,
      };
    },

    async createSignInChallenge(input) {
      assert.equal(input.userId, "user-1");
      return challenge;
    },

    async verifySignInTotp(input) {
      assert.equal(input.challengeToken, challenge.challengeToken);
      assert.equal(input.code, "123456");
      return createVerifiedSession();
    },

    async verifySignInRecoveryCode(input) {
      assert.equal(input.challengeToken, challenge.challengeToken);
      return createVerifiedSession();
    },

    async beginPasskeyMfa(token) {
      assert.equal(token, challenge.challengeToken);

      return {
        options: {
          challenge: "B".repeat(43),
        },
        expiresAt: challenge.expiresAt,
      };
    },

    async finishPasskeyMfa(input) {
      assert.equal(input.challengeToken, challenge.challengeToken);
      return createVerifiedSession();
    },
  };

  const manager = new StorageAuthStepUpManager({
    storage,
    sessions,
    mfa,
  });

  await manager.initialize();

  return {
    manager,
    sessions,
    storage,
    current,
    challenge,
    getVerificationCalls: () => verificationCalls,
  };
};

test("step-up challenge is bound to the existing authenticated session", async () => {
  const harness = await createHarness();

  const challenge = await harness.manager.beginStepUp({
    sessionToken: harness.current.token,
    ipAddress: "127.0.0.1",
  });

  assert.equal(challenge.challengeToken, harness.challenge.challengeToken);

  const pending = await harness.manager.getPendingAuthState(
    challenge.challengeToken,
    harness.current.token,
  );

  assert.equal(pending.status, "step-up-pending");
  assert.equal(pending.challengeId, challenge.challengeId);

  const otherSession = await harness.sessions.create({
    userId: "user-1",
    kind: "authenticated",
  });

  assert.equal(
    await harness.manager.getPendingAuthState(
      challenge.challengeToken,
      otherSession.token,
    ),
    null,
  );
});

test("successful TOTP step-up rotates and marks the session", async () => {
  const harness = await createHarness();

  const challenge = await harness.manager.beginStepUp({
    sessionToken: harness.current.token,
    ipAddress: "127.0.0.1",
  });

  const result = await harness.manager.verifyTotp({
    challengeToken: challenge.challengeToken,
    sessionToken: harness.current.token,
    code: "123456",
    ipAddress: "127.0.0.1",
  });

  assert.equal(result.user.id, "user-1");
  assert.notEqual(result.session.id, harness.current.session.id);

  assert.equal(await harness.sessions.validate(harness.current.token), null);

  const activeSession = await harness.sessions.validate(result.token);

  assert.equal(activeSession.kind, "authenticated");
  assert.equal(activeSession.metadata.authenticationMethod, "totp");
  assert.equal(
    activeSession.metadata.stepUpOfSessionId,
    harness.current.session.id,
  );

  assert.equal(typeof activeSession.metadata.stepUpVerifiedAt, "string");
});

test("a consumed step-up challenge cannot be reused", async () => {
  const harness = await createHarness();

  const challenge = await harness.manager.beginStepUp({
    sessionToken: harness.current.token,
    ipAddress: "127.0.0.1",
  });

  await harness.manager.verifyTotp({
    challengeToken: challenge.challengeToken,
    sessionToken: harness.current.token,
    code: "123456",
    ipAddress: "127.0.0.1",
  });

  await assert.rejects(() =>
    harness.manager.verifyTotp({
      challengeToken: challenge.challengeToken,
      sessionToken: harness.current.token,
      code: "123456",
      ipAddress: "127.0.0.1",
    }),
  );

  assert.equal(harness.getVerificationCalls(), 1);
});

test("a step-up challenge cannot be completed from another session", async () => {
  const harness = await createHarness();

  const challenge = await harness.manager.beginStepUp({
    sessionToken: harness.current.token,
    ipAddress: "127.0.0.1",
  });

  const otherSession = await harness.sessions.create({
    userId: "user-1",
    kind: "authenticated",
  });

  await assert.rejects(() =>
    harness.manager.verifyTotp({
      challengeToken: challenge.challengeToken,
      sessionToken: otherSession.token,
      code: "123456",
      ipAddress: "127.0.0.1",
    }),
  );

  assert.equal(harness.getVerificationCalls(), 0);
});

test("concurrent step-up completion allows only one winner", async () => {
  const harness = await createHarness();

  const challenge = await harness.manager.beginStepUp({
    sessionToken: harness.current.token,
    ipAddress: "127.0.0.1",
  });

  const results = await Promise.allSettled([
    harness.manager.verifyTotp({
      challengeToken: challenge.challengeToken,
      sessionToken: harness.current.token,
      code: "123456",
      ipAddress: "127.0.0.1",
    }),
    harness.manager.verifyTotp({
      challengeToken: challenge.challengeToken,
      sessionToken: harness.current.token,
      code: "123456",
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

test("step-up passkey options are obtained only for the bound session", async () => {
  const harness = await createHarness();

  const challenge = await harness.manager.beginStepUp({
    sessionToken: harness.current.token,
    ipAddress: "127.0.0.1",
  });

  const started = await harness.manager.beginPasskey({
    challengeToken: challenge.challengeToken,
    sessionToken: harness.current.token,
    ipAddress: "127.0.0.1",
  });

  assert.equal(started.options.challenge, "B".repeat(43));
  assert.equal(started.expiresAt.getTime(), challenge.expiresAt.getTime());
});
