import * as p from "@clack/prompts";
import { access, realpath } from "node:fs/promises";
import path from "node:path";

import type {
  AiAgent,
  AiCliOptions,
  AiCommand,
} from "./types";
import { AI_AGENTS } from "./types";
import {
  applyInstructionPlan,
  checkInstructionPlan,
  createInstructionPlan,
  readProjectManifest,
} from "./file-manager";
import {
  readSharedInstructions,
  resolveInstructionPackages,
} from "./package-resolver";

type ParsedAiArguments = {
  command: AiCommand;
  agents?: AiAgent[];
  packages?: string[];
  dryRun: boolean;
  yes: boolean;
  nonInteractive: boolean;
  cwd?: string;
};

const usage = `Usage:
  create-puzzle ai init [--agents copilot,claude,cursor,agents] [--packages @puzzle-ui/ui] [--dry-run] [--yes]
  create-puzzle ai update [--agents copilot,claude,cursor,agents] [--packages @puzzle-ui/ui] [--dry-run] [--yes]
  create-puzzle ai check [--agents copilot,claude,cursor,agents] [--packages @puzzle-ui/ui]

Agents: copilot, claude, cursor, agents
Package names must be direct dependencies in this project or one of its workspaces.
Generation is offline and treats package instruction files as data.`;

const parseList = (raw: string, option: string): string[] => {
  const values = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (values.length === 0 || new Set(values).size !== values.length) {
    throw new Error(`The "${option}" option requires a non-empty, duplicate-free list.`);
  }
  return values;
};

export const parseAiArguments = (args: string[]): ParsedAiArguments | { help: true } => {
  if (args.length === 1 && (args[0] === "--help" || args[0] === "-h")) {
    return { help: true };
  }
  const command = args[0];
  if (command !== "init" && command !== "update" && command !== "check") {
    throw new Error(`Expected "init", "update", or "check".\n\n${usage}`);
  }

  let agents: AiAgent[] | undefined;
  let packages: string[] | undefined;
  let dryRun = false;
  let yes = false;
  let nonInteractive = false;
  let cwd: string | undefined;

  for (let index = 1; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--agents") {
      if (agents) {
        throw new Error('The "--agents" option can be specified only once.');
      }
      const next = args[index + 1];
      if (!next || next.startsWith("-")) {
        throw new Error('The "--agents" option requires a comma-separated list.');
      }
      const names = parseList(next, "--agents");
      const unknown = names.filter(
        (name) => !AI_AGENTS.includes(name as AiAgent),
      );
      if (unknown.length > 0) {
        throw new Error(`Unknown AI agent(s): ${unknown.join(", ")}.`);
      }
      agents = names as AiAgent[];
      index += 1;
    } else if (argument === "--packages") {
      if (packages) {
        throw new Error('The "--packages" option can be specified only once.');
      }
      const next = args[index + 1];
      if (!next || next.startsWith("-")) {
        throw new Error('The "--packages" option requires a comma-separated list.');
      }
      packages = parseList(next, "--packages");
      index += 1;
    } else if (argument === "--cwd") {
      if (cwd !== undefined) {
        throw new Error('The "--cwd" option can be specified only once.');
      }
      const next = args[index + 1];
      if (!next || next.startsWith("-")) {
        throw new Error('The "--cwd" option requires a directory path.');
      }
      cwd = next;
      index += 1;
    } else if (argument === "--dry-run") {
      if (dryRun) {
        throw new Error('The "--dry-run" option can be specified only once.');
      }
      dryRun = true;
    } else if (argument === "--yes" || argument === "-y") {
      if (yes) {
        throw new Error('The "--yes" option can be specified only once.');
      }
      yes = true;
      nonInteractive = true;
    } else if (argument === "--non-interactive") {
      if (nonInteractive) {
        throw new Error('The "--non-interactive" option can be specified only once.');
      }
      nonInteractive = true;
    } else if (argument === "--help" || argument === "-h") {
      return { help: true };
    } else {
      throw new Error(`Unknown AI option "${argument}".\n\n${usage}`);
    }
  }

  if (command === "check" && dryRun) {
    throw new Error('"--dry-run" is not valid with "ai check".');
  }

  return { command, agents, packages, dryRun, yes, nonInteractive, cwd };
};

const detectAgents = async (projectRoot: string): Promise<AiAgent[]> => {
  const detected: AiAgent[] = [];
  const paths: Array<[AiAgent, string[]]> = [
    ["copilot", [".github/copilot-instructions.md", ".github/instructions"]],
    ["claude", ["CLAUDE.md", ".claude"]],
    ["cursor", [".cursor"]],
    ["agents", ["AGENTS.md"]],
  ];

  for (const [agent, candidates] of paths) {
    for (const candidate of candidates) {
      try {
        await access(path.join(projectRoot, candidate));
        detected.push(agent);
        break;
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "ENOENT"
        ) {
          continue;
        }
        throw error;
      }
    }
  }
  return detected;
};

const selectAgents = async ({
  parsed,
  projectRoot,
  previousAgents,
  interactive,
}: {
  parsed: ParsedAiArguments;
  projectRoot: string;
  previousAgents: AiAgent[] | undefined;
  interactive: boolean;
}): Promise<AiAgent[]> => {
  if (parsed.agents) {
    return [...parsed.agents].sort();
  }
  if (parsed.command === "check") {
    if (!previousAgents) {
      throw new Error('No AI manifest exists. Run "create-puzzle ai init" first.');
    }
    return previousAgents;
  }
  if (previousAgents) {
    return previousAgents;
  }

  const detectedAgents = await detectAgents(projectRoot);
  if (parsed.yes) {
    return [...AI_AGENTS];
  }
  if (detectedAgents.length > 0) {
    return detectedAgents;
  }
  if (parsed.nonInteractive || !interactive) {
    throw new Error(
      'No supported agent configuration was detected. Specify "--agents" or use "--yes" to select all agents.',
    );
  }

  const selected = await p.multiselect({
    message: "Which AI agents should receive Puzzle instructions?",
    options: AI_AGENTS.map((agent) => ({
      value: agent,
      label:
        agent === "agents"
          ? "Generic AGENTS.md"
          : agent === "copilot"
            ? "GitHub Copilot"
            : agent === "claude"
              ? "Claude Code"
              : "Cursor",
    })),
    initialValues: [...AI_AGENTS],
    required: true,
  });
  if (p.isCancel(selected)) {
    p.cancel("Puzzle AI instruction setup cancelled.");
    throw new Error("Puzzle AI instruction setup cancelled.");
  }
  return [...selected].sort();
};

const printPlan = (
  write: (message: string) => void,
  packages: Array<{ name: string; version: string }>,
  agents: AiAgent[],
  changes: string[],
  dryRun: boolean,
) => {
  write("Puzzle AI Integration");
  write("");
  write("Detected packages:");
  for (const item of packages) {
    write(`  ✓ ${item.name}@${item.version}`);
  }
  write("");
  write(`Selected agents: ${agents.join(", ")}`);
  if (changes.length === 0) {
    write("Instruction files are already up to date.");
  } else {
    write(dryRun ? "Planned changes:" : "Changes:");
    for (const change of changes) {
      write(`  ${dryRun ? "•" : "✓"} ${change}`);
    }
  }
  if (dryRun) {
    write("Dry run complete. No files were changed.");
  }
};

export const runAiCli = async (
  args: string[],
  {
    cwd = process.cwd(),
    write = console.log,
    interactive = Boolean(process.stdin.isTTY),
  }: AiCliOptions = {},
): Promise<void> => {
  const parsed = parseAiArguments(args);
  if ("help" in parsed) {
    write(usage);
    return;
  }

  const projectRoot = await realpath(
    path.resolve(cwd, parsed.cwd ?? "."),
  );
  const previousManifest = await readProjectManifest(projectRoot);
  const loadedPackages = await resolveInstructionPackages(
    projectRoot,
    parsed.packages,
  );
  const selectedAgents = await selectAgents({
    parsed,
    projectRoot,
    previousAgents: previousManifest?.agents,
    interactive,
  });
  const sharedInstructions = await readSharedInstructions();
  const plan = await createInstructionPlan({
    projectRoot,
    packages: loadedPackages,
    agents: selectedAgents,
    sharedInstructions,
    previousManifest,
  });

  if (parsed.command === "check") {
    const errors = await checkInstructionPlan(
      projectRoot,
      plan,
      previousManifest,
    );
    if (errors.length > 0) {
      throw new Error(`Puzzle AI instructions are not current:\n- ${errors.join("\n- ")}`);
    }
    write(
      `Puzzle AI instructions are current for ${loadedPackages.length} package(s) and ${selectedAgents.length} agent(s).`,
    );
    return;
  }

  printPlan(
    write,
    loadedPackages.map(({ name, version }) => ({ name, version })),
    selectedAgents,
    plan.changes,
    parsed.dryRun,
  );
  if (plan.conflicts.length > 0) {
    throw new Error(`Instruction conflicts:\n- ${plan.conflicts.join("\n- ")}`);
  }
  if (parsed.dryRun) {
    return;
  }
  await applyInstructionPlan(projectRoot, plan);
  if (plan.changes.length > 0) {
    write("Completed successfully.");
  }
};

export { usage as aiCliUsage };
