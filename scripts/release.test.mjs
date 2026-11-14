import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmod, copyFile, mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from "node:fs/promises";
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
      scripts: { build: "unused", ...(entry.name === "core" ? { test: "unused" } : {}) },
    });
    await writeFile(join(directory, path), originals[path]);
  }
  const initial = run(bun, ["install", "--lockfile-only", "--ignore-scripts"], {
    cwd: directory,
  });
  assert.equal(initial.status, 0, initial.stderr);
  originals["bun.lock"] = await readFile(join(directory, "bun.lock"), "utf8");
  originals["packages/core/CHANGELOG.md"] = "# Changelog\n\nCore history.\n\n## Unreleased\n\n- Added a helper.\n\n## 0.4.0 - 2026-11-09\n\n- Previous changes.\n";
  await writeFile(join(directory, "packages/core/CHANGELOG.md"), originals["packages/core/CHANGELOG.md"]);
  await writeFile(join(directory, "originals.json"), JSON.stringify(originals));

  const commandShim = `#!${process.execPath}
import assert from "node:assert/strict";
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
const command = basename(process.argv[1]);
const args = process.argv.slice(2);
appendFileSync(join(process.env.FIXTURE_ROOT, "commands.jsonl"), JSON.stringify({ command, args, cwd: process.cwd() }) + "\\n");
if (command === "script") {
  const result = process.env.REAL_SCRIPT
    ? spawnSync(process.env.REAL_SCRIPT, args, { stdio: "inherit" })
    : spawnSync("npm", process.platform === "darwin" ? args.slice(3) : args[3].split(" ").slice(1), { stdio: "inherit" });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
} else if (command === "git") {
  if (process.env.REAL_GIT) {
    if (args[0] === process.env.FAIL_STEP) process.exit(1);
    const result = spawnSync(process.env.REAL_GIT, args, { stdio: "inherit" });
    if (result.error) throw result.error;
    process.exit(result.status ?? 1);
  }
  if (args[0] === "status") process.exit(0);
  if (args[0] === "rev-parse") process.exit(1);
  if (args[0] === "merge-base") process.exit(process.env.FAIL_STEP === "baseline" ? 1 : 0);
  if (args[0] === "diff") {
    console.log("M\\tpackages/core/src/index.ts");
    process.exit(0);
  }
  if (args[0] === "log") {
    console.log("abc123 Add a helper");
    process.exit(0);
  }
  if (["add", "commit", "push", "tag", "reset"].includes(args[0])) {
    assert.notEqual(process.env.DRY_RUN, "true", "Unexpected Git side effect during dry run");
    if (args[0] === process.env.FAIL_STEP) process.exit(1);
    process.exit(0);
  }
  assert.equal(args[0], "restore", "Unexpected Git command");
  const originals = JSON.parse(readFileSync("originals.json", "utf8"));
  for (const path of args.slice(args.indexOf("--") + 1)) writeFileSync(path, originals[path]);
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
  if (process.env.DRY_RUN === "true") assert.ok(args.includes("--dry-run"), "Never publish during a dry run");
  const authenticated = join(process.env.FIXTURE_ROOT, "npm-authenticated");
  if (args[0] === "whoami" && process.env.NPM_LOGIN === "true" && !existsSync(authenticated)) process.exit(1);
  if (args[0] === process.env.FAIL_STEP) process.exit(1);
  if (args[0] === "login" || (args[0] === "publish" && process.env.NPM_LOGIN === "true")) {
    if (args[0] === "login") assert.ok(args.includes("--auth-type=web"));
    process.stdout.write("Press ENTER to open ");
    await new Promise((resolve) => setTimeout(resolve, 10));
    process.stdout.write("in the browser...");
    const { createInterface } = await import("node:readline/promises");
    const prompt = createInterface({ input: process.stdin, output: process.stdout });
    const answer = await prompt.question("");
    assert.equal(answer, "");
    prompt.close();
    writeFileSync(authenticated, "authenticated");
    process.stdin.pause();
  }
} else if (command === "copilot" || (command === "bun" && args[0] === "x")) {
  if (command === "bun") {
    assert.deepEqual(args.slice(0, 5), ["x", "--silent", "--package", "@github/copilot", "copilot"]);
    if (process.env.FAIL_STEP === "copilot-runner") {
      console.error("Copilot authentication required");
      process.exit(1);
    }
  }
  assert.ok(args.includes("--no-ask-user"));
  assert.ok(args.includes("read"));
  assert.ok(args.includes("bash,view,grep,glob"));
  assert.ok(args.includes("--deny-tool"));
  const prompt = args[args.indexOf("--prompt") + 1];
  assert.match(prompt, /v0\\.4\\.0\\.\\.HEAD/);
  assert.match(prompt, /Read every changed file/);
  assert.match(prompt, /packages\\/core\\/src\\/index\\.ts/);
  if (process.env.FAIL_STEP === "copilot") process.exit(1);
  if (process.env.FAIL_STEP === "invalid-json") {
    console.log("not JSON");
    process.exit(0);
  }
  const packageLine = prompt.split("\\n").find((line) => line.startsWith("Packages: "));
  const packages = JSON.parse(packageLine.slice("Packages: ".length));
  const notes = packages.map(({ package: name }) => ({
    package: name,
    changes: name === "@puzzle-ui/core" ? ["Added a helper."] : [],
  }));
  if (process.env.FAIL_STEP === "missing-package") notes.pop();
  if (process.env.FAIL_STEP === "duplicate-package") notes.push(notes[0]);
  if (process.env.FAIL_STEP === "omitted-unreleased") notes[0].changes = [];
  if (process.env.FAIL_STEP === "multiline-note") notes[0].changes = ["Added a helper.\\n## Invalid heading"];
  console.log(JSON.stringify(notes));
} else {
  assert.equal(command, "bun");
  assert.equal(args[0], "run");
}
`;
  for (const command of ["bun", "git", "npm", "copilot", "script"]) {
    const path = join(directory, "bin", command);
    await writeFile(path, commandShim);
    await chmod(path, 0o755);
  }
  await writeFile(join(directory, "bin/package.json"), '{"type":"module"}');
  return originals;
};

for (const failure of [undefined, "copilot-runner"]) {
  test(`release without Copilot on PATH ${failure ? "reports runner failures and restores files" : "uses Bun's package runner"}`, async () => {
    const directory = await mkdtemp(join(tmpdir(), "puzzle-release-runner-test-"));
    try {
      const originals = await createFixture(directory);
      await rm(join(directory, "bin/copilot"));
      const result = run(process.execPath, ["scripts/release.mjs", "--dry-run"], {
        cwd: directory,
        input: "minor\n",
        env: {
          ...process.env,
          PATH: join(directory, "bin"),
          REAL_BUN: bun,
          FIXTURE_ROOT: directory,
          FAIL_INSTALL: "",
          FAIL_STEP: failure ?? "",
          DRY_RUN: "true",
        },
      });
      assert.equal(result.status, failure ? 1 : 0, result.stdout + result.stderr);
      const commands = (await readFile(join(directory, "commands.jsonl"), "utf8"))
        .trim().split("\n").map((line) => JSON.parse(line));
      assert.equal(commands.filter(({ command, args }) => command === "bun" && args[0] === "x").length, 1);
      assert.equal(commands.some(({ command }) => command === "copilot"), false);
      if (failure) {
        assert.match(result.stderr, /Copilot authentication required/);
        assert.match(result.stderr, /Authenticate first/);
        assert.equal(commands.some(({ command, args }) => command === "npm" && args[0] === "publish"), false);
      }
      for (const [path, content] of Object.entries(originals)) {
        assert.equal(await readFile(join(directory, path), "utf8"), content, path);
      }
      assert.equal((await readdir(join(directory, "packages/ui"))).includes("CHANGELOG.md"), false);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}

for (const failure of [undefined, "login"]) {
  test(`release automatically confirms npm browser prompts ${failure ? "and stops on login failure" : "for login and publishing"}`, async () => {
    const directory = await mkdtemp(join(tmpdir(), "puzzle-release-npm-test-"));
    try {
      await createFixture(directory);
      const result = run(process.execPath, ["scripts/release.mjs"], {
        cwd: directory,
        input: "minor\n",
        timeout: 60000,
        env: {
          ...process.env,
          PATH: `${join(directory, "bin")}:${process.env.PATH}`,
          REAL_BUN: bun,
          REAL_SCRIPT: process.platform === "darwin" || process.platform === "linux" ? "/usr/bin/script" : "",
          FIXTURE_ROOT: directory,
          FAIL_INSTALL: "",
          FAIL_STEP: failure ?? "",
          DRY_RUN: "false",
          NPM_LOGIN: "true",
        },
      });
      assert.equal(result.status, failure ? 1 : 0, result.stdout + result.stderr);
      const commands = (await readFile(join(directory, "commands.jsonl"), "utf8"))
        .trim().split("\n").map((line) => JSON.parse(line));
      assert.equal(commands.filter(({ command, args }) => command === "npm" && args[0] === "login").length, 1);
      const publishes = commands.filter(({ command, args }) => command === "npm" && args[0] === "publish");
      assert.equal(publishes.length, failure ? 0 : 14);
      for (const publish of publishes) {
        assert.ok(publish.cwd.startsWith(join(await realpath(directory), "packages") + "/"));
      }
      if (failure) {
        assert.match(result.stderr, /npm login failed/);
      } else {
        assert.equal(await readFile(join(directory, "npm-authenticated"), "utf8"), "authenticated");
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}

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
          DRY_RUN: "true",
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
      assert.equal(commands.some(({ command }) => command === "copilot"), !failure);
      assert.equal(commands.some(({ command, args }) => command === "bun" && args[0] === "x"), false);
      for (const [path, content] of Object.entries(originals)) {
        assert.equal(await readFile(join(directory, path), "utf8"), content, path);
      }
      assert.equal((await readdir(join(directory, "packages/ui"))).includes("CHANGELOG.md"), false);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}

for (const failure of [
  undefined, "baseline", "copilot", "invalid-json", "missing-package",
  "duplicate-package", "commit", "push", "publish", "tag",
  "omitted-unreleased", "multiline-note",
]) {
  test(`release ${failure ? `stops safely after ${failure} failure` : "pushes package changelogs before publishing and tags afterwards"}`, async () => {
    const directory = await mkdtemp(join(tmpdir(), "puzzle-release-test-"));
    try {
      const originals = await createFixture(directory);
      const result = run(process.execPath, ["scripts/release.mjs"], {
        cwd: directory,
        input: "minor\n",
        env: {
          ...process.env,
          PATH: `${join(directory, "bin")}:${process.env.PATH}`,
          REAL_BUN: bun,
          FIXTURE_ROOT: directory,
          FAIL_INSTALL: "",
          FAIL_STEP: failure ?? "",
          DRY_RUN: "false",
        },
      });
      assert.equal(result.status, failure ? 1 : 0, result.stdout + result.stderr);
      const commands = (await readFile(join(directory, "commands.jsonl"), "utf8"))
        .trim().split("\n").map((line) => JSON.parse(line));
      const index = (command, action) => commands.findIndex((entry) =>
        entry.command === command && (!action || entry.args[0] === action));
      const committed = [undefined, "push", "publish", "tag"].includes(failure);
      assert.equal(commands.some(({ command, args }) => command === "bun" && args[0] === "x"), false);
      if (committed) {
        const core = await readFile(join(directory, "packages/core/CHANGELOG.md"), "utf8");
        assert.match(core, /## 0\.5\.0 - \d{4}-\d{2}-\d{2}\n\n- Added a helper\./);
        assert.doesNotMatch(core, /## Unreleased/);
        assert.match(core, /## 0\.4\.0 - 2026-11-09\n\n- Previous changes\./);
        assert.match(await readFile(join(directory, "packages/ui/CHANGELOG.md"), "utf8"),
          /- No changes; version bumped in lockstep\./);
        assert.equal(index("git", "restore"), -1);
        assert.ok(index("copilot") > commands.findLastIndex(({ command }) => command === "bun"));
        assert.ok(commands.some(({ command, args }) => command === "bun" && args[1] === "test"));
        assert.ok(index("copilot") < index("git", "commit"));
        assert.ok(index("git", "commit") < index("git", "push"));
        assert.deepEqual(commands[index("git", "add")].args, ["add", "--all"]);
        assert.ok(commands[index("git", "commit")].args.some((arg) => arg.includes("Co-authored-by: Copilot")));
      } else {
        for (const [path, content] of Object.entries(originals)) {
          assert.equal(await readFile(join(directory, path), "utf8"), content, path);
        }
        assert.equal((await readdir(join(directory, "packages/ui"))).includes("CHANGELOG.md"), false);
      }
      if (!failure || ["publish", "tag"].includes(failure)) {
        assert.ok(index("git", "push") < index("npm", "publish"));
      } else {
        assert.equal(index("npm", "publish"), -1);
      }
      if (!failure || failure === "tag") {
        const publishes = commands.filter(({ command, args }) => command === "npm" && args[0] === "publish");
        assert.equal(publishes.length, Object.keys(originals).filter((path) => path.endsWith("package.json")).length);
        assert.ok(index("git", "tag") > commands.findLastIndex(({ command }) => command === "npm"));
      } else {
        assert.equal(index("git", "tag"), -1);
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}

for (const failure of [undefined, "commit", "push"]) {
  test(`release with real git ${failure ? `preserves a safe worktree after ${failure} failure` : "pushes the release commit and tag"}`, async () => {
    const directory = await mkdtemp(join(tmpdir(), "puzzle-release-git-test-"));
    try {
      const originals = await createFixture(directory);
      const git = run("git", ["--exec-path"]).stdout.trim() + "/git";
      const gitRun = (...args) => {
        const result = run(git, args, { cwd: directory });
        assert.equal(result.status, 0, result.stdout + result.stderr);
        return result.stdout.trim();
      };
      gitRun("init");
      gitRun("config", "user.name", "Release Test");
      gitRun("config", "user.email", "release-test@example.invalid");
      gitRun("config", "commit.gpgsign", "false");
      gitRun("config", "tag.gpgsign", "false");
      gitRun("config", "core.hooksPath", "/dev/null");
      await writeFile(join(directory, ".gitignore"), "bin/\nnode_modules/\noriginals.json\ncommands.jsonl\nremote.git/\n");
      await mkdir(join(directory, "packages/core/src"));
      await writeFile(join(directory, "packages/core/src/index.ts"), "export const helper = true;\n");
      gitRun("add", "--all");
      gitRun("commit", "-m", "Initial fixture");
      gitRun("tag", "v0.4.0");
      await writeFile(join(directory, "packages/core/src/index.ts"), "export const helper = false;\n");
      gitRun("add", "--all");
      gitRun("commit", "-m", "Change helper");
      const initialHead = gitRun("rev-parse", "HEAD");
      gitRun("init", "--bare", "remote.git");
      gitRun("remote", "add", "origin", join(directory, "remote.git"));
      gitRun("push", "-u", "origin", "HEAD");
      const result = run(process.execPath, ["scripts/release.mjs"], {
        cwd: directory,
        input: "minor\n",
        env: {
          ...process.env,
          PATH: `${join(directory, "bin")}:${process.env.PATH}`,
          REAL_BUN: bun,
          REAL_GIT: git,
          FIXTURE_ROOT: directory,
          FAIL_INSTALL: "",
          FAIL_STEP: failure ?? "",
          DRY_RUN: "false",
        },
      });
      assert.equal(result.status, failure ? 1 : 0, result.stdout + result.stderr);
      assert.equal(gitRun("status", "--porcelain"), "");
      if (failure === "commit") {
        assert.equal(gitRun("rev-parse", "HEAD"), initialHead);
        for (const [path, content] of Object.entries(originals)) {
          assert.equal(await readFile(join(directory, path), "utf8"), content, path);
        }
      } else {
        assert.notEqual(gitRun("rev-parse", "HEAD"), initialHead);
        assert.match(gitRun("show", "HEAD:packages/ui/CHANGELOG.md"), /No changes; version bumped in lockstep/);
        if (!failure) {
          assert.equal(gitRun("rev-parse", "HEAD"), gitRun("--git-dir=remote.git", "rev-parse", "v0.5.0^{}"));
        }
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}
