import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const repositoryRoot = resolve(packageRoot, "../..");

const readManifest = async () => {
  const content = await readFile(resolve(packageRoot, "package.json"), "utf8");

  return JSON.parse(content);
};

const exists = async (path) => {
  await assert.doesNotReject(readFile(path));
};

test("package has the correct identity", async () => {
  const manifest = await readManifest();

  assert.equal(manifest.name, "@puzzle-ui/seo");
  assert.equal(manifest.type, "module");
  assert.equal(manifest.license, "MIT");
  assert.equal(manifest.private, undefined);
});

test("package contains publication metadata", async () => {
  const manifest = await readManifest();

  assert.equal(manifest.publishConfig.access, "public");

  assert.equal(manifest.publishConfig.registry, "https://registry.npmjs.org/");

  assert.equal(manifest.sideEffects, false);

  assert.ok(manifest.description && manifest.description.length > 10);
});

test("package supports ESM and CommonJS", async () => {
  const manifest = await readManifest();

  assert.ok(manifest.main.endsWith(".cjs"));
  assert.ok(manifest.module.endsWith(".js"));
  assert.ok(manifest.types.endsWith(".d.ts"));

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
    "./testing",
    "./validation",
    "./urls",
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

test("React supports the declared optional peer dependency", async () => {
  const manifest = await readManifest();

  assert.equal(manifest.peerDependencies.react, "^19.0.0");

  assert.equal(manifest.peerDependenciesMeta.react.optional, true);
});

test("package has no unnecessary runtime dependencies", async () => {
  const manifest = await readManifest();

  assert.equal(Object.keys(manifest.dependencies ?? {}).length, 0);
});

test("published files are restricted to dist", async () => {
  const manifest = await readManifest();

  assert.deepEqual(manifest.files, ["dist"]);
});

test("package documentation and license exist", async () => {
  await exists(resolve(packageRoot, "README.md"));
  await exists(resolve(repositoryRoot, "LICENSE"));
  await exists(resolve(packageRoot, "CHANGELOG.md"));
  await exists(resolve(packageRoot, "TESTING.md"));
});

test("testing utilities are exposed through the public API", async () => {
  const manifest = await readManifest();

  const testingExport = manifest.exports["./testing"];

  assert.ok(testingExport);

  const source = await readFile(
    resolve(packageRoot, "src/testing/index.ts"),
    "utf8",
  );

  for (const name of [
    "inspectSeoGraph",
    "formatSeoDiagnostics",
    "createSeoTestFixture",
    "runSeoTest",
    "assertSeoTest",
  ]) {
    assert.ok(source.includes(name), `Missing testing export: ${name}`);
  }
});

test("build output exists for every public entrypoint", async () => {
  const manifest = await readManifest();

  for (const [name, entry] of Object.entries(manifest.exports)) {
    const esmPath = resolve(packageRoot, entry.import.default);

    const cjsPath = resolve(packageRoot, entry.require.default);

    const esmTypes = resolve(packageRoot, entry.import.types);

    const cjsTypes = resolve(packageRoot, entry.require.types);

    await exists(esmPath);
    await exists(cjsPath);
    await exists(esmTypes);
    await exists(cjsTypes);

    assert.ok(
      esmPath.startsWith(resolve(packageRoot, "dist")),
      `${name}: ESM must resolve inside dist`,
    );

    assert.ok(
      cjsPath.startsWith(resolve(packageRoot, "dist")),
      `${name}: CJS must resolve inside dist`,
    );
  }
});
