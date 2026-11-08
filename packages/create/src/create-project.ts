import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import * as p from "@clack/prompts";

import type { CommandRunner, ProjectOptions } from "./types";
import { frameworkGenerators } from "./frameworks";
import { configureTheme } from "./theme/configure-theme";
import { runCommand } from "./utils/execute";
import { validateProjectDirectory } from "./utils/validate-project";
import { PUZZLE_PACKAGES } from "./constants";
import { configureTailwind } from "./tailwind/configure-tailwind";
import { installTailwind } from "./tailwind/install-tailwind";

type CreateProjectContext = {
  /** Directory the project directory is resolved from. Defaults to `process.cwd()`. */
  cwd?: string;
  /** Runs external commands. Defaults to spawning a child process. */
  runner?: CommandRunner;
};

const installDependencies = async (
  directory: string,
  packageManager: ProjectOptions["packageManager"],
  runner: CommandRunner,
) => {
  const packages = [...PUZZLE_PACKAGES];

  if (packageManager === "bun") {
    await runner("bun", ["add", ...packages], { cwd: directory });
    return;
  }

  await runner("npm", ["install", ...packages], { cwd: directory });
};

const configureProjectName = async (directory: string, projectName: string) => {
  const packageJsonPath = path.join(directory, "package.json");

  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
    name?: string;
    [key: string]: unknown;
  };

  packageJson.name = projectName;

  await writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );
};

const createProject = async (
  options: ProjectOptions,
  { cwd = process.cwd(), runner = runCommand }: CreateProjectContext = {},
) => {
  // Validate before starting the spinner, so nothing is generated or reported
  // as a failed step when the target directory cannot be used.
  const targetDirectory = await validateProjectDirectory(
    options.directory,
    cwd,
  );

  const projectName = path.basename(targetDirectory);
  const projectParent = path.dirname(targetDirectory);

  const spinner = p.spinner();
  let spinnerActive = false;

  const startStep = (message: string) => {
    spinner.start(message);
    spinnerActive = true;
  };

  const finishStep = (message: string) => {
    spinner.stop(message);
    spinnerActive = false;
  };

  try {
    startStep("Generating framework");

    if (options.framework === "react") {
      // The Basic React generator writes directly into its target directory.
      await frameworkGenerators.react(
        targetDirectory,
        options.packageManager,
        runner,
      );
    } else {
      // Next.js and TanStack CLI create their own project directory.
      await frameworkGenerators[options.framework](
        projectName,
        options.packageManager,
        runner,
        projectParent,
      );
    }

    finishStep("Framework generated");

    startStep("Configuring Puzzle theme");
    await configureTheme(targetDirectory, options.framework);
    await configureProjectName(targetDirectory, projectName);
    finishStep("Puzzle theme configured");

    if (options.tailwind) {
      startStep("Configuring Tailwind CSS");
      await configureTailwind(targetDirectory, options.framework);
      finishStep("Tailwind CSS configured");

      startStep("Installing Tailwind CSS");
      await installTailwind({
        directory: targetDirectory,
        framework: options.framework,
        packageManager: options.packageManager,
        runner,
      });
      finishStep("Tailwind CSS installed");
    }

    startStep("Installing Puzzle");
    await installDependencies(targetDirectory, options.packageManager, runner);
    finishStep("Puzzle installed");
  } catch (error) {
    if (spinnerActive) {
      spinner.error("Project creation failed");
    }

    throw error;
  }

  p.log.success(`Project "${projectName}" created successfully.`);

  p.outro(
    `Next steps:\n\n  cd ${path.relative(process.cwd(), targetDirectory) || "."}\n  ${options.packageManager} run dev`,
  );
};

export { createProject, type CreateProjectContext };
