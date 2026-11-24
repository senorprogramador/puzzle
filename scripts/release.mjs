#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

const releaseOrder = [
  "core",
  "commerce",
  "theme",
  "hooks",
  "icons",
  "storage",
  "media",
  "media-cloudflare",
  "cms",
  "ui",
  "pieces",
  "create",
  "session",
  "storage-d1",
  "storage-mongodb",
  "auth",
  "fullstack",
  "payment-providers",
  "seo",
  "i18n",
];

const packages = releaseOrder.map((name) => {
  const dir = join(root, "packages", name);

  return {
    name,
    dir,
    manifestPath: join(dir, "package.json"),
  };
});

const dependencyFields = [
  "dependencies",
  "peerDependencies",
  "optionalDependencies",
  "devDependencies",
];

const releaseTypes = ["major", "minor", "patch"];
const lockfile = join(root, "bun.lock");
const npmPollIntervalMs = 10_000;
const npmPollTimeoutMs = 15 * 60 * 1000;
const maxCopilotOutputBytes = 64 * 1024 * 1024;

class ReleaseError extends Error {}

const log = (message) => {
  console.log(`\n\x1b[1m> ${message}\x1b[0m`);
};

const fail = (message) => {
  throw new ReleaseError(message);
};

const run = (command, args, {
  cwd = root,
  capture = false,
  allowMissing = false,
  allowTimeout = false,
  timeout,
  maxBuffer,
} = {}) => {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: capture ? ["inherit", "pipe", "pipe"] : "inherit",
    ...(timeout === undefined ? {} : { timeout }),
    ...(maxBuffer === undefined ? {} : { maxBuffer }),
  });

  if (result.error) {
    if (allowMissing && result.error.code === "ENOENT") {
      return { ok: false, missing: true, stdout: "", stderr: result.error.message };
    }
    if (allowTimeout && result.error.code === "ETIMEDOUT") {
      return { ok: false, timedOut: true, stdout: "", stderr: result.error.message };
    }
    fail(`Could not run "${command}": ${result.error.message}`);
  }

  return {
    ok: result.status === 0,
    stdout: result.stdout?.trim() ?? "",
    stderr: result.stderr?.trim() ?? "",
  };
};

const runOrFail = (description, command, args, options) => {
  if (!run(command, args, options).ok) {
    fail(`${description} failed: ${command} ${args.join(" ")}`);
  }
};

const runCopilot = (args, { capture = false } = {}) => {
  const options = { capture, allowMissing: true, maxBuffer: maxCopilotOutputBytes };
  const result = run("copilot", args, options);
  if (!result.missing) {
    return result;
  }
  log("Copilot CLI is not on PATH; running @github/copilot through Bun's package cache");
  return run("bun", [
    "x", "--silent", "--package", "@github/copilot", "copilot", ...args,
  ], options);
};

const collectMarkdownFiles = (directory) => {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return collectMarkdownFiles(path);
    }
    return entry.isFile() && /\.mdx?$/.test(entry.name) ? [path] : [];
  });
};

const getPublicDocumentationPaths = (manifests) => {
  const paths = [
    join(root, "README.md"),
    ...manifests.flatMap(({ dir }) => [
      join(dir, "README.md"),
      ...collectMarkdownFiles(join(dir, "ai")),
    ]),
    ...collectMarkdownFiles(join(root, "apps/site/content/docs")),
  ];

  return [...new Set(paths)]
    .filter(existsSync)
    .map((path) => relative(root, path))
    .sort();
};

const readManifest = (path) => JSON.parse(readFileSync(path, "utf8"));

const writeManifest = (path, manifest) => {
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
};

const bumpVersion = (version, type) => {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);

  if (!match) {
    fail(`Unsupported version "${version}". Expected MAJOR.MINOR.PATCH.`);
  }

  const [major, minor, patch] = match.slice(1).map(Number);

  if (type === "major") {
    return `${major + 1}.0.0`;
  }

  if (type === "minor") {
    return `${major}.${minor + 1}.0`;
  }

  return `${major}.${minor}.${patch + 1}`;
};

const validateReleasePackageCoverage = () => {
  const packageRoot = join(root, "packages");
  const directories = readdirSync(packageRoot, {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .filter(({ name }) => {
      const manifestPath = join(packageRoot, name, "package.json");
      return !existsSync(manifestPath) || readManifest(manifestPath).private !== true;
    })
    .map((entry) => entry.name);

  const omitted = directories.filter((name) => !releaseOrder.includes(name));

  const missing = releaseOrder.filter((name) => !directories.includes(name));

  if (omitted.length > 0) {
    fail(`Packages missing from the release order: ${omitted.join(", ")}.`);
  }

  if (missing.length > 0) {
    fail(`Release order contains missing packages: ${missing.join(", ")}.`);
  }
};

const askReleaseType = async () => {
  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    for (;;) {
      const answer = (
        await prompt.question("Release type (major, minor, patch): ")
      )
        .trim()
        .toLowerCase();

      if (releaseTypes.includes(answer)) {
        return answer;
      }

      console.log(`Please answer one of: ${releaseTypes.join(", ")}.`);
    }
  } finally {
    prompt.close();
  }
};

const runNpmWithBrowserPrompt = (args, cwd = root) => new Promise((resolve, reject) => {
  const command = `npm ${args.join(" ")}`;
  const terminalArgs = process.platform === "darwin"
    ? ["-q", "/dev/null", "npm", ...args]
    : process.platform === "linux"
      ? ["-q", "-e", "-c", command, "/dev/null"]
      : null;

  if (!terminalArgs) {
    reject(new ReleaseError("Automatic npm browser confirmation requires macOS or Linux."));
    return;
  }

  // macOS script requires a pipe or terminal, not Node's stdin socket.
  const child = spawn("bash", ["-c", 'script "$@" < <(cat)', "bash", ...terminalArgs], {
    cwd,
    stdio: ["pipe", "pipe", "inherit"],
  });
  let output = "";
  let inputError;
  const wasPaused = process.stdin.isPaused();
  process.stdin.pipe(child.stdin, { end: false });
  child.stdin.on("error", (error) => {
    // npm may exit while terminal input is still being forwarded.
    if (error.code !== "EPIPE") {
      inputError = error;
    }
  });
  child.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
    output += chunk.toString();
    const prompt = /Press ENTER to open in the browser[^\r\n]*/i.exec(output);
    if (prompt) {
      child.stdin.write("\n");
      output = output.slice(prompt.index + prompt[0].length);
    }
    output = output.slice(-1024);
  });
  const cleanup = () => {
    process.stdin.unpipe(child.stdin);
    if (wasPaused) {
      process.stdin.pause();
    }
  };
  child.on("error", (error) => {
    cleanup();
    reject(new ReleaseError(`Could not run npm in a terminal: ${error.message}`));
  });
  child.on("close", (code) => {
    cleanup();
    if (inputError) {
      reject(new ReleaseError(`Could not forward npm terminal input: ${inputError.message}`));
    } else {
      resolve({ ok: code === 0 });
    }
  });
});

const ensureNpmAuthentication = async () => {
  while (!run("npm", ["whoami"], { capture: true }).ok) {
    log("npm requires authentication. Waiting for npm login...");

    if (!(await runNpmWithBrowserPrompt(["login", "--auth-type=web"])).ok) {
      fail("npm login failed.");
    }
  }
};

export const waitForNpmAvailability = async (
  manifests,
  version,
  {
    query = (name, expectedVersion, remainingMs) =>
      run("npm", [
        "view",
        `${name}@${expectedVersion}`,
        "version",
        "--json",
        "--fetch-retries=0",
        `--fetch-timeout=${Math.max(1, remainingMs)}`,
      ], {
        capture: true,
        allowTimeout: true,
        timeout: remainingMs,
      }),
    sleep = (milliseconds) => new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds)),
    now = () => Date.now(),
    intervalMs = npmPollIntervalMs,
    timeoutMs = npmPollTimeoutMs,
  } = {},
) => {
  const pending = new Set(manifests.map(({ name }) => name));
  const deadline = now() + timeoutMs;
  const failTimeout = () => fail(
    `Timed out waiting for npm to expose ${version} for: ${[...pending].join(", ")}.`,
  );

  while (pending.size > 0) {
    for (const name of pending) {
      const remaining = deadline - now();
      if (remaining <= 0) {
        failTimeout();
      }
      const result = await query(name, version, remaining);
      if (result.timedOut) {
        failTimeout();
      }
      if (result.ok) {
        let availableVersion;
        try {
          availableVersion = JSON.parse(result.stdout);
        } catch (error) {
          fail(`npm returned invalid version data for ${name}@${version}: ${error.message}`);
        }
        if (availableVersion !== version) {
          fail(`npm reports ${name}@${version} as ${availableVersion ?? "unavailable"}.`);
        }
        pending.delete(name);
      } else if (!/\bE404\b|\b404 Not Found\b|No match found for version/i.test(
        `${result.stdout}\n${result.stderr}`,
      )) {
        fail(`Could not check npm availability for ${name}@${version}.${result.stderr ? `\n${result.stderr}` : ""}`);
      }
    }

    if (pending.size === 0) {
      return;
    }

    const remaining = deadline - now();
    if (remaining <= 0) {
      failTimeout();
    }
    await sleep(Math.min(intervalMs, remaining));
  }
};

const restoreReleaseFiles = (files) => {
  log("Restoring release changes");

  runOrFail("Restoring release files", "git", [
    "restore", "--staged", "--worktree", "--", ...files,
  ]);
};

// Copilot may wrap the JSON in a Markdown fence or surround it with prose.
const parseCopilotJson = (output) => {
  const text = output.trim();
  const fenced = text.match(/```(?:json)?\s*\n([\s\S]*?)\n?```/i);
  const body = fenced ? fenced[1].trim() : text;
  try {
    return JSON.parse(body);
  } catch (error) {
    for (let start = 0; start < body.length; start += 1) {
      if (body[start] !== "[" && body[start] !== "{") continue;

      const expectedClosers = [];
      let inString = false;
      let escaped = false;
      for (let end = start; end < body.length; end += 1) {
        const character = body[end];
        if (inString) {
          if (escaped) {
            escaped = false;
          } else if (character === "\\") {
            escaped = true;
          } else if (character === "\"") {
            inString = false;
          }
          continue;
        }
        if (character === "\"") {
          inString = true;
        } else if (character === "{") {
          expectedClosers.push("}");
        } else if (character === "[") {
          expectedClosers.push("]");
        } else if (character === "}" || character === "]") {
          if (expectedClosers.pop() !== character) break;
          if (expectedClosers.length === 0) {
            try {
              return JSON.parse(body.slice(start, end + 1));
            } catch {
              break;
            }
          }
        }
      }
    }
    throw error;
  }
};

const updateChangelogs = (manifests, version, baseline, originals) => {
  const range = `${baseline}..HEAD`;
  const changed = run("git", ["diff", "--name-status", range], { capture: true });
  const commits = run("git", ["log", "--format=%h %s", range], { capture: true });

  if (!changed.ok || !commits.ok) {
    fail(`Could not inspect changes since ${baseline}.`);
  }

  const date = new Date().toISOString().slice(0, 10);
  const prompt = [
    `Prepare changelog notes for Puzzle ${version}, released on ${date}.`,
    `The last release is ${baseline}; review git diff ${range} and git log ${range}.`,
    "Read every changed file that still exists, and inspect the diff for deleted files.",
    "Read each package's existing CHANGELOG.md if present, including Pending notes.",
    "Do not modify files or run commands other than git diff and git log.",
    "Summarize meaningful user-facing changes per package, including relevant shared changes.",
    "Exclude version/dependency bumps, lockfile churn, and changelog-only edits.",
    "Include existing Pending notes in the new release without duplicating them.",
    "Use an empty changes array if a package has no substantive changes.",
    "Return ONLY raw JSON (no Markdown code fences or prose): an array with exactly one object per package,",
    '{"package":"@puzzle-ui/core","changes":["Added ...","Fixed ..."]}.',
    "Each change must be a nonempty single-line Markdown bullet body (no bullet prefix).",
    `Packages: ${JSON.stringify(manifests.map(({ manifest, dir }) => ({
      package: manifest.name,
      directory: relative(root, dir),
    })))}`,
    `Changed files:\n${changed.stdout || "(none)"}`,
    `Commits:\n${commits.stdout || "(none)"}`,
  ].join("\n");

  log(`Generating package changelogs with Copilot since ${baseline}`);

  const args = [
    "--prompt", prompt,
    "--silent",
    "--no-ask-user",
    "--available-tools", "bash,view,grep,glob",
    "--allow-tool", "read",
    "--allow-tool", "shell(git diff)",
    "--allow-tool", "shell(git log)",
    "--deny-tool", "write",
  ];
  let result = runCopilot(args, { capture: true });
  if (!result.ok && /No authentication information found/i.test(result.stderr)) {
    log("Copilot requires GitHub authentication. Complete the login in your browser...");
    if (!runCopilot(["login"]).ok) {
      fail("Copilot login failed. Run \"bun x --package @github/copilot copilot login\" before retrying the release.");
    }
    result = runCopilot(args, { capture: true });
  }

  if (!result.ok) {
    fail(`Copilot changelog generation failed.${result.stderr ? `\n${result.stderr}` : ""}\nAuthenticate first with "bun x --package @github/copilot copilot login".`);
  }

  let notes;
  try {
    notes = parseCopilotJson(result.stdout);
  } catch (error) {
    fail(`Copilot did not return valid changelog JSON: ${error.message}`);
  }

  const expected = new Set(manifests.map(({ manifest }) => manifest.name));
  const byPackage = new Map();
  if (!Array.isArray(notes)) {
    fail("Copilot changelog output must be an array.");
  }
  for (const entry of notes) {
    if (
      !entry || !expected.has(entry.package) || byPackage.has(entry.package) ||
      !Array.isArray(entry.changes) ||
      entry.changes.some((change) =>
        typeof change !== "string" || !change.trim() || /[\r\n]/.test(change))
    ) {
      fail("Copilot returned invalid or duplicate package changelog notes.");
    }
    byPackage.set(entry.package, entry.changes);
  }
  if (byPackage.size !== expected.size) {
    fail("Copilot changelog output is missing packages.");
  }

  const rootPath = join(root, "CHANGELOG.md");
  const rootOriginal = existsSync(rootPath) ? readFileSync(rootPath, "utf8") : null;
  const rootContent = rootOriginal ?? "# Changelog\n\nAll notable changes to Puzzle packages are documented in this file.\n";
  const rootHeadings = [...rootContent.matchAll(/^## (.+)$/gm)];
  if (rootHeadings.some((heading) => heading[1].split(" - ")[0].replace(/^\[|\]$/g, "") === version)) {
    fail(`Root changelog already has an entry for ${version}.`);
  }
  const firstRelease = rootHeadings.find((heading) => !/^\[?Pending\]?$/i.test(heading[1]));
  const rootIntro = firstRelease ? rootContent.slice(0, firstRelease.index) : rootContent;
  const rootHistory = firstRelease ? rootContent.slice(firstRelease.index) : "";
  const formatChanges = (changes) => changes.length
    ? changes.map((change) => `- ${change.trim()}`).join("\n")
    : "- No changes; version bumped in lockstep.";

  for (const { dir, manifest } of manifests) {
    const path = join(dir, "CHANGELOG.md");
    const original = existsSync(path) ? readFileSync(path, "utf8") : null;
    originals.set(path, original);
    const content = original ?? `# Changelog\n\nAll notable changes to \`${manifest.name}\` are documented in this file.\n`;
    const headings = [...content.matchAll(/^## (.+)$/gm)];
    if (headings.some((heading) => heading[1].split(" - ")[0] === version)) {
      fail(`${manifest.name} already has a changelog entry for ${version}.`);
    }
    const first = headings[0];
    const intro = first ? content.slice(0, first.index) : content;
    const pending = first && /^Pending$/i.test(first[1]);
    const history = first
      ? content.slice(pending ? (headings[1]?.index ?? content.length) : first.index)
      : "";
    const changes = byPackage.get(manifest.name);
    if (
      pending && changes.length === 0 &&
      content.slice(first.index + first[0].length, headings[1]?.index).trim()
    ) {
      fail(`Copilot omitted Pending notes for ${manifest.name}.`);
    }
    const bullets = formatChanges(changes);
    writeFileSync(path, `${intro.trimEnd()}\n\n## ${version} - ${date}\n\n${bullets}\n${history ? `\n${history}` : ""}`);
  }

  const packageNotes = manifests
    .filter(({ manifest }) => byPackage.get(manifest.name).length > 0)
    .map(({ manifest }) => `### \`${manifest.name}\`\n\n${formatChanges(byPackage.get(manifest.name))}`)
    .join("\n\n");
  originals.set(rootPath, rootOriginal);
  writeFileSync(rootPath, `${rootIntro.trimEnd()}\n\n## ${version} - ${date}\n${packageNotes ? `\n${packageNotes}\n` : ""}${rootHistory ? `\n${rootHistory}` : ""}`);
};

const auditPublicDocumentation = (manifests, version, baseline, originals) => {
  const paths = getPublicDocumentationPaths(manifests);
  if (paths.length === 0) {
    log("No public documentation or consumer AI instructions were found to audit");
    return;
  }

  const range = `${baseline}..HEAD`;
  const changed = run("git", ["diff", "--name-status", range], { capture: true });
  const commits = run("git", ["log", "--format=%h %s", range], { capture: true });
  if (!changed.ok || !commits.ok) {
    fail(`Could not inspect changes since ${baseline} for the documentation audit.`);
  }

  const prompt = [
    `Audit public documentation and consumer AI instructions for the Puzzle ${version} release.`,
    `The previous release is ${baseline}; inspect git diff ${range} and git log ${range}.`,
    "Read every candidate document and compare feature claims with the current package source, public exports, package manifests, and included package files.",
    "Make only minimal edits needed to remove or accurately qualify feature claims that are not implemented and included in this release.",
    "Do not remove accurate claims merely because they are new; do not invent or promise functionality.",
    "Do not edit source code, package manifests, changelogs, maintainer instructions, generated registries, roadmaps, or planning documents.",
    "Do not modify files directly. Return ONLY raw JSON with this shape:",
    '{"edits":[{"path":"apps/site/content/docs/example.mdx","content":"complete updated file contents\\n","reason":"Why the claim is not releasable","evidence":["path/to/source.ts: export ..."]}]}.',
    "Use paths relative to the repository root. Include only changed files; use an empty edits array if no changes are needed.",
    "Each edit must include the complete updated document, a nonempty single-line reason, and at least one concrete source/export evidence string.",
    `Candidate documents:\n${paths.map((path) => `- ${path}`).join("\n")}`,
    `Changed files:\n${changed.stdout || "(none)"}`,
    `Commits:\n${commits.stdout || "(none)"}`,
  ].join("\n");
  const args = [
    "--prompt", prompt,
    "--silent",
    "--no-ask-user",
    "--available-tools", "bash,view,grep,glob",
    "--allow-tool", "read",
    "--allow-tool", "shell(git diff)",
    "--allow-tool", "shell(git log)",
    "--deny-tool", "write",
  ];
  let result = runCopilot(args, { capture: true });
  if (!result.ok && /No authentication information found/i.test(result.stderr)) {
    log("Copilot requires GitHub authentication. Complete the login in your browser...");
    if (!runCopilot(["login"]).ok) {
      fail("Copilot login failed. Run \"bun x --package @github/copilot copilot login\" before retrying the release.");
    }
    result = runCopilot(args, { capture: true });
  }
  if (!result.ok) {
    fail(`Copilot documentation audit failed.${result.stderr ? `\n${result.stderr}` : ""}\nAuthenticate first with "bun x --package @github/copilot copilot login".`);
  }

  let response;
  try {
    response = parseCopilotJson(result.stdout);
  } catch (error) {
    fail(`Copilot did not return valid documentation audit JSON: ${error.message}`);
  }
  if (!response || !Array.isArray(response.edits)) {
    fail("Copilot documentation audit output must contain an edits array.");
  }

  const allowed = new Set(paths);
  const edited = new Set();
  for (const edit of response.edits) {
    if (
      !edit || !allowed.has(edit.path) || edited.has(edit.path) ||
      typeof edit.content !== "string" || !edit.content.trim() ||
      !edit.content.endsWith("\n") ||
      typeof edit.reason !== "string" || !edit.reason.trim() || /[\r\n]/.test(edit.reason) ||
      !Array.isArray(edit.evidence) || edit.evidence.length === 0 ||
      edit.evidence.some((item) => typeof item !== "string" || !item.trim())
    ) {
      fail("Copilot returned an invalid, duplicate, or out-of-scope documentation edit.");
    }
    edited.add(edit.path);

    const path = join(root, edit.path);
    const original = readFileSync(path, "utf8");
    if (edit.content === original) {
      continue;
    }
    originals.set(path, original);
    writeFileSync(path, edit.content);
    log(`Updated ${edit.path}: ${edit.reason}`);
  }
};

const restoreChangelogs = (originals) => {
  for (const [path, content] of originals) {
    if (content === null && existsSync(path)) {
      unlinkSync(path);
    } else if (content !== null) {
      writeFileSync(path, content);
    }
  }
};

const restoreDocumentation = (originals) => {
  for (const [path, content] of originals) {
    writeFileSync(path, content);
  }
};

const main = async () => {
  log(dryRun ? "Starting release (dry run)" : "Starting release");

  const status = run("git", ["status", "--porcelain"], { capture: true });
  if (!status.ok) {
    fail(`Could not check the git working tree.${status.stderr ? `\n${status.stderr}` : ""}`);
  }
  if (status.stdout) {
    fail(
      "The git working tree is not clean. Commit or stash your changes before releasing.",
    );
  }

  validateReleasePackageCoverage();

  const manifests = packages.map((pkg) => ({
    ...pkg,
    manifest: readManifest(pkg.manifestPath),
  }));

  const currentVersion = manifests[0].manifest.version;

  const mismatched = manifests.filter(
    ({ manifest }) => manifest.version !== currentVersion,
  );

  if (mismatched.length > 0) {
    fail(
      `All packages must share the same version. Expected ${currentVersion}, found: ${mismatched
        .map(({ manifest }) => `${manifest.name}@${manifest.version}`)
        .join(", ")}.`,
    );
  }

  for (const { manifest } of manifests) {
    if (manifest.private === true) {
      fail(`${manifest.name} is private and cannot be published.`);
    }

    if (!manifest.publishConfig?.access) {
      fail(`${manifest.name} is missing publishConfig.access.`);
    }
  }

  const releaseType = await askReleaseType();
  const version = bumpVersion(currentVersion, releaseType);
  const tag = `v${version}`;

  if (
    run("git", ["rev-parse", "--quiet", "--verify", `refs/tags/${tag}`], {
      capture: true,
    }).ok
  ) {
    fail(`Git tag ${tag} already exists.`);
  }

  const baseline = `v${currentVersion}`;
  if (!run("git", ["merge-base", "--is-ancestor", `refs/tags/${baseline}`, "HEAD"], {
    capture: true,
  }).ok) {
    fail(`Last release tag ${baseline} must exist and be an ancestor of HEAD. Fetch release tags before releasing.`);
  }

  const releaseFiles = [
    ...manifests.map(({ manifestPath }) => relative(root, manifestPath)),
    relative(root, lockfile),
    "docs/ai/integration/registry.json",
  ];

  const names = new Set(manifests.map(({ manifest }) => manifest.name));

  const published = [];
  const changelogOriginals = new Map();
  const documentationOriginals = new Map();
  let releaseCommitted = false;
  let releaseTagCreated = false;

  try {
    log(`Updating packages from ${currentVersion} to ${version}`);

    for (const { manifestPath, manifest } of manifests) {
      manifest.version = version;

      for (const field of dependencyFields) {
        for (const dependency of Object.keys(manifest[field] ?? {})) {
          if (names.has(dependency)) {
            manifest[field][dependency] = `^${version}`;
          }
        }
      }

      writeManifest(manifestPath, manifest);
    }

    runOrFail("Updating bun.lock", "bun", ["install", "--lockfile-only"]);

    runOrFail("Verifying bun.lock", "bun", ["install", "--frozen-lockfile"]);

    runOrFail("Type checking", "bun", ["run", "typecheck"]);

    log("Running package tests");

    for (const { dir, manifest } of manifests) {
      const scripts = manifest.scripts ?? {};

      const testScript = scripts["test:all"]
        ? "test:all"
        : scripts.vitest
          ? "vitest"
          : scripts.test
            ? "test"
            : undefined;

      if (testScript) {
        runOrFail(`Tests for ${manifest.name}`, "bun", ["run", testScript], {
          cwd: dir,
        });
      }
    }

    log("Building packages");

    for (const { dir, manifest } of manifests) {
      runOrFail(`Build for ${manifest.name}`, "bun", ["run", "build"], {
        cwd: dir,
      });
    }

    updateChangelogs(manifests, version, baseline, changelogOriginals);
    auditPublicDocumentation(manifests, version, baseline, documentationOriginals);

    runOrFail(
      "AI instruction tarball and consumer CLI validation",
      "bun",
      ["packages/create/src/ai/check.ts", "--write-index"],
    );

    runOrFail("Documentation site build", "bun", [
      "run",
      "--filter",
      "@puzzle-ui/site",
      "build",
    ]);

    log("Validating npm package contents");

    for (const { dir, manifest } of manifests) {
      runOrFail(
        `Package preflight for ${manifest.name}`,
        "npm",
        ["pack", "--dry-run", "--ignore-scripts"],
        { cwd: dir },
      );
    }

    log("Publishing packages");

    if (dryRun) {
      for (const { dir, manifest } of manifests) {
        log(`Publishing ${manifest.name}@${version} (dry run)`);
        const args = ["publish", "--ignore-scripts", "--dry-run"];
        runOrFail(`Publishing ${manifest.name}`, "npm", args, { cwd: dir });
      }

      restoreReleaseFiles(releaseFiles);
      restoreChangelogs(changelogOriginals);
      restoreDocumentation(documentationOriginals);
      log(`Dry run for ${tag} succeeded. No packages were published and no commit or tag was created.`);
      return;
    }

    await ensureNpmAuthentication();

    for (const { dir, manifest } of manifests) {
      log(`Publishing ${manifest.name}@${version}`);

      if (!(await runNpmWithBrowserPrompt([
        "publish",
        "--ignore-scripts",
      ], dir)).ok) {
        fail(`Publishing ${manifest.name}@${version} failed.`);
      }

      published.push(manifest.name);
    }

    log(`Waiting for ${version} to become available on npm`);
    await waitForNpmAvailability(
      manifests.map(({ manifest }) => manifest),
      version,
    );

    log(`Committing and pushing ${tag}`);
    runOrFail("Staging release changes", "git", ["add", "--all"]);
    runOrFail("Committing release", "git", [
      "commit", "-m", `Release ${tag}`,
      "-m", "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
    ]);
    releaseCommitted = true;
    runOrFail("Pushing release commit", "git", ["push"]);

    log(`Tagging ${tag}`);
    runOrFail("Creating tag", "git", ["tag", "-a", tag, "-m", `Release ${tag}`]);
    releaseTagCreated = true;
    runOrFail("Pushing release tag", "git", ["push", "--follow-tags"]);

    console.log(
      `\n\x1b[32mSuccessfully released ${tag}: ${[...names].join(", ")}.\x1b[0m`,
    );
  } catch (error) {
    if (!dryRun && published.length > 0) {
      const gitStatus = releaseCommitted
        ? `Release commit ${tag} exists${releaseTagCreated ? " and the local tag was created" : ""}; inspect which Git pushes completed.`
        : "The release commit and tag have not been completed.";
      console.error(
        `\nRelease ${tag} stopped after publishing. Published: ${published.join(", ")}. Files were left in place. ${gitStatus} Inspect npm and Git state, then complete only the missing steps; do not blindly republish.`,
      );
    } else {
      const trackedChangelogs = [...changelogOriginals]
        .filter(([, content]) => content !== null)
        .map(([path]) => relative(root, path));
      restoreReleaseFiles([...releaseFiles, ...trackedChangelogs]);
      restoreChangelogs(changelogOriginals);
      restoreDocumentation(documentationOriginals);
    }

    throw error;
  }
};

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(
      `\n\x1b[31mRelease stopped: ${error instanceof ReleaseError ? error.message : error}\x1b[0m`,
    );

    process.exit(1);
  });
}
