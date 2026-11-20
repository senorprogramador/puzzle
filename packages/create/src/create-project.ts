import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import * as p from "@clack/prompts";

import type { AuthDatabase, CommandRunner, ProjectOptions } from "./types";

import { frameworkGenerators } from "./frameworks";
import { configureFramework } from "./frameworks/configure-framework";
import { configureTheme } from "./theme/configure-theme";
import { configureAuth } from "./auth/configure-auth";
import {
  promptInitialUser,
  type InitialUser,
} from "./auth/initial-user";
import type { RequestMongoReset } from "./auth/prepare-mongodb";
import { runCommand } from "./utils/execute";
import { validateProjectDirectory } from "./utils/validate-project";
import { isFullStackFramework } from "./constants";
import {
  setupGeneratedProject,
  type ProjectStep,
} from "./post-generation";

type CreateProjectContext = {
  cwd?: string;
  runner?: CommandRunner;
  requestInitialUser?: () => Promise<InitialUser | null>;
  requestMongoReset?: RequestMongoReset;
  initialUser?: InitialUser;
};

const getAuthDatabase = (options: ProjectOptions) =>
  options.auth && isFullStackFramework(options.framework)
    ? (options.database ?? "custom")
    : undefined;

const getNextSteps = (
  options: ProjectOptions,
  relativeDirectory: string,
) => {
  const database = getAuthDatabase(options);

  return [
    `cd ${relativeDirectory}`,
    ...(database === "mongodb"
      ? [`${options.packageManager} run db:setup`]
      : []),
    `${options.packageManager} run dev`,
  ];
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

const generateProjectFiles = async ({
  targetDirectory,
  projectParent,
  projectName,
  options,
  database,
  runner,
  runStep,
}: {
  targetDirectory: string;
  projectParent: string;
  projectName: string;
  options: ProjectOptions;
  database?: AuthDatabase;
  runner: CommandRunner;
  runStep: ProjectStep;
}) => {
  await runStep("Generating framework", "Framework generated", async () => {
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
  });

  await runStep(
    "Configuring framework",
    "Framework configured",
    () =>
      configureFramework(
        targetDirectory,
        options.framework,
        options.auth,
        database,
      ),
  );

  await runStep("Configuring Puzzle theme", "Puzzle theme configured", async () => {
    await configureTheme(targetDirectory, {
      framework: options.framework,
      auth: options.auth,
      database,
    });
    await configureProjectName(targetDirectory, projectName);
  });

  if (options.auth) {
    await runStep("Configuring Puzzle Auth", "Puzzle Auth configured", () =>
      configureAuth(targetDirectory, {
        framework: options.framework,
        database,
        projectName,
        packageManager: options.packageManager,
      }),
    );
  }
};

const createProject = async (
  options: ProjectOptions,
  {
    cwd = process.cwd(),
    runner = runCommand,
    requestInitialUser = promptInitialUser,
    requestMongoReset,
    initialUser: suppliedInitialUser,
  }: CreateProjectContext = {},
): Promise<boolean> => {
  const targetDirectory = await validateProjectDirectory(
    options.directory,
    cwd,
  );

  const projectName = path.basename(targetDirectory);
  const projectParent = path.dirname(targetDirectory);
  const database = getAuthDatabase(options);
  const initialUser =
    database === "mongodb" || database === "d1"
      ? suppliedInitialUser ?? (await requestInitialUser())
      : undefined;

  if (initialUser === null) {
    p.cancel("Project creation cancelled.");
    return false;
  }

  const spinner = p.spinner();
  let spinnerActive = false;

  const runStep: ProjectStep = async (startMessage, finishMessage, operation) => {
    spinner.start(startMessage);
    spinnerActive = true;
    const result = await operation();
    spinner.stop(finishMessage);
    spinnerActive = false;
    return result;
  };

  try {
    await generateProjectFiles({
      targetDirectory,
      projectParent,
      projectName,
      options,
      database,
      runner,
      runStep,
    });

    const setupCompleted = await setupGeneratedProject({
      targetDirectory,
      options,
      database,
      runner,
      runStep,
      initialUser,
      requestMongoReset,
    });

    if (!setupCompleted) {
      p.cancel("Project creation cancelled. Existing MongoDB volumes were preserved.");
      return false;
    }
  } catch (error) {
    if (spinnerActive) {
      spinner.error("Project creation failed");
    }

    throw error;
  }

  p.log.success(`Project "${projectName}" created successfully.`);

  if (options.auth && isFullStackFramework(options.framework)) {
    p.log.info(
      initialUser
        ? "Puzzle Auth settings were written to .env. Your first application account is ready in the local database. Open /sign-in to sign in."
        : "Puzzle Auth settings were written to .env. Open /dashboard to try the protected route.",
    );
  }

  const steps = getNextSteps(
    options,
    path.relative(cwd, targetDirectory) || ".",
  );

  p.outro(`Next steps:\n\n${steps.map((step) => `  ${step}`).join("\n")}`);
  return true;
};

export { createProject, type CreateProjectContext };
