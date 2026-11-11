import type { FrameworkGenerator, PackageManager } from "../types";

import { runCommand } from "../utils/execute";

const getExecutor = (packageManager: PackageManager) => {
  if (packageManager === "bun") {
    return {
      command: "bunx",
      prefix: [],
    };
  }

  if (packageManager === "pnpm" || packageManager === "yarn") {
    return {
      command: packageManager,
      prefix: ["dlx"],
    };
  }

  return {
    command: "npx",
    prefix: ["--yes"],
  };
};

const createTanStackProject: FrameworkGenerator = async (
  directory,
  packageManager,
  runner = runCommand,
  cwd,
) => {
  const args = [
    "@tanstack/cli@latest",
    "create",
    directory,
    "--framework",
    "React",
    "--package-manager",
    packageManager,
    "--blank",
    "--no-install",
    "--no-git",
    "--yes",
  ];

  const executor = getExecutor(packageManager);

  await runner(
    executor.command,
    [...executor.prefix, ...args],
    cwd ? { cwd } : undefined,
  );
};

export { createTanStackProject };
