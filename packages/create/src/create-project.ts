import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import * as p from "@clack/prompts";

import type { CommandRunner, ProjectOptions } from "./types";

import { frameworkGenerators } from "./frameworks";
import { configureFramework } from "./frameworks/configure-framework";
import { configureTheme } from "./theme/configure-theme";
import { configureAuth } from "./auth/configure-auth";
import { runCommand } from "./utils/execute";
import { validateProjectDirectory } from "./utils/validate-project";

import { PUZZLE_PACKAGES, PUZZLE_AUTH_PACKAGES } from "./constants";

import { configureTailwind } from "./tailwind/configure-tailwind";
import { installTailwind } from "./tailwind/install-tailwind";

type CreateProjectContext = {
  cwd?: string;
  runner?: CommandRunner;
};

const installDependencies = async (
  directory: string,
  packageManager: ProjectOptions["packageManager"],
  auth: boolean,
  runner: CommandRunner,
) => {
  const packages = [...PUZZLE_PACKAGES, ...(auth ? PUZZLE_AUTH_PACKAGES : [])];

  const args =
    packageManager === "npm" ? ["install", ...packages] : ["add", ...packages];

  await runner(packageManager, args, {
    cwd: directory,
  });
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
      await frameworkGenerators.react(
        targetDirectory,
        options.packageManager,
        runner,
      );
    } else {
      await frameworkGenerators[options.framework](
        projectName,
        options.packageManager,
        runner,
        projectParent,
      );
    }

    finishStep("Framework generated");

    startStep("Configuring framework");

    await configureFramework(targetDirectory, options.framework, options.auth);

    finishStep("Framework configured");

    startStep("Configuring Puzzle theme");

    await configureTheme(targetDirectory, options.framework);
    await configureProjectName(targetDirectory, projectName);

    finishStep("Puzzle theme configured");

    if (options.auth) {
      startStep("Configuring Puzzle Auth");

      await configureAuth(targetDirectory, options.framework);

      finishStep("Puzzle Auth configured");
    }

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

    await installDependencies(
      targetDirectory,
      options.packageManager,
      options.auth,
      runner,
    );

    finishStep(options.auth ? "Puzzle and Auth installed" : "Puzzle installed");
  } catch (error) {
    if (spinnerActive) {
      spinner.error("Project creation failed");
    }

    throw error;
  }

  p.log.success(`Project "${projectName}" created successfully.`);

  p.outro(
    `Next steps:\n\n  cd ${path.relative(cwd, targetDirectory) || "."}\n  ${options.packageManager} run dev`,
  );
};

export { createProject, type CreateProjectContext };
