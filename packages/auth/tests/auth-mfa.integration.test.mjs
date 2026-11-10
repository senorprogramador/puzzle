import test from "node:test";
import assert from "node:assert/strict";

import {
  StorageAuthManager,
  StorageAuthMfaManager,
  WebCryptoAuthSecretProtector,
  AUTH_MFA_FACTOR_COLLECTION,
  generateTotpCode,
} from "../dist/index.js";

import {
  MemoryStorage,
  FakePasswordHasher,
  FakeRateLimitProvider,
  FakeSessionManager,
} from "./fixtures/auth-harness.mjs";

const RATE_LIMIT_SECRET = "test-only-mfa-rate-limit-secret-000000000000";

const PASSWORD = "correct-horse-battery-staple";

const createWebAuthnProvider = () => ({
  async generateRegistrationOptions(input) {
    return {
      challenge: input.challenge,
      rp: {
        id: input.rpId,
        name: input.rpName,
      },
      user: {
        id: input.userId,
        name: input.userName,
        displayName: input.userName,
      },
      excludeCredentials: input.excludeCredentialIds.map((id) => ({
        id,
      })),
    };
  },

  async verifyRegistrationResponse(input) {
    const response = input.response;

    if (response.challenge !== input.expectedChallenge) {
      return {
        verified: false,
        userVerified: false,
      };
    }

    return {
      verified: true,
      userVerified: true,
      credential: {
        credentialId: response.id,
        publicKey: "AQIDBA",
        counter: 0,
        transports: ["internal"],
      },
    };
  },

  async generateAuthenticationOptions(input) {
    return {
      challenge: input.challenge,
      rpId: input.rpId,
      userVerification: input.userVerification,
      allowCredentials: input.allowCredentialIds?.map((id) => ({
        id,
      })),
    };
  },

  async verifyAuthenticationResponse(input) {
    const response = input.response;

    const challengeMatches = response.challenge === input.expectedChallenge;

    const credentialMatches = response.id === input.credential.credentialId;

    const newCounter = Number.isSafeInteger(response.counter)
      ? response.counter
      : input.credential.counter + 1;

    return {
      verified: challengeMatches && credentialMatches,
      userVerified: true,
      credentialId: response.id,
      newCounter,
    };
  },
});

const createHarness = async (authOptions = {}) => {
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
      webAuthnProvider: createWebAuthnProvider(),
    },
    {
      rateLimitKeySecret: RATE_LIMIT_SECRET,
      issuer: "Puzzle Test",
      requireVerifiedEmail: false,
      clock,
      webAuthn: {
        rpId: "example.com",
        rpName: "Puzzle Test",
        origin: "https://example.com",
      },
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
      ...authOptions,
    },
  );

  await auth.initialize();

  const registered = await auth.register({
    email: "mfa@example.com",
    password: PASSWORD,
    name: "MFA User",
    ipAddress: "127.0.0.1",
  });

  const advanceTime = (milliseconds = 30_000) => {
    currentTime = new Date(currentTime.getTime() + milliseconds);
  };

  const currentDate = () => new Date(currentTime);

  const createCurrentTotpCode = async (secret) =>
    generateTotpCode(secret, currentTime.getTime(), {
      digits: 6,
      periodSeconds: 30,
    });

  return {
    auth,
    mfa,
    storage,
    sessions,
    registered,
    advanceTime,
    currentDate,
    createCurrentTotpCode,
  };
};

const enrollTotp = async (harness) => {
  const started = await harness.mfa.beginTotpEnrollment({
    sessionToken: harness.registered.token,
    currentPassword: PASSWORD,
    ipAddress: "127.0.0.1",
    label: "Test authenticator",
  });

  const code = await harness.createCurrentTotpCode(started.secret);

  const completed = await harness.mfa.verifyTotpEnrollment({
    sessionToken: harness.registered.token,
    factorId: started.factorId,
    code,
    ipAddress: "127.0.0.1",
  });

  assert.equal(completed.factor.type, "totp");
  assert.equal(completed.factor.status, "active");
  assert.equal(completed.recoveryCodes.length, 10);

  return {
    started,
    completed,
  };
};

const signInWithPassword = async (harness) => {
  const result = await harness.auth.signIn({
    email: "mfa@example.com",
    password: PASSWORD,
    ipAddress: "127.0.0.1",
  });

  assert.equal(result.status, "mfa-pending");

  return result;
};

test("password sign-in creates no authenticated session before TOTP verification", async () => {
  const harness = await createHarness();

  await enrollTotp(harness);

  await harness.auth.signOut(harness.registered.token);

  const sessionsBefore = harness.sessions.sessions.size;

  const pending = await signInWithPassword(harness);

  assert.equal(pending.status, "mfa-pending");
  assert.ok(pending.challengeToken);
  assert.equal(harness.sessions.sessions.size, sessionsBefore);

  const state = await harness.auth.getAuthState(pending.challengeToken);

  assert.equal(state.status, "mfa-pending");
  assert.equal(state.userId, harness.registered.user.id);
});

test("TOTP completes sign-in and creates an authenticated session", async () => {
  const harness = await createHarness();

  const enrollment = await enrollTotp(harness);

  await harness.auth.signOut(harness.registered.token);

  harness.advanceTime();

  const pending = await signInWithPassword(harness);

  const code = await harness.createCurrentTotpCode(enrollment.started.secret);

  const authenticated = await harness.mfa.verifySignInTotp({
    challengeToken: pending.challengeToken,
    code,
    ipAddress: "127.0.0.1",
  });

  assert.equal(authenticated.user.id, harness.registered.user.id);

  assert.equal(
    await harness.auth
      .getAuthState(authenticated.token)
      .then((state) => state.status),
    "authenticated",
  );
});

test("a TOTP time step cannot be reused for another sign-in", async () => {
  const harness = await createHarness();

  const enrollment = await enrollTotp(harness);

  await harness.auth.signOut(harness.registered.token);

  harness.advanceTime();

  const code = await harness.createCurrentTotpCode(enrollment.started.secret);

  const firstChallenge = await signInWithPassword(harness);

  await harness.mfa.verifySignInTotp({
    challengeToken: firstChallenge.challengeToken,
    code,
    ipAddress: "127.0.0.1",
  });

  await harness.auth.signOutEverywhere(harness.registered.user.id);

  const secondChallenge = await signInWithPassword(harness);

  await assert.rejects(() =>
    harness.mfa.verifySignInTotp({
      challengeToken: secondChallenge.challengeToken,
      code,
      ipAddress: "127.0.0.1",
    }),
  );
});

test("a recovery code is consumed after successful sign-in", async () => {
  const harness = await createHarness();

  const enrollment = await enrollTotp(harness);
  const recoveryCode = enrollment.completed.recoveryCodes[0];

  await harness.auth.signOut(harness.registered.token);

  const pending = await signInWithPassword(harness);

  const result = await harness.mfa.verifySignInRecoveryCode({
    challengeToken: pending.challengeToken,
    code: recoveryCode,
    ipAddress: "127.0.0.1",
  });

  assert.equal(result.user.id, harness.registered.user.id);

  assert.equal(await harness.mfa.getRecoveryCodeCount(result.token), 9);

  await harness.auth.signOutEverywhere(harness.registered.user.id);

  const nextChallenge = await signInWithPassword(harness);

  await assert.rejects(() =>
    harness.mfa.verifySignInRecoveryCode({
      challengeToken: nextChallenge.challengeToken,
      code: recoveryCode,
      ipAddress: "127.0.0.1",
    }),
  );
});

test("passkey registration stores the verified credential", async () => {
  const harness = await createHarness();

  const enrollment = await enrollTotp(harness);

  harness.advanceTime();

  const pending = await signInWithPassword(harness);

  const code = await harness.createCurrentTotpCode(enrollment.started.secret);

  const authenticated = await harness.mfa.verifySignInTotp({
    challengeToken: pending.challengeToken,
    code,
    ipAddress: "127.0.0.1",
  });

  const started = await harness.mfa.beginPasskeyRegistration({
    sessionToken: authenticated.token,
    currentPassword: PASSWORD,
    ipAddress: "127.0.0.1",
    label: "Test passkey",
  });

  const completed = await harness.mfa.finishPasskeyRegistration({
    sessionToken: authenticated.token,
    challengeToken: started.challengeToken,
    response: {
      id: "passkey-credential-1",
      challenge: started.options.challenge,
    },
    ipAddress: "127.0.0.1",
  });

  assert.equal(completed.factor.type, "passkey");
  assert.equal(completed.factor.status, "active");

  const stored = await harness.storage.findOne(AUTH_MFA_FACTOR_COLLECTION, {
    where: {
      credentialId: {
        operator: "eq",
        value: "passkey-credential-1",
      },
    },
  });

  assert.equal(stored.userId, authenticated.user.id);
  assert.equal(stored.publicKey, "AQIDBA");
  assert.equal(stored.counter, 0);
});

test("discoverable passkey sign-in completes after server verification", async () => {
  const harness = await createHarness();

  const enrollment = await enrollTotp(harness);

  harness.advanceTime();

  const pending = await signInWithPassword(harness);
  const code = await harness.createCurrentTotpCode(enrollment.started.secret);

  const authenticated = await harness.mfa.verifySignInTotp({
    challengeToken: pending.challengeToken,
    code,
    ipAddress: "127.0.0.1",
  });

  const registration = await harness.mfa.beginPasskeyRegistration({
    sessionToken: authenticated.token,
    currentPassword: PASSWORD,
    ipAddress: "127.0.0.1",
    label: "Test passkey",
  });

  await harness.mfa.finishPasskeyRegistration({
    sessionToken: authenticated.token,
    challengeToken: registration.challengeToken,
    response: {
      id: "passkey-credential-1",
      challenge: registration.options.challenge,
    },
    ipAddress: "127.0.0.1",
  });

  await harness.auth.signOutEverywhere(authenticated.user.id);

  const passkeyChallenge = await harness.mfa.beginPasskeySignIn({
    ipAddress: "127.0.0.1",
  });

  const result = await harness.mfa.finishPasskeySignIn({
    challengeToken: passkeyChallenge.challengeToken,
    response: {
      id: "passkey-credential-1",
      challenge: passkeyChallenge.options.challenge,
      counter: 1,
    },
    ipAddress: "127.0.0.1",
  });

  assert.equal(result.user.id, harness.registered.user.id);

  const stored = await harness.storage.findOne(AUTH_MFA_FACTOR_COLLECTION, {
    where: {
      credentialId: {
        operator: "eq",
        value: "passkey-credential-1",
      },
    },
  });

  assert.equal(stored.counter, 1);
});

test("passkey counter regression is rejected", async () => {
  const harness = await createHarness();

  const enrollment = await enrollTotp(harness);

  harness.advanceTime();

  const pending = await signInWithPassword(harness);
  const code = await harness.createCurrentTotpCode(enrollment.started.secret);

  const authenticated = await harness.mfa.verifySignInTotp({
    challengeToken: pending.challengeToken,
    code,
    ipAddress: "127.0.0.1",
  });

  const registration = await harness.mfa.beginPasskeyRegistration({
    sessionToken: authenticated.token,
    currentPassword: PASSWORD,
    ipAddress: "127.0.0.1",
  });

  await harness.mfa.finishPasskeyRegistration({
    sessionToken: authenticated.token,
    challengeToken: registration.challengeToken,
    response: {
      id: "passkey-credential-1",
      challenge: registration.options.challenge,
    },
    ipAddress: "127.0.0.1",
  });

  const passkeyChallenge = await harness.mfa.beginPasskeySignIn({
    ipAddress: "127.0.0.1",
  });

  await harness.mfa.finishPasskeySignIn({
    challengeToken: passkeyChallenge.challengeToken,
    response: {
      id: "passkey-credential-1",
      challenge: passkeyChallenge.options.challenge,
      counter: 1,
    },
    ipAddress: "127.0.0.1",
  });

  await harness.auth.signOutEverywhere(authenticated.user.id);

  const replayChallenge = await harness.mfa.beginPasskeySignIn({
    ipAddress: "127.0.0.1",
  });

  await assert.rejects(() =>
    harness.mfa.finishPasskeySignIn({
      challengeToken: replayChallenge.challengeToken,
      response: {
        id: "passkey-credential-1",
        challenge: replayChallenge.options.challenge,
        counter: 1,
      },
      ipAddress: "127.0.0.1",
    }),
  );
});

test("concurrent TOTP completion has only one successful session", async () => {
  const harness = await createHarness();

  const enrollment = await enrollTotp(harness);

  await harness.auth.signOut(harness.registered.token);

  harness.advanceTime();

  const pending = await signInWithPassword(harness);

  const code = await harness.createCurrentTotpCode(enrollment.started.secret);

  const results = await Promise.allSettled([
    harness.mfa.verifySignInTotp({
      challengeToken: pending.challengeToken,
      code,
      ipAddress: "127.0.0.1",
    }),
    harness.mfa.verifySignInTotp({
      challengeToken: pending.challengeToken,
      code,
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

test("required MFA registration creates no session before TOTP enrollment", async () => {
  const harness = await createHarness({
    mfaPolicy: {
      required: true,
    },
  });

  const sessionsBefore = harness.sessions.sessions.size;

  const pending = await harness.auth.register({
    email: "required-totp@example.com",
    password: PASSWORD,
    name: "Required TOTP",
    ipAddress: "127.0.0.1",
  });

  assert.equal(pending.status, "mfa-enrollment-pending");
  assert.equal(harness.sessions.sessions.size, sessionsBefore);

  const state = await harness.auth.getAuthState(pending.challengeToken);

  assert.equal(state.status, "mfa-enrollment-pending");
  assert.equal(state.availableFactors.includes("totp"), true);

  const started = await harness.mfa.beginRequiredTotpEnrollment({
    challengeToken: pending.challengeToken,
    ipAddress: "127.0.0.1",
    label: "Required authenticator",
  });

  assert.equal(harness.sessions.sessions.size, sessionsBefore);

  const code = await harness.createCurrentTotpCode(started.secret);

  const completed = await harness.mfa.verifyRequiredTotpEnrollment({
    challengeToken: pending.challengeToken,
    factorId: started.factorId,
    code,
    ipAddress: "127.0.0.1",
  });

  assert.equal(completed.factor.type, "totp");
  assert.equal(completed.factor.status, "active");
  assert.equal(completed.recoveryCodes.length, 10);
  assert.equal(completed.auth.user.email, "required-totp@example.com");

  const authenticatedState = await harness.auth.getAuthState(
    completed.auth.token,
  );

  assert.equal(authenticatedState.status, "authenticated");
  assert.equal(harness.sessions.sessions.size, sessionsBefore + 1);
});

test("required MFA registration creates no session before passkey enrollment", async () => {
  const harness = await createHarness({
    mfaPolicy: {
      required: true,
    },
  });

  const sessionsBefore = harness.sessions.sessions.size;

  const pending = await harness.auth.register({
    email: "required-passkey@example.com",
    password: PASSWORD,
    name: "Required Passkey",
    ipAddress: "127.0.0.1",
  });

  assert.equal(pending.status, "mfa-enrollment-pending");
  assert.equal(harness.sessions.sessions.size, sessionsBefore);

  const state = await harness.auth.getAuthState(pending.challengeToken);

  assert.equal(state.status, "mfa-enrollment-pending");
  assert.equal(state.availableFactors.includes("passkey"), true);

  const started = await harness.mfa.beginRequiredPasskeyEnrollment({
    challengeToken: pending.challengeToken,
    ipAddress: "127.0.0.1",
    label: "Required passkey",
  });

  assert.equal(harness.sessions.sessions.size, sessionsBefore);

  const completed = await harness.mfa.finishRequiredPasskeyEnrollment({
    challengeToken: pending.challengeToken,
    response: {
      id: "required-passkey-credential",
      challenge: started.options.challenge,
    },
    ipAddress: "127.0.0.1",
  });

  assert.equal(completed.factor.type, "passkey");
  assert.equal(completed.factor.status, "active");
  assert.equal(completed.recoveryCodes.length, 10);
  assert.equal(completed.auth.user.email, "required-passkey@example.com");

  const authenticatedState = await harness.auth.getAuthState(
    completed.auth.token,
  );

  assert.equal(authenticatedState.status, "authenticated");
  assert.equal(harness.sessions.sessions.size, sessionsBefore + 1);
});

test("requiredFor can require first-factor enrollment at sign-in", async () => {
  let requireMfa = false;

  const harness = await createHarness({
    mfaPolicy: {
      requiredFor: (user) =>
        requireMfa && user.email === "conditional@example.com",
    },
  });

  const registered = await harness.auth.register({
    email: "conditional@example.com",
    password: PASSWORD,
    name: "Conditional MFA",
    ipAddress: "127.0.0.1",
  });

  assert.ok(registered.token);

  await harness.auth.signOut(registered.token);

  const sessionsBefore = harness.sessions.sessions.size;

  requireMfa = true;

  const pending = await harness.auth.signIn({
    email: "conditional@example.com",
    password: PASSWORD,
    ipAddress: "127.0.0.1",
  });

  assert.equal(pending.status, "mfa-enrollment-pending");
  assert.equal(harness.sessions.sessions.size, sessionsBefore);

  const state = await harness.auth.getAuthState(pending.challengeToken);

  assert.equal(state.status, "mfa-enrollment-pending");
});

test("required MFA sign-in challenges an enrolled factor instead of starting enrollment again", async () => {
  const harness = await createHarness({
    mfaPolicy: {
      required: true,
    },
  });

  const pending = await harness.auth.register({
    email: "required-signin@example.com",
    password: PASSWORD,
    name: "Required Sign-in",
    ipAddress: "127.0.0.1",
  });

  const started = await harness.mfa.beginRequiredTotpEnrollment({
    challengeToken: pending.challengeToken,
    ipAddress: "127.0.0.1",
  });

  const code = await harness.createCurrentTotpCode(started.secret);

  const enrolled = await harness.mfa.verifyRequiredTotpEnrollment({
    challengeToken: pending.challengeToken,
    factorId: started.factorId,
    code,
    ipAddress: "127.0.0.1",
  });

  await harness.auth.signOut(enrolled.auth.token);

  const sessionsBefore = harness.sessions.sessions.size;

  const signIn = await harness.auth.signIn({
    email: "required-signin@example.com",
    password: PASSWORD,
    ipAddress: "127.0.0.1",
  });

  assert.equal(signIn.status, "mfa-pending");
  assert.equal(harness.sessions.sessions.size, sessionsBefore);

  const state = await harness.auth.getAuthState(signIn.challengeToken);

  assert.equal(state.status, "mfa-pending");
});
