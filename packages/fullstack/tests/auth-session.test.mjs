import test from "node:test";
import assert from "node:assert/strict";

import {
  getRequestSession,
  createSessionResponse,
  clearSessionResponse,
  logoutRequest,
  logoutAllRequest,
} from "../dist/auth/server/index.js";

import { createSessionCookieOptions } from "@puzzle-ui/session";

const cookie = createSessionCookieOptions({
  production: true,
});

const csrf = {
  allowedOrigins: ["https://example.com"],
};

const createSessionStub = () => {
  const calls = {
    validate: [],
    revoke: [],
    revokeAll: [],
  };

  const session = {
    id: "session-1",
    tokenHash: "hash",
    userId: "user-1",
    kind: "authenticated",
    createdAt: new Date(),
    lastSeenAt: new Date(),
    expiresAt: new Date(Date.now() + 3600000),
    revokedAt: null,
  };

  return {
    calls,

    sessions: {
      async validate(token) {
        calls.validate.push(token);

        return token === "valid-token" ? session : null;
      },

      async revoke(id) {
        calls.revoke.push(id);
      },

      async revokeAll(userId) {
        calls.revokeAll.push(userId);
      },
    },
  };
};

test("extracts and validates the request session", async () => {
  const { sessions, calls } = createSessionStub();

  const request = new Request("https://example.com/private", {
    headers: {
      cookie: "__Host-puzzle.session=valid-token",
    },
  });

  const result = await getRequestSession(request, {
    sessions,
    cookie,
  });

  assert.equal(result.id, "session-1");
  assert.deepEqual(calls.validate, ["valid-token"]);
});

test("returns null for missing session cookies", async () => {
  const { sessions, calls } = createSessionStub();

  const request = new Request("https://example.com/private");

  assert.equal(
    await getRequestSession(request, {
      sessions,
      cookie,
    }),
    null,
  );

  assert.equal(calls.validate.length, 0);
});

test("returns null for invalid session tokens", async () => {
  const { sessions } = createSessionStub();

  const request = new Request("https://example.com/private", {
    headers: {
      cookie: "__Host-puzzle.session=invalid-token",
    },
  });

  assert.equal(
    await getRequestSession(request, {
      sessions,
      cookie,
    }),
    null,
  );
});

test("creates a non-cacheable session response", () => {
  const response = createSessionResponse(
    JSON.stringify({ success: true }),
    "valid-token",
    {
      sessions: createSessionStub().sessions,
      cookie,
    },
    new Date(Date.now() + 3600000),
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.match(response.headers.get("set-cookie"), /HttpOnly/);
  assert.match(response.headers.get("set-cookie"), /Secure/);
});

test("rejects expired session cookies", () => {
  assert.throws(
    () =>
      createSessionResponse(
        null,
        "valid-token",
        {
          sessions: createSessionStub().sessions,
          cookie,
        },
        new Date(Date.now() - 1000),
      ),
    /expired/,
  );
});

test("clears the session cookie", () => {
  const response = clearSessionResponse(null, {
    sessions: createSessionStub().sessions,
    cookie,
  });

  assert.match(response.headers.get("set-cookie"), /Max-Age=0/);

  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("logout revokes the current session", async () => {
  const { sessions, calls } = createSessionStub();

  const request = new Request("https://example.com/logout", {
    method: "POST",
    headers: {
      origin: "https://example.com",
      cookie: "__Host-puzzle.session=valid-token",
    },
  });

  const response = await logoutRequest(request, {
    sessions,
    cookie,
    csrf,
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls.revoke, ["session-1"]);
  assert.match(response.headers.get("set-cookie"), /Max-Age=0/);
});

test("logout rejects untrusted origins", async () => {
  const { sessions, calls } = createSessionStub();

  const request = new Request("https://example.com/logout", {
    method: "POST",
    headers: {
      origin: "https://attacker.example",
      cookie: "__Host-puzzle.session=valid-token",
    },
  });

  await assert.rejects(
    () =>
      logoutRequest(request, {
        sessions,
        cookie,
        csrf,
      }),
    /not allowed/,
  );

  assert.equal(calls.revoke.length, 0);
});

test("logout all revokes all sessions for the authenticated user", async () => {
  const { sessions, calls } = createSessionStub();

  const request = new Request("https://example.com/logout-all", {
    method: "POST",
    headers: {
      origin: "https://example.com",
      cookie: "__Host-puzzle.session=valid-token",
    },
  });

  const response = await logoutAllRequest(request, {
    sessions,
    cookie,
    csrf,
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls.revokeAll, ["user-1"]);
});

test("logout all rejects untrusted origins", async () => {
  const { sessions, calls } = createSessionStub();

  const request = new Request("https://example.com/logout-all", {
    method: "POST",
    headers: {
      origin: "https://attacker.example",
    },
  });

  await assert.rejects(
    () =>
      logoutAllRequest(request, {
        sessions,
        cookie,
        csrf,
      }),
    /not allowed/,
  );

  assert.equal(calls.revokeAll.length, 0);
});

test("logout all rejects missing session cookies", async () => {
  const { sessions, calls } = createSessionStub();

  const request = new Request("https://example.com/logout-all", {
    method: "POST",
    headers: {
      origin: "https://example.com",
    },
  });

  const response = await logoutAllRequest(request, {
    sessions,
    cookie,
    csrf,
  });

  assert.equal(response.status, 401);
  assert.equal(calls.revokeAll.length, 0);
});

test("logout all derives the user ID from the validated session", async () => {
  const { sessions, calls } = createSessionStub();

  const request = new Request("https://example.com/logout-all", {
    method: "POST",
    headers: {
      origin: "https://example.com",
      cookie: "__Host-puzzle.session=valid-token",
    },
  });

  const response = await logoutAllRequest(request, {
    sessions,
    cookie,
    csrf,
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls.revokeAll, ["user-1"]);
});

test("logout all rejects anonymous sessions", async () => {
  const { sessions, calls } = createSessionStub();

  sessions.validate = async () => ({
    id: "anonymous-1",
    userId: null,
    kind: "anonymous",
  });

  const request = new Request("https://example.com/logout-all", {
    method: "POST",
    headers: {
      origin: "https://example.com",
      cookie: "__Host-puzzle.session=valid-token",
    },
  });

  const response = await logoutAllRequest(request, {
    sessions,
    cookie,
    csrf,
  });

  assert.equal(response.status, 401);
  assert.equal(calls.revokeAll.length, 0);
});
