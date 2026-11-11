import test from "node:test";
import assert from "node:assert/strict";

import {
  StorageAuthManager,
  StorageAuthMfaManager,
  StorageAuthStepUpManager,
  WebCryptoAuthSecretProtector,
  SimpleWebAuthnProvider,
  generateTotpCode,
} from "@puzzle-ui/auth";

import {
  createAuthMfaHandlers,
  MFA_CHALLENGE_COOKIE_NAME,
  readMfaChallengeCookie,
} from "../dist/auth/server/index.js";

import { createSessionCookieOptions } from "@puzzle-ui/session";

import {
  MemoryStorage,
  FakePasswordHasher,
  FakeRateLimitProvider,
  FakeSessionManager,
} from "../../auth/tests/fixtures/auth-harness.mjs";

import { createWebAuthnCredentialFixture } from "../../auth/tests/fixtures/webauthn-cryptographic-fixture.mjs";

const RATE_LIMIT_SECRET = "test-only-fullstack-mfa-rate-limit-secret-000000";

const PASSWORD = "correct-horse-battery-staple";

const ORIGIN = "https://example.com";
const RP_ID = "example.com";

const createHarness = async ({ webAuthn = false } = {}) => {
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
      ...(webAuthn
        ? {
            webAuthnProvider: new SimpleWebAuthnProvider(),
          }
        : {}),
    },
    {
      rateLimitKeySecret: RATE_LIMIT_SECRET,
      issuer: "Puzzle Test",
      requireVerifiedEmail: false,
      clock,
      ...(webAuthn
        ? {
            webAuthn: {
              rpId: RP_ID,
              rpName: "Puzzle Test",
              origin: ORIGIN,
            },
          }
        : {}),
    },
  );

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
      mfaPolicy: {
        required: true,
      },
      clock,
    },
  );

  const stepUp = new StorageAuthStepUpManager(
    {
      storage,
      sessions,
      mfa,
    },
    {
      clock,
    },
  );

  await mfa.initialize();
  await auth.initialize();
  await stepUp.initialize();

  const cookie = createSessionCookieOptions({
    production: true,
  });

  const handlers = createAuthMfaHandlers({
    auth,
    mfa,
    stepUp,
    sessions,
    cookie,
    csrf: {
      allowedOrigins: [ORIGIN],
    },
    resolveClientIp: () => "127.0.0.1",
  });

  return {
    auth,
    mfa,
    sessions,
    storage,
    cookie,
    handlers,
    currentTime: () => new Date(currentTime),
    advanceTime(milliseconds) {
      currentTime = new Date(currentTime.getTime() + milliseconds);
    },
  };
};

const postRequest = (path, body = {}, cookieHeader = "") =>
  new Request(`${ORIGIN}${path}`, {
    method: "POST",
    headers: {
      origin: ORIGIN,
      "content-type": "application/json",
      ...(cookieHeader
        ? {
            cookie: cookieHeader,
          }
        : {}),
    },
    body: JSON.stringify(body),
  });

const getRequest = (path, cookieHeader = "") =>
  new Request(`${ORIGIN}${path}`, {
    method: "GET",
    headers: {
      ...(cookieHeader
        ? {
            cookie: cookieHeader,
          }
        : {}),
    },
  });

const getSessionToken = (setCookie, cookieName) => {
  const escapedName = cookieName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const match = new RegExp(`${escapedName}=([^;]+)`).exec(setCookie ?? "");

  return match?.[1] ?? null;
};

const getEnrollmentChallengeToken = (response) => {
  const token = readMfaChallengeCookie(response.headers.get("set-cookie"));

  assert.ok(token, "Expected an MFA enrollment challenge cookie.");

  return token;
};

test("required TOTP enrollment completes the entire registration flow", async () => {
  const harness = await createHarness();

  const sessionsBeforeRegistration = harness.sessions.sessions.size;

  // 1. Register a user while MFA is mandatory.
  const registrationResponse = await harness.handlers.register(
    postRequest("/register", {
      email: "required-totp@example.com",
      password: PASSWORD,
      name: "Required TOTP",
    }),
  );

  assert.equal(registrationResponse.status, 200);

  const registrationPayload = await registrationResponse.json();

  // 2. Registration returns an enrollment-pending state.
  assert.equal(registrationPayload.status, "mfa-enrollment-pending");

  assert.equal(registrationPayload.purpose, "enrollment");
  assert.ok(registrationPayload.challengeId);

  assert.equal(Object.hasOwn(registrationPayload, "challengeToken"), false);

  const challengeToken = getEnrollmentChallengeToken(registrationResponse);

  // 3. No authenticated session exists before enrollment.
  assert.equal(harness.sessions.sessions.size, sessionsBeforeRegistration);

  const pendingStateResponse = await harness.handlers.getAuthState(
    getRequest("/state", `${MFA_CHALLENGE_COOKIE_NAME}=${challengeToken}`),
  );

  assert.equal(pendingStateResponse.status, 200);

  const pendingState = await pendingStateResponse.json();

  assert.equal(pendingState.status, "mfa-enrollment-pending");

  assert.equal(pendingState.user, null);
  assert.equal(pendingState.mfa.purpose, "enrollment");

  // 4. Start the actual TOTP enrollment through the HTTP handler.
  const startResponse = await harness.handlers.beginRequiredTotpEnrollment(
    postRequest(
      "/mfa/enrollment/totp/start",
      {
        label: "Required authenticator",
      },
      `${MFA_CHALLENGE_COOKIE_NAME}=${challengeToken}`,
    ),
  );

  assert.equal(startResponse.status, 200);

  const startPayload = await startResponse.json();

  assert.equal(startPayload.status, "totp-enrollment-pending");

  assert.ok(startPayload.factorId);
  assert.ok(startPayload.secret);
  assert.ok(startPayload.otpauthUrl);

  assert.equal(harness.sessions.sessions.size, sessionsBeforeRegistration);

  // 5. Verify the generated TOTP code through the HTTP handler.
  const code = await generateTotpCode(
    startPayload.secret,
    harness.currentTime().getTime(),
    {
      digits: 6,
      periodSeconds: 30,
    },
  );

  const finishResponse = await harness.handlers.verifyRequiredTotpEnrollment(
    postRequest(
      "/mfa/enrollment/totp/verify",
      {
        factorId: startPayload.factorId,
        code,
      },
      `${MFA_CHALLENGE_COOKIE_NAME}=${challengeToken}`,
    ),
  );

  assert.equal(finishResponse.status, 200);

  const finishPayload = await finishResponse.json();

  assert.equal(finishPayload.status, "mfa-factor-added");
  assert.equal(finishPayload.factor.type, "totp");
  assert.equal(finishPayload.factor.status, "active");

  // 6. Recovery codes are returned exactly once as part of enrollment.
  assert.equal(finishPayload.recoveryCodes.length, 10);

  assert.equal(
    new Set(finishPayload.recoveryCodes).size,
    finishPayload.recoveryCodes.length,
  );

  // 7. A normal authenticated session is created only after verification.
  assert.equal(harness.sessions.sessions.size, sessionsBeforeRegistration + 1);

  const setCookie = finishResponse.headers.get("set-cookie");

  assert.match(setCookie, /Max-Age=0/);

  const sessionToken = getSessionToken(setCookie, harness.cookie.name);

  assert.ok(sessionToken);

  const authenticatedStateResponse = await harness.handlers.getAuthState(
    getRequest("/state", `${harness.cookie.name}=${sessionToken}`),
  );

  assert.equal(authenticatedStateResponse.status, 200);

  const authenticatedState = await authenticatedStateResponse.json();

  assert.equal(authenticatedState.status, "authenticated");
  assert.equal(authenticatedState.user.email, "required-totp@example.com");

  assert.equal(
    await harness.auth.getAuthState(sessionToken).then((state) => state.status),
    "authenticated",
  );
});

test("required passkey enrollment verifies a real WebAuthn credential before creating a session", async () => {
  const harness = await createHarness({
    webAuthn: true,
  });

  const sessionsBefore = harness.sessions.sessions.size;

  const registrationResponse = await harness.handlers.register(
    postRequest("/register", {
      email: "required-passkey@example.com",
      password: PASSWORD,
      name: "Required Passkey",
    }),
  );

  assert.equal(registrationResponse.status, 200);

  const registrationPayload = await registrationResponse.json();

  assert.equal(registrationPayload.status, "mfa-enrollment-pending");

  const challengeToken = getEnrollmentChallengeToken(registrationResponse);

  assert.equal(harness.sessions.sessions.size, sessionsBefore);

  const startResponse = await harness.handlers.beginRequiredPasskeyEnrollment(
    postRequest(
      "/mfa/enrollment/passkey/start",
      {
        label: "Platform passkey",
      },
      `${MFA_CHALLENGE_COOKIE_NAME}=${challengeToken}`,
    ),
  );

  assert.equal(startResponse.status, 200);

  const startPayload = await startResponse.json();

  assert.equal(startPayload.status, "passkey-enrollment-pending");

  assert.ok(startPayload.options.challenge);

  assert.equal(harness.sessions.sessions.size, sessionsBefore);

  const fixture = createWebAuthnCredentialFixture({
    challenge: startPayload.options.challenge,
    origin: ORIGIN,
    rpId: RP_ID,
  });

  const finishResponse = await harness.handlers.finishRequiredPasskeyEnrollment(
    postRequest(
      "/mfa/enrollment/passkey/finish",
      {
        response: fixture.registrationResponse,
      },
      `${MFA_CHALLENGE_COOKIE_NAME}=${challengeToken}`,
    ),
  );

  assert.equal(finishResponse.status, 200);

  const finishPayload = await finishResponse.json();

  assert.equal(finishPayload.status, "mfa-factor-added");
  assert.equal(finishPayload.factor.type, "passkey");
  assert.equal(finishPayload.factor.status, "active");

  assert.equal(finishPayload.recoveryCodes.length, 10);

  assert.equal(harness.sessions.sessions.size, sessionsBefore + 1);

  const sessionToken = getSessionToken(
    finishResponse.headers.get("set-cookie"),
    harness.cookie.name,
  );

  assert.ok(sessionToken);

  const stateResponse = await harness.handlers.getAuthState(
    getRequest("/state", `${harness.cookie.name}=${sessionToken}`),
  );

  assert.equal(stateResponse.status, 200);

  const state = await stateResponse.json();

  assert.equal(state.status, "authenticated");
  assert.equal(state.user.email, "required-passkey@example.com");
});
