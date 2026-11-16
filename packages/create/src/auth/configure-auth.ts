import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { isFullStackFramework } from "../constants";
import { writeTemplates } from "../theme/configure-theme";

import type { AuthDatabase, Framework, PackageManager } from "../types";

import {
  getCloudflareScripts,
  getGitignoreEntries,
  getInfrastructureFiles,
  type InfrastructureOptions,
} from "./infrastructure";
import { getAuthTemplates } from "./templates";

export type ConfigureAuthOptions = {
  framework: Framework;
  database?: AuthDatabase;
  projectName: string;
  packageManager: PackageManager;
};

const readIfExists = async (filePath: string) => {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
};

const updateGitignore = async (directory: string, entries: string[]) => {
  const gitignorePath = path.join(directory, ".gitignore");
  const current = (await readIfExists(gitignorePath)) ?? "";
  const lines = current.split(/\r?\n/).map((line) => line.trim());

  // Trailing-wildcard patterns such as `.env*` already cover `.env`.
  const isIgnored = (entry: string) =>
    lines.some(
      (line) =>
        line === entry ||
        (line.endsWith("*") && entry.startsWith(line.slice(0, -1))),
    );

  const missing = entries.filter((entry) => !isIgnored(entry));

  if (missing.length === 0) {
    return;
  }

  const prefix = current && !current.endsWith("\n") ? "\n" : "";

  await writeFile(
    gitignorePath,
    `${current}${prefix}\n# Puzzle Auth\n${missing.join("\n")}\n`,
    "utf8",
  );
};

const updateCloudflareScripts = async (options: InfrastructureOptions & { directory: string }) => {
  const packageJsonPath = path.join(options.directory, "package.json");

  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
    scripts?: Record<string, string>;
    [key: string]: unknown;
  };

  const scripts = { ...packageJson.scripts, ...getCloudflareScripts(options) };

  // react-router-serve runs the Node.js build, which a Worker build replaces.
  if (options.framework === "react-router") {
    delete scripts.start;
  }

  packageJson.scripts = scripts;

  await writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );
};

const configureAuth = async (
  directory: string,
  options: ConfigureAuthOptions,
): Promise<void> => {
  const { framework, projectName, packageManager } = options;

  if (!isFullStackFramework(framework)) {
    await writeTemplates(directory, getAuthTemplates({ framework }));
    return;
  }

  const database = options.database ?? "custom";
  const infrastructure: InfrastructureOptions = {
    framework,
    database,
    projectName,
    packageManager,
  };

  await writeTemplates(directory, {
    ...getAuthTemplates({ framework, database }),
    ...getInfrastructureFiles(infrastructure),
  });

  await updateGitignore(directory, getGitignoreEntries(infrastructure));

  if (database === "d1") {
    await updateCloudflareScripts({ ...infrastructure, directory });
  }
};

export { configureAuth };
