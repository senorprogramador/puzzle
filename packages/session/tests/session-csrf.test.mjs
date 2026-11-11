import test from "node:test";
import assert from "node:assert/strict";

import {
  validateRequestOrigin,
  protectStateChangingRequest,
} from "../dist/index.js";

const options = {
  allowedOrigins: ["https://example.com", "https://app.example.com"],
};

test("accepts an allowed origin", () => {
  const request = new Request("https://example.com/api", {
    method: "POST",
    headers: {
      origin: "https://example.com",
    },
  });

  assert.doesNotThrow(() => validateRequestOrigin(request, options));
});

test("rejects an untrusted origin", () => {
  const request = new Request("https://example.com/api", {
    method: "POST",
    headers: {
      origin: "https://attacker.example",
    },
  });

  assert.throws(() => validateRequestOrigin(request, options), /not allowed/);
});

test("rejects missing origin by default", () => {
  const request = new Request("https://example.com/api", {
    method: "POST",
  });

  assert.throws(
    () => validateRequestOrigin(request, options),
    /Origin header is required/,
  );
});

test("normalizes default ports", () => {
  const request = new Request("https://example.com/api", {
    method: "POST",
    headers: {
      origin: "https://example.com:443",
    },
  });

  assert.doesNotThrow(() => validateRequestOrigin(request, options));
});

test("rejects origin values containing paths", () => {
  const request = new Request("https://example.com/api", {
    method: "POST",
    headers: {
      origin: "https://example.com/untrusted-path",
    },
  });

  assert.throws(
    () => validateRequestOrigin(request, options),
    /Invalid request origin/,
  );
});

test("rejects origin values containing query strings", () => {
  const request = new Request("https://example.com/api", {
    method: "POST",
    headers: {
      origin: "https://example.com/?redirect=https://attacker.example",
    },
  });

  assert.throws(
    () => validateRequestOrigin(request, options),
    /Invalid request origin/,
  );
});

test("rejects origin values containing fragments", () => {
  const request = new Request("https://example.com/api", {
    method: "POST",
    headers: {
      origin: "https://example.com/#attacker",
    },
  });

  assert.throws(
    () => validateRequestOrigin(request, options),
    /Invalid request origin/,
  );
});

test("rejects origin values containing credentials", () => {
  const request = new Request("https://example.com/api", {
    method: "POST",
    headers: {
      origin: "https://user:password@example.com",
    },
  });

  assert.throws(
    () => validateRequestOrigin(request, options),
    /Invalid request origin/,
  );
});

test("rejects unsupported origin protocols", () => {
  const request = new Request("https://example.com/api", {
    method: "POST",
    headers: {
      origin: "ftp://example.com",
    },
  });

  assert.throws(
    () => validateRequestOrigin(request, options),
    /Invalid request origin/,
  );
});

test("rejects cross-site state-changing requests", () => {
  const request = new Request("https://example.com/api", {
    method: "POST",
    headers: {
      origin: "https://example.com",
      "sec-fetch-site": "cross-site",
    },
  });

  assert.throws(
    () => protectStateChangingRequest(request, options),
    /Cross-site/,
  );
});

test("allows safe GET requests without origin", () => {
  const request = new Request("https://example.com/api", {
    method: "GET",
  });

  assert.doesNotThrow(() => protectStateChangingRequest(request, options));
});

test("allows same-origin state-changing requests", () => {
  const request = new Request("https://example.com/api", {
    method: "POST",
    headers: {
      origin: "https://example.com",
      "sec-fetch-site": "same-origin",
    },
  });

  assert.doesNotThrow(() => protectStateChangingRequest(request, options));
});

test("allows explicitly configured missing origins", () => {
  const request = new Request("https://example.com/api", {
    method: "POST",
  });

  assert.doesNotThrow(() =>
    validateRequestOrigin(request, {
      ...options,
      allowMissingOrigin: true,
    }),
  );
});

test("does not allow an untrusted origin when missing origins are permitted", () => {
  const request = new Request("https://example.com/api", {
    method: "POST",
    headers: {
      origin: "https://attacker.example",
    },
  });

  assert.throws(
    () =>
      validateRequestOrigin(request, {
        ...options,
        allowMissingOrigin: true,
      }),
    /not allowed/,
  );
});
