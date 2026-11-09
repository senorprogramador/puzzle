import test from "node:test";
import assert from "node:assert/strict";

import {
  createSessionCookieOptions,
  serializeSessionCookie,
  serializeClearedSessionCookie,
  readSessionCookie,
} from "../dist/index.js";

test("creates secure production cookie options", () => {
  const options = createSessionCookieOptions({
    production: true,
  });

  assert.equal(options.name, "__Host-puzzle.session");
  assert.equal(options.path, "/");
  assert.equal(options.httpOnly, true);
  assert.equal(options.secure, true);
  assert.equal(options.sameSite, "lax");
});

test("rejects insecure __Host cookies", () => {
  assert.throws(
    () =>
      createSessionCookieOptions({
        production: false,
      }),
    /__Host- cookies require Secure/,
  );
});

test("serializes an HttpOnly session cookie", () => {
  const options = createSessionCookieOptions({
    production: true,
  });

  const cookie = serializeSessionCookie("opaque-token", options, 3600);

  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /Path=\//);
  assert.match(cookie, /SameSite=lax/);
  assert.match(cookie, /Max-Age=3600/);
  assert.match(cookie, /__Host-puzzle\.session=/);
});

test("does not set a Domain attribute", () => {
  const options = createSessionCookieOptions({
    production: true,
  });

  const cookie = serializeSessionCookie("opaque-token", options, 3600);

  assert.doesNotMatch(cookie, /Domain=/i);
});

test("serializes cookie deletion", () => {
  const options = createSessionCookieOptions({
    production: true,
  });

  const cookie = serializeClearedSessionCookie(options);

  assert.match(cookie, /Max-Age=0/);
  assert.match(cookie, /Expires=/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
});

test("reads an encoded session cookie", () => {
  const token = readSessionCookie(
    "other=value; __Host-puzzle.session=abc%2F123; theme=dark",
  );

  assert.equal(token, "abc/123");
});

test("returns null for missing cookies", () => {
  assert.equal(readSessionCookie(null), null);
  assert.equal(readSessionCookie("theme=dark"), null);
});

test("rejects invalid cookie max age", () => {
  const options = createSessionCookieOptions({
    production: true,
  });

  assert.throws(
    () => serializeSessionCookie("token", options, 0),
    /positive integer/,
  );
});
