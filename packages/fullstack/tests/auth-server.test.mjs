import test from "node:test";
import assert from "node:assert/strict";

import {
  createAuthServer,
  createAuthRouteHandlers,
} from "../dist/auth/server/index.js";

import { createSessionCookieOptions } from "@puzzle-ui/session";

const createHarness = (input = {}) => {
  const calls = [];

  let mfaInitializationAttempts = 0;

  const auth = {
    async initialize() {
      calls.push("auth");
    },

    async getAuthState() {
      return {
        status: "unauthenticated",
      };
    },

    async getCurrentUser() {
      return null;
    },

    async signIn() {
      throw new Error("Unexpected sign-in call.");
    },

    async signOut() {},
  };

  const mfa = {
    async initialize() {
      calls.push("mfa");
      mfaInitializationAttempts++;

      if (input.failFirstMfaInitialization && mfaInitializationAttempts === 1) {
        throw new Error("Simulated MFA storage initialization failure.");
      }
    },

    async getAvailableFactors() {
      return [];
    },
  };

  const stepUp = {
    async initialize() {
      calls.push("step-up");
    },

    async getPendingAuthState() {
      return null;
    },
  };

  const sessions = {
    async validate() {
      return null;
    },

    async revoke() {},
    async revokeAll() {},
  };

  const server = createAuthServer({
    auth,
    mfa,
    stepUp,
    sessions,
    cookie: createSessionCookieOptions({
      production: true,
    }),
    csrf: {
      allowedOrigins: ["https://example.com"],
    },
    resolveClientIp: () => "127.0.0.1",
  });

  return {
    server,
    calls,
  };
};

test("initializes MFA, auth and step-up exactly once", async () => {
  const harness = createHarness();

  await Promise.all([
    harness.server.initialize(),
    harness.server.initialize(),
    harness.server.initialize(),
  ]);

  assert.deepEqual(harness.calls, ["mfa", "auth", "step-up"]);

  await harness.server.initialize();

  assert.deepEqual(harness.calls, ["mfa", "auth", "step-up"]);
});

test("route handlers initialize the server before processing requests", async () => {
  const harness = createHarness();

  const routes = createAuthRouteHandlers(harness.server);

  assert.equal(typeof routes["/api/auth/state"].GET, "function");

  const response = await routes["/api/auth/state"].GET(
    new Request("https://example.com/api/auth/state", {
      method: "GET",
    }),
  );

  assert.equal(response.status, 200);

  assert.deepEqual(harness.calls, ["mfa", "auth", "step-up"]);

  assert.deepEqual(await response.json(), {
    status: "unauthenticated",
    user: null,
  });

  assert.equal(typeof routes["/api/auth/register"].POST, "function");

  assert.equal(
    typeof routes["/api/auth/mfa/enrollment/required/totp/start"].POST,
    "function",
  );

  assert.equal(
    typeof routes["/api/auth/mfa/enrollment/required/totp/finish"].POST,
    "function",
  );

  assert.equal(
    typeof routes["/api/auth/mfa/enrollment/required/passkey/start"].POST,
    "function",
  );

  assert.equal(
    typeof routes["/api/auth/mfa/enrollment/required/passkey/finish"].POST,
    "function",
  );
});

test("direct server handlers also initialize before processing requests", async () => {
  const harness = createHarness();

  const response = await harness.server.handlers.getAuthState(
    new Request("https://example.com/state", {
      method: "GET",
    }),
  );

  assert.equal(response.status, 200);

  assert.deepEqual(harness.calls, ["mfa", "auth", "step-up"]);
});

test("a failed initialization returns an unavailable response and can be retried", async () => {
  const harness = createHarness({
    failFirstMfaInitialization: true,
  });

  const request = new Request("https://example.com/state", {
    method: "GET",
  });

  const firstResponse = await harness.server.handlers.getAuthState(request);

  assert.equal(firstResponse.status, 503);

  assert.deepEqual(await firstResponse.json(), {
    error: {
      code: "AUTH_INITIALIZATION_FAILED",
      message: "Authentication is temporarily unavailable.",
    },
  });

  const secondResponse = await harness.server.handlers.getAuthState(request);

  assert.equal(secondResponse.status, 200);

  assert.deepEqual(harness.calls, ["mfa", "mfa", "auth", "step-up"]);
});
