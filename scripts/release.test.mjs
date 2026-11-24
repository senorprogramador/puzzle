import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmod, copyFile, mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { waitForNpmAvailability } from "./release.mjs";

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
  await mkdir(join(directory, "docs/ai/integration"), { recursive: true });
  await mkdir(join(directory, "apps/site/content/docs"), { recursive: true });
  await copyFile(join(root, "scripts/release.mjs"), join(directory, "scripts/release.mjs"));
  await writeFile(join(directory, "package.json"), JSON.stringify({
    name: "release-test",
    private: true,
    workspaces: ["packages/*"],
  }));
  const originals = {};
  originals["README.md"] = "# Release test\n";
  await writeFile(join(directory, "README.md"), originals["README.md"]);
  originals["apps/site/content/docs/getting-started.mdx"] = "# Getting started\n\nUse the released helper.\n";
  await writeFile(
    join(directory, "apps/site/content/docs/getting-started.mdx"),
    originals["apps/site/content/docs/getting-started.mdx"],
  );
  originals["docs/ai/integration/registry.json"] = JSON.stringify({
    schemaVersion: 1,
    packages: [],
  });
  await writeFile(
    join(directory, "docs/ai/integration/registry.json"),
    originals["docs/ai/integration/registry.json"],
  );
  for (const entry of await readdir(join(root, "packages"), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const manifest = JSON.parse(await readFile(join(root, "packages", entry.name, "package.json"), "utf8"));
    const path = `packages/${entry.name}/package.json`;
    await mkdir(join(directory, "packages", entry.name), { recursive: true });
    originals[path] = JSON.stringify({
      name: manifest.name,
      private: manifest.private,
      version: manifest.private ? "0.5.0" : "0.4.0",
      publishConfig: { access: "public" },
      dependencies: entry.name === "core" || manifest.private ? {} : { "@puzzle-ui/core": "^0.4.0" },
      scripts: { build: "unused", ...(entry.name === "core" ? { test: "unused" } : {}) },
    });
    await writeFile(join(directory, path), originals[path]);
    if (entry.name === "core") {
      await mkdir(join(directory, "packages/core/ai"));
      originals["packages/core/ai/instructions.md"] = "# Core consumer guidance\n";
      await writeFile(
        join(directory, "packages/core/ai/instructions.md"),
        originals["packages/core/ai/instructions.md"],
      );
    }
  }
  const initial = run(bun, ["install", "--lockfile-only", "--ignore-scripts"], {
    cwd: directory,
  });
  assert.equal(initial.status, 0, initial.stderr);
  originals["bun.lock"] = await readFile(join(directory, "bun.lock"), "utf8");
  originals["packages/core/CHANGELOG.md"] = "# Changelog\n\nCore history.\n\n## Pending\n\n- Added a helper.\n\n## 0.4.0 - 2026-11-09\n\n- Previous changes.\n";
  await writeFile(join(directory, "packages/core/CHANGELOG.md"), originals["packages/core/CHANGELOG.md"]);
  originals["CHANGELOG.md"] = "# Changelog\n\nRoot history.\n\n## [Pending]\n\n### Added\n\n- A monorepo change.\n\n## 0.4.0 - 2026-11-09\n\n- Previous root changes.\n";
  await writeFile(join(directory, "CHANGELOG.md"), originals["CHANGELOG.md"]);
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
} else if (command === "bun" && args[0] === "packages/create/src/ai/check.ts") {
  if (process.env.FAIL_STEP === "ai-check") process.exit(1);
} else if (command === "npm") {
  if (process.env.DRY_RUN === "true") assert.ok(args.includes("--dry-run"), "Never publish during a dry run");
  const authenticated = join(process.env.FIXTURE_ROOT, "npm-authenticated");
  if (args[0] === "view") {
    if (process.env.FAIL_STEP === "poll-timeout") {
      console.error("npm error code E404");
      process.exit(1);
    }
    if (process.env.FAIL_STEP === "poll-error") {
      console.error("npm error ECONNRESET");
      process.exit(1);
    }
    const version = args[1].slice(args[1].lastIndexOf("@") + 1);
    console.log(JSON.stringify(version));
    process.exit(0);
  }
  if (args[0] === "whoami" && process.env.NPM_LOGIN === "true" && !existsSync(authenticated)) process.exit(1);
  if (args[0] === "publish" && process.env.FAIL_STEP === "partial-publish") {
    const publishedMarker = join(process.env.FIXTURE_ROOT, "one-package-published");
    if (existsSync(publishedMarker)) process.exit(1);
    writeFileSync(publishedMarker, "published");
  }
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
  const copilotAuthenticated = join(process.env.FIXTURE_ROOT, "copilot-authenticated");
  if (args.includes("login")) {
    if (process.env.FAIL_STEP === "copilot-login") process.exit(1);
    writeFileSync(copilotAuthenticated, "authenticated");
    process.exit(0);
  }
  if (process.env.COPILOT_LOGIN === "true" &&
      (!existsSync(copilotAuthenticated) || process.env.FAIL_STEP === "copilot-auth-retry")) {
    console.error("Error: No authentication information found.");
    process.exit(1);
  }
  assert.ok(args.includes("--no-ask-user"));
  assert.ok(args.includes("read"));
  assert.ok(args.includes("bash,view,grep,glob"));
  assert.ok(args.includes("--deny-tool"));
  const prompt = args[args.indexOf("--prompt") + 1];
  if (process.env.FAIL_STEP === "copilot") process.exit(1);
  if (prompt.includes("Audit public documentation")) {
    assert.match(prompt, /v0\\.4\\.0\\.\\.HEAD/);
    assert.match(prompt, /apps\\/site\\/content\\/docs\\/getting-started\\.mdx/);
    assert.match(prompt, /packages\\/core\\/ai\\/instructions\\.md/);
    if (process.env.FAIL_STEP === "docs-audit") process.exit(1);
    if (process.env.FAIL_STEP === "docs-invalid-json") {
      console.log("not JSON");
      process.exit(0);
    }
    const edits = [
      {
        path: "apps/site/content/docs/getting-started.mdx",
        content: "# Getting started\\n\\nUse the released helper safely.\\n",
        reason: "The updated wording matches the release implementation.",
        evidence: ["packages/core/src/index.ts: exports helper"],
      },
      {
        path: "packages/core/ai/instructions.md",
        content: "# Core consumer guidance\\n\\nUse the released helper safely.\\n",
        reason: "The updated instructions match the release implementation.",
        evidence: ["packages/core/src/index.ts: exports helper"],
      },
    ];
    if (process.env.FAIL_STEP === "docs-out-of-scope") {
      edits[0].path = "packages/core/package.json";
    }
    const response = {
      edits: process.env.ALL_DOCS_VALID === "true" ? [] : edits,
    };
    const prefix = process.env.COPILOT_DOCS_LARGE === "true"
      ? "x".repeat(1024 * 1024 + 1)
      : "";
    console.log(prefix + (process.env.COPILOT_DOCS_PROSE === "true"
      ? "Audit complete:\\n" + JSON.stringify(response)
      : JSON.stringify(response)));
  } else {
    assert.match(prompt, /v0\\.4\\.0\\.\\.HEAD/);
    assert.match(prompt, /Read every changed file/);
    assert.match(prompt, /packages\\/core\\/src\\/index\\.ts/);
    if (process.env.FAIL_STEP === "invalid-json") {
      console.log("not JSON");
      process.exit(0);
    }
    const packageLine = prompt.split("\\n").find((line) => line.startsWith("Packages: "));
    const packages = JSON.parse(packageLine.slice("Packages: ".length));
    const notes = packages.map(({ package: name }) => ({
      package: name,
      changes: process.env.ALL_EMPTY === "true" ? [] :
        name === "@puzzle-ui/core" ? ["Added a helper."] :
        name === "@puzzle-ui/theme" ? ["Updated the theme."] : [],
    }));
    if (process.env.FAIL_STEP === "missing-package") notes.pop();
    if (process.env.FAIL_STEP === "duplicate-package") notes.push(notes[0]);
    if (process.env.FAIL_STEP === "omitted-pending") notes[0].changes = [];
    if (process.env.FAIL_STEP === "multiline-note") notes[0].changes = ["Added a helper.\\n## Invalid heading"];
    console.log(JSON.stringify(notes));
  }
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

test("npm availability polling retries 404s until every package reports the release version", async () => {
  let time = 0;
  const attempts = new Map();
  const sleeps = [];

  await waitForNpmAvailability([
    { name: "@puzzle-ui/core" },
    { name: "@puzzle-ui/theme" },
  ], "0.5.0", {
    query: (name, version) => {
      const count = (attempts.get(name) ?? 0) + 1;
      attempts.set(name, count);
      if (name === "@puzzle-ui/core" && count === 1) {
        return { ok: false, stderr: "npm error code E404" };
      }
      return { ok: true, stdout: JSON.stringify(version) };
    },
    sleep: async (milliseconds) => {
      sleeps.push(milliseconds);
      time += milliseconds;
    },
    now: () => time,
    intervalMs: 10,
    timeoutMs: 100,
  });

  assert.equal(attempts.get("@puzzle-ui/core"), 2);
  assert.equal(attempts.get("@puzzle-ui/theme"), 1);
  assert.deepEqual(sleeps, [10]);
});

test("npm availability polling stops at its deadline and surfaces non-404 errors", async () => {
  let time = 0;
  await assert.rejects(waitForNpmAvailability([{ name: "@puzzle-ui/core" }], "0.5.0", {
    query: () => ({ ok: false, stderr: "npm error code E404" }),
    sleep: async (milliseconds) => { time += milliseconds; },
    now: () => time,
    intervalMs: 10,
    timeoutMs: 15,
  }), /Timed out waiting for npm to expose 0\.5\.0/);

  await assert.rejects(waitForNpmAvailability([{ name: "@puzzle-ui/core" }], "0.5.0", {
    query: () => ({ ok: false, stderr: "npm error ECONNRESET" }),
    sleep: async () => assert.fail("Network errors must not be retried as propagation delays"),
    now: () => 0,
    intervalMs: 10,
    timeoutMs: 100,
  }), /Could not check npm availability/);
});

test("root changelog includes changed package release entries only", async () => {
  const rootChangelog = await readFile(join(root, "CHANGELOG.md"), "utf8");
  const rootHeadings = [...rootChangelog.matchAll(/^## (\d+\.\d+\.\d+) - (\d{4}-\d{2}-\d{2})$/gm)];
  for (const entry of await readdir(join(root, "packages"), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = join(root, "packages", entry.name);
    const { name, private: isPrivate } = JSON.parse(await readFile(join(dir, "package.json"), "utf8"));
    if (isPrivate) continue;
    const content = await readFile(join(dir, "CHANGELOG.md"), "utf8");
    const headings = [...content.matchAll(/^## (\d+\.\d+\.\d+) - (\d{4}-\d{2}-\d{2})$/gm)];
    for (const [index, heading] of headings.entries()) {
      const releaseIndex = rootHeadings.findIndex((rootHeading) =>
        rootHeading[1] === heading[1] && rootHeading[2] === heading[2]);
      assert.notEqual(releaseIndex, -1, `${name}@${heading[1]} missing from root changelog`);
      const release = rootChangelog.slice(rootHeadings[releaseIndex].index, rootHeadings[releaseIndex + 1]?.index);
      const sections = [...release.matchAll(/^### `([^`]+)`$/gm)];
      const sectionIndex = sections.findIndex((section) => section[1] === name);
      const expected = content.slice(heading.index + heading[0].length, headings[index + 1]?.index).trim().replace(/^### /gm, "#### ");
      if (expected === "- No changes; version bumped in lockstep.") {
        assert.equal(sectionIndex, -1, `${name}@${heading[1]} should be omitted`);
        continue;
      }
      assert.notEqual(sectionIndex, -1, `${name}@${heading[1]} missing package section`);
      const actual = release.slice(sections[sectionIndex].index + sections[sectionIndex][0].length, sections[sectionIndex + 1]?.index).trim();
      assert.equal(actual, expected, `${name}@${heading[1]} differs from its package changelog`);
    }
  }
});

test("release retains a root version heading when no packages have changes", async () => {
  const directory = await mkdtemp(join(tmpdir(), "puzzle-release-empty-test-"));
  try {
    await createFixture(directory);
    await writeFile(join(directory, "packages/core/CHANGELOG.md"), "# Changelog\n\n## 0.4.0 - 2026-11-09\n\n- Previous changes.\n");
    const result = run(process.execPath, ["scripts/release.mjs"], {
      cwd: directory,
      input: "minor\n",
      env: {
        ...process.env,
        PATH: `${join(directory, "bin")}:${process.env.PATH}`,
        REAL_BUN: bun,
        FIXTURE_ROOT: directory,
        FAIL_INSTALL: "",
        FAIL_STEP: "",
        DRY_RUN: "false",
        ALL_EMPTY: "true",
      },
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const commands = (await readFile(join(directory, "commands.jsonl"), "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    const published = commands.filter(({ command, args }) => command === "npm" && args[0] === "publish");
    for (const name of ["workspace", "workspace-ui"]) {
      assert.equal(published.some(({ cwd }) => basename(cwd) === name), false);
    }
    const order = new Map();
    const manifests = [];
    for (const [index, { cwd }] of published.entries()) {
      const name = basename(cwd);
      const manifest = JSON.parse(await readFile(join(root, "packages", name, "package.json"), "utf8"));
      order.set(manifest.name, index);
      manifests.push(manifest);
    }
    assert.ok(order.has("@puzzle-ui/media"));
    assert.ok(order.has("@puzzle-ui/cms"));
    for (const manifest of manifests) {
      for (const dependency of Object.keys({
        ...manifest.dependencies,
        ...manifest.optionalDependencies,
        ...manifest.peerDependencies,
      })) {
        if (order.has(dependency)) {
          assert.ok(order.get(dependency) < order.get(manifest.name),
            `${dependency} must be published before ${manifest.name}`);
        }
      }
    }
    const rootChangelog = await readFile(join(directory, "CHANGELOG.md"), "utf8");
    assert.match(rootChangelog, /## 0\.5\.0 - \d{4}-\d{2}-\d{2}\n\n## 0\.4\.0/);
    assert.doesNotMatch(rootChangelog, /### `@puzzle-ui\//);
    assert.match(await readFile(join(directory, "packages/core/CHANGELOG.md"), "utf8"),
      /## 0\.5\.0 - \d{4}-\d{2}-\d{2}\n\n- No changes; version bumped in lockstep\./);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

for (const dryRun of [false, true]) {
  test(`release ${dryRun ? "removes a newly created root changelog after a dry run" : "creates a missing root changelog"}`, async () => {
    const directory = await mkdtemp(join(tmpdir(), "puzzle-release-root-test-"));
    try {
      await createFixture(directory);
      await rm(join(directory, "CHANGELOG.md"));
      const result = run(process.execPath, ["scripts/release.mjs", ...(dryRun ? ["--dry-run"] : [])], {
        cwd: directory,
        input: "minor\n",
        env: {
          ...process.env,
          PATH: `${join(directory, "bin")}:${process.env.PATH}`,
          REAL_BUN: bun,
          FIXTURE_ROOT: directory,
          FAIL_INSTALL: "",
          DRY_RUN: String(dryRun),
        },
      });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      if (dryRun) {
        assert.equal((await readdir(directory)).includes("CHANGELOG.md"), false);
      } else {
        assert.match(await readFile(join(directory, "CHANGELOG.md"), "utf8"), /### `@puzzle-ui\/core`\n\n- Added a helper\./);
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}

test("release captures large prose-wrapped Copilot audit responses", async () => {
  const directory = await mkdtemp(join(tmpdir(), "puzzle-release-docs-prose-test-"));
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
        FAIL_INSTALL: "",
        DRY_RUN: "true",
        COPILOT_DOCS_PROSE: "true",
        COPILOT_DOCS_LARGE: "true",
      },
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    for (const [path, content] of Object.entries(originals)) {
      assert.equal(await readFile(join(directory, path), "utf8"), content, path);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

for (const missing of [false, true]) {
  for (const failure of [undefined, "copilot-login", "copilot-auth-retry"]) {
    test(`release logs into Copilot ${missing ? "through Bun" : "on PATH"}${failure ? ` and stops after ${failure}` : " and retries changelog generation"}`, async () => {
      const directory = await mkdtemp(join(tmpdir(), "puzzle-release-auth-test-"));
      try {
        const originals = await createFixture(directory);
        if (missing) await rm(join(directory, "bin/copilot"));
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
            COPILOT_LOGIN: "true",
          },
        });
        assert.equal(result.status, failure ? 1 : 0, result.stdout + result.stderr);
        const commands = (await readFile(join(directory, "commands.jsonl"), "utf8"))
          .trim().split("\n").map((line) => JSON.parse(line));
        const copilotCommands = commands.filter(({ command, args }) =>
          command === "copilot" || (command === "bun" && args[0] === "x"));
        assert.equal(copilotCommands.filter(({ args }) => args.includes("login")).length, 1);
        assert.equal(copilotCommands.filter(({ args }) => args.includes("--prompt")).length,
          failure === "copilot-login" ? 1 : failure === "copilot-auth-retry" ? 2 : 3);
        assert.equal(commands.some(({ command, args }) => command === "npm" && args[0] === "publish"), !failure);
        for (const [path, content] of Object.entries(originals)) {
          assert.equal(await readFile(join(directory, path), "utf8"), content, path);
        }
        assert.equal((await readdir(join(directory, "packages/ui"))).includes("CHANGELOG.md"), false);
        if (failure === "copilot-login") assert.match(result.stderr, /Copilot login failed/);
        if (failure === "copilot-auth-retry") assert.match(result.stderr, /No authentication information found/);
      } finally {
        await rm(directory, { recursive: true, force: true });
      }
    });
  }
}

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
      assert.equal(commands.filter(({ command, args }) => command === "bun" && args[0] === "x").length,
        failure ? 1 : 2);
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
      const originals = JSON.parse(
        await readFile(join(directory, "originals.json"), "utf8"),
      );
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
      const releasePackageCount = Object.keys(originals)
        .filter((path) => path.endsWith("package.json"))
        .filter((path) => JSON.parse(originals[path]).private !== true)
        .length;
      assert.equal(publishes.length, failure ? 0 : releasePackageCount);
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
  undefined, "baseline", "ai-check", "copilot", "invalid-json", "missing-package",
  "duplicate-package", "docs-audit", "docs-invalid-json", "docs-out-of-scope",
  "commit", "push", "publish", "partial-publish", "tag",
  "omitted-pending", "multiline-note", "duplicate-root",
]) {
  test(`release ${failure ? `stops safely after ${failure} failure` : "publishes and polls before committing and tagging"}`, async () => {
    const directory = await mkdtemp(join(tmpdir(), "puzzle-release-test-"));
    try {
      const originals = await createFixture(directory);
      if (failure === "duplicate-root") {
        originals["CHANGELOG.md"] += "\n## [0.5.0] - 2026-11-10\n\n- Existing release.\n";
        await writeFile(join(directory, "CHANGELOG.md"), originals["CHANGELOG.md"]);
        await writeFile(join(directory, "originals.json"), JSON.stringify(originals));
      }
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
      const preserved = [undefined, "commit", "push", "partial-publish", "tag"].includes(failure);
      const committed = [undefined, "push", "tag"].includes(failure);
      assert.equal(commands.some(({ command, args }) => command === "bun" && args[0] === "x"), false);
      if (preserved) {
        const core = await readFile(join(directory, "packages/core/CHANGELOG.md"), "utf8");
        assert.match(core, /## 0\.5\.0 - \d{4}-\d{2}-\d{2}\n\n- Added a helper\./);
        assert.doesNotMatch(core, /## Pending/);
        assert.match(core, /## 0\.4\.0 - 2026-11-09\n\n- Previous changes\./);
        assert.match(await readFile(join(directory, "packages/ui/CHANGELOG.md"), "utf8"),
          /- No changes; version bumped in lockstep\./);
        const rootChangelog = await readFile(join(directory, "CHANGELOG.md"), "utf8");
        assert.match(rootChangelog, /## \[Pending\]\n\n### Added\n\n- A monorepo change\.\n\n## 0\.5\.0 - \d{4}-\d{2}-\d{2}/);
        assert.match(rootChangelog, /### `@puzzle-ui\/core`\n\n- Added a helper\./);
        assert.match(rootChangelog, /### `@puzzle-ui\/theme`\n\n- Updated the theme\./);
        assert.doesNotMatch(rootChangelog, /### `@puzzle-ui\/ui`/);
        assert.doesNotMatch(rootChangelog, /No changes; version bumped in lockstep\./);
        assert.match(rootChangelog, /## 0\.4\.0 - 2026-11-09\n\n- Previous root changes\./);
        assert.equal(await readFile(join(directory, "apps/site/content/docs/getting-started.mdx"), "utf8"),
          "# Getting started\n\nUse the released helper safely.\n");
        assert.equal(await readFile(join(directory, "packages/core/ai/instructions.md"), "utf8"),
          "# Core consumer guidance\n\nUse the released helper safely.\n");
        assert.ok(commands.some(({ command, args }) => command === "bun" && args[1] === "test"));
        if (failure === "partial-publish") {
          const publishes = commands.filter(({ command, args }) => command === "npm" && args[0] === "publish");
          assert.equal(publishes.length, 2);
          assert.equal(basename(publishes[0].cwd), "core");
          assert.equal(commands.some(({ command, args }) => command === "npm" && args[0] === "view"), false);
          assert.equal(index("git", "add"), -1);
          assert.match(result.stderr, /Published: @puzzle-ui\/core/);
        } else {
          const publishIndexes = commands.flatMap((entry, commandIndex) =>
            entry.command === "npm" && entry.args[0] === "publish" ? [commandIndex] : []);
          const lastPublishIndex = Math.max(...publishIndexes);
          const lastViewIndex = commands.findLastIndex(({ command, args }) =>
            command === "npm" && args[0] === "view");
          assert.ok(index("copilot") < index("npm", "publish"));
          assert.ok(lastPublishIndex < lastViewIndex);
          assert.ok(lastViewIndex < index("git", "add"));
          assert.ok(index("git", "add") < index("git", "commit"));
        }
        if (committed) {
          assert.ok(index("git", "commit") < index("git", "push"));
          assert.deepEqual(commands[index("git", "add")].args, ["add", "--all"]);
          assert.ok(commands[index("git", "commit")].args.some((arg) => arg.includes("Co-authored-by: Copilot")));
        }
      } else {
        for (const [path, content] of Object.entries(originals)) {
          assert.equal(await readFile(join(directory, path), "utf8"), content, path);
        }
        assert.equal((await readdir(join(directory, "packages/ui"))).includes("CHANGELOG.md"), false);
        if (failure === "duplicate-root") assert.match(result.stderr, /Root changelog already has an entry/);
      }
      if (committed) {
        assert.ok(index("npm", "publish") < index("git", "push"));
      } else if (preserved) {
        assert.equal(index("git", "push"), -1);
      } else {
        assert.equal(index("git", "commit"), -1);
      }
      if (!failure || failure === "tag") {
        assert.ok(index("git", "tag") > commands.findLastIndex(({ command, args }) =>
          command === "npm" && args[0] === "view"));
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
      if (failure === "commit") {
        assert.equal(gitRun("rev-parse", "HEAD"), initialHead);
        assert.notEqual(gitRun("status", "--porcelain"), "");
        assert.equal(JSON.parse(await readFile(join(directory, "packages/core/package.json"), "utf8")).version, "0.5.0");
        assert.match(await readFile(join(directory, "apps/site/content/docs/getting-started.mdx"), "utf8"),
          /released helper safely/);
        assert.match(result.stderr, /Published:/);
      } else {
        assert.equal(gitRun("status", "--porcelain"), "");
        assert.notEqual(gitRun("rev-parse", "HEAD"), initialHead);
        assert.match(gitRun("show", "HEAD:packages/ui/CHANGELOG.md"), /No changes; version bumped in lockstep/);
        assert.match(gitRun("show", "HEAD:CHANGELOG.md"), /### `@puzzle-ui\/core`\n\n- Added a helper\./);
        assert.match(gitRun("show", "HEAD:apps/site/content/docs/getting-started.mdx"),
          /released helper safely/);
        assert.match(gitRun("show", "HEAD:packages/core/ai/instructions.md"),
          /released helper safely/);
        if (!failure) {
          assert.equal(gitRun("rev-parse", "HEAD"), gitRun("--git-dir=remote.git", "rev-parse", "v0.5.0^{}"));
        } else {
          assert.notEqual(run(git, ["show-ref", "--verify", "--quiet", "refs/tags/v0.5.0"], { cwd: directory }).status, 0);
        }
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}
