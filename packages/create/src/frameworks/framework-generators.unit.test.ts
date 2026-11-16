import { readFile, rm } from "node:fs/promises";

import path from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import type { PackageManager } from "../types";

import { createNextProject } from "./next";
import { createReactRouterProject } from "./react-router";
import { createReactProject } from "./react";
import { createTanStackProject } from "./tanstack";

describe("external framework generators", () => {
  it.each([
    ["next", createNextProject, ["create-next-app@latest", "demo", "--ts", "--app", "--src-dir", "--skip-install", "--disable-git", "--no-tailwind", "--yes", "--use-npm"]],
    ["tanstack", createTanStackProject, ["@tanstack/cli@latest", "create", "demo", "--framework", "React", "--package-manager", "npm", "--blank", "--no-install", "--no-git", "--yes"]],
    ["react-router", createReactRouterProject, ["create-react-router@latest", "demo", "--no-install", "--no-git-init", "--yes"]],
  ] as const)(
    "passes the exact npm arguments to %s",
    async (_name, generator, expectedArgs) => {
      const runner = vi.fn().mockResolvedValue(undefined);
      await generator("demo", "npm", runner, "/workspace");

      expect(runner).toHaveBeenCalledOnce();
      expect(runner).toHaveBeenCalledWith(
        "npx",
        ["--yes", ...expectedArgs],
        { cwd: "/workspace" },
      );
    },
  );

  it.each([
    ["bun", "bunx", []],
    ["pnpm", "pnpm", ["dlx"]],
    ["yarn", "yarn", ["dlx"]],
  ] as const)("uses %s execution args and propagates generator failures", async (manager, command, prefix) => {
    const error = new Error("generator failed");
    const runner = vi.fn().mockRejectedValue(error);

    await expect(
      createReactRouterProject("demo", manager, runner),
    ).rejects.toBe(error);
    expect(runner).toHaveBeenCalledWith(
      command,
      [...prefix, "create-react-router@latest", "demo", "--no-install", "--no-git-init", "--yes"],
      undefined,
    );
  });
});

describe("createReactProject", () => {
  const root = path.resolve(process.cwd(), ".test-work/react-generator");

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it("writes the expected minimal app files and package metadata", async () => {
    await createReactProject(path.join(root, "demo"), "bun");

    const packageJson = JSON.parse(
      await readFile(path.join(root, "demo/package.json"), "utf8"),
    );
    expect(packageJson).toMatchObject({
      name: "demo",
      private: true,
      type: "module",
      dependencies: { react: "^19.0.0", "react-dom": "^19.0.0" },
      scripts: { dev: "vite", preview: "vite preview" },
    });

    expect(await readFile(path.join(root, "demo/index.html"), "utf8")).toContain(
      '<div id="root"></div>',
    );
    expect(await readFile(path.join(root, "demo/vite.config.ts"), "utf8")).toContain(
      "plugins: [react()]",
    );
    expect(await readFile(path.join(root, "demo/tsconfig.app.json"), "utf8")).toContain(
      '"strict": true',
    );
  });

  it("does not invoke the supplied runner", async () => {
    const runner = vi.fn();
    await createReactProject(path.join(root, "no-runner"), "npm", runner);
    expect(runner).not.toHaveBeenCalled();
  });
});
