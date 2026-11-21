import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readDist = (path) =>
  readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");

test("shared and client media entries expose no provider or server-only types", async () => {
  const [sharedJs, sharedDts, clientJs, clientDts] = await Promise.all([
    readDist("media/shared/index.js"),
    readDist("media/shared/index.d.ts"),
    readDist("media/client/index.js"),
    readDist("media/client/index.d.ts"),
  ]);
  const publicDeclarations = `${sharedDts}\n${clientDts}`;

  assert.doesNotMatch(sharedJs, /@puzzle-ui\/media|media\/server|node:/);
  assert.doesNotMatch(clientJs, /@puzzle-ui\/media|media\/server|node:/);
  assert.doesNotMatch(
    publicDeclarations,
    /MediaObjectReference|MediaObjectStorageAdapter|MediaUploadSession|StorageAdapter|multipartUploadId|providerUploadId/,
  );
  assert.doesNotMatch(publicDeclarations, /tenantId:\s*string/);
});

test("media server and framework adapters do not import browser UI", async () => {
  const [server, next, tanstack] = await Promise.all([
    readDist("media/server/index.js"),
    readDist("media/next/index.js"),
    readDist("media/tanstack/index.js"),
  ]);

  assert.doesNotMatch(server, /@puzzle-ui\/ui|react-dom|media\/client|next\/|tanstack\/react/);
  assert.doesNotMatch(next, /@puzzle-ui\/ui|react|media\/client/);
  assert.doesNotMatch(tanstack, /@puzzle-ui\/ui|react|media\/client/);
});

test("media entry additions preserve all Auth export subpaths", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const authExports = Object.keys(manifest.exports).filter((entry) =>
    entry.startsWith("./auth/"),
  );
  assert.deepEqual(authExports.sort(), [
    "./auth/client",
    "./auth/next",
    "./auth/server",
    "./auth/shared",
    "./auth/tanstack",
  ]);
  for (const entry of authExports) {
    assert.ok(manifest.exports[entry].import.default.startsWith("./dist/auth/"));
    assert.ok(manifest.exports[entry].require.default.startsWith("./dist/auth/"));
  }
});
