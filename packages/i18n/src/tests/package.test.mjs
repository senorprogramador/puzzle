import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { createI18n } from "@puzzle-ui/i18n";
import { runI18nCli } from "@puzzle-ui/i18n/cli";
import { extractTranslationKeys } from "@puzzle-ui/i18n/compiler/typescript";
import {
  createContentResolver,
  createSanityContentSource,
  SANITY_CONTENT_QUERY,
} from "@puzzle-ui/i18n/content";
import { resolveNextRequestLocale } from "@puzzle-ui/i18n/next";
import { createReactRouterLocaleLoader } from "@puzzle-ui/i18n/react-router";
import { generateLocalizedSitemap } from "@puzzle-ui/i18n/seo/sitemap";
import {
  createI18nDiagnostics,
  I18nDevTools,
} from "@puzzle-ui/i18n/devtools";
import { createFileCatalogSource } from "@puzzle-ui/i18n/sources/node";
import { createTanStackLocaleLoader } from "@puzzle-ui/i18n/tanstack";

const cwd = new URL("../../", import.meta.url);

test("the published package includes its public entrypoints and consumer instructions", () => {
  const output = execFileSync(
    "npm",
    ["pack", "--dry-run", "--ignore-scripts", "--json"],
    { cwd, encoding: "utf8" },
  );
  const [artifact] = JSON.parse(output);
  const files = new Set(artifact.files.map(({ path }) => path));

  for (const requiredFile of [
    "README.md",
    "ai/manifest.json",
    "ai/instructions.md",
    "dist/index.js",
    "dist/react/index.js",
    "dist/devtools/index.js",
    "dist/routing/index.js",
    "dist/seo/index.js",
    "dist/seo/sitemap.js",
    "dist/compiler/index.js",
    "dist/compiler/typescript.js",
    "dist/ai/index.js",
    "dist/content/index.js",
    "dist/content/sanity.js",
    "dist/sources/index.js",
    "dist/sources/node.js",
    "dist/cli/index.js",
    "dist/cli/bin.js",
    "dist/adapters/next.js",
    "dist/adapters/tanstack.js",
    "dist/adapters/react-router.js",
  ]) {
    assert.ok(files.has(requiredFile), `Package artifact is missing ${requiredFile}`);
  }

  for (const clientEntry of [
    "../../dist/react/index.js",
    "../../dist/react/index.cjs",
    "../../dist/devtools/index.js",
    "../../dist/devtools/index.cjs",
  ]) {
    const contents = readFileSync(new URL(clientEntry, import.meta.url), "utf8");
    assert.ok(
      contents.startsWith('"use client";'),
      `Client entry ${clientEntry} is missing its client directive`,
    );
  }
});

test("the built package self-resolves public APIs and the CLI binary", async () => {
  const instance = createI18n({
    locales: [{ locale: "en" }],
    defaultLocale: "en",
    catalogs: { en: { title: "Title" } },
  });

  assert.equal(instance.createTranslator("en").t("title"), "Title");
  assert.equal(typeof createFileCatalogSource, "function");
  assert.equal(typeof resolveNextRequestLocale, "function");
  assert.equal(typeof createTanStackLocaleLoader, "function");
  assert.equal(typeof createReactRouterLocaleLoader, "function");
  assert.equal(typeof generateLocalizedSitemap, "function");
  assert.equal(typeof extractTranslationKeys, "function");
  assert.equal(typeof createI18nDiagnostics, "function");
  assert.equal(typeof I18nDevTools, "function");
  assert.equal(typeof createContentResolver, "function");
  assert.equal(typeof createSanityContentSource, "function");
  assert.match(SANITY_CONTENT_QUERY, /\$slug/);
  assert.equal(await runI18nCli(["--help"], { stdout: () => undefined }), 0);

  const cliPath = fileURLToPath(new URL("../../dist/cli/bin.js", import.meta.url));
  const result = spawnSync(process.execPath, [cliPath, "--version"], {
    cwd,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /@puzzle-ui\/i18n 0\.13\.0/);
});

test("the built CLI scans source through its optional TypeScript peer", async () => {
  const directory = fileURLToPath(
    new URL("./fixtures/cli-scan/", import.meta.url),
  );
  const output = [];
  const result = await runI18nCli(
    ["scan", "src", "--catalog", "catalogs/en.json"],
    {
      cwd: directory,
      stdout: (message) => output.push(message),
      stderr: (message) => output.push(message),
    },
  );

  assert.equal(result, 0, output.join("\n"));
  assert.match(output.join("\n"), /Source scan passed/);
});
