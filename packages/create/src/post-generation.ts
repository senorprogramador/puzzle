import type { AuthDatabase, CommandRunner, ProjectOptions } from "./types";

import { prepareMongoDB, type RequestMongoReset } from "./auth/prepare-mongodb";
import {
  AUTH_DATABASE_PACKAGES,
  D1_FRAMEWORK_PACKAGES,
  PUZZLE_AUTH_PACKAGES,
  PUZZLE_PACKAGES,
  TANSTACK_NITRO_PACKAGES,
  isFullStackFramework,
} from "./constants";
import { configureTailwind } from "./tailwind/configure-tailwind";
import { installTailwind } from "./tailwind/install-tailwind";
import type { InitialUser } from "./auth/initial-user";

export type ProjectStep = <T>(
  startMessage: string,
  finishMessage: string,
  operation: () => Promise<T>,
) => Promise<T>;

const getDependencies = (
  options: ProjectOptions,
  database?: AuthDatabase,
) => {
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
  database: AuthDatabase | undefined,
  runner: CommandRunner,
) => {
  const { packageManager } = options;
  const { dependencies, devDependencies } = getDependencies(options, database);

  const args =
    packageManager === "npm"
      ? ["install", ...dependencies]
      : ["add", ...dependencies];

  await runner(packageManager, args, { cwd: directory });

  if (devDependencies.length > 0) {
    const devArgs =
      packageManager === "npm"
        ? ["install", "--save-dev", ...devDependencies]
        : packageManager === "yarn"
          ? ["add", "--dev", ...devDependencies]
          : ["add", "-D", ...devDependencies];

    await runner(packageManager, devArgs, { cwd: directory });
  }
};

export const setupGeneratedProject = async ({
  targetDirectory,
  options,
  database,
  runner,
  runStep,
  initialUser,
  requestMongoReset,
}: {
  targetDirectory: string;
  options: ProjectOptions;
  database?: AuthDatabase;
  runner: CommandRunner;
  runStep: ProjectStep;
  initialUser?: InitialUser;
  requestMongoReset?: RequestMongoReset;
}): Promise<boolean> => {
  if (
    database === "mongodb" &&
    !(await prepareMongoDB(targetDirectory, runner, requestMongoReset))
  ) {
    return false;
  }

  if (options.tailwind) {
    await runStep("Configuring Tailwind CSS", "Tailwind CSS configured", () =>
      configureTailwind(targetDirectory, options.framework),
    );

    await runStep("Installing Tailwind CSS", "Tailwind CSS installed", () =>
      installTailwind({
        directory: targetDirectory,
        framework: options.framework,
        packageManager: options.packageManager,
        runner,
      }),
    );
  }

  await runStep(
    "Installing Puzzle",
    options.auth ? "Puzzle and Auth installed" : "Puzzle installed",
    () => installDependencies(targetDirectory, options, database, runner),
  );

  await runStep("Downloading fonts", "Fonts downloaded", () =>
    runner(options.packageManager, ["run", "fonts:download"], {
      cwd: targetDirectory,
    }),
  );

  if (database === "d1") {
    await runStep("Generating Cloudflare types", "Cloudflare types generated", () =>
      runner(options.packageManager, ["run", "cf-typegen"], {
        cwd: targetDirectory,
      }),
    );
  }

  if (initialUser) {
    if (database === "mongodb") {
      await runStep("Starting the local MongoDB database", "MongoDB is ready", () =>
        runner(options.packageManager, ["run", "db:setup"], {
          cwd: targetDirectory,
        }),
      );
    }

    await runStep("Creating the first application user", "Application user created", () =>
      runner("node", ["scripts/create-initial-user.mjs"], {
        cwd: targetDirectory,
        input: JSON.stringify(initialUser),
      }),
    );
  }

  return true;
};
