import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("package manifest exposes a buildable package", async () => {
  const manifest = JSON.parse(await readFile(resolve(packageRoot, "package.json"), "utf8"));
  assert.equal(manifest.name, "@puzzle-ui/fullstack");
  assert.equal(manifest.type, "module");
  assert.ok(manifest.exports);
  assert.ok(manifest.scripts.build);
});

test("build output matches every package export", async () => {
  const manifest = JSON.parse(
    await readFile(resolve(packageRoot, "package.json"), "utf8"),
  );

  for (const entry of Object.values(manifest.exports)) {
    for (const condition of [entry.import, entry.require]) {
      await access(resolve(packageRoot, condition.types));
      await access(resolve(packageRoot, condition.default));
    }
  }
});
