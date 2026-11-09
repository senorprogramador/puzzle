import test from "node:test";
import assert from "node:assert/strict";

import {
  generateSessionToken,
  generateSessionId,
  hashSessionToken,
} from "../dist/index.js";

test("generates a 256-bit opaque session token", () => {
  const token = generateSessionToken();

  assert.equal(typeof token, "string");
  assert.match(token, /^[A-Za-z0-9_-]+$/);

  // Base64URL representation of 32 bytes.
  assert.equal(token.length, 43);
});

test("generates unique session tokens", () => {
  const first = generateSessionToken();
  const second = generateSessionToken();

  assert.notEqual(first, second);
});

test("generates valid UUID session IDs", () => {
  const id = generateSessionId();

  assert.match(
    id,
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  );
});

test("hashes tokens deterministically", async () => {
  const token = generateSessionToken();

  const first = await hashSessionToken(token);
  const second = await hashSessionToken(token);

  assert.equal(first, second);
});

test("never returns the raw token as its hash", async () => {
  const token = generateSessionToken();
  const hash = await hashSessionToken(token);

  assert.notEqual(hash, token);
});

test("rejects malformed tokens", async () => {
  await assert.rejects(
    () => hashSessionToken("short"),
    /Invalid session token/,
  );
});
