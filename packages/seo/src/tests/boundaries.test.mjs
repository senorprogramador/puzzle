import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const sourceRoot = resolve(packageRoot, "src");

const collectFiles = async (directory) => {
  const entries = await readdir(directory, {
    withFileTypes: true,
  });

  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(path)));
    } else if (entry.name.endsWith(".ts")) {
      files.push(path);
    }
  }

  return files;
};

const readSources = async (directory) => {
  const files = await collectFiles(directory);

  return Promise.all(
    files.map(async (path) => ({
      path,
      relative: path.slice(sourceRoot.length + 1),
      content: await readFile(path, "utf8"),
    })),
  );
};

test("core does not depend on React", async () => {
  const sources = await readSources(resolve(sourceRoot, "core"));

  for (const source of sources) {
    assert.doesNotMatch(
      source.content,
      /from\s+["']react["']|from\s+["']react-dom["']/,
      source.relative,
    );
  }
});

test("schema does not depend on React", async () => {
  const sources = await readSources(resolve(sourceRoot, "schema"));

  for (const source of sources) {
    assert.doesNotMatch(
      source.content,
      /from\s+["']react["']|from\s+["']react-dom["']/,
      source.relative,
    );
  }
});

test("core does not use browser globals", async () => {
  const sources = await readSources(resolve(sourceRoot, "core"));

  for (const source of sources) {
    assert.doesNotMatch(
      source.content,
      /\b(window|document|navigator|localStorage|sessionStorage)\b/,
      source.relative,
    );
  }
});

test("server does not depend on browser-only modules", async () => {
  const sources = await readSources(resolve(sourceRoot, "server"));

  for (const source of sources) {
    assert.doesNotMatch(
      source.content,
      /from\s+["'](?:react-dom\/client|jsdom|happy-dom)["']/,
      source.relative,
    );
  }
});

test("core does not import framework-specific modules", async () => {
  const sources = await readSources(resolve(sourceRoot, "core"));

  for (const source of sources) {
    assert.doesNotMatch(
      source.content,
      /from\s+["']\.\.\/(?:react|server|context)["']/,
      source.relative,
    );
  }
});
