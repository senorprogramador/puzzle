import test from "node:test";
import assert from "node:assert/strict";

import { createAuthReadinessHandler } from "../dist/auth/server/index.js";

const createRequest = (method = "GET") =>
  new Request("https://example.com/api/health/ready", {
    method,
  });

test("returns ready when every dependency check succeeds", async () => {
  const handler = createAuthReadinessHandler({
    checks: [
      {
        name: "storage",
        check: async () => true,
      },
      {
        name: "rate-limiter",
        check: async () => undefined,
      },
      {
        name: "session-storage",
        check: async () => true,
      },
    ],
  });

  const response = await handler(createRequest());

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");

  assert.deepEqual(await response.json(), {
    status: "ready",
    checks: [
      {
        name: "storage",
        status: "ok",
      },
      {
        name: "rate-limiter",
        status: "ok",
      },
      {
        name: "session-storage",
        status: "ok",
      },
    ],
  });
});

test("returns unavailable when a dependency check fails", async () => {
  const handler = createAuthReadinessHandler({
    checks: [
      {
        name: "storage",
        check: async () => true,
      },
      {
        name: "database",
        check: async () => false,
      },
    ],
  });

  const response = await handler(createRequest());

  assert.equal(response.status, 503);

  assert.deepEqual(await response.json(), {
    status: "unavailable",
    checks: [
      {
        name: "storage",
        status: "ok",
      },
      {
        name: "database",
        status: "unavailable",
      },
    ],
  });
});

test("does not expose dependency error messages", async () => {
  const handler = createAuthReadinessHandler({
    checks: [
      {
        name: "database",
        check: async () => {
          throw new Error("Connection failed: password=production-secret");
        },
      },
    ],
  });

  const response = await handler(createRequest());
  const body = await response.text();

  assert.equal(response.status, 503);
  assert.doesNotMatch(body, /production-secret/);
  assert.doesNotMatch(body, /password=/);
  assert.doesNotMatch(body, /Connection failed/);
});

test("runs independent dependency checks concurrently", async () => {
  let completed = 0;

  const handler = createAuthReadinessHandler({
    checks: [
      {
        name: "first",
        check: async () => {
          completed++;
        },
      },
      {
        name: "second",
        check: async () => {
          completed++;
        },
      },
      {
        name: "third",
        check: async () => {
          completed++;
        },
      },
    ],
  });

  const response = await handler(createRequest());

  assert.equal(response.status, 200);
  assert.equal(completed, 3);
});

test("supports HEAD requests without returning a response body", async () => {
  const handler = createAuthReadinessHandler({
    checks: [
      {
        name: "storage",
        check: async () => true,
      },
    ],
  });

  const response = await handler(createRequest("HEAD"));

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "");
});

test("returns 503 for HEAD requests when dependencies are unavailable", async () => {
  const handler = createAuthReadinessHandler({
    checks: [
      {
        name: "storage",
        check: async () => false,
      },
    ],
  });

  const response = await handler(createRequest("HEAD"));

  assert.equal(response.status, 503);
  assert.equal(await response.text(), "");
});

test("rejects unsupported HTTP methods", async () => {
  const handler = createAuthReadinessHandler({
    checks: [
      {
        name: "storage",
        check: async () => true,
      },
    ],
  });

  const response = await handler(createRequest("POST"));

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
});

test("requires at least one readiness check", () => {
  assert.throws(
    () =>
      createAuthReadinessHandler({
        checks: [],
      }),
    TypeError,
  );
});

test("rejects duplicate readiness check names", () => {
  assert.throws(
    () =>
      createAuthReadinessHandler({
        checks: [
          {
            name: "storage",
            check: async () => true,
          },
          {
            name: "storage",
            check: async () => true,
          },
        ],
      }),
    TypeError,
  );
});

test("rejects invalid readiness check names", () => {
  assert.throws(
    () =>
      createAuthReadinessHandler({
        checks: [
          {
            name: "Database Connection",
            check: async () => true,
          },
        ],
      }),
    TypeError,
  );
});
