import test from "node:test";
import assert from "node:assert/strict";

import { createNextAuthHandler } from "../dist/auth/next/index.js";

import { createTanStackAuthHandler } from "../dist/auth/tanstack/index.js";

const createServer = () => ({
  handlers: {
    async getAuthState() {
      return new Response(
        JSON.stringify({
          status: "unauthenticated",
          user: null,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    },

    async register() {
      return new Response(null, { status: 201 });
    },

    async signIn() {
      return new Response(null, { status: 200 });
    },

    async signOut() {
      return new Response(null, { status: 200 });
    },
  },
});

test("Next adapter dispatches authentication requests", async () => {
  const handlers = createNextAuthHandler({
    auth: createServer(),
  });

  const response = await handlers.GET(
    new Request("https://example.com/api/auth/state"),
  );

  assert.equal(response.status, 200);

  assert.deepEqual(await response.json(), {
    status: "unauthenticated",
    user: null,
  });
});

test("Next adapter returns 404 for unknown routes", async () => {
  const handlers = createNextAuthHandler({
    auth: createServer(),
  });

  const response = await handlers.GET(
    new Request("https://example.com/api/auth/unknown"),
  );

  assert.equal(response.status, 404);
});

test("Next adapter rejects unsupported methods", async () => {
  const handlers = createNextAuthHandler({
    auth: createServer(),
  });

  const response = await handlers.GET(
    new Request("https://example.com/api/auth/state", {
      method: "DELETE",
    }),
  );

  assert.equal(response.status, 405);
});

test("TanStack adapter dispatches authentication requests", async () => {
  const handler = createTanStackAuthHandler({
    auth: createServer(),
  });

  const response = await handler(
    new Request("https://example.com/api/auth/state"),
  );

  assert.equal(response.status, 200);

  assert.deepEqual(await response.json(), {
    status: "unauthenticated",
    user: null,
  });
});

test("TanStack adapter returns 404 for unknown routes", async () => {
  const handler = createTanStackAuthHandler({
    auth: createServer(),
  });

  const response = await handler(
    new Request("https://example.com/api/auth/unknown"),
  );

  assert.equal(response.status, 404);
});
