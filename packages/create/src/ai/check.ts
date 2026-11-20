import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  instructionContentHash,
  loadPackageInstructions,
  validateInstructionManifest,
} from "./package-resolver";
import type { InstalledPackage } from "./types";

const execFileAsync = promisify(execFile);
const SECRET_OR_LOCAL_PATH_PATTERN =
  /(?:\/Users\/|\/home\/|[A-Za-z]:\\Users\\|BEGIN (?:RSA )?PRIVATE KEY|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})/i;
const GENERATED_INDEX_PATH = "docs/ai/integration/registry.json";

type PackageRecord = {
  directory: string;
  packageJsonPath: string;
  loaded: Awaited<ReturnType<typeof loadPackageInstructions>>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isMissingFileError = (error: unknown): boolean =>
  isRecord(error) && error.code === "ENOENT";

const findRepositoryRoot = async (): Promise<string> => {
  let current = path.dirname(fileURLToPath(import.meta.url));
  while (true) {
    try {
      const packageJson = JSON.parse(
        await readFile(path.join(current, "package.json"), "utf8"),
      ) as unknown;
      if (
        isRecord(packageJson) &&
        Array.isArray(packageJson.workspaces) &&
        await pathExists(path.join(current, "docs", "ai"))
      ) {
        return current;
      }
    } catch (error) {
      if (!isMissingFileError(error)) {
        throw error;
      }
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error("Unable to locate the Puzzle repository root.");
    }
    current = parent;
  }
};

const pathExists = async (target: string): Promise<boolean> => {
  try {
    await realpath(target);
    return true;
  } catch (error) {
    if (isMissingFileError(error)) {
      return false;
    }
    throw error;
  }
};

const readPackageRecords = async (repositoryRoot: string): Promise<PackageRecord[]> => {
  const packageRoot = path.join(repositoryRoot, "packages");
  const entries = await readdir(packageRoot, { withFileTypes: true });
  const records: PackageRecord[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const directory = path.join(packageRoot, entry.name);
    const packageJsonPath = path.join(directory, "package.json");
    let packageJson: Record<string, unknown>;
    try {
      packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as Record<
        string,
        unknown
      >;
    } catch (error) {
      if (isMissingFileError(error)) {
        continue;
      }
      throw error;
    }
    if (
      typeof packageJson.name !== "string" ||
      !packageJson.name.startsWith("@puzzle-ui/") ||
      packageJson.private === true
    ) {
      continue;
    }

    const files = Array.isArray(packageJson.files) ? packageJson.files : [];
    if (!files.includes("ai")) {
      throw new Error(
        `${packageJson.name} must include "ai" in its package.json files list.`,
      );
    }
    const instructionManifestPath = path.join(directory, "ai", "manifest.json");
    const manifestValue = JSON.parse(
      await readFile(instructionManifestPath, "utf8"),
    ) as unknown;
    validateInstructionManifest(
      manifestValue,
      instructionManifestPath,
      packageJson.name,
    );
    const installed: InstalledPackage = {
      name: packageJson.name,
      version: String(packageJson.version ?? ""),
      private: false,
      packageDirectory: directory,
      packageJsonPath,
    };
    if (!installed.version) {
      throw new Error(`Missing package version in ${packageJsonPath}.`);
    }
    const loaded = await loadPackageInstructions(installed);
    records.push({
      directory,
      packageJsonPath,
      loaded,
    });
  }

  const names = new Set(records.map(({ loaded }) => loaded.name));
  for (const { loaded } of records) {
    for (const dependency of loaded.dependencies) {
      if (!names.has(dependency)) {
        throw new Error(
          `${loaded.name} references missing instruction dependency ${dependency}.`,
        );
      }
    }
  }
  assertAcyclicDependencies(records);
  return records.sort((left, right) =>
    left.loaded.name.localeCompare(right.loaded.name),
  );
};

const assertAcyclicDependencies = (records: PackageRecord[]) => {
  const byName = new Map(
    records.map((record) => [record.loaded.name, record.loaded.dependencies]),
  );
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (name: string, stack: string[]) => {
    if (visiting.has(name)) {
      throw new Error(
        `Circular AI instruction dependency: ${[...stack, name].join(" -> ")}.`,
      );
    }
    if (visited.has(name)) {
      return;
    }
    visiting.add(name);
    for (const dependency of byName.get(name) ?? []) {
      visit(dependency, [...stack, name]);
    }
    visiting.delete(name);
    visited.add(name);
  };
  for (const name of byName.keys()) {
    visit(name, []);
  }
};

const extractCodeExamples = (content: string): string[] => {
  const examples: string[] = [];
  const pattern = /```(?:ts|tsx|typescript)\s*\r?\n([\s\S]*?)```/g;
  for (const match of content.matchAll(pattern)) {
    examples.push(match[1] ?? "");
  }
  return examples;
};

const findDeclarationTarget = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    return value.endsWith(".d.ts") || value.endsWith(".d.cts") || value.endsWith(".d.mts")
      ? value
      : undefined;
  }
  if (!isRecord(value)) {
    return undefined;
  }
  if (typeof value.types === "string") {
    return value.types;
  }
  for (const nested of Object.values(value)) {
    const target = findDeclarationTarget(nested);
    if (target) {
      return target;
    }
  }
  return undefined;
};

const validateExampleImports = async (
  repositoryRoot: string,
  records: PackageRecord[],
): Promise<void> => {
  const tempDirectory = await mkdtemp(
    path.join(repositoryRoot, ".puzzle-ai-example-check-"),
  );
  try {
    const sourceFiles: string[] = [];
    for (const [index, record] of records.entries()) {
      const examples = extractCodeExamples(record.loaded.content);
      if (examples.length === 0) {
        continue;
      }
      const source = examples.join("\n\n");
      const filePath = path.join(tempDirectory, `package-${index}.tsx`);
      await writeFile(filePath, source, "utf8");
      sourceFiles.push(filePath);
    }
    if (sourceFiles.length === 0) {
      return;
    }

    const paths: Record<string, string[]> = {};
    for (const record of records) {
      const packageJson = JSON.parse(
        await readFile(record.packageJsonPath, "utf8"),
      ) as Record<string, unknown>;
      const exportMap = isRecord(packageJson.exports)
        ? packageJson.exports
        : {};
      const exportEntries = Object.entries(exportMap);
      for (const [exportName, exportValue] of exportEntries) {
        const declaration = findDeclarationTarget(exportValue);
        if (!declaration) {
          continue;
        }
        const moduleName =
          exportName === "."
            ? record.loaded.name
            : `${record.loaded.name}/${exportName.slice(2)}`;
        paths[moduleName] = [
          path
            .relative(
              tempDirectory,
              path.resolve(record.directory, declaration),
            )
            .split(path.sep)
            .join("/"),
        ];
      }
      if (!paths[record.loaded.name] && typeof packageJson.types === "string") {
        paths[record.loaded.name] = [
          path
            .relative(
              tempDirectory,
              path.resolve(record.directory, packageJson.types),
            )
            .split(path.sep)
            .join("/"),
        ];
      }
    }

    const configPath = path.join(tempDirectory, "tsconfig.json");
    await writeFile(
      configPath,
      JSON.stringify(
        {
          compilerOptions: {
            strict: true,
            noEmit: true,
            skipLibCheck: true,
            target: "ES2022",
            module: "ESNext",
            moduleResolution: "Bundler",
            jsx: "react-jsx",
            paths,
          },
          files: sourceFiles.map((filePath) =>
            path.relative(tempDirectory, filePath).split(path.sep).join("/"),
          ),
        },
        null,
        2,
      ),
    );

    try {
      await execFileAsync(
        "bun",
        ["run", "tsc", "--project", configPath],
        {
          cwd: repositoryRoot,
          maxBuffer: 8 * 1024 * 1024,
          timeout: 120_000,
        },
      );
    } catch (error) {
      if (isRecord(error)) {
        const output = [error.stdout, error.stderr]
          .filter((item): item is string => typeof item === "string" && item.length > 0)
          .join("\n");
        if (output) {
          throw new Error(`AI code example typecheck failed:\n${output}`);
        }
      }
      throw error;
    }
  } finally {
    await rm(tempDirectory, { recursive: true, force: true });
  }
};

const validateInstructionContent = async (record: PackageRecord): Promise<void> => {
  const { content, name } = record.loaded;
  if (content.trim().length === 0) {
    throw new Error(`AI instructions are empty: ${name}.`);
  }
  if (SECRET_OR_LOCAL_PATH_PATTERN.test(content)) {
    throw new Error(`AI instructions contain a secret-like value or local path: ${name}.`);
  }
  if ((content.match(/```/g) ?? []).length % 2 !== 0) {
    throw new Error(`Unclosed Markdown code fence in AI instructions: ${name}.`);
  }
  if (
    content.includes("PUZZLE AI INSTRUCTIONS START") ||
    content.includes("PUZZLE AI INSTRUCTIONS END")
  ) {
    throw new Error(`Reserved managed marker occurs in AI instructions: ${name}.`);
  }

  const links = content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g);
  for (const link of links) {
    const rawTarget = link[1] ?? "";
    const target = rawTarget.split(/[?#]/, 1)[0] ?? "";
    if (!target.startsWith("https://") && !target.startsWith("./") && !target.startsWith("../")) {
      throw new Error(`Unsupported documentation link in ${name}: ${rawTarget}`);
    }
    if (rawTarget.startsWith("https://")) {
      try {
        new URL(rawTarget);
      } catch {
        throw new Error(`Invalid documentation URL in ${name}: ${rawTarget}`);
      }
    } else {
      try {
        await realpath(path.resolve(record.directory, "ai", target));
      } catch (error) {
        if (isMissingFileError(error)) {
          throw new Error(`Broken local documentation link in ${name}: ${rawTarget}`);
        }
        throw error;
      }
    }
  }
};

const buildRegistry = (records: PackageRecord[]) => ({
  schemaVersion: 1,
  packages: records.map(({ loaded }) => ({
    name: loaded.name,
    version: loaded.version,
    instructionVersion: loaded.instructionVersion,
    files: [
      "ai/manifest.json",
      "ai/instructions.md",
      ...(loaded.name === "@puzzle-ui/create" ? ["ai/shared.md"] : []),
    ],
    instructionDependencies: loaded.dependencies,
    documentationUrl: loaded.documentationUrl,
    contentHash: loaded.contentHash,
  })),
});

const readRegistry = async (registryPath: string): Promise<unknown | undefined> => {
  try {
    return JSON.parse(await readFile(registryPath, "utf8")) as unknown;
  } catch (error) {
    if (isMissingFileError(error)) {
      return undefined;
    }
    throw error;
  }
};

const validateTarballs = async (records: PackageRecord[]): Promise<void> => {
  const tempDirectory = await mkdtemp(
    path.join(os.tmpdir(), "puzzle-ai-tarballs-"),
  );
  try {
    const tarballs = new Map<string, string>();
    for (const record of records) {
      const result = await execFileAsync(
        "npm",
        [
          "pack",
          "--ignore-scripts",
          "--json",
          "--pack-destination",
          tempDirectory,
        ],
        {
          cwd: record.directory,
          maxBuffer: 8 * 1024 * 1024,
          timeout: 120_000,
        },
      );
      const packed = JSON.parse(result.stdout) as Array<{
        filename: string;
        files: Array<{ path: string }>;
      }>;
      const tarballPath = path.join(tempDirectory, packed[0]!.filename);
      const packedFiles = new Set(packed[0]!.files.map(({ path: file }) => file));
      for (const file of packedFiles) {
        if (
          path.isAbsolute(file) ||
          file.split(/[\\/]/).some((part) => part === ".." || part === "")
        ) {
          throw new Error(
            `${record.loaded.name} tarball has an unsafe path: ${file}`,
          );
        }
      }
      tarballs.set(record.loaded.name, tarballPath);
      for (const requiredFile of ["ai/manifest.json", "ai/instructions.md"]) {
        if (!packedFiles.has(requiredFile)) {
          throw new Error(
            `${record.loaded.name} tarball is missing ${requiredFile}.`,
          );
        }
      }
      if (record.loaded.name === "@puzzle-ui/create" && !packedFiles.has("ai/shared.md")) {
        throw new Error("@puzzle-ui/create tarball is missing ai/shared.md.");
      }
      const developmentFiles = [...packedFiles].filter(
        (file) =>
          /(^|\/)AGENTS\.md$/.test(file) ||
          /(^|\/)\.github\/instructions\//.test(file) ||
          /(^|\/)src\//.test(file),
      );
      if (developmentFiles.length > 0) {
        throw new Error(
          `${record.loaded.name} tarball contains development files: ${developmentFiles.join(", ")}.`,
        );
      }

      const packedManifest = await execFileAsync(
        "tar",
        ["-xOf", tarballPath, "package/ai/manifest.json"],
        { maxBuffer: 1024 * 1024, timeout: 30_000 },
      );
      const packedInstructions = await execFileAsync(
        "tar",
        ["-xOf", tarballPath, "package/ai/instructions.md"],
        { maxBuffer: 1024 * 1024, timeout: 30_000 },
      );
      const sourceManifest = await readFile(
        path.join(record.directory, "ai", "manifest.json"),
        "utf8",
      );
      const sourceInstructions = await readFile(
        path.join(record.directory, "ai", "instructions.md"),
        "utf8",
      );
      if (
        JSON.stringify(JSON.parse(packedManifest.stdout)) !==
          JSON.stringify(JSON.parse(sourceManifest)) ||
        packedInstructions.stdout !== sourceInstructions
      ) {
        throw new Error(
          `${record.loaded.name} AI instructions differ between the source and npm tarball.`,
        );
      }
    }

      await validateInstalledTarballWorkflow(
      repositoryRootForRecords(records),
        records,
        tarballs,
        tempDirectory,
      );
  } finally {
    await rm(tempDirectory, { recursive: true, force: true });
  }
};

const repositoryRootForRecords = (records: PackageRecord[]): string => {
  const createPackage = records.find(
    (record) => record.loaded.name === "@puzzle-ui/create",
  );
  if (!createPackage) {
    throw new Error("The @puzzle-ui/create package is missing from the registry.");
  }
  return path.resolve(createPackage.directory, "../..");
};

const validateInstalledTarballWorkflow = async (
  repositoryRoot: string,
  records: PackageRecord[],
  tarballs: Map<string, string>,
  tempDirectory: string,
): Promise<void> => {
  const consumerRoot = path.join(tempDirectory, "consumer");
  const packageRoot = path.join(consumerRoot, "node_modules", "@puzzle-ui");
  await mkdir(packageRoot, { recursive: true });

  for (const packageName of [
    "@puzzle-ui/create",
    "@puzzle-ui/ui",
    "@puzzle-ui/theme",
    "@puzzle-ui/core",
  ]) {
    const tarballPath = tarballs.get(packageName);
    if (!tarballPath) {
      throw new Error(`Required local npm tarball is missing: ${packageName}.`);
    }
    const packageDirectory = path.join(packageRoot, packageName.slice("@puzzle-ui/".length));
    await mkdir(packageDirectory, { recursive: true });
    await execFileAsync(
      "tar",
      ["-xzf", tarballPath, "-C", packageDirectory, "--strip-components=1"],
      { maxBuffer: 8 * 1024 * 1024, timeout: 30_000 },
    );
  }

  const clackEntry = fileURLToPath(import.meta.resolve("@clack/prompts"));
  const clackSource = await realpath(path.resolve(path.dirname(clackEntry), ".."));
  const clackLink = path.join(consumerRoot, "node_modules", "@clack", "prompts");
  await mkdir(path.dirname(clackLink), { recursive: true });
  await symlink(
    clackSource,
    clackLink,
    process.platform === "win32" ? "junction" : "dir",
  );
  const packageVersions = new Map(
    records.map(({ loaded }) => [loaded.name, loaded.version]),
  );
  await writeFile(
    path.join(consumerRoot, "package.json"),
    JSON.stringify({
      name: "puzzle-ai-tarball-consumer",
      private: true,
      dependencies: {
        "@puzzle-ui/theme": packageVersions.get("@puzzle-ui/theme"),
        "@puzzle-ui/ui": packageVersions.get("@puzzle-ui/ui"),
      },
    }),
  );

  const createEntry = path.join(
    packageRoot,
    "create",
    "dist",
    "index.js",
  );
  const invoke = async (command: string[]) => {
    try {
      await execFileAsync("node", [createEntry, ...command], {
        cwd: consumerRoot,
        maxBuffer: 4 * 1024 * 1024,
        timeout: 30_000,
      });
    } catch (error) {
      if (isRecord(error)) {
        const output = [error.stdout, error.stderr]
          .filter((item): item is string => typeof item === "string" && item.length > 0)
          .join("\n");
        if (output) {
          throw new Error(`Tarball CLI scenario failed:\n${output}`);
        }
      }
      throw error;
    }
  };

  await invoke(["ai", "init", "--agents", "copilot,agents"]);
  const copilotFile = path.join(
    consumerRoot,
    ".github",
    "instructions",
    "puzzle-ai.instructions.md",
  );
  const agentsFile = path.join(consumerRoot, "AGENTS.md");
  const firstCopilot = await readFile(copilotFile, "utf8");
  if (
    !firstCopilot.includes(
      `@puzzle-ui/ui@${packageVersions.get("@puzzle-ui/ui")}`,
    ) ||
    !firstCopilot.includes(
      `@puzzle-ui/theme@${packageVersions.get("@puzzle-ui/theme")}`,
    )
  ) {
    throw new Error("Tarball CLI did not resolve all selected package instructions.");
  }
  const firstAgents = await readFile(agentsFile, "utf8");
  if (firstAgents.match(/PUZZLE AI INSTRUCTIONS START/g)?.length !== 1) {
    throw new Error("Tarball CLI did not create one managed AGENTS.md section.");
  }

  await invoke(["ai", "update", "--agents", "copilot,agents"]);
  if ((await readFile(copilotFile, "utf8")) !== firstCopilot) {
    throw new Error("Tarball CLI update is not idempotent.");
  }
  await writeFile(agentsFile, `${firstAgents}\nConsumer-owned note.\n`);
  await invoke(["ai", "update", "--agents", "copilot,agents"]);
  if (!(await readFile(agentsFile, "utf8")).includes("Consumer-owned note.")) {
    throw new Error("Tarball CLI update did not preserve user-owned AGENTS.md content.");
  }
  await invoke(["ai", "check"]);
};

const writeGeneratedRegistry = async (
  repositoryRoot: string,
  registry: ReturnType<typeof buildRegistry>,
  shouldWrite: boolean,
) => {
  const registryPath = path.join(repositoryRoot, GENERATED_INDEX_PATH);
  const expected = `${JSON.stringify(registry, null, 2)}\n`;
  if (shouldWrite) {
    await writeFile(registryPath, expected, "utf8");
    return;
  }
  const actual = await readRegistry(registryPath);
  if (JSON.stringify(actual) !== JSON.stringify(registry)) {
    throw new Error(
      `${GENERATED_INDEX_PATH} is stale. Run "bun packages/create/src/ai/check.ts --write-index".`,
    );
  }
}

export const runAiCheck = async (args = process.argv.slice(2)): Promise<void> => {
  const writeIndex = args.length === 1 && args[0] === "--write-index";
  if (args.length > 0 && !writeIndex) {
    throw new Error('Supported option: "--write-index".');
  }
  const repositoryRoot = await findRepositoryRoot();
  const records = await readPackageRecords(repositoryRoot);
  for (const record of records) {
    await validateInstructionContent(record);
    if (instructionContentHash(record.loaded.content) !== record.loaded.contentHash) {
      throw new Error(`Content hash mismatch for ${record.loaded.name}.`);
    }
  }
  await validateExampleImports(repositoryRoot, records);
  await validateTarballs(records);
  await writeGeneratedRegistry(
    repositoryRoot,
    buildRegistry(records),
    writeIndex,
  );
  console.log(
    `AI instructions valid: ${records.length} public package tarballs checked.`,
  );
};

if (import.meta.main) {
  runAiCheck().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
