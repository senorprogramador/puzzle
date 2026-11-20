import * as p from "@clack/prompts";

import type { CommandRunner } from "./types";

import { createProject } from "./create-project";
import {
  loadProjectConfiguration,
  requiresInitialUser,
  toProjectOptions,
} from "./configuration";
import { getProjectConfiguration } from "./prompts";
import { readInitialUserFromStdin } from "./auth/initial-user";
import type { RequestMongoReset } from "./auth/prepare-mongodb";
import { validateProjectDirectory } from "./utils/validate-project";
import { runAiCli } from "./ai/cli";

type CliArguments =
  | { mode: "interactive" }
  | { mode: "help" }
  | {
      mode: "configuration";
      configPath: string;
      validateOnly: boolean;
      dryRun: boolean;
      credentialsFromStdin: boolean;
    };

type CliContext = {
  cwd?: string;
  runner?: CommandRunner;
  stdin?: AsyncIterable<string | Uint8Array>;
  write?: (message: string) => void;
  requestMongoReset?: RequestMongoReset;
};

const usage = `Usage:
  create-puzzle
  create-puzzle --help
  create-puzzle ai init|update|check [options]
  create-puzzle --config <path> [--validate | --dry-run] [--credentials-stdin]

Configuration files are JSON and must match config.schema.json.
Use --credentials-stdin to provide initial-user JSON for MongoDB or D1 Auth.
MongoDB volumes are never reset automatically in configuration mode.`;

export const parseCliArguments = (args: string[]): CliArguments => {
  if (args.length === 0) {
    return { mode: "interactive" };
  }

  if (args.length === 1 && (args[0] === "--help" || args[0] === "-h")) {
    return { mode: "help" };
  }

  let configPath: string | undefined;
  let validateOnly = false;
  let dryRun = false;
  let credentialsFromStdin = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--config") {
      if (configPath !== undefined) {
        throw new Error('The "--config" option can be specified only once.');
      }

      const next = args[index + 1];
      if (!next || next.startsWith("-")) {
        throw new Error('The "--config" option requires a file path.');
      }

      configPath = next;
      index += 1;
    } else if (argument === "--validate") {
      if (validateOnly) {
        throw new Error('The "--validate" option can be specified only once.');
      }
      validateOnly = true;
    } else if (argument === "--dry-run") {
      if (dryRun) {
        throw new Error('The "--dry-run" option can be specified only once.');
      }
      dryRun = true;
    } else if (argument === "--credentials-stdin") {
      if (credentialsFromStdin) {
        throw new Error(
          'The "--credentials-stdin" option can be specified only once.',
        );
      }
      credentialsFromStdin = true;
    } else {
      throw new Error(`Unknown option "${argument}". Run create-puzzle --help.`);
    }
  }

  if (!configPath) {
    throw new Error('The "--config" option is required when using CLI options.');
  }
  if (validateOnly && dryRun) {
    throw new Error('"--validate" and "--dry-run" cannot be used together.');
  }
  if (credentialsFromStdin && (validateOnly || dryRun)) {
    throw new Error(
      '"--credentials-stdin" is only valid when generating a project.',
    );
  }

  return {
    mode: "configuration",
    configPath,
    validateOnly,
    dryRun,
    credentialsFromStdin,
  };
};

export const runCli = async (
  args = process.argv.slice(2),
  {
    cwd = process.cwd(),
    runner,
    stdin = process.stdin,
    write = console.log,
    requestMongoReset,
  }: CliContext = {},
): Promise<void> => {
  if (args[0] === "ai") {
    await runAiCli(args.slice(1), {
      cwd,
      write,
      interactive: Boolean(process.stdin.isTTY),
    });
    return;
  }

  const parsed = parseCliArguments(args);

  if (parsed.mode === "help") {
    write(usage);
    return;
  }

  if (parsed.mode === "interactive") {
    const configuration = await getProjectConfiguration();
    if (!configuration) {
      p.cancel("Project creation cancelled.");
      return;
    }

    await createProject(toProjectOptions(configuration), {
      cwd,
      ...(runner ? { runner } : {}),
      ...(requestMongoReset ? { requestMongoReset } : {}),
    });
    return;
  }

  const configuration = await loadProjectConfiguration(
    parsed.configPath,
    cwd,
  );
  const options = toProjectOptions(configuration);

  if (parsed.validateOnly) {
    write(
      `Configuration is valid for ${options.framework} project "${options.name}".`,
    );
    return;
  }

  if (parsed.dryRun) {
    await validateProjectDirectory(options.directory, cwd);
    const database = configuration.database
      ? ` with ${configuration.database}`
      : "";
    write(
      `Would create "${options.name}" using ${options.framework}, ` +
        `${configuration.styling} styling, and ` +
        `${configuration.auth ? "Puzzle Auth" : "no Auth"}${database}.`,
    );
    return;
  }

  await validateProjectDirectory(options.directory, cwd);

  const needsInitialUser = requiresInitialUser(configuration);
  if (needsInitialUser && !parsed.credentialsFromStdin) {
    throw new Error(
      'This configuration requires an initial Auth user. Supply its JSON ' +
        'through stdin and add "--credentials-stdin".',
    );
  }
  if (!needsInitialUser && parsed.credentialsFromStdin) {
    throw new Error(
      '"--credentials-stdin" is only supported for MongoDB or D1 Auth configurations.',
    );
  }

  const initialUser = needsInitialUser
    ? await readInitialUserFromStdin(stdin)
    : undefined;
  const created = await createProject(options, {
    cwd,
    ...(runner ? { runner } : {}),
    initialUser,
    requestMongoReset: requestMongoReset ?? (async () => false),
  });

  if (!created) {
    throw new Error(
      "Project creation was cancelled. Existing MongoDB volumes were preserved.",
    );
  }
};

export { usage as cliUsage };
