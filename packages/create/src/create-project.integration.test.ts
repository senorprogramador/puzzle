import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, mkdir, writeFile } from "node:fs/promises";

import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PackageManager } from "./types";

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

  it("creates a complete React project with Puzzle and Tailwind installed", async () => {
    const runner = vi.fn().mockResolvedValue(undefined);
    const requestInitialUser = vi.fn();

    await createProject(
      {
        name: "my-awesome-app",
        directory: "my-awesome-app",
        framework: "react",
        packageManager: "bun",
        tailwind: true,
        auth: false,
      },
      {
        cwd,
        runner,
        requestInitialUser,
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

    const css = await readFile(
      path.join(projectDirectory, "src/index.css"),
      "utf8",
    );

    expect(packageJson.name).toBe("my-awesome-app");
    expect(requestInitialUser).not.toHaveBeenCalled();
    expect(main).toContain("@puzzle-ui/theme");
    expect(main).toContain(
      '<Theme theme="system" fonts={fonts} fontSource="local">',
    );
    expect(app).toContain("@puzzle-ui/ui");
    expect(css).toContain('@import "tailwindcss";');
    expect(packageJson.scripts["fonts:download"]).toBe(
      "puzzle-theme fonts download --config src/puzzle-fonts.json --subsets latin,latin-ext",
    );

    expect(runner).toHaveBeenCalledTimes(3);

    expect(runner).toHaveBeenLastCalledWith(
      "bun",
      ["run", "fonts:download"],
      {
        cwd: projectDirectory,
      },
    );

    expect(runner).toHaveBeenCalledWith(
      "bun",
      ["add", "-D", "tailwindcss@latest", "@tailwindcss/vite@latest"],
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

  it("generates a React application with Puzzle Auth", async () => {
    const runner = vi.fn().mockResolvedValue(undefined);

    await createProject(
      {
        name: "auth-app",
        directory: "auth-app",
        framework: "react",
        packageManager: "bun",
        tailwind: false,
        auth: true,
      },
      {
        cwd,
        runner,
      },
    );

    const projectDirectory = path.join(cwd, "auth-app");

    const main = await readFile(
      path.join(projectDirectory, "src/main.tsx"),
      "utf8",
    );

    const signIn = await readFile(
      path.join(projectDirectory, "src/auth/sign-in.tsx"),
      "utf8",
    );

    const signUp = await readFile(
      path.join(projectDirectory, "src/auth/sign-up.tsx"),
      "utf8",
    );

    expect(main).toContain("@puzzle-ui/fullstack/auth/client");
    expect(main).toContain("<AuthProvider");

    expect(signIn).toContain('mode="sign-in"');
    expect(signUp).toContain('mode="sign-up"');

    expect(runner).toHaveBeenCalledWith(
      "bun",
      [
        "add",
        "@puzzle-ui/ui@latest",
        "@puzzle-ui/theme@latest",
        "@puzzle-ui/auth@latest",
        "@puzzle-ui/fullstack@latest",
        "@puzzle-ui/session@latest",
      ],
      {
        cwd: projectDirectory,
      },
    );
  });

  it.each(["bun", "npm", "pnpm", "yarn"] as PackageManager[])(
    "installs Puzzle Auth with %s",
    async (packageManager) => {
      const runner = vi.fn().mockResolvedValue(undefined);

      await createProject(
        {
          name: "auth-app",
          directory: "auth-app",
          framework: "react",
          packageManager,
          tailwind: false,
          auth: true,
        },
        {
          cwd,
          runner,
        },
      );

      const projectDirectory = path.join(cwd, "auth-app");

      expect(runner).toHaveBeenCalledTimes(2);

      expect(runner).toHaveBeenCalledWith(
        packageManager,
        [
          ...(packageManager === "npm" ? ["install"] : ["add"]),
          "@puzzle-ui/ui@latest",
          "@puzzle-ui/theme@latest",
          "@puzzle-ui/auth@latest",
          "@puzzle-ui/fullstack@latest",
          "@puzzle-ui/session@latest",
        ],
        {
          cwd: projectDirectory,
        },
      );
    },
  );

  it.each(["bun", "npm", "pnpm", "yarn"] as PackageManager[])(
    "installs Puzzle with %s when Tailwind is disabled",
    async (packageManager) => {
      const runner = vi.fn().mockResolvedValue(undefined);

      await createProject(
        {
          name: "my-app",
          directory: "my-app",
          framework: "react",
          packageManager,
          tailwind: false,
          auth: false,
        },
        {
          cwd,
          runner,
        },
      );

      const projectDirectory = path.join(cwd, "my-app");

      const css = await readFile(
        path.join(projectDirectory, "src/index.css"),
        "utf8",
      );

      expect(css).not.toContain('@import "tailwindcss";');
      expect(runner).toHaveBeenCalledTimes(2);
      expect(runner).toHaveBeenLastCalledWith(
        packageManager,
        ["run", "fonts:download"],
        {
          cwd: projectDirectory,
        },
      );

      expect(runner).toHaveBeenCalledWith(
        packageManager,
        [
          ...(packageManager === "npm" ? ["install"] : ["add"]),
          "@puzzle-ui/ui@latest",
          "@puzzle-ui/theme@latest",
        ],
        {
          cwd: projectDirectory,
        },
      );
    },
  );

  it("installs D1 storage and Cloudflare tooling for TanStack Start", async () => {
    const projectDirectory = path.join(cwd, "edge-app");

    const runner = vi.fn(async () => {
      // Stand in for the TanStack Start generator on its first call.
      if (existsSync(projectDirectory)) return;

      await mkdir(path.join(projectDirectory, "src/routes"), {
        recursive: true,
      });
      await writeFile(
        path.join(projectDirectory, "package.json"),
        JSON.stringify({ name: "generated", scripts: { dev: "vite dev" } }),
        "utf8",
      );
      await writeFile(
        path.join(projectDirectory, "vite.config.ts"),
        "export default defineConfig({\n  plugins: [tanstackStart()],\n});\n",
        "utf8",
      );
    });

    await createProject(
      {
        name: "edge-app",
        directory: "edge-app",
        framework: "tanstack",
        packageManager: "bun",
        tailwind: false,
        auth: true,
        database: "d1",
      },
      {
        cwd,
        runner,
        requestInitialUser: async () => ({ email: "owner@example.com", password: "initial user password" }),
      },
    );

    const options = { cwd: projectDirectory };

    expect(runner).toHaveBeenCalledWith(
      "bun",
      expect.arrayContaining([
        "@puzzle-ui/fullstack@latest",
        "@puzzle-ui/storage-d1@latest",
      ]),
      options,
    );
    expect(runner).toHaveBeenCalledWith(
      "bun",
      ["add", "-D", "@cloudflare/vite-plugin@latest", "wrangler@latest"],
      options,
    );
    expect(runner).toHaveBeenCalledWith("bun", ["run", "fonts:download"], options);
    expect(runner).toHaveBeenCalledWith("bun", ["run", "cf-typegen"], options);
    expect(runner).toHaveBeenLastCalledWith(
      "node",
      ["scripts/create-initial-user.mjs"],
      { ...options, input: JSON.stringify({ email: "owner@example.com", password: "initial user password" }) },
    );
    expect(runner).not.toHaveBeenCalledWith(
      "bun",
      expect.arrayContaining(["nitro@latest"]),
      options,
    );

    const env = await readFile(path.join(projectDirectory, ".env"), "utf8");

    expect(env).not.toContain("initial user password");
    expect(env).not.toContain("owner@example.com");
    expect(await readFile(path.join(projectDirectory, "scripts/create-initial-user.mjs"), "utf8"))
      .not.toContain("initial user password");
    expect(env).toContain('D1_DATABASE_NAME="edge-app-db"');
    expect(
      await readFile(path.join(projectDirectory, "wrangler.jsonc"), "utf8"),
    ).toContain('"binding": "DB"');
  });

  it("adds Nitro to TanStack Start projects that run on Node.js", async () => {
    const projectDirectory = path.join(cwd, "node-app");

    const runner = vi.fn(async () => {
      // Stand in for the TanStack Start generator on its first call.
      if (existsSync(projectDirectory)) return;

      await mkdir(path.join(projectDirectory, "src/routes"), {
        recursive: true,
      });
      await writeFile(
        path.join(projectDirectory, "package.json"),
        JSON.stringify({ name: "generated", scripts: { build: "vite build" } }),
        "utf8",
      );
      await writeFile(
        path.join(projectDirectory, "vite.config.ts"),
        "export default defineConfig({\n  plugins: [tanstackStart(), viteReact()],\n});\n",
        "utf8",
      );
    });

    await createProject(
      {
        name: "node-app",
        directory: "node-app",
        framework: "tanstack",
        packageManager: "pnpm",
        tailwind: false,
        auth: true,
        database: "mongodb",
      },
      {
        cwd,
        runner,
        requestInitialUser: async () => ({ email: "owner@example.com", password: "initial user password" }),
      },
    );

    const options = { cwd: projectDirectory };
    const packageJson = JSON.parse(
      await readFile(path.join(projectDirectory, "package.json"), "utf8"),
    );

    expect(runner).toHaveBeenCalledWith(
      "pnpm",
      expect.arrayContaining(["mongodb@latest", "nitro@latest"]),
      options,
    );
    expect(runner).toHaveBeenCalledWith(
      "pnpm",
      ["run", "fonts:download"],
      options,
    );
    expect(runner).toHaveBeenCalledWith("pnpm", ["run", "db:setup"], options);
    expect(runner).toHaveBeenLastCalledWith(
      "node",
      ["scripts/create-initial-user.mjs"],
      { ...options, input: JSON.stringify({ email: "owner@example.com", password: "initial user password" }) },
    );
    expect(packageJson.scripts).toMatchObject({
      start: "node .output/server/index.mjs",
      "fonts:download":
        "puzzle-theme fonts download --config src/puzzle-fonts.json --subsets latin,latin-ext",
    });
    expect(
      await readFile(path.join(projectDirectory, "vite.config.ts"), "utf8"),
    ).toContain("nitro({ routeRules: createFontRouteRules() })");
  });

  it("does not overwrite an existing project", async () => {
    const runner = vi.fn();

    const existingDirectory = path.join(cwd, "existing-app");

    await mkdir(existingDirectory);

    await expect(
      createProject(
        {
          name: "existing-app",
          directory: "existing-app",
          framework: "react",
          packageManager: "bun",
          tailwind: true,
          auth: false,
        },
        {
          cwd,
          runner,
        },
      ),
    ).rejects.toThrow("already exists");

    expect(runner).not.toHaveBeenCalled();
  });

  it("cancels before scaffolding when initial user input is cancelled", async () => {
    const runner = vi.fn();

    await createProject({
      name: "cancelled-app",
      directory: "cancelled-app",
      framework: "tanstack",
      packageManager: "bun",
      tailwind: false,
      auth: true,
      database: "mongodb",
    }, { cwd, runner, requestInitialUser: async () => null });

    expect(runner).not.toHaveBeenCalled();
    expect(existsSync(path.join(cwd, "cancelled-app"))).toBe(false);
  });
});
