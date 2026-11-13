import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const readManifest = async () => {
  const content = await readFile(resolve(packageRoot, "package.json"), "utf8");

  return JSON.parse(content);
};

test("package has the correct identity", async () => {
  const manifest = await readManifest();

  assert.equal(manifest.name, "@puzzle-ui/seo");
  assert.equal(manifest.type, "module");
  assert.equal(manifest.license, "MIT");
});

test("package supports ESM and CommonJS", async () => {
  const manifest = await readManifest();

  assert.ok(manifest.main.endsWith(".cjs"));
  assert.ok(manifest.module.endsWith(".js"));

  assert.ok(manifest.exports["."].import);
  assert.ok(manifest.exports["."].require);
});

test("all public subpaths have explicit exports", async () => {
  const manifest = await readManifest();

  const expected = [
    ".",
    "./core",
    "./context",
    "./schema",
    "./metadata",
    "./react",
    "./server",
    "./sitemap",
    "./robots",
    "./urls",
    "./testing",
    "./validation",
    "./next",
    "./tanstack",
    "./react-router",
  ];

  for (const entry of expected) {
    assert.ok(manifest.exports[entry], `Missing public export: ${entry}`);
  }
});

test("all exports expose ESM, CJS and declarations", async () => {
  const manifest = await readManifest();

  for (const [name, entry] of Object.entries(manifest.exports)) {
    assert.ok(entry.import?.default, `${name}: missing ESM`);
    assert.ok(entry.require?.default, `${name}: missing CJS`);
    assert.ok(entry.import?.types, `${name}: missing ESM types`);
    assert.ok(entry.require?.types, `${name}: missing CJS types`);
  }
});

test("React supports the declared peer dependency versions", async () => {
  const manifest = await readManifest();

  assert.equal(manifest.peerDependencies.react, "^19.0.0");
});

test("published files are restricted to dist", async () => {
  const manifest = await readManifest();

  assert.deepEqual(manifest.files, ["dist"]);
});

test("build output exists for every public entrypoint", async () => {
  const manifest = await readManifest();

  for (const [name, entry] of Object.entries(manifest.exports)) {
    const esmPath = resolve(packageRoot, entry.import.default);
    const cjsPath = resolve(packageRoot, entry.require.default);

    await assert.doesNotReject(
      readFile(esmPath),
      `Missing ESM build for ${name}`,
    );

    await assert.doesNotReject(
      readFile(cjsPath),
      `Missing CJS build for ${name}`,
    );
  }
});
