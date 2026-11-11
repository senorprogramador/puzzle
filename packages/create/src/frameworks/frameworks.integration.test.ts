import { mkdtemp, readFile, rm } from "node:fs/promises";

import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PackageManager } from "../types";

import { createNextProject } from "./next";
import { createTanStackProject } from "./tanstack";
import { createReactProject } from "./react";

const generatorCases = [
  {
    packageManager: "bun",
    command: "bunx",
    prefix: [],
  },
  {
    packageManager: "npm",
    command: "npx",
    prefix: ["--yes"],
  },
  {
    packageManager: "pnpm",
    command: "pnpm",
    prefix: ["dlx"],
  },
  {
    packageManager: "yarn",
    command: "yarn",
    prefix: ["dlx"],
  },
] as const;

describe("framework generators", () => {
  let cwd: string;

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(os.tmpdir(), "puzzle-framework-"));
  });

  afterEach(async () => {
    await rm(cwd, {
      recursive: true,
      force: true,
    });
  });

  it.each(generatorCases)(
    "generates a Next.js project using $packageManager",
    async ({ packageManager, command, prefix }) => {
      const runner = vi.fn().mockResolvedValue(undefined);

      await createNextProject("my-app", packageManager, runner, cwd);

      expect(runner).toHaveBeenCalledWith(
        command,
        [
          ...prefix,
          "create-next-app@latest",
          "my-app",
          "--ts",
          "--app",
          "--src-dir",
          "--skip-install",
          "--disable-git",
          "--no-tailwind",
          "--yes",
          `--use-${packageManager}`,
        ],
        { cwd },
      );
    },
  );

  it.each(generatorCases)(
    "generates a TanStack Start project using $packageManager",
    async ({ packageManager, command, prefix }) => {
      const runner = vi.fn().mockResolvedValue(undefined);

      await createTanStackProject("my-app", packageManager, runner, cwd);

      expect(runner).toHaveBeenCalledWith(
        command,
        [
          ...prefix,
          "@tanstack/cli@latest",
          "create",
          "my-app",
          "--framework",
          "React",
          "--package-manager",
          packageManager,
          "--blank",
          "--no-install",
          "--no-git",
          "--yes",
        ],
        { cwd },
      );
    },
  );

  it("generates a Basic React project", async () => {
    await createReactProject(path.join(cwd, "my-app"), "bun");

    const packageJson = JSON.parse(
      await readFile(path.join(cwd, "my-app", "package.json"), "utf8"),
    );

    expect(packageJson.name).toBe("my-app");
    expect(packageJson.dependencies.react).toBe("^19.0.0");
    expect(packageJson.devDependencies.vite).toBe("latest");

    const viteConfig = await readFile(
      path.join(cwd, "my-app", "vite.config.ts"),
      "utf8",
    );

    expect(viteConfig).toContain("@vitejs/plugin-react");
  });

  it("does not run an external generator for Basic React", async () => {
    const runner = vi.fn();

    await createReactProject(path.join(cwd, "my-app"), "npm", runner);

    expect(runner).not.toHaveBeenCalled();
  });

  it("accepts every supported package manager in the React generator", async () => {
    const packageManagers: PackageManager[] = ["bun", "npm", "pnpm", "yarn"];

    for (const packageManager of packageManagers) {
      const directory = path.join(cwd, packageManager);

      await createReactProject(directory, packageManager);

      const packageJson = JSON.parse(
        await readFile(path.join(directory, "package.json"), "utf8"),
      );

      expect(packageJson.name).toBe(packageManager);
    }
  });
});
