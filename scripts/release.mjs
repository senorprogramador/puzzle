#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

// Publish order: dependencies before the packages that depend on them.
const packages = ["core", "theme", "hooks", "icons", "ui"].map((name) => {
  const dir = join(root, "packages", name);
  return { dir, manifestPath: join(dir, "package.json") };
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

const log = (message) => console.log(`\n\x1b[1m> ${message}\x1b[0m`);
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
  return { ok: result.status === 0, stdout: result.stdout?.trim() ?? "" };
};

const runOrFail = (description, command, args, options) => {
  if (!run(command, args, options).ok) {
    fail(`${description} failed: ${command} ${args.join(" ")}`);
  }
};

const readManifest = (path) => JSON.parse(readFileSync(path, "utf8"));
const writeManifest = (path, manifest) =>
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);

const bumpVersion = (version, type) => {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    fail(`Unsupported version "${version}". Expected MAJOR.MINOR.PATCH.`);
  }
  const [major, minor, patch] = match.slice(1).map(Number);
  if (type === "major") return `${major + 1}.0.0`;
  if (type === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Only update workspace metadata; a full `bun install` would also re-resolve unrelated dependencies.
const updateLockfile = (manifests, currentVersion, version) => {
  const lock = readFileSync(lockfile, "utf8");
  const workspacesEnd = lock.indexOf('\n  "packages": {');
  if (workspacesEnd === -1) {
    fail("Could not find the packages section in bun.lock.");
  }
  let workspaces = lock.slice(0, workspacesEnd);
  for (const { dir, manifest } of manifests) {
    const entry = new RegExp(
      `("${escapeRegExp(relative(root, dir))}": \\{\\s*"name": "${escapeRegExp(manifest.name)}",\\s*"version": ")${escapeRegExp(currentVersion)}"`,
    );
    if (!entry.test(workspaces)) {
      fail(`Could not find ${manifest.name}@${currentVersion} in bun.lock.`);
    }
    workspaces = workspaces
      .replace(entry, `$1${version}"`)
      .replaceAll(
        `"${manifest.name}": "^${currentVersion}"`,
        `"${manifest.name}": "^${version}"`,
      );
  }
  writeFileSync(lockfile, workspaces + lock.slice(workspacesEnd));
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
      if (releaseTypes.includes(answer)) return answer;
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
  run("git", ["restore", "--", ...files]);
};

const main = async () => {
  log(dryRun ? "Starting release (dry run)" : "Starting release");

  if (run("git", ["status", "--porcelain"], { capture: true }).stdout) {
    fail(
      "The git working tree is not clean. Commit or stash your changes before releasing.",
    );
  }

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

  const releaseFiles = [
    ...manifests.map(({ manifestPath }) => relative(root, manifestPath)),
    relative(root, lockfile),
  ];
  const names = new Set(manifests.map(({ manifest }) => manifest.name));
  const published = [];

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
    updateLockfile(manifests, currentVersion, version);
    runOrFail("Verifying bun.lock", "bun", ["install", "--frozen-lockfile"]);

    log("Running tests");
    for (const { dir, manifest } of manifests) {
      const scripts = manifest.scripts ?? {};
      const testScript = scripts["test:all"]
        ? "test:all"
        : scripts.vitest
          ? "vitest"
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
  } catch (error) {
    restoreReleaseFiles(releaseFiles);
    throw error;
  }

  try {
    log("Publishing packages");
    for (const { dir, manifest } of manifests) {
      ensureNpmAuthentication();
      log(`Publishing ${manifest.name}@${version}`);
      // Packages were just built, so skip the prepack rebuild.
      const args = [
        "publish",
        "--ignore-scripts",
        ...(dryRun ? ["--dry-run"] : []),
      ];
      runOrFail(`Publishing ${manifest.name}`, "npm", args, { cwd: dir });
      published.push(manifest.name);
    }
  } catch (error) {
    if (published.length > 0 && !dryRun) {
      console.error(
        `\nAlready published: ${published.join(", ")}. Version changes were left in place.`,
      );
    } else {
      restoreReleaseFiles(releaseFiles);
    }
    throw error;
  }

  if (dryRun) {
    restoreReleaseFiles(releaseFiles);
    log(
      `Dry run for ${tag} succeeded. No packages were published and no commit or tag was created.`,
    );
    return;
  }

  log(`Committing and tagging ${tag}`);
  runOrFail("Staging release changes", "git", ["add", "--", ...releaseFiles]);
  runOrFail("Committing release", "git", ["commit", "-m", `Release ${tag}`]);
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
