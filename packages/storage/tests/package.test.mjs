import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("package manifest exposes a buildable package", async () => {
  const manifest = JSON.parse(await readFile(resolve(packageRoot, "package.json"), "utf8"));
  assert.equal(manifest.name, "@puzzle-ui/storage");
  assert.equal(manifest.type, "module");
  assert.ok(manifest.exports);
  assert.ok(manifest.scripts.build);
});
