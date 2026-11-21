import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readDist = (path) =>
  readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");

test("CMS public subpaths are declared and build to import and require targets", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(
    Object.keys(manifest.exports)
      .filter((entry) => entry.startsWith("./cms/"))
      .sort(),
    [
      "./cms/client",
      "./cms/next",
      "./cms/server",
      "./cms/shared",
      "./cms/tanstack",
    ],
  );
  assert.equal("." in manifest.exports, false);
  for (const [entry, conditions] of Object.entries(manifest.exports)) {
    if (!entry.startsWith("./cms/")) continue;
    for (const condition of [conditions.import, conditions.require]) {
      assert.match(condition.default, /^\.\/dist\/cms\//);
      assert.match(condition.types, /^\.\/dist\/cms\//);
      await readDist(condition.default.slice("./dist/".length));
      await readDist(condition.types.slice("./dist/".length));
    }
  }
});

test("shared and client CMS exports do not contain runtime server, storage, or secret dependencies", async () => {
  const [sharedJs, clientJs, sharedDts, clientDts] = await Promise.all([
    readDist("cms/shared/index.js"),
    readDist("cms/client/index.js"),
    readDist("cms/shared/index.d.ts"),
    readDist("cms/client/index.d.ts"),
  ]);
  const publicDeclarations = `${sharedDts}\n${clientDts}`;

  assert.doesNotMatch(sharedJs, /@puzzle-ui\/cms|cms\/server|@puzzle-ui\/storage|node:/);
  assert.doesNotMatch(clientJs, /@puzzle-ui\/cms|cms\/server|@puzzle-ui\/storage|node:/);
  assert.doesNotMatch(
    publicDeclarations,
    /CmsServiceOptions|CmsService\b|StorageAdapter|MediaObjectReference|objectKey|secretKey|providerUploadId/i,
  );
  assert.match(clientDts, /getPublishedEntry\([^)]*\): Promise<CmsPublishedEntry>/);

  const publicEntryDeclaration = sharedDts.slice(
    sharedDts.indexOf("CmsPublishedEntry"),
  );
  assert.doesNotMatch(
    publicEntryDeclaration.split("export type CmsPublishedEntryPage")[0] ?? "",
    /tenantId|publishedSnapshot|scheduledAt|secretDraft/i,
  );
});

test("framework CMS adapters import only the server dispatcher", async () => {
  const [server, next, tanstack] = await Promise.all([
    readDist("cms/server/index.js"),
    readDist("cms/next/index.js"),
    readDist("cms/tanstack/index.js"),
  ]);

  assert.match(server, /@puzzle-ui\/cms/);
  assert.doesNotMatch(next, /@puzzle-ui\/ui|react|cms\/client/);
  assert.doesNotMatch(tanstack, /@puzzle-ui\/ui|react|cms\/client/);
});

test("CMS entry additions preserve Auth and Media export paths", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const authExports = Object.keys(manifest.exports)
    .filter((entry) => entry.startsWith("./auth/"))
    .sort();
  assert.deepEqual(authExports, [
    "./auth/client",
    "./auth/next",
    "./auth/server",
    "./auth/shared",
    "./auth/tanstack",
  ]);
  const mediaExports = Object.keys(manifest.exports)
    .filter((entry) => entry.startsWith("./media/"))
    .sort();
  assert.deepEqual(mediaExports, [
    "./media/client",
    "./media/next",
    "./media/server",
    "./media/shared",
    "./media/tanstack",
  ]);
});
