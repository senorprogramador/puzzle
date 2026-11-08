import { mkdtemp, readFile, rm } from "node:fs/promises";

import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createProject } from "./create-project";

describe("createProject", () => {
  let cwd: string;

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(os.tmpdir(), "puzzle-create-project-"));
  });

  afterEach(async () => {
    await rm(cwd, {
      recursive: true,
      force: true,
    });
  });

  it("creates a complete React project with Puzzle installed", async () => {
    const runner = vi.fn().mockResolvedValue(undefined);

    await createProject(
      {
        name: "my-awesome-app",
        directory: "my-awesome-app",
        framework: "react",
        packageManager: "bun",
        tailwind: true,
      },
      {
        cwd,
        runner,
      },
    );

    const projectDirectory = path.join(cwd, "my-awesome-app");

    const packageJson = JSON.parse(
      await readFile(path.join(projectDirectory, "package.json"), "utf8"),
    );

    const main = await readFile(
      path.join(projectDirectory, "src/main.tsx"),
      "utf8",
    );

    const app = await readFile(
      path.join(projectDirectory, "src/App.tsx"),
      "utf8",
    );

    expect(packageJson.name).toBe("my-awesome-app");

    expect(main).toContain("@puzzle-ui/theme");
    expect(main).toContain('<Theme theme="system">');

    expect(app).toContain("@puzzle-ui/ui");

    expect(runner).toHaveBeenCalledTimes(2);

    expect(runner).toHaveBeenCalledWith(
      "bun",
      ["add", "-d", "tailwindcss@latest", "@tailwindcss/vite@latest"],
      {
        cwd: projectDirectory,
      },
    );

    expect(runner).toHaveBeenCalledWith(
      "bun",
      ["add", "@puzzle-ui/ui@latest", "@puzzle-ui/theme@latest"],
      {
        cwd: projectDirectory,
      },
    );
  });

  it("does not overwrite an existing project", async () => {
    const runner = vi.fn();

    const existingDirectory = path.join(cwd, "existing-app");

    const { mkdir } = await import("node:fs/promises");

    await mkdir(existingDirectory);

    await expect(
      createProject(
        {
          name: "existing-app",
          directory: "existing-app",
          framework: "react",
          packageManager: "bun",
          tailwind: true,
        },
        {
          cwd,
          runner,
        },
      ),
    ).rejects.toThrow("already exists");

    expect(runner).not.toHaveBeenCalled();
  });
});
