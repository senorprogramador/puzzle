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

const createNextProject: FrameworkGenerator = async (
  directory,
  packageManager,
  runner = runCommand,
  cwd,
) => {
  const args = [
    "create-next-app@latest",
    directory,
    "--ts",
    "--app",
    "--src-dir",
    "--skip-install",
    "--disable-git",
    "--no-tailwind",
    "--yes",
    `--use-${packageManager}`,
  ];

  const executor = getExecutor(packageManager);

  await runner(
    executor.command,
    [...executor.prefix, ...args],
    cwd ? { cwd } : undefined,
  );
};

export { createNextProject };
