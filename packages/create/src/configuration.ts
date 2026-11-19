import { readFile } from "node:fs/promises";
import path from "node:path";

import { AUTH_DATABASES, FRAMEWORKS, isFullStackFramework } from "./constants";
import { detectPackageManager } from "./utils/detect-package-manager";
import { toKebabCase } from "./utils/kebab-case";

import type {
  AuthDatabase,
  PackageManager,
  ProjectConfiguration,
  ProjectOptions,
} from "./types";

const stylingOptions = new Set(["tailwind", "none"]);
const packageManagers = new Set<PackageManager>(["bun", "npm", "pnpm", "yarn"]);
const frameworks = new Set(FRAMEWORKS.map(({ value }) => value));
const databases = new Set(AUTH_DATABASES.map(({ value }) => value));
const configurationKeys = new Set([
  "projectName",
  "framework",
  "styling",
  "auth",
  "database",
  "packageManager",
]);

const invalid = (message: string): never => {
  throw new Error(`Invalid Puzzle Create configuration: ${message}`);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const validateProjectConfiguration = (
  value: unknown,
): ProjectConfiguration => {
  if (!isRecord(value)) {
    return invalid("expected a JSON object.");
  }

  const unexpected = Object.keys(value).filter(
    (key) => !configurationKeys.has(key),
  );
  if (unexpected.length) {
    return invalid(
      `unsupported field "${unexpected[0]}". See config.schema.json for allowed fields.`,
    );
  }

  if (
    typeof value.projectName !== "string" ||
    value.projectName.trim().length === 0 ||
    value.projectName.trim().length > 120
  ) {
    return invalid('"projectName" must be a non-empty string of at most 120 characters.');
  }

  const projectName = value.projectName.trim();
  if (!toKebabCase(projectName)) {
    return invalid('"projectName" must contain at least one letter or number.');
  }

  if (
    typeof value.framework !== "string" ||
    !frameworks.has(value.framework as ProjectConfiguration["framework"])
  ) {
    return invalid(
      `"framework" must be one of: ${FRAMEWORKS.map(({ value: framework }) => framework).join(", ")}.`,
    );
  }

  if (typeof value.styling !== "string" || !stylingOptions.has(value.styling)) {
    return invalid('"styling" must be "tailwind" or "none".');
  }

  if (typeof value.auth !== "boolean") {
    return invalid('"auth" must be true or false.');
  }

  if (
    value.packageManager !== undefined &&
    (typeof value.packageManager !== "string" ||
      !packageManagers.has(value.packageManager as PackageManager))
  ) {
    return invalid('"packageManager" must be bun, npm, pnpm, or yarn.');
  }

  if (
    value.database !== undefined &&
    (typeof value.database !== "string" ||
      !databases.has(value.database as AuthDatabase))
  ) {
    return invalid('"database" must be mongodb, d1, or custom.');
  }

  const framework = value.framework as ProjectConfiguration["framework"];
  const database = value.database as AuthDatabase | undefined;

  if (value.auth && isFullStackFramework(framework) && !database) {
    return invalid(
      '"database" is required when Auth is enabled for a full-stack ' +
        "framework. Choose mongodb, d1, or custom.",
    );
  }

  if (database && (!value.auth || !isFullStackFramework(framework))) {
    return invalid(
      '"database" is supported only when Auth is enabled for Next.js, ' +
        "TanStack Start, or React Router.",
    );
  }

  return {
    projectName,
    framework,
    styling: value.styling as ProjectConfiguration["styling"],
    auth: value.auth,
    ...(database ? { database } : {}),
    ...(value.packageManager
      ? { packageManager: value.packageManager as PackageManager }
      : {}),
  };
};

export const toProjectOptions = (
  configuration: ProjectConfiguration,
  detectedPackageManager = detectPackageManager(),
): ProjectOptions => {
  const name = toKebabCase(configuration.projectName);

  return {
    name,
    directory: name,
    framework: configuration.framework,
    packageManager: configuration.packageManager ?? detectedPackageManager,
    tailwind: configuration.styling === "tailwind",
    auth: configuration.auth,
    ...(configuration.database
      ? { database: configuration.database }
      : {}),
  };
};

export const requiresInitialUser = (configuration: ProjectConfiguration) =>
  configuration.auth &&
  isFullStackFramework(configuration.framework) &&
  (configuration.database === "mongodb" || configuration.database === "d1");

export const loadProjectConfiguration = async (
  configPath: string,
  cwd = process.cwd(),
): Promise<ProjectConfiguration> => {
  const absoluteConfigPath = path.resolve(cwd, configPath);
  let contents: string;

  try {
    contents = await readFile(absoluteConfigPath, "utf8");
  } catch (error) {
    throw new Error(
      `Could not read configuration file "${configPath}". ` +
        "Check that the path exists and is readable.",
      { cause: error },
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(contents);
  } catch {
    throw new Error(
      `Configuration file "${configPath}" must contain valid JSON.`,
    );
  }

  return validateProjectConfiguration(parsed);
};
