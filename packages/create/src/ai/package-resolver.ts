import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  lstat,
  readFile,
  readdir,
  realpath,
} from "node:fs/promises";
import path from "node:path";

import type {
  InstructionManifest,
  InstalledPackage,
  LoadedInstructionPackage,
} from "./types";

const PACKAGE_NAME_PATTERN = /^@puzzle-ui\/[a-z0-9][a-z0-9-]*$/;
const MAX_PROJECT_DIRECTORIES = 20_000;
const MAX_INSTRUCTION_BYTES = 256_000;
const SKIPPED_DIRECTORY_NAMES = new Set([
  ".git",
  ".next",
  ".nuxt",
  ".turbo",
  ".vercel",
  ".yarn",
  ".pnpm",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
  "target",
  "vendor",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isMissingFileError = (error: unknown): boolean =>
  isRecord(error) && error.code === "ENOENT";

const sha256 = (value: string | Buffer): string =>
  createHash("sha256").update(value).digest("hex");

const isPathInside = (parent: string, candidate: string): boolean => {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
};

const readJsonFile = async (filePath: string): Promise<unknown> => {
  let contents: string;
  try {
    contents = await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingFileError(error)) {
      throw new Error(`Required file is missing: ${filePath}`);
    }
    throw error;
  }

  try {
    return JSON.parse(contents) as unknown;
  } catch (error) {
    throw new Error(
      `Invalid JSON in ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

const readPackageJson = async (filePath: string): Promise<Record<string, unknown>> => {
  const value = await readJsonFile(filePath);
  if (!isRecord(value) || typeof value.name !== "string") {
    throw new Error(`Package manifest must have a name: ${filePath}`);
  }
  return value;
};

const findProjectPackageManifests = async (
  projectRoot: string,
): Promise<string[]> => {
  const manifests: string[] = [];
  const pending = [projectRoot];
  let visitedDirectories = 0;

  while (pending.length > 0) {
    const directory = pending.pop()!;
    visitedDirectories += 1;
    if (visitedDirectories > MAX_PROJECT_DIRECTORIES) {
      throw new Error(
        `Project package discovery exceeded ${MAX_PROJECT_DIRECTORIES} directories. Run the command from a narrower project directory.`,
      );
    }

    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name === "package.json") {
        manifests.push(path.join(directory, entry.name));
        continue;
      }

      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        !SKIPPED_DIRECTORY_NAMES.has(entry.name)
      ) {
        pending.push(path.join(directory, entry.name));
      }
    }
  }

  return manifests.sort();
};

const dependencyNamesFrom = (value: unknown): string[] => {
  if (!isRecord(value)) {
    return [];
  }
  return Object.keys(value).filter((name) => PACKAGE_NAME_PATTERN.test(name));
};

const packageDependencies = (manifest: Record<string, unknown>): string[] =>
  [
    ...dependencyNamesFrom(manifest.dependencies),
    ...dependencyNamesFrom(manifest.devDependencies),
  ].filter((name, index, names) => names.indexOf(name) === index);

const readInstalledPackage = async (
  name: string,
  fromDirectory: string,
  projectRoot: string,
): Promise<InstalledPackage | undefined> => {
  if (!PACKAGE_NAME_PATTERN.test(name)) {
    throw new Error(`Unsupported Puzzle package name: ${name}`);
  }

  let current = path.resolve(fromDirectory);
  while (isPathInside(projectRoot, current)) {
    const candidateDirectory = path.join(current, "node_modules", ...name.split("/"));
    const packageJsonPath = path.join(candidateDirectory, "package.json");
    try {
      await lstat(packageJsonPath);
    } catch (error) {
      if (isMissingFileError(error)) {
        if (current === projectRoot) {
          return undefined;
        }
        current = path.dirname(current);
        continue;
      }
      throw error;
    }

    const manifest = await readPackageJson(packageJsonPath);
    if (manifest.name !== name) {
      throw new Error(
        `Installed package name mismatch at ${packageJsonPath}: expected "${name}", received "${String(manifest.name)}".`,
      );
    }
    if (typeof manifest.version !== "string") {
      throw new Error(`Installed package has no version: ${packageJsonPath}`);
    }

    return {
      name,
      version: manifest.version as string,
      private: manifest.private === true,
      packageDirectory: candidateDirectory,
      packageJsonPath,
    };
  }

  return undefined;
};

export const discoverInstalledPuzzlePackages = async (
  projectDirectory: string,
): Promise<InstalledPackage[]> => {
  const projectRoot = await realpath(path.resolve(projectDirectory));
  const packageJsonPaths = await findProjectPackageManifests(projectRoot);
  const packages = new Map<string, InstalledPackage>();

  for (const packageJsonPath of packageJsonPaths) {
    const projectManifest = await readPackageJson(packageJsonPath);
    const declaredNames = packageDependencies(projectManifest);
    for (const name of declaredNames) {
      const installed = await readInstalledPackage(
        name,
        path.dirname(packageJsonPath),
        projectRoot,
      );
      if (!installed) {
        throw new Error(
          `Puzzle package "${name}" is declared in ${packageJsonPath} but is not installed under this project. Install dependencies before generating instructions.`,
        );
      }
      if (!installed.private) {
        const key = `${installed.name}@${installed.version}:${installed.packageDirectory}`;
        packages.set(key, installed);
      }
    }
  }

  return [...packages.values()].sort(
    (left, right) =>
      left.name.localeCompare(right.name) ||
      left.version.localeCompare(right.version) ||
      left.packageDirectory.localeCompare(right.packageDirectory),
  );
};

const parseInstructionManifest = (
  value: unknown,
  manifestPath: string,
  expectedPackageName: string,
): InstructionManifest => {
  if (!isRecord(value)) {
    throw new Error(`AI instruction manifest must be an object: ${manifestPath}`);
  }
  if (value.schemaVersion !== 1) {
    throw new Error(`Unsupported AI instruction schema in ${manifestPath}.`);
  }
  if (value.packageName !== expectedPackageName) {
    throw new Error(`Package name mismatch in ${manifestPath}.`);
  }
  if (
    !Number.isInteger(value.instructionVersion) ||
    (value.instructionVersion as number) < 1
  ) {
    throw new Error(`Invalid instructionVersion in ${manifestPath}.`);
  }
  if (
    typeof value.contentFile !== "string" ||
    value.contentFile.length === 0 ||
    path.isAbsolute(value.contentFile) ||
    value.contentFile.split(/[\\/]/).some((part) => part === ".." || part === "")
  ) {
    throw new Error(`Unsafe contentFile in ${manifestPath}.`);
  }
  if (
    !Array.isArray(value.instructionDependencies) ||
    !value.instructionDependencies.every(
      (dependency) =>
        typeof dependency === "string" && PACKAGE_NAME_PATTERN.test(dependency),
    )
  ) {
    throw new Error(`Invalid instructionDependencies in ${manifestPath}.`);
  }
  const dependencies = value.instructionDependencies as string[];
  if (new Set(dependencies).size !== dependencies.length) {
    throw new Error(`Duplicate instruction dependency in ${manifestPath}.`);
  }
  if (
    typeof value.documentationUrl !== "string" ||
    !value.documentationUrl.startsWith("https://")
  ) {
    throw new Error(`Invalid documentationUrl in ${manifestPath}.`);
  }

  return {
    schemaVersion: 1,
    packageName: expectedPackageName,
    instructionVersion: value.instructionVersion as number,
    contentFile: value.contentFile,
    instructionDependencies: dependencies,
    documentationUrl: value.documentationUrl,
  };
};

export const loadPackageInstructions = async (
  installed: InstalledPackage,
): Promise<LoadedInstructionPackage> => {
  const packageDirectory = await realpath(installed.packageDirectory);
  const packageJson = await readPackageJson(
    path.join(packageDirectory, "package.json"),
  );
  if (packageJson.name !== installed.name || packageJson.version !== installed.version) {
    throw new Error(
      `Installed package changed during instruction discovery: ${installed.name}.`,
    );
  }

  const aiDirectory = await realpath(path.join(packageDirectory, "ai")).catch(
    (error: unknown) => {
      if (isMissingFileError(error)) {
        throw new Error(
          `Published package ${installed.name}@${installed.version} does not contain its required ai directory.`,
        );
      }
      throw error;
    },
  );
  if (!isPathInside(packageDirectory, aiDirectory)) {
    throw new Error(`AI instructions escape the installed package: ${installed.name}.`);
  }

  const manifestPath = path.join(aiDirectory, "manifest.json");
  const instructionManifest = parseInstructionManifest(
    await readJsonFile(manifestPath),
    manifestPath,
    installed.name,
  );
  const contentPath = path.resolve(aiDirectory, instructionManifest.contentFile);
  if (!isPathInside(aiDirectory, contentPath)) {
    throw new Error(`AI content path escapes its package: ${installed.name}.`);
  }
  const realContentPath = await realpath(contentPath);
  if (!isPathInside(aiDirectory, realContentPath)) {
    throw new Error(`AI content symlink escapes its package: ${installed.name}.`);
  }
  const contentBuffer = await readFile(realContentPath);
  if (contentBuffer.byteLength === 0 || contentBuffer.byteLength > MAX_INSTRUCTION_BYTES) {
    throw new Error(
      `AI instructions for ${installed.name} must be between 1 byte and ${MAX_INSTRUCTION_BYTES} bytes.`,
    );
  }
  const content = contentBuffer.toString("utf8");
  if (content.includes("\u0000")) {
    throw new Error(`AI instructions contain a null byte: ${installed.name}.`);
  }

  return {
    name: installed.name,
    version: installed.version,
    instructionVersion: instructionManifest.instructionVersion,
    content,
    contentHash: sha256(contentBuffer),
    dependencies: instructionManifest.instructionDependencies,
    documentationUrl: instructionManifest.documentationUrl,
    packageDirectory: installed.packageDirectory,
  };
};

export const resolveInstructionPackages = async (
  projectDirectory: string,
  selectedPackages?: string[],
): Promise<LoadedInstructionPackage[]> => {
  const projectRoot = await realpath(path.resolve(projectDirectory));
  const detectedPackages = await discoverInstalledPuzzlePackages(projectRoot);
  const selectedNames = selectedPackages
    ? new Set(selectedPackages)
    : undefined;
  if (selectedNames) {
    const unknownNames = [...selectedNames].filter(
      (name) => !detectedPackages.some((installed) => installed.name === name),
    );
    if (unknownNames.length > 0) {
      throw new Error(
        `Selected Puzzle package(s) are not installed as direct dependencies: ${unknownNames.join(", ")}.`,
      );
    }
  }

  const roots = selectedNames
    ? detectedPackages.filter((installed) => selectedNames.has(installed.name))
    : detectedPackages;
  if (roots.length === 0) {
    throw new Error(
      "No installed public @puzzle-ui packages were detected. Add a Puzzle package or select the correct project directory.",
    );
  }

  const resolved = new Map<string, LoadedInstructionPackage>();
  const visiting: string[] = [];

  const visit = async (
    installed: InstalledPackage,
  ): Promise<void> => {
    const loaded = await loadPackageInstructions(installed);
    const key = `${loaded.name}@${loaded.version}:${loaded.contentHash}`;
    if (visiting.includes(key)) {
      throw new Error(
        `Circular AI instruction dependency: ${[...visiting, key].join(" -> ")}.`,
      );
    }
    if (resolved.has(key)) {
      return;
    }

    visiting.push(key);
    for (const dependencyName of loaded.dependencies) {
      const dependency = await readInstalledPackage(
        dependencyName,
        loaded.packageDirectory,
        projectRoot,
      );
      if (!dependency || dependency.private) {
        throw new Error(
          `AI instructions for ${loaded.name} require installed public package ${dependencyName}.`,
        );
      }
      await visit(dependency);
    }
    visiting.pop();
    resolved.set(key, loaded);
  };

  for (const installed of roots) {
    await visit(installed);
  }

  return [...resolved.values()].sort(
    (left, right) =>
      left.name.localeCompare(right.name) ||
      left.version.localeCompare(right.version) ||
      left.contentHash.localeCompare(right.contentHash),
  );
};

export const readSharedInstructions = async (): Promise<string> => {
  const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(moduleDirectory, "../ai/shared.md"),
    path.resolve(moduleDirectory, "../../ai/shared.md"),
  ];

  for (const candidate of candidates) {
    try {
      const realFile = await realpath(candidate);
      const content = await readFile(realFile, "utf8");
      if (content.trim().length > 0) {
        return content.trim();
      }
    } catch (error) {
      if (!isMissingFileError(error)) {
        throw error;
      }
    }
  }

  throw new Error(
    "Shared Puzzle AI guidance is missing from the @puzzle-ui/create package.",
  );
};

export const instructionContentHash = sha256;
export const isSafePackageName = (value: string): boolean =>
  PACKAGE_NAME_PATTERN.test(value);
export const validateInstructionManifest = parseInstructionManifest;
