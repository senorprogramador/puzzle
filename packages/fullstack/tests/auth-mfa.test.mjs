import test from "node:test";
import assert from "node:assert/strict";

import {
  createAuthMfaHandlers,
  createMfaPendingResponse,
  readMfaChallengeCookie,
} from "../dist/auth/server/index.js";

import { createSessionCookieOptions } from "@puzzle-ui/session";

const challengeToken = "a".repeat(64);

const expiresAt = new Date(Date.now() + 300_000);

const pendingChallenge = {
  status: "mfa-pending",
  challengeId: "challenge-1",
  challengeToken,
  expiresAt,
  availableFactors: ["totp", "passkey", "recovery-code"],
};

const user = {
  id: "user-1",
  email: "user@example.com",
  emailVerifiedAt: new Date(),
  name: "Test User",
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const session = {
  id: "session-1",
  tokenHash: "session-hash",
  userId: "user-1",
  kind: "authenticated",
  createdAt: new Date(),
  lastSeenAt: new Date(),
  expiresAt: new Date(Date.now() + 3_600_000),
  revokedAt: null,
  metadata: {},
};

const authResult = {
  user,
  session: {
    id: "session-2",
    userId: "user-1",
    kind: "authenticated",
    createdAt: new Date(),
    lastSeenAt: new Date(),
    expiresAt: new Date(Date.now() + 3_600_000),
    revokedAt: null,
  },
  token: "b".repeat(64),
};

const cookie = createSessionCookieOptions({
  production: true,
});

const createHarness = (overrides = {}) => {
  const calls = {
    signIn: [],
    verifyTotp: [],
    verifyRecoveryCode: [],
    beginStepUp: [],
    verifyStepUpTotp: [],
    validateSession: [],
  };

  const sessions = {
    async validate(token) {
      calls.validateSession.push(token);

      return token === "session-token" ? session : null;
    },

    async create() {
      return {
        session: authResult.session,
        token: authResult.token,
      };
    },

    async revoke() {},
    async revokeAll() {},
  };

  const auth = {
    async signIn(input) {
      calls.signIn.push(input);
      return pendingChallenge;
    },

    async getAuthState(token) {
      if (token === "session-token") {
        return {
          status: "authenticated",
          userId: "user-1",
          sessionId: "session-1",
        };
      }

      return {
        status: "mfa-pending",
        userId: "user-1",
        challengeId: "challenge-1",
        expiresAt,
      };
    },

    async getCurrentUser() {
      return user;
    },

    async signOut() {},
  };

  const mfa = {
    async getAvailableFactors() {
      return ["totp", "passkey", "recovery-code"];
    },

    async verifySignInTotp(input) {
      calls.verifyTotp.push(input);
      return authResult;
    },

    async verifySignInRecoveryCode(input) {
      calls.verifyRecoveryCode.push(input);
      return authResult;
    },

    async beginPasskeySignIn() {
      return {
        challengeId: "passkey-sign-in-1",
        challengeToken,
        options: {
          challenge: "B".repeat(43),
        },
        expiresAt,
      };
    },

    async finishPasskeySignIn() {
      return authResult;
    },

    async beginPasskeyMfa() {
      return {
        options: {
          challenge: "C".repeat(43),
        },
        expiresAt,
      };
    },

    async finishPasskeyMfa() {
      return authResult;
    },

    async beginTotpEnrollment() {
      return {
        factorId: "factor-1",
        secret: "JBSWY3DPEHPK3PXP",
        otpauthUrl: "otpauth://totp/Puzzle:user",
        expiresAt,
      };
    },

    async verifyTotpEnrollment() {
      return {
        factor: {
          id: "factor-1",
          type: "totp",
          status: "active",
          label: "Authenticator",
          createdAt: new Date(),
          lastUsedAt: new Date(),
        },
        recoveryCodes: ["AAAA-BBBB"],
      };
    },

    async beginPasskeyRegistration() {
      return {
        challengeId: "passkey-registration-1",
        challengeToken,
        options: {
          challenge: "D".repeat(43),
        },
        expiresAt,
      };
    },

    async finishPasskeyRegistration() {
      return {
        factor: {
          id: "factor-2",
          type: "passkey",
          status: "active",
          label: "MacBook",
          createdAt: new Date(),
          lastUsedAt: new Date(),
        },
        recoveryCodes: ["CCCC-DDDD"],
      };
    },

    async listFactors() {
      return [];
    },

    async getRecoveryCodeCount() {
      return 0;
    },

    async removeFactor() {},
    async regenerateRecoveryCodes() {
      return ["EEEE-FFFF"];
    },
  };

  const stepUp = {
    async beginStepUp(input) {
      calls.beginStepUp.push(input);
      return pendingChallenge;
    },

    async getPendingAuthState() {
      return {
        status: "step-up-pending",
        challengeId: "challenge-1",
        expiresAt,
      };
    },

    async beginPasskey() {
      return {
        options: {
          challenge: "E".repeat(43),
        },
        expiresAt,
      };
    },

    async verifyTotp(input) {
      calls.verifyStepUpTotp.push(input);
      return authResult;
    },

    async verifyRecoveryCode() {
      return authResult;
    },

    async finishPasskey() {
      return authResult;
    },
  };

  return {
    calls,
    handlers: createAuthMfaHandlers({
      auth,
      mfa,
      stepUp,
      sessions,
      cookie,
      csrf: {
        allowedOrigins: ["https://example.com"],
      },
      resolveClientIp: () => "127.0.0.1",
      ...overrides,
    }),
  };
};

const postRequest = (
  path,
  body,
  cookieHeader = "",
  origin = "https://example.com",
) =>
  new Request(`https://example.com${path}`, {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });

test("MFA pending response stores the raw challenge token only in a cookie", async () => {
  const response = createMfaPendingResponse(pendingChallenge);

  const payload = await response.json();
  const setCookie = response.headers.get("set-cookie");

  assert.equal(payload.status, "mfa-pending");
  assert.equal(payload.challengeId, "challenge-1");
  assert.deepEqual(payload.availableFactors, [
    "totp",
    "passkey",
    "recovery-code",
  ]);

  assert.equal(Object.hasOwn(payload, "challengeToken"), false);

  assert.equal(JSON.stringify(payload).includes(challengeToken), false);

  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /Secure/);
  assert.match(setCookie, /SameSite=Strict/);
  assert.match(setCookie, /Path=\//);

  assert.equal(readMfaChallengeCookie(setCookie), challengeToken);
});

test("sign-in returns a safe MFA response and clears a previous session cookie", async () => {
  const harness = createHarness();

  const response = await harness.handlers.signIn(
    postRequest(
      "/sign-in",
      {
        email: "user@example.com",
        password: "correct-password",
      },
      "__Host-puzzle.session=old-session",
    ),
  );

  assert.equal(response.status, 200);

  const payload = await response.json();
  const setCookie = response.headers.get("set-cookie");

  assert.equal(payload.status, "mfa-pending");
  assert.equal(payload.purpose, "sign-in");
  assert.equal(payload.challengeId, "challenge-1");
  assert.equal(Object.hasOwn(payload, "challengeToken"), false);

  assert.equal(JSON.stringify(payload).includes(challengeToken), false);

  assert.match(setCookie, /__Host-puzzle\.mfa=/);
  assert.match(setCookie, /__Host-puzzle\.session=/);
  assert.match(setCookie, /Max-Age=0/);

  assert.equal(harness.calls.signIn.length, 1);
});

test("TOTP verification reads the challenge token from the cookie", async () => {
  const harness = createHarness();

  const response = await harness.handlers.verifySignInTotp(
    postRequest(
      "/mfa/sign-in/totp",
      {
        code: "123456",
      },
      `__Host-puzzle.mfa=${challengeToken}`,
    ),
  );

  assert.equal(response.status, 200);

  const payload = await response.json();
  const setCookie = response.headers.get("set-cookie");

  assert.equal(payload.status, "authenticated");
  assert.equal(payload.user.id, "user-1");
  assert.equal(Object.hasOwn(payload, "token"), false);

  assert.equal(harness.calls.verifyTotp[0].challengeToken, challengeToken);

  assert.match(setCookie, /__Host-puzzle\.session=/);
  assert.match(setCookie, /__Host-puzzle\.mfa=/);
  assert.match(setCookie, /Max-Age=0/);
});

test("a request cannot supply a raw challenge token in its JSON body", async () => {
  const harness = createHarness();

  const response = await harness.handlers.verifySignInTotp(
    postRequest("/mfa/sign-in/totp", {
      code: "123456",
      challengeToken,
    }),
  );

  assert.equal(response.status, 400);
  assert.equal(harness.calls.verifyTotp.length, 0);
});

test("MFA verification rejects a request from an untrusted origin", async () => {
  const harness = createHarness();

  const response = await harness.handlers.verifySignInTotp(
    postRequest(
      "/mfa/sign-in/totp",
      {
        code: "123456",
      },
      `__Host-puzzle.mfa=${challengeToken}`,
      "https://attacker.example",
    ),
  );

  assert.equal(response.status, 403);
  assert.equal(harness.calls.verifyTotp.length, 0);
});

test("step-up challenge is stored in the same protected cookie", async () => {
  const harness = createHarness();

  const response = await harness.handlers.beginStepUp(
    postRequest(
      "/mfa/step-up/start",
      {},
      "__Host-puzzle.session=session-token",
    ),
  );

  assert.equal(response.status, 200);

  const payload = await response.json();
  const setCookie = response.headers.get("set-cookie");

  assert.equal(payload.status, "mfa-pending");
  assert.equal(payload.purpose, "step-up");
  assert.equal(Object.hasOwn(payload, "challengeToken"), false);

  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /Secure/);
  assert.match(setCookie, /SameSite=Strict/);

  assert.equal(harness.calls.beginStepUp[0].sessionToken, "session-token");
});

test("step-up verification rotates the session and clears the challenge cookie", async () => {
  const harness = createHarness();

  const response = await harness.handlers.verifyStepUpTotp(
    postRequest(
      "/mfa/step-up/totp",
      {
        code: "123456",
      },
      `__Host-puzzle.session=session-token; __Host-puzzle.mfa=${challengeToken}`,
    ),
  );

  assert.equal(response.status, 200);

  const payload = await response.json();
  const setCookie = response.headers.get("set-cookie");

  assert.equal(payload.status, "authenticated");
  assert.equal(
    harness.calls.verifyStepUpTotp[0].challengeToken,
    challengeToken,
  );

  assert.match(setCookie, /__Host-puzzle\.session=/);
  assert.match(setCookie, /__Host-puzzle\.mfa=/);
  assert.match(setCookie, /Max-Age=0/);
});

test("state endpoint returns an authenticated snapshot without an MFA cookie", async () => {
  const harness = createHarness();

  const request = new Request("https://example.com/state", {
    method: "GET",
    headers: {
      cookie: "__Host-puzzle.session=session-token",
    },
  });

  const response = await harness.handlers.getAuthState(request);

  assert.equal(response.status, 200);

  const payload = await response.json();

  assert.equal(payload.status, "authenticated");
  assert.equal(payload.user.id, "user-1");
});

test("state endpoint returns a pending step-up challenge for the current session", async () => {
  const harness = createHarness();

  const response = await harness.handlers.getAuthState(
    new Request("https://example.com/state", {
      headers: {
        cookie: `__Host-puzzle.session=session-token; __Host-puzzle.mfa=${challengeToken}`,
      },
    }),
  );

  assert.equal(response.status, 200);

  const payload = await response.json();

  assert.equal(payload.status, "step-up-pending");
  assert.equal(payload.user, null);
  assert.equal(payload.mfa.purpose, "step-up");
  assert.equal(payload.mfa.challengeId, "challenge-1");
  assert.equal(Object.hasOwn(payload.mfa, "challengeToken"), false);
});

for (const status of ["mfa-pending", "mfa-enrollment-pending"]) {
  test(`state endpoint returns ${status} without a session cookie`, async () => {
    const harness = createHarness({
      auth: {
        async getAuthState(token) {
          assert.equal(token, challengeToken);

          return {
            status,
            challengeId: "challenge-1",
            expiresAt,
            availableFactors: pendingChallenge.availableFactors,
          };
        },
      },
    });

    const response = await harness.handlers.getAuthState(
      new Request("https://example.com/state", {
        headers: {
          cookie: `__Host-puzzle.mfa=${challengeToken}`,
        },
      }),
    );

    assert.equal(response.status, 200);

    const payload = await response.json();

    assert.equal(payload.status, status);
    assert.equal(payload.user, null);
    assert.equal(
      payload.mfa.purpose,
      status === "mfa-pending" ? "sign-in" : "enrollment",
    );
    assert.equal(payload.mfa.challengeId, "challenge-1");
    assert.equal(payload.mfa.expiresAt, expiresAt.toISOString());
    assert.deepEqual(
      payload.mfa.availableFactors,
      pendingChallenge.availableFactors,
    );
    assert.equal(Object.hasOwn(payload.mfa, "challengeToken"), false);
  });
}

test("a session-bound challenge cannot be completed through normal sign-in MFA", async () => {
  const harness = createHarness({
    stepUp: {
      async getPendingAuthState() {
        return null;
      },
    },
  });

  const response = await harness.handlers.verifySignInTotp(
    postRequest(
      "/mfa/sign-in/totp",
      {
        code: "123456",
      },
      `__Host-puzzle.session=session-token; __Host-puzzle.mfa=${challengeToken}`,
    ),
  );

  assert.equal(response.status, 401);
  assert.equal(harness.calls.verifyTotp.length, 0);
});

test("a stale step-up cookie is not interpreted as a sign-in MFA challenge", async () => {
  const harness = createHarness({
    stepUp: {
      async getPendingAuthState() {
        return null;
      },
    },
  });

  const request = new Request("https://example.com/state", {
    method: "GET",
    headers: {
      cookie: `__Host-puzzle.session=session-token; __Host-puzzle.mfa=${challengeToken}`,
    },
  });

  const response = await harness.handlers.getAuthState(request);

  assert.equal(response.status, 200);

  const payload = await response.json();

  assert.equal(payload.status, "authenticated");
  assert.equal(payload.user.id, "user-1");
});
