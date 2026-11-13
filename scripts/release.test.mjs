import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmod, copyFile, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const bun = join(root, "node_modules/.bin/bun");

const run = (command, args, options) => {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });
  if (result.error) throw result.error;
  return result;
};

const createFixture = async (directory) => {
  await mkdir(join(directory, "scripts"));
  await mkdir(join(directory, "bin"));
  await copyFile(join(root, "scripts/release.mjs"), join(directory, "scripts/release.mjs"));
  await writeFile(join(directory, "package.json"), JSON.stringify({
    name: "release-test",
    private: true,
    workspaces: ["packages/*"],
  }));
  const originals = {};
  for (const entry of await readdir(join(root, "packages"), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const manifest = JSON.parse(await readFile(join(root, "packages", entry.name, "package.json"), "utf8"));
    const path = `packages/${entry.name}/package.json`;
    await mkdir(join(directory, "packages", entry.name), { recursive: true });
    originals[path] = JSON.stringify({
      name: manifest.name,
      version: "0.4.0",
      publishConfig: { access: "public" },
      dependencies: entry.name === "core" ? {} : { "@puzzle-ui/core": "^0.4.0" },
      scripts: { build: "unused" },
    });
    await writeFile(join(directory, path), originals[path]);
  }
  const initial = run(bun, ["install", "--lockfile-only", "--ignore-scripts"], {
    cwd: directory,
  });
  assert.equal(initial.status, 0, initial.stderr);
  originals["bun.lock"] = await readFile(join(directory, "bun.lock"), "utf8");
  await writeFile(join(directory, "originals.json"), JSON.stringify(originals));

  const commandShim = `#!${process.execPath}
import assert from "node:assert/strict";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
const command = basename(process.argv[1]);
const args = process.argv.slice(2);
appendFileSync(join(process.env.FIXTURE_ROOT, "commands.jsonl"), JSON.stringify({ command, args }) + "\\n");
if (command === "git") {
  if (args[0] === "status") process.exit(0);
  if (args[0] === "rev-parse") process.exit(1);
  assert.equal(args[0], "restore", "Unexpected Git side effect");
  const originals = JSON.parse(readFileSync("originals.json", "utf8"));
  for (const path of args.slice(2)) writeFileSync(path, originals[path]);
} else if (command === "bun" && args[0] === "install") {
  if (args.includes(process.env.FAIL_INSTALL)) process.exit(1);
  const result = spawnSync(process.env.REAL_BUN, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status === 0) {
    const lock = readFileSync("bun.lock", "utf8");
    assert.match(lock, /"version": "0.5.0"/);
    assert.doesNotMatch(lock, /0\\.4\\.0/);
  }
  process.exit(result.status ?? 1);
} else if (command === "npm") {
  assert.ok(args.includes("--dry-run"), "Never publish during a test");
} else {
  assert.equal(command, "bun");
  assert.equal(args[0], "run");
}
`;
  for (const command of ["bun", "git", "npm"]) {
    const path = join(directory, "bin", command);
    await writeFile(path, commandShim);
    await chmod(path, 0o755);
  }
  await writeFile(join(directory, "bin/package.json"), '{"type":"module"}');
  return originals;
};

for (const failure of [undefined, "--lockfile-only", "--frozen-lockfile"]) {
  test(`release ${failure ? `restores files after ${failure} failure` : "refreshes and verifies the lockfile before a dry run"}`, async () => {
    const directory = await mkdtemp(join(tmpdir(), "puzzle-release-test-"));
    try {
      const originals = await createFixture(directory);
      const result = run(process.execPath, ["scripts/release.mjs", "--dry-run"], {
        cwd: directory,
        input: "minor\n",
        env: {
          ...process.env,
          PATH: `${join(directory, "bin")}:${process.env.PATH}`,
          REAL_BUN: bun,
          FIXTURE_ROOT: directory,
          FAIL_INSTALL: failure ?? "",
        },
      });
      assert.equal(result.status, failure ? 1 : 0, result.stdout + result.stderr);
      const commands = (await readFile(join(directory, "commands.jsonl"), "utf8"))
        .trim().split("\n").map((line) => JSON.parse(line));
      const installs = commands.filter(({ command, args }) => command === "bun" && args[0] === "install");
      assert.deepEqual(installs.map(({ args }) => args), [
        ["install", "--lockfile-only"],
        ...(failure === "--lockfile-only" ? [] : [["install", "--frozen-lockfile"]]),
      ]);
      assert.equal(commands.some(({ command }) => command === "npm"), !failure);
      for (const [path, content] of Object.entries(originals)) {
        assert.equal(await readFile(join(directory, path), "utf8"), content, path);
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}
