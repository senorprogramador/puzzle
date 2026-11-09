import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));

test("package manifest exposes a buildable package", async () => {
  const manifest = JSON.parse(
    await readFile(resolve(packageRoot, "package.json"), "utf8"),
  );

  assert.equal(manifest.name, "@puzzle-ui/session");
  assert.equal(manifest.type, "module");
  assert.ok(manifest.exports);
  assert.ok(manifest.scripts.build);
  assert.ok(manifest.scripts.typecheck);
  assert.ok(manifest.scripts.test);
});

test("package publishes only compiled output", async () => {
  const manifest = JSON.parse(
    await readFile(resolve(packageRoot, "package.json"), "utf8"),
  );

  assert.deepEqual(manifest.files, ["dist"]);
});

test("package uses the Node built-in test runner", async () => {
  const manifest = JSON.parse(
    await readFile(resolve(packageRoot, "package.json"), "utf8"),
  );

  assert.equal(manifest.scripts.test, "node --test");
});
