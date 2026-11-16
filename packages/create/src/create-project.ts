import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import * as p from "@clack/prompts";

import type { CommandRunner, ProjectOptions } from "./types";

import { frameworkGenerators } from "./frameworks";
import { configureFramework } from "./frameworks/configure-framework";
import { configureTheme } from "./theme/configure-theme";
import { configureAuth } from "./auth/configure-auth";
import { promptInitialUser, type InitialUser } from "./auth/initial-user";
import { prepareMongoDB, type RequestMongoReset } from "./auth/prepare-mongodb";
import { runCommand } from "./utils/execute";
import { validateProjectDirectory } from "./utils/validate-project";

import {
  AUTH_DATABASE_PACKAGES,
  D1_FRAMEWORK_PACKAGES,
  isFullStackFramework,
  PUZZLE_AUTH_PACKAGES,
  PUZZLE_PACKAGES,
  TANSTACK_NITRO_PACKAGES,
} from "./constants";

import { configureTailwind } from "./tailwind/configure-tailwind";
import { installTailwind } from "./tailwind/install-tailwind";

type CreateProjectContext = {
  cwd?: string;
  runner?: CommandRunner;
  requestInitialUser?: () => Promise<InitialUser | null>;
  requestMongoReset?: RequestMongoReset;
};

const getAuthDatabase = (options: ProjectOptions) =>
  options.auth && isFullStackFramework(options.framework)
    ? (options.database ?? "custom")
    : undefined;

const getDependencies = (options: ProjectOptions) => {
  const database = getAuthDatabase(options);
  const cloudflare =
    database === "d1" && isFullStackFramework(options.framework)
      ? D1_FRAMEWORK_PACKAGES[options.framework]
      : undefined;

  return {
    dependencies: [
      ...PUZZLE_PACKAGES,
      ...(options.auth ? PUZZLE_AUTH_PACKAGES : []),
      ...(database ? AUTH_DATABASE_PACKAGES[database] : []),
      ...(cloudflare?.dependencies ?? []),
      ...(options.framework === "tanstack" && database !== "d1"
        ? TANSTACK_NITRO_PACKAGES
        : []),
    ],
    devDependencies: [...(cloudflare?.devDependencies ?? [])],
  };
};

const installDependencies = async (
  directory: string,
  options: ProjectOptions,
  runner: CommandRunner,
) => {
  const { packageManager } = options;
  const { dependencies, devDependencies } = getDependencies(options);

  const args =
    packageManager === "npm"
      ? ["install", ...dependencies]
      : ["add", ...dependencies];

  await runner(packageManager, args, {
    cwd: directory,
  });

  if (devDependencies.length > 0) {
    const devArgs =
      packageManager === "npm"
        ? ["install", "--save-dev", ...devDependencies]
        : packageManager === "yarn"
          ? ["add", "--dev", ...devDependencies]
          : ["add", "-D", ...devDependencies];

    await runner(packageManager, devArgs, {
      cwd: directory,
    });
  }
};

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

const createProject = async (
  options: ProjectOptions,
  {
    cwd = process.cwd(),
    runner = runCommand,
    requestInitialUser = promptInitialUser,
    requestMongoReset,
  }: CreateProjectContext = {},
) => {
  const targetDirectory = await validateProjectDirectory(
    options.directory,
    cwd,
  );

  const projectName = path.basename(targetDirectory);
  const projectParent = path.dirname(targetDirectory);
  const database = getAuthDatabase(options);
  const initialUser = database === "mongodb" || database === "d1"
    ? await requestInitialUser()
    : undefined;

  if (initialUser === null) {
    p.cancel("Project creation cancelled.");
    return;
  }

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

    await configureFramework(
      targetDirectory,
      options.framework,
      options.auth,
      database,
    );

    finishStep("Framework configured");

    startStep("Configuring Puzzle theme");

    await configureTheme(targetDirectory, {
      framework: options.framework,
      auth: options.auth,
      database,
    });
    await configureProjectName(targetDirectory, projectName);

    finishStep("Puzzle theme configured");

    if (options.auth) {
      startStep("Configuring Puzzle Auth");

      await configureAuth(targetDirectory, {
        framework: options.framework,
        database,
        projectName,
        packageManager: options.packageManager,
      });

      finishStep("Puzzle Auth configured");
    }

    if (database === "mongodb" && !await prepareMongoDB(targetDirectory, runner, requestMongoReset)) {
      p.cancel("Project creation cancelled. Existing MongoDB volumes were preserved.");
      return;
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

    await installDependencies(targetDirectory, options, runner);

    finishStep(options.auth ? "Puzzle and Auth installed" : "Puzzle installed");

    startStep("Downloading fonts");

    await runner(options.packageManager, ["run", "fonts:download"], {
      cwd: targetDirectory,
    });

    finishStep("Fonts downloaded");

    if (database === "d1") {
      startStep("Generating Cloudflare types");

      await runner(options.packageManager, ["run", "cf-typegen"], {
        cwd: targetDirectory,
      });

      finishStep("Cloudflare types generated");
    }

    if (initialUser) {
      if (database === "mongodb") {
        startStep("Starting the local MongoDB database");
        await runner(options.packageManager, ["run", "db:setup"], {
          cwd: targetDirectory,
        });
        finishStep("MongoDB is ready");
      }

      startStep("Creating the first application user");
      await runner("node", ["scripts/create-initial-user.mjs"], {
        cwd: targetDirectory,
        input: JSON.stringify(initialUser),
      });
      finishStep("Application user created");
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
};

export { createProject, type CreateProjectContext };
