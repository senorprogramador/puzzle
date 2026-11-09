import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

test("session package does not depend on framework packages", async () => {
  const manifest = JSON.parse(
    await readFile(resolve(root, "package.json"), "utf8"),
  );

  const dependencies = {
    ...manifest.dependencies,
    ...manifest.devDependencies,
  };

  assert.equal(dependencies.react, undefined);
  assert.equal(dependencies.next, undefined);
  assert.equal(dependencies["@tanstack/react-start"], undefined);
});

test("session package depends only on vendor-neutral storage", async () => {
  const manifest = JSON.parse(
    await readFile(resolve(root, "package.json"), "utf8"),
  );

  assert.deepEqual(Object.keys(manifest.dependencies), ["@puzzle-ui/storage"]);
});

test("public entry point exposes the session engine", async () => {
  const index = await readFile(resolve(root, "src/index.ts"), "utf8");

  assert.match(index, /StorageSessionManager/);
  assert.match(index, /SessionDataManager/);
  assert.match(index, /SessionMigrationManager/);
});

test("session records never expose plaintext token fields", async () => {
  const types = await readFile(
    resolve(root, "src/types/session.types.ts"),
    "utf8",
  );

  assert.match(types, /tokenHash/);
  assert.doesNotMatch(types, /readonly token:/);
});

test("session collection has a unique token hash index", async () => {
  const source = await readFile(
    resolve(root, "src/session.storage.ts"),
    "utf8",
  );

  assert.match(source, /token_hash_unique/);
  assert.match(source, /unique:\s*true/);
});

test("session data collection has a compound unique index", async () => {
  const source = await readFile(
    resolve(root, "src/session.storage.ts"),
    "utf8",
  );

  assert.match(source, /owner_namespace_key/);
  assert.match(source, /ownerId.*namespace.*key/s);
});

test("migration explicitly restricts allowed namespaces", async () => {
  const source = await readFile(
    resolve(root, "src/session.migration.ts"),
    "utf8",
  );

  assert.match(source, /allowedNamespaces/);
  assert.match(source, /maximumTotalBytes/);
  assert.match(source, /atomicBatch/);
});

test("session manager enforces idle and absolute expiration", async () => {
  const source = await readFile(
    resolve(root, "src/session.manager.ts"),
    "utf8",
  );

  assert.match(source, /idleTimeoutSeconds/);
  assert.match(source, /absoluteLifetimeSeconds/);
});

test("session manager requires atomic storage capabilities", async () => {
  const source = await readFile(
    resolve(root, "src/session.manager.ts"),
    "utf8",
  );

  assert.match(source, /uniqueConstraints/);
  assert.match(source, /conditionalWrites/);
  assert.match(source, /atomicBatch/);
});
