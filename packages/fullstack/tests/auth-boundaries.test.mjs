import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readDist = (path) =>
  readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");

test("client entry does not import server-only packages", async () => {
  const source = await readDist("auth/client/index.js");

  assert.doesNotMatch(source, /@puzzle-ui\/auth/);
  assert.doesNotMatch(source, /@puzzle-ui\/session/);
  assert.doesNotMatch(source, /auth\/server/);
  assert.doesNotMatch(source, /node:/);
});

test("shared entry does not import server implementations", async () => {
  const source = await readDist("auth/shared/index.js");

  assert.doesNotMatch(source, /@puzzle-ui\/auth/);
  assert.doesNotMatch(source, /@puzzle-ui\/session/);
  assert.doesNotMatch(source, /node:/);
});

test("server entry does not import browser UI dependencies", async () => {
  const source = await readDist("auth/server/index.js");

  assert.doesNotMatch(source, /@puzzle-ui\/ui/);
  assert.doesNotMatch(source, /react-dom/);
  assert.doesNotMatch(source, /@simplewebauthn\/browser/);
});

test("Next integration does not import React client modules", async () => {
  const source = await readDist("auth/next/index.js");

  assert.doesNotMatch(source, /react/);
  assert.doesNotMatch(source, /@puzzle-ui\/ui/);
});

test("TanStack integration does not import React client modules", async () => {
  const source = await readDist("auth/tanstack/index.js");

  assert.doesNotMatch(source, /@puzzle-ui\/ui/);
});
