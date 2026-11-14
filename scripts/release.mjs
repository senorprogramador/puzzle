#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

const releaseOrder = [
  "core",
  "theme",
  "hooks",
  "icons",
  "ui",
  "pieces",
  "create",
  "storage",
  "session",
  "storage-d1",
  "storage-mongodb",
  "auth",
  "fullstack",
  "seo",
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

class ReleaseError extends Error {}

const log = (message) => {
  console.log(`\n\x1b[1m> ${message}\x1b[0m`);
};

const fail = (message) => {
  throw new ReleaseError(message);
};

const run = (command, args, { cwd = root, capture = false } = {}) => {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: capture ? ["inherit", "pipe", "pipe"] : "inherit",
  });

  if (result.error) {
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
  const directories = readdirSync(join(root, "packages"), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
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

const ensureNpmAuthentication = () => {
  while (!run("npm", ["whoami"], { capture: true }).ok) {
    log("npm requires authentication. Waiting for npm login...");

    if (!run("npm", ["login"]).ok) {
      fail("npm login failed.");
    }
  }
};

const restoreReleaseFiles = (files) => {
  log("Restoring version changes");

  runOrFail("Restoring release files", "git", [
    "restore", "--staged", "--worktree", "--", ...files,
  ]);
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
    "Read each package's existing CHANGELOG.md if present, including Unreleased notes.",
    "Do not modify files or run commands other than git diff and git log.",
    "Summarize meaningful user-facing changes per package, including relevant shared changes.",
    "Exclude version/dependency bumps, lockfile churn, and changelog-only edits.",
    "Include existing Unreleased notes in the new release without duplicating them.",
    "Use an empty changes array if a package has no substantive changes.",
    "Return ONLY JSON: an array with exactly one object per package,",
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

  const result = run("copilot", [
    "--prompt", prompt,
    "--silent",
    "--no-ask-user",
    "--available-tools", "bash,view,grep,glob",
    "--allow-tool", "read",
    "--allow-tool", "shell(git diff)",
    "--allow-tool", "shell(git log)",
    "--deny-tool", "write",
  ], { capture: true });

  if (!result.ok) {
    fail(`Copilot changelog generation failed.${result.stderr ? `\n${result.stderr}` : ""}`);
  }

  let notes;
  try {
    notes = JSON.parse(result.stdout);
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
    const unreleased = first && /^Unreleased$/i.test(first[1]);
    const history = first
      ? content.slice(unreleased ? (headings[1]?.index ?? content.length) : first.index)
      : "";
    const changes = byPackage.get(manifest.name);
    if (
      unreleased && changes.length === 0 &&
      content.slice(first.index + first[0].length, headings[1]?.index).trim()
    ) {
      fail(`Copilot omitted Unreleased notes for ${manifest.name}.`);
    }
    const bullets = changes.length
      ? changes.map((change) => `- ${change.trim()}`).join("\n")
      : "- No changes; version bumped in lockstep.";
    writeFileSync(path, `${intro.trimEnd()}\n\n## ${version} - ${date}\n\n${bullets}\n${history ? `\n${history}` : ""}`);
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
  ];

  const names = new Set(manifests.map(({ manifest }) => manifest.name));

  const published = [];
  const changelogOriginals = new Map();
  let releaseCommitted = false;

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

    updateChangelogs(manifests, version, baseline, changelogOriginals);

    if (!dryRun) {
      log(`Committing and pushing ${tag} before publishing`);
      runOrFail("Staging release changes", "git", ["add", "--all"]);
      runOrFail("Committing release", "git", [
        "commit", "-m", `Release ${tag}`,
        "-m", "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
      ]);
      releaseCommitted = true;
      runOrFail("Pushing release commit", "git", ["push"]);
    }
  } catch (error) {
    if (releaseCommitted) {
      console.error(`\nRelease ${tag} was committed. Files were left in place; resolve the push failure before publishing.`);
    } else {
      const trackedChangelogs = [...changelogOriginals]
        .filter(([, content]) => content !== null)
        .map(([path]) => relative(root, path));
      restoreReleaseFiles([...releaseFiles, ...trackedChangelogs]);
      const newChangelogs = [...changelogOriginals]
        .filter(([, content]) => content === null)
        .map(([path]) => relative(root, path));
      // Newly created changelogs may have been staged before a failed commit.
      if (!dryRun && newChangelogs.length > 0) {
        runOrFail("Unstaging changelogs", "git", [
          "reset", "HEAD", "--", ...newChangelogs,
        ]);
      }
      restoreChangelogs(changelogOriginals);
    }
    throw error;
  }

  try {
    if (!dryRun) {
      ensureNpmAuthentication();
    }

    log("Publishing packages");

    for (const { dir, manifest } of manifests) {
      log(`Publishing ${manifest.name}@${version}`);

      const args = [
        "publish",
        "--ignore-scripts",
        ...(dryRun ? ["--dry-run"] : []),
      ];

      runOrFail(`Publishing ${manifest.name}`, "npm", args, { cwd: dir });

      published.push(manifest.name);
    }
  } catch (error) {
    if (!dryRun) {
      console.error(
        `\nRelease ${tag} was committed and pushed. Already published: ${published.join(", ") || "(none)"}. Files were left in place; inspect npm before recovering the release.`,
      );
    } else {
      restoreReleaseFiles(releaseFiles);
      restoreChangelogs(changelogOriginals);
    }

    throw error;
  }

  if (dryRun) {
    restoreReleaseFiles(releaseFiles);
    restoreChangelogs(changelogOriginals);

    log(
      `Dry run for ${tag} succeeded. No packages were published and no commit or tag was created.`,
    );

    return;
  }

  log(`Tagging ${tag}`);

  runOrFail("Creating tag", "git", ["tag", "-a", tag, "-m", `Release ${tag}`]);

  runOrFail("Pushing tags and commits", "git", ["push", "--follow-tags"]);

  console.log(
    `\n\x1b[32mSuccessfully released ${tag}: ${[...names].join(", ")}.\x1b[0m`,
  );
};

main().catch((error) => {
  console.error(
    `\n\x1b[31mRelease stopped: ${error instanceof ReleaseError ? error.message : error}\x1b[0m`,
  );

  process.exit(1);
});
