import { mkdir, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { TestProject } from "vitest/node";

import { run } from "./process";

declare module "vitest" {
  export interface ProvidedContext {
    /** Temporary directory that holds every generated project. */
    e2eRoot: string;
    /** Local tarball path for each Puzzle package, keyed by package name. */
    puzzlePackages: Record<string, string>;
  }
}

const repositoryRoot = path.resolve(import.meta.dirname, "../../..");

/** Every Puzzle package a generated project can depend on, directly or transitively. */
const PACKED_PACKAGES = [
  "core",
  "hooks",
  "icons",
  "theme",
  "ui",
  "media",
  "cms",
  "storage",
  "session",
  "auth",
  "fullstack",
  "storage-mongodb",
  "storage-d1",
];

/**
 * Builds the workspace and packs the Puzzle packages, so generated projects
 * install this checkout instead of the versions published to npm.
 */
export default async function setup(project: TestProject) {
  const root = await mkdtemp(path.join(os.tmpdir(), "puzzle-create-e2e-"));
  const packagesDirectory = path.join(root, "packages");

  await mkdir(packagesDirectory);

  if (process.env.PUZZLE_E2E_SKIP_BUILD !== "1") {
    await run("bun", ["run", "build"], { cwd: repositoryRoot });
  }

  const puzzlePackages: Record<string, string> = {};

  for (const name of PACKED_PACKAGES) {
    const tarball = path.join(packagesDirectory, `puzzle-ui-${name}.tgz`);

    await run(
      "bun",
      ["pm", "pack", "--ignore-scripts", "--quiet", "--filename", tarball],
      { cwd: path.join(repositoryRoot, "packages", name) },
    );

    puzzlePackages[`@puzzle-ui/${name}`] = tarball;
  }

  project.provide("e2eRoot", root);
  project.provide("puzzlePackages", puzzlePackages);

  return async () => {
    if (process.env.PUZZLE_E2E_KEEP === "1") {
      console.info(`Kept generated projects in ${root}`);
      return;
    }

    await rm(root, { recursive: true, force: true });
  };
}
