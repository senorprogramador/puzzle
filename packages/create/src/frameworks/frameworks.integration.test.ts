import { mkdtemp, readFile, rm } from "node:fs/promises";

import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createNextProject } from "./next";

import { createTanStackProject } from "./tanstack";

import { createReactProject } from "./react";

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

  it("generates a Next.js project using Bun", async () => {
    const runner = vi.fn().mockResolvedValue(undefined);

    await createNextProject("my-app", "bun", runner);

    expect(runner).toHaveBeenCalledWith(
      "bunx",
      expect.arrayContaining([
        "create-next-app@latest",
        "my-app",
        "--skip-install",
        "--use-bun",
      ]),
    );
  });

  it("generates a Next.js project using npm", async () => {
    const runner = vi.fn().mockResolvedValue(undefined);

    await createNextProject("my-app", "npm", runner);

    expect(runner).toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining([
        "--yes",
        "create-next-app@latest",
        "my-app",
        "--skip-install",
        "--use-npm",
      ]),
    );
  });

  it("generates a TanStack Start project", async () => {
    const runner = vi.fn().mockResolvedValue(undefined);

    await createTanStackProject("my-app", "bun", runner);

    expect(runner).toHaveBeenCalledWith(
      "bunx",
      expect.arrayContaining([
        "@tanstack/cli@latest",
        "create",
        "my-app",
        "--framework",
        "React",
        "--blank",
        "--no-install",
      ]),
    );
  });

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
});
