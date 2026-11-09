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
