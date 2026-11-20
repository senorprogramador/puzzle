import { randomUUID } from "node:crypto";
import {
  lstat,
  mkdir,
  readFile,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  AiAgent,
  AiProjectManifest,
  GeneratedFileRecord,
  LoadedInstructionPackage,
} from "./types";
import { instructionContentHash } from "./package-resolver";

const START_MARKER = "<!-- PUZZLE AI INSTRUCTIONS START -->";
const END_MARKER = "<!-- PUZZLE AI INSTRUCTIONS END -->";
const MANIFEST_PATH = ".puzzle/ai/manifest.json";
const GENERATED_PATHS: Record<AiAgent, string> = {
  copilot: ".github/instructions/puzzle-ai.instructions.md",
  claude: ".claude/rules/puzzle-ai.md",
  cursor: ".cursor/rules/puzzle-ai.mdc",
  agents: "AGENTS.md",
};

type PlannedOperation = {
  path: string;
  content?: string;
  remove?: boolean;
  mode?: number;
};

type ManagedSection = {
  content: string;
  section: string;
  managedHash: string;
};

export type InstructionPlan = {
  manifest: AiProjectManifest;
  operations: PlannedOperation[];
  conflicts: string[];
  changes: string[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isMissingFileError = (error: unknown): boolean =>
  isRecord(error) && error.code === "ENOENT";

const generatedSection = (body: string): string =>
  `${START_MARKER}\n${body.trim()}\n${END_MARKER}`;

const extractManagedSection = (content: string, filePath: string): ManagedSection | undefined => {
  const start = content.indexOf(START_MARKER);
  const end = content.indexOf(END_MARKER);
  if (start === -1 && end === -1) {
    return undefined;
  }
  if (start === -1 || end === -1 || end < start || content.indexOf(START_MARKER, start + 1) !== -1 || content.indexOf(END_MARKER, end + 1) !== -1) {
    throw new Error(`Managed instruction markers are malformed in ${filePath}.`);
  }

  const sectionEnd = end + END_MARKER.length;
  const section = content.slice(start, sectionEnd);
  const bodyStart = start + START_MARKER.length;
  const bodyEnd = end;
  return {
    content,
    section,
    managedHash: instructionContentHash(content.slice(bodyStart, bodyEnd).trim()),
  };
};

const joinExistingAndManaged = (
  existing: string | undefined,
  section: string,
): string => {
  if (existing === undefined || existing.length === 0) {
    return `${section}\n`;
  }
  const separator = existing.endsWith("\n") ? "\n" : "\n\n";
  return `${existing}${separator}${section}\n`;
};

const replaceManagedSection = (
  existing: string,
  section: string,
  previous: GeneratedFileRecord,
  filePath: string,
): { content: string; managedHash: string } => {
  const current = extractManagedSection(existing, filePath);
  if (!current) {
    throw new Error(`The managed instruction section is missing from ${filePath}.`);
  }

  const expectedManagedHash = instructionContentHash(
    section.slice(START_MARKER.length, section.length - END_MARKER.length).trim(),
  );
  if (
    current.managedHash !== previous.managedHash &&
    current.managedHash !== expectedManagedHash
  ) {
    throw new Error(
      `The managed instruction section in ${filePath} was edited manually.`,
    );
  }

  const start = existing.indexOf(START_MARKER);
  const end = existing.indexOf(END_MARKER) + END_MARKER.length;
  const content = `${existing.slice(0, start)}${section}${existing.slice(end)}`;
  return { content, managedHash: expectedManagedHash };
};

const appendManagedSection = (
  existing: string | undefined,
  section: string,
  previous: GeneratedFileRecord | undefined,
  filePath: string,
): { content: string; managedHash: string } => {
  const expectedManagedHash = instructionContentHash(
    section.slice(START_MARKER.length, section.length - END_MARKER.length).trim(),
  );

  if (existing !== undefined) {
    const managed = extractManagedSection(existing, filePath);
    if (managed) {
      if (!previous) {
        throw new Error(
          `The Puzzle-managed markers in ${filePath} are not tracked by the local manifest.`,
        );
      }
      return replaceManagedSection(existing, section, previous, filePath);
    }
    if (previous) {
      throw new Error(`The managed instruction section is missing from ${filePath}.`);
    }
  }

  return {
    content: joinExistingAndManaged(existing, section),
    managedHash: expectedManagedHash,
  };
};

const parseProjectManifest = (value: unknown, manifestPath: string): AiProjectManifest => {
  if (!isRecord(value) || value.schemaVersion !== 1) {
    throw new Error(`Invalid Puzzle AI manifest at ${manifestPath}.`);
  }
  if (typeof value.generatorVersion !== "string" || !Array.isArray(value.packages)) {
    throw new Error(`Invalid Puzzle AI manifest fields at ${manifestPath}.`);
  }
  if (
    !Array.isArray(value.agents) ||
    !value.agents.every((agent) => ["copilot", "claude", "cursor", "agents"].includes(String(agent)))
  ) {
    throw new Error(`Invalid agent selection in ${manifestPath}.`);
  }
  if (!isRecord(value.generatedFiles)) {
    throw new Error(`Invalid generatedFiles in ${manifestPath}.`);
  }

  const generatedFiles: Record<string, GeneratedFileRecord> = {};
  for (const [filePath, fileRecord] of Object.entries(value.generatedFiles)) {
    if (
      !Object.values(GENERATED_PATHS).includes(filePath) ||
      !isRecord(fileRecord) ||
      typeof fileRecord.fileHash !== "string" ||
      typeof fileRecord.managedHash !== "string"
    ) {
      throw new Error(`Invalid managed file entry in ${manifestPath}: ${filePath}`);
    }
    generatedFiles[filePath] = {
      fileHash: fileRecord.fileHash,
      managedHash: fileRecord.managedHash,
    };
  }

  if (
    !value.packages.every(
      (item) =>
        isRecord(item) &&
        typeof item.name === "string" &&
        typeof item.version === "string" &&
        Number.isInteger(item.instructionVersion) &&
        typeof item.contentHash === "string",
    )
  ) {
    throw new Error(`Invalid package records in ${manifestPath}.`);
  }

  return {
    schemaVersion: 1,
    generatorVersion: value.generatorVersion,
    packages: value.packages as AiProjectManifest["packages"],
    agents: value.agents as AiAgent[],
    generatedFiles,
  };
};

export const readProjectManifest = async (
  projectRoot: string,
): Promise<AiProjectManifest | undefined> => {
  const { target: manifestPath, existing: contents } = await assertSafeOutputPath(
    projectRoot,
    MANIFEST_PATH,
  );
  if (contents === undefined) {
    return undefined;
  }

  let value: unknown;
  try {
    value = JSON.parse(contents) as unknown;
  } catch (error) {
    throw new Error(
      `Invalid JSON in ${manifestPath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return parseProjectManifest(value, manifestPath);
};

const assertSafeOutputPath = async (
  projectRoot: string,
  relativePath: string,
): Promise<{ target: string; existing?: string; mode?: number }> => {
  if (
    path.isAbsolute(relativePath) ||
    relativePath.split(/[\\/]/).some((part) => part === ".." || part === "")
  ) {
    throw new Error(`Unsafe generated file path: ${relativePath}`);
  }

  const root = await realpath(projectRoot);
  const target = path.resolve(root, relativePath);
  const relative = path.relative(root, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Generated file path escapes the project: ${relativePath}`);
  }

  const parts = relative.split(path.sep);
  let current = root;
  for (const part of parts.slice(0, -1)) {
    current = path.join(current, part);
    try {
      const currentStat = await lstat(current);
      if (currentStat.isSymbolicLink() || !currentStat.isDirectory()) {
        throw new Error(`Generated path contains an unsafe directory: ${current}`);
      }
    } catch (error) {
      if (isMissingFileError(error)) {
        break;
      }
      throw error;
    }
  }

  try {
    const targetStat = await lstat(target);
    if (targetStat.isSymbolicLink() || !targetStat.isFile()) {
      throw new Error(`Refusing to replace non-regular file: ${target}`);
    }
    const existing = await readFile(target, "utf8");
    return { target, existing, mode: targetStat.mode & 0o777 };
  } catch (error) {
    if (isMissingFileError(error)) {
      return { target };
    }
    throw error;
  }
};

const buildAgentOutput = (
  agent: AiAgent,
  section: string,
): string => {
  if (agent === "copilot") {
    return [
      "---",
      'applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx,**/*.css,**/*.mdx"',
      "---",
      "",
      section,
      "",
    ].join("\n");
  }
  if (agent === "claude") {
    return [
      "---",
      "paths:",
      '  - "**/*.ts"',
      '  - "**/*.tsx"',
      '  - "**/*.js"',
      '  - "**/*.jsx"',
      '  - "**/*.css"',
      '  - "**/*.mdx"',
      "---",
      "",
      section,
      "",
    ].join("\n");
  }
  if (agent === "cursor") {
    return [
      "---",
      "description: Puzzle package usage guidance",
      'globs: "**/*.ts, **/*.tsx, **/*.js, **/*.jsx, **/*.css, **/*.mdx"',
      "alwaysApply: false",
      "---",
      "",
      section,
      "",
    ].join("\n");
  }
  return `${section}\n`;
};

const readGeneratorVersion = async (): Promise<string> => {
  const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(moduleDirectory, "../package.json"),
    path.resolve(moduleDirectory, "../../package.json"),
  ];
  for (const candidate of candidates) {
    try {
      const value = JSON.parse(await readFile(candidate, "utf8")) as unknown;
      if (isRecord(value) && typeof value.version === "string") {
        return value.version;
      }
    } catch (error) {
      if (!isMissingFileError(error)) {
        throw error;
      }
    }
  }
  throw new Error("Unable to read the @puzzle-ui/create version.");
};

const readTextIfExists = async (target: string): Promise<string | undefined> => {
  try {
    return await readFile(target, "utf8");
  } catch (error) {
    if (isMissingFileError(error)) {
      return undefined;
    }
    throw error;
  }
};

const makeExpectedInstructionSection = (
  sharedInstructions: string,
  packages: LoadedInstructionPackage[],
): string => {
  const duplicateMarkers = [START_MARKER, END_MARKER].some((marker) =>
    packages.some((item) => item.content.includes(marker)),
  );
  if (duplicateMarkers) {
    throw new Error("A package instruction contains a reserved managed-section marker.");
  }

  const uniqueContents = new Set<string>();
  const packageSections = packages
    .filter((item) => {
      const key = `${item.name}@${item.version}:${item.contentHash}`;
      if (uniqueContents.has(key)) {
        return false;
      }
      uniqueContents.add(key);
      return true;
    })
    .map(
      (item) =>
        `## ${item.name}@${item.version}\n\n${item.content.trim()}\n\nDocumentation: ${item.documentationUrl}`,
    );
  const body = [
    "# Puzzle package guidance",
    "Use the following package-specific guidance only when working with that installed package.",
    "## Shared guidance",
    sharedInstructions.trim(),
    ...packageSections,
  ].join("\n\n");
  return generatedSection(body);
};

const safeRemoveManagedSection = (
  existing: string,
  previous: GeneratedFileRecord,
  filePath: string,
): { content: string; removeFile: boolean } => {
  const managed = extractManagedSection(existing, filePath);
  if (!managed || managed.managedHash !== previous.managedHash) {
    throw new Error(
      `The managed instruction section in ${filePath} was removed or edited manually.`,
    );
  }
  const start = existing.indexOf(START_MARKER);
  const end = existing.indexOf(END_MARKER) + END_MARKER.length;
  const before = existing.slice(0, start);
  const after = existing.slice(end);
  const remaining = `${before}${after}`.trim();
  return {
    content: remaining.length > 0 ? `${remaining}\n` : "",
    removeFile: remaining.length === 0,
  };
};

export const createInstructionPlan = async ({
  projectRoot,
  packages,
  agents,
  sharedInstructions,
  previousManifest,
}: {
  projectRoot: string;
  packages: LoadedInstructionPackage[];
  agents: AiAgent[];
  sharedInstructions: string;
  previousManifest?: AiProjectManifest;
}): Promise<InstructionPlan> => {
  const root = await realpath(projectRoot);
  const section = makeExpectedInstructionSection(sharedInstructions, packages);
  const conflicts: string[] = [];
  const changes: string[] = [];
  const operations: PlannedOperation[] = [];
  const generatedFiles: Record<string, GeneratedFileRecord> = {};
  const desiredPaths = new Set(agents.map((agent) => GENERATED_PATHS[agent]));

  for (const agent of agents) {
    const relativePath = GENERATED_PATHS[agent];
    let existing: string | undefined;
    let mode: number | undefined;
    try {
      ({ existing, mode } = await assertSafeOutputPath(root, relativePath));
    } catch (error) {
      conflicts.push(error instanceof Error ? error.message : String(error));
      continue;
    }

    const previous = previousManifest?.generatedFiles[relativePath];
    const rendered = buildAgentOutput(agent, section);
    let nextContent: string;
    let managedHash: string;
    try {
      if (agent === "agents") {
        const merged = appendManagedSection(existing, section, previous, relativePath);
        nextContent = merged.content;
        managedHash = merged.managedHash;
      } else if (existing === undefined) {
        if (previous) {
          nextContent = rendered;
          managedHash = instructionContentHash(
            section.slice(START_MARKER.length, section.length - END_MARKER.length).trim(),
          );
        } else {
          nextContent = rendered;
          managedHash = instructionContentHash(
            section.slice(START_MARKER.length, section.length - END_MARKER.length).trim(),
          );
        }
      } else {
        const managed = extractManagedSection(existing, relativePath);
        if (!managed) {
          throw new Error(
            `${relativePath} already exists and is not Puzzle-managed. Move it or choose another agent output path; the file was left unchanged.`,
          );
        }
        if (!previous) {
          throw new Error(
            `Puzzle markers in ${relativePath} are not tracked by the local manifest.`,
          );
        }
        const replaced = replaceManagedSection(existing, section, previous, relativePath);
        const frontmatter = existing.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/)?.[0] ?? "";
        const expectedFrontmatter = rendered.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/)?.[0] ?? "";
        if (frontmatter !== expectedFrontmatter) {
          throw new Error(
            `Agent frontmatter in ${relativePath} was edited manually; the file was left unchanged.`,
          );
        }
        nextContent = replaced.content;
        managedHash = replaced.managedHash;
      }
    } catch (error) {
      conflicts.push(error instanceof Error ? error.message : String(error));
      continue;
    }

    const fileHash = instructionContentHash(nextContent);
    generatedFiles[relativePath] = { fileHash, managedHash };
    if (nextContent !== existing) {
      operations.push({ path: relativePath, content: nextContent, mode });
      changes.push(`${existing === undefined ? "Create" : "Update"} ${relativePath}`);
    }
  }

  for (const [relativePath, previous] of Object.entries(
    previousManifest?.generatedFiles ?? {},
  )) {
    if (desiredPaths.has(relativePath)) {
      continue;
    }
    let existing: string | undefined;
    let mode: number | undefined;
    try {
      ({ existing, mode } = await assertSafeOutputPath(root, relativePath));
    } catch (error) {
      conflicts.push(error instanceof Error ? error.message : String(error));
      continue;
    }
    if (existing === undefined) {
      changes.push(`Forget missing ${relativePath}`);
      continue;
    }
    try {
      const managed = safeRemoveManagedSection(existing, previous, relativePath);
      operations.push(
        managed.removeFile
          ? { path: relativePath, remove: true }
          : { path: relativePath, content: managed.content, mode },
      );
      changes.push(`${managed.removeFile ? "Remove" : "Update"} ${relativePath}`);
    } catch (error) {
      conflicts.push(error instanceof Error ? error.message : String(error));
    }
  }

  const instructionPackages = packages.map((item) => ({
    name: item.name,
    version: item.version,
    instructionVersion: item.instructionVersion,
    contentHash: item.contentHash,
  }));
  const manifest: AiProjectManifest = {
    schemaVersion: 1,
    generatorVersion: await readGeneratorVersion(),
    packages: instructionPackages,
    agents: [...agents].sort(),
    generatedFiles,
  };

  const manifestPath = await assertSafeOutputPath(root, MANIFEST_PATH);
  if (manifestPath.existing !== undefined && !previousManifest) {
    conflicts.push(
      `${MANIFEST_PATH} already exists without a valid Puzzle AI manifest; it was left unchanged.`,
    );
  }
  if (!conflicts.length) {
    const manifestContent = `${JSON.stringify(manifest, null, 2)}\n`;
    if (manifestContent !== manifestPath.existing) {
      operations.push({
        path: MANIFEST_PATH,
        content: manifestContent,
        mode: manifestPath.mode,
      });
      changes.push(`Update ${MANIFEST_PATH}`);
    }
  }

  return { manifest, operations, conflicts, changes };
};

export const checkInstructionPlan = async (
  projectRoot: string,
  plan: InstructionPlan,
  previousManifest: AiProjectManifest | undefined,
): Promise<string[]> => {
  const errors = [...plan.conflicts];
  if (!previousManifest) {
    errors.push(`Missing ${MANIFEST_PATH}; run "create-puzzle ai init" first.`);
    return errors;
  }

  const expectedPackages = JSON.stringify(plan.manifest.packages);
  const actualPackages = JSON.stringify(previousManifest.packages);
  const sameManagedFiles = Object.keys(plan.manifest.generatedFiles).length ===
    Object.keys(previousManifest.generatedFiles).length &&
    Object.entries(plan.manifest.generatedFiles).every(
      ([filePath, expected]) =>
        previousManifest.generatedFiles[filePath]?.managedHash ===
        expected.managedHash,
    );
  if (
    expectedPackages !== actualPackages ||
    JSON.stringify(plan.manifest.agents) !== JSON.stringify(previousManifest.agents) ||
    !sameManagedFiles ||
    plan.manifest.generatorVersion !== previousManifest.generatorVersion
  ) {
    errors.push("Installed Puzzle packages or agent selection differ from the AI manifest.");
  }
  for (const [relativePath, record] of Object.entries(plan.manifest.generatedFiles)) {
    try {
      const { existing } = await assertSafeOutputPath(projectRoot, relativePath);
      if (existing === undefined) {
        errors.push(`Missing generated instruction file: ${relativePath}`);
        continue;
      }
      const managed = extractManagedSection(existing, relativePath);
      if (!managed || managed.managedHash !== record.managedHash) {
        errors.push(`Generated instruction content is stale or modified: ${relativePath}`);
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return errors;
};

const applyOperation = async (
  projectRoot: string,
  operation: PlannedOperation,
): Promise<{ content?: string; mode?: number; existed: boolean }> => {
  const { target, existing, mode } = await assertSafeOutputPath(
    projectRoot,
    operation.path,
  );
  if (operation.remove) {
    if (existing !== undefined) {
      await rm(target);
    }
    return { content: existing, mode, existed: existing !== undefined };
  }

  await mkdir(path.dirname(target), { recursive: true });
  const root = await realpath(projectRoot);
  const relative = path.relative(root, target);
  await assertSafeOutputPath(root, relative);
  const temporary = path.join(
    path.dirname(target),
    `.puzzle-ai-${randomUUID()}.tmp`,
  );
  await writeFile(temporary, operation.content ?? "", {
    encoding: "utf8",
    flag: "wx",
    mode: operation.mode ?? mode ?? 0o644,
  });
  try {
    await rename(temporary, target);
  } catch (error) {
    await rm(temporary, { force: true });
    throw error;
  }
  return { content: existing, mode, existed: existing !== undefined };
};

export const applyInstructionPlan = async (
  projectRoot: string,
  plan: InstructionPlan,
): Promise<void> => {
  if (plan.conflicts.length > 0) {
    throw new Error(plan.conflicts.join("\n"));
  }

  const completed: Array<{
    operation: PlannedOperation;
    previous: { content?: string; mode?: number; existed: boolean };
  }> = [];
  try {
    for (const operation of plan.operations) {
      const previous = await applyOperation(projectRoot, operation);
      completed.push({ operation, previous });
    }
  } catch (error) {
    const rollbackErrors: unknown[] = [];
    for (const { operation, previous } of completed.reverse()) {
      try {
        const { target } = await assertSafeOutputPath(projectRoot, operation.path);
        if (previous.existed && previous.content !== undefined) {
          await mkdir(path.dirname(target), { recursive: true });
          const temporary = path.join(
            path.dirname(target),
            `.puzzle-ai-rollback-${randomUUID()}.tmp`,
          );
          await writeFile(temporary, previous.content, {
            encoding: "utf8",
            flag: "wx",
            mode: previous.mode ?? 0o644,
          });
          await rename(temporary, target);
        } else {
          await rm(target, { force: true });
        }
      } catch (rollbackError) {
        rollbackErrors.push(rollbackError);
      }
    }
    if (rollbackErrors.length > 0) {
      throw new AggregateError(
        [error, ...rollbackErrors],
        "AI instruction update failed and rollback was incomplete.",
      );
    }
    throw error;
  }
};

export const managedSectionMarkers = {
  start: START_MARKER,
  end: END_MARKER,
};
