import test from "node:test";
import assert from "node:assert/strict";

import {
  createAuthLifecycleHandlers,
  createAuthReadinessHandler,
} from "../dist/auth/server/index.js";

import { createSessionCookieOptions } from "@puzzle-ui/session";

const origin = "https://example.com";
const jsonRequest = (pathname, body, extraHeaders = {}) =>
  new Request(`${origin}${pathname}`, {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });

const createLifecycleHarness = (overrides = {}, allowPasswordChange = true) => {
  const calls = [];
  const lifecycle = {
    async sendEmailVerification(input) { calls.push(["sendEmailVerification", input]); },
    async verifyEmail(token) { calls.push(["verifyEmail", token]); },
    async requestPasswordReset(input) { calls.push(["requestPasswordReset", input]); },
    async resetPassword(input) { calls.push(["resetPassword", input]); },
    async changePassword(input) { calls.push(["changePassword", input]); },
    async requestEmailChange(input) { calls.push(["requestEmailChange", input]); },
    async verifyEmailChange(token) {
      calls.push(["verifyEmailChange", token]);
      return { id: "user-1", email: "new@example.com" };
    },
    async updateProfile(input) {
      calls.push(["updateProfile", input]);
      return { id: "user-1", name: input.name ?? "Example", image: input.image ?? null };
    },
    ...overrides,
  };
  const cookie = createSessionCookieOptions({ production: false });
  const handlers = createAuthLifecycleHandlers({
    lifecycle,
    sessions: {
      async validate(token) {
        return token === "session-token"
          ? {
              id: token,
              kind: "authenticated",
              userId: "user-1",
              createdAt: new Date("2025-01-01T00:00:00.000Z"),
              lastSeenAt: new Date("2025-01-02T00:00:00.000Z"),
              expiresAt: new Date("2025-02-01T00:00:00.000Z"),
              revokedAt: null,
            }
          : null;
      },
      async list(userId, currentSessionId) {
        return [
          {
            sessionId: currentSessionId,
            kind: "authenticated",
            createdAt: new Date("2025-01-01T00:00:00.000Z"),
            lastSeenAt: new Date("2025-01-02T00:00:00.000Z"),
            expiresAt: new Date("2025-02-01T00:00:00.000Z"),
            current: true,
          },
        ];
      },
      async get(sessionId) {
        return sessionId === "other-session"
          ? {
              id: sessionId,
              kind: "authenticated",
              userId: "user-1",
              createdAt: new Date("2025-01-01T00:00:00.000Z"),
              lastSeenAt: new Date("2025-01-02T00:00:00.000Z"),
              expiresAt: new Date("2025-02-01T00:00:00.000Z"),
              revokedAt: null,
            }
          : null;
      },
      async revoke(sessionId) {
        calls.push(["revoke", sessionId]);
      },
    },
    cookie,
    csrf: { allowedOrigins: [origin] },
    resolveClientIp: () => "203.0.113.8",
    verificationUrl: () => "https://example.com/verify?token=verified-token",
    passwordResetUrl: () => "https://example.com/reset?token=reset-token",
    emailChangeUrl: () => "https://example.com/verify-email-change?token=email-token",
    allowPasswordChange,
  });
  return { calls, handlers, cookie };
};

test("lifecycle endpoints invoke callbacks with validated request context and stable success responses", async () => {
  const harness = createLifecycleHarness();
  const cookieHeader = `${harness.cookie.name}=session-token`;

  const verificationRequest = new Request(`${origin}/verification/request`, {
    method: "POST",
    headers: { origin, cookie: cookieHeader },
  });
  const verification = await harness.handlers.requestEmailVerification(verificationRequest);
  assert.equal(verification.status, 200);
  assert.deepEqual(await verification.json(), { status: "verification-requested" });

  const verified = await harness.handlers.verifyEmail(
    jsonRequest("/verification/verify", { token: "verification-token" }),
  );
  assert.equal(verified.status, 200);
  assert.deepEqual(await verified.json(), { status: "email-verified" });

  const resetRequested = await harness.handlers.requestPasswordReset(
    jsonRequest("/password/reset/request", { email: " person@example.com " }),
  );
  assert.equal(resetRequested.status, 200);
  assert.deepEqual(await resetRequested.json(), { status: "password-reset-requested" });

  const reset = await harness.handlers.resetPassword(
    jsonRequest("/password/reset/finish", {
      token: "reset-token",
      newPassword: "new-password",
    }),
  );
  assert.equal(reset.status, 200);
  assert.deepEqual(await reset.json(), { status: "password-reset" });

  const changed = await harness.handlers.changePassword(
    jsonRequest(
      "/password/change",
      { currentPassword: "old-password", newPassword: "new-password" },
      { cookie: cookieHeader },
    ),
  );
  assert.equal(changed.status, 200);
  assert.deepEqual(await changed.json(), { status: "password-changed" });

  assert.deepEqual(harness.calls, [
    ["sendEmailVerification", {
      userId: "user-1",
      verificationUrl: "https://example.com/verify?token=verified-token",
      ipAddress: "203.0.113.8",
    }],
    ["verifyEmail", "verification-token"],
    ["requestPasswordReset", {
      email: " person@example.com ",
      resetUrl: "https://example.com/reset?token=reset-token",
      ipAddress: "203.0.113.8",
    }],
    ["resetPassword", { token: "reset-token", newPassword: "new-password" }],
    ["changePassword", {
      sessionToken: "session-token",
      currentPassword: "old-password",
      newPassword: "new-password",
    }],
  ]);
});

test("lifecycle handlers reject invalid methods, bodies, CSRF, and missing sessions", async () => {
  const { handlers } = createLifecycleHarness();
  const wrongMethod = await handlers.verifyEmail(
    new Request(`${origin}/verification/verify`, { method: "GET" }),
  );
  assert.equal(wrongMethod.status, 405);
  assert.deepEqual(await wrongMethod.json(), {
    error: { code: "METHOD_NOT_ALLOWED", message: "Only POST requests are supported." },
  });

  test("lifecycle handler can reject password changes without invoking persistence", async () => {
    const { calls, handlers, cookie } = createLifecycleHarness({}, false);
    const response = await handlers.changePassword(
      jsonRequest(
        "/password/change",
        { currentPassword: "old-password", newPassword: "new-password" },
        { cookie: `${cookie.name}=session-token` },
      ),
    );

    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), {
      error: {
        code: "PASSWORD_CHANGE_DISABLED",
        message: "Password changes are disabled.",
      },
    });
    assert.equal(calls.some(([name]) => name === "changePassword"), false);
  });

  const malformed = await handlers.verifyEmail(new Request(`${origin}/verification/verify`, {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: "{",
  }));
  assert.equal(malformed.status, 400);
  assert.deepEqual((await malformed.json()).error, {
    code: "INVALID_REQUEST",
    message: "The request is invalid.",
  });

  const missingToken = await handlers.verifyEmail(jsonRequest("/verification/verify", { token: " " }));
  assert.equal(missingToken.status, 400);

  const noSession = await handlers.requestEmailVerification(
    new Request(`${origin}/verification/request`, {
      method: "POST",
      headers: { origin },
    }),
  );
  assert.equal(noSession.status, 401);
  assert.equal((await noSession.json()).error.code, "UNAUTHENTICATED");

  const noCookie = await handlers.changePassword(
    jsonRequest("/password/change", {
      currentPassword: "old",
      newPassword: "new",
    }),
  );
  assert.equal(noCookie.status, 401);
});

test("profile and session handlers are authenticated, scoped, and revoke other sessions only", async () => {
  const harness = createLifecycleHarness();
  const cookie = `${harness.cookie.name}=session-token`;

  const profile = await harness.handlers.updateProfile(
    jsonRequest(
      "/profile",
      { name: "Updated User", image: null },
      { cookie },
    ),
  );
  assert.equal(profile.status, 200);
  assert.deepEqual(await profile.json(), {
    user: { id: "user-1", name: "Updated User", image: null },
  });
  assert.deepEqual(harness.calls[0], [
    "updateProfile",
    {
      sessionToken: "session-token",
      name: "Updated User",
      image: null,
    },
  ]);

  const sessions = await harness.handlers.listSessions(
    new Request(`${origin}/sessions`, { headers: { cookie } }),
  );
  assert.equal(sessions.status, 200);
  assert.equal((await sessions.json()).sessions[0].current, true);

  const revoked = await harness.handlers.revokeSession(
    jsonRequest("/sessions/revoke", { sessionId: "other-session" }, { cookie }),
  );
  assert.equal(revoked.status, 200);
  assert.deepEqual(await revoked.json(), { status: "session-revoked" });
  assert.deepEqual(harness.calls[1], ["revoke", "other-session"]);

  const selfRevocation = await harness.handlers.revokeSession(
    jsonRequest("/sessions/revoke", { sessionId: "session-token" }, { cookie }),
  );
  assert.equal(selfRevocation.status, 404);
});

test("email change requires the current password and verifies the new address", async () => {
  const harness = createLifecycleHarness();
  const cookie = `${harness.cookie.name}=session-token`;

  const requested = await harness.handlers.requestEmailChange(
    jsonRequest(
      "/email/change/request",
      { currentPassword: "current-password", email: "new@example.com" },
      { cookie },
    ),
  );
  assert.equal(requested.status, 200);
  assert.deepEqual(await requested.json(), { status: "email-change-requested" });

  const verified = await harness.handlers.verifyEmailChange(
    jsonRequest("/email/change/verify", { token: "verification-token" }),
  );
  assert.equal(verified.status, 200);
  assert.deepEqual(await verified.json(), {
    status: "email-changed",
    user: { id: "user-1", email: "new@example.com" },
  });

  assert.deepEqual(harness.calls, [
    [
      "requestEmailChange",
      {
        sessionToken: "session-token",
        currentPassword: "current-password",
        email: "new@example.com",
        verificationUrl: "https://example.com/verify-email-change?token=email-token",
        ipAddress: "203.0.113.8",
      },
    ],
    ["verifyEmailChange", "verification-token"],
  ]);
});

test("lifecycle callback failures are sanitized and use the internal-error status", async () => {
  const { handlers } = createLifecycleHarness({
    async verifyEmail() {
      throw new Error("private provider details");
    },
  });
  const response = await handlers.verifyEmail(
    jsonRequest("/verification/verify", { token: "token" }),
  );

  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), {
    error: {
      code: "INTERNAL_AUTH_ERROR",
      message: "An authentication error occurred.",
    },
  });
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("readiness handler reports healthy, unavailable, failed, and HEAD checks", async () => {
  const checks = [
    { name: "database", check: () => true },
    { name: "email-provider", check: () => false },
    { name: "auth-storage", check: async () => { throw new Error("private"); } },
  ];
  const handler = createAuthReadinessHandler({ checks });
  const unavailable = await handler(new Request("https://example.com/health"));

  assert.equal(unavailable.status, 503);
  assert.equal(unavailable.headers.get("cache-control"), "no-store");
  assert.deepEqual(await unavailable.json(), {
    status: "unavailable",
    checks: [
      { name: "database", status: "ok" },
      { name: "email-provider", status: "unavailable" },
      { name: "auth-storage", status: "unavailable" },
    ],
  });

  const healthy = createAuthReadinessHandler({
    checks: [{ name: "database", check: async () => undefined }],
  });
  const head = await healthy(new Request("https://example.com/health", { method: "HEAD" }));
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");

  const rejectedMethod = await healthy(
    new Request("https://example.com/health", { method: "POST" }),
  );
  assert.equal(rejectedMethod.status, 405);
  assert.equal(rejectedMethod.headers.get("allow"), "GET, HEAD");
  assert.equal(await rejectedMethod.text(), "");
});

test("readiness handler validates non-empty, uniquely named checks", () => {
  assert.throws(() => createAuthReadinessHandler({ checks: [] }), /At least one/);
  assert.throws(
    () => createAuthReadinessHandler({
      checks: [
        { name: "database", check() {} },
        { name: "database", check() {} },
      ],
    }),
    /Duplicate readiness check name/,
  );
  assert.throws(
    () => createAuthReadinessHandler({ checks: [{ name: "Bad Name", check() {} }] }),
    /valid name and check function/,
  );
});
