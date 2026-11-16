import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { CommandRunner } from "../src/types";
import type { Scaffold } from "./matrix";
import { run, startServer, type Server } from "./process";

const readJson = async <T>(file: string) =>
  JSON.parse(await readFile(file, "utf8")) as T;

/**
 * Runs the CLI's commands with captured output. Puzzle packages are installed
 * from the local tarballs, and `overrides` makes their Puzzle dependencies
 * resolve to the same tarballs.
 */
export const createLocalPackageRunner =
  (puzzlePackages: Record<string, string>): CommandRunner =>
  async (command, args, options = {}) => {
    const cwd = options.cwd ?? process.cwd();
    const installsPuzzle =
      command === "bun" &&
      args[0] === "add" &&
      args.some((arg) => arg.startsWith("@puzzle-ui/"));

    if (!installsPuzzle) {
      await run(command, args, { cwd, input: options.input });
      return;
    }

    const packageJsonPath = path.join(cwd, "package.json");
    const packageJson =
      await readJson<Record<string, unknown>>(packageJsonPath);

    packageJson.overrides = {
      ...(packageJson.overrides as Record<string, string> | undefined),
      ...Object.fromEntries(
        Object.entries(puzzlePackages).map(([name, tarball]) => [
          name,
          `file:${tarball}`,
        ]),
      ),
    };

    await writeFile(
      packageJsonPath,
      `${JSON.stringify(packageJson, null, 2)}\n`,
    );

    const localArgs = args.map((arg) => {
      const name = arg.replace(/@latest$/, "");

      return puzzlePackages[name]
        ? `${name}@file:${puzzlePackages[name]}`
        : arg;
    });

    await run(command, localArgs, { cwd });
  };

const bin = (directory: string, name: string) =>
  path.join(directory, "node_modules", ".bin", name);

export const startDevProject = (
  directory: string,
  port: number,
): Promise<Server> =>
  startServer("bun", ["run", "dev", "--port", String(port)], {
    cwd: directory,
    port,
  });

/**
 * Builds the project the way its package.json does, then typechecks it.
 * Next.js D1 projects are also built for Cloudflare Workers with OpenNext.
 */
export const buildProject = async (directory: string, scaffold: Scaffold) => {
  await run("bun", ["run", "build"], { cwd: directory });

  switch (scaffold.framework) {
    case "next":
    case "tanstack":
      await run(bin(directory, "tsc"), ["--noEmit"], { cwd: directory });
      break;
    case "react-router":
      await run("bun", ["run", "typecheck"], { cwd: directory });
      break;
    case "react":
      // The build script already typechecks with tsconfig.app.json.
      await run(
        bin(directory, "tsc"),
        ["--noEmit", "-p", "tsconfig.node.json"],
        {
          cwd: directory,
        },
      );
      break;
  }

  if (scaffold.framework === "next" && scaffold.database === "d1") {
    await run(bin(directory, "opennextjs-cloudflare"), ["build"], {
      cwd: directory,
    });
  }
};

/**
 * Serves the production build: Node.js servers for Node.js targets, and the
 * local Workers runtime for D1 projects.
 */
export const startProject = (
  directory: string,
  scaffold: Scaffold,
  port: number,
): Promise<Server> => {
  const options = { cwd: directory, port, env: { PORT: String(port) } };
  const d1 = scaffold.database === "d1";
  const vitePreview = () =>
    startServer(
      bin(directory, "vite"),
      ["preview", "--port", String(port), "--strictPort"],
      options,
    );

  switch (scaffold.framework) {
    case "next":
      return d1
        ? startServer(
            bin(directory, "opennextjs-cloudflare"),
            ["preview", "--port", String(port)],
            options,
          )
        : startServer(
            bin(directory, "next"),
            ["start", "--port", String(port)],
            {
              ...options,
              env: { ...options.env, NODE_ENV: "production" },
            },
          );
    case "tanstack":
      return d1
        ? vitePreview()
        : startServer("node", [".output/server/index.mjs"], options);
    case "react-router":
      return d1
        ? vitePreview()
        : startServer(
            bin(directory, "react-router-serve"),
            ["./build/server/index.js"],
            { ...options, env: { ...options.env, NODE_ENV: "production" } },
          );
    case "react":
      return vitePreview();
  }
};

/**
 * Publishes the generated MongoDB container on another host port, so suites
 * can run in parallel next to a MongoDB already using 27017.
 */
export const useMongoPort = async (directory: string, port: number) => {
  const composePath = path.join(directory, "docker-compose.yml");
  const environmentPath = path.join(directory, ".env");
  const compose = await readFile(composePath, "utf8");
  const environment = await readFile(environmentPath, "utf8");

  if (!compose.includes('"127.0.0.1:27017:27017"')) {
    throw new Error("docker-compose.yml no longer publishes 127.0.0.1:27017.");
  }

  await writeFile(
    composePath,
    compose.replace('"127.0.0.1:27017:27017"', `"127.0.0.1:${port}:27017"`),
  );
  await writeFile(
    environmentPath,
    environment.replace("@localhost:27017/", `@localhost:${port}/`),
  );
};

export const startMongo = async (directory: string) => {
  await run("bun", ["run", "db:setup"], { cwd: directory });
  await run("docker", ["compose", "up", "--detach", "--wait"], {
    cwd: directory,
  });
};

export const stopMongo = (directory: string) =>
  run("docker", ["compose", "down", "--volumes", "--remove-orphans"], {
    cwd: directory,
  });

/**
 * Parses the dotenv values the generated `.env` file uses: KEY="value".
 */
export const readEnvironment = async (directory: string) => {
  const content = await readFile(path.join(directory, ".env"), "utf8");

  return Object.fromEntries(
    [...content.matchAll(/^([A-Z0-9_]+)="([^"]*)"$/gm)].map(
      ([, key, value]) => [key!, value!],
    ),
  );
};
