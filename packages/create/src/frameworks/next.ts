import type { FrameworkGenerator } from "../types";

import { runCommand } from "../utils/execute";
import { getPackageExecutor } from "../utils/package-executor";

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

  const executor = getPackageExecutor(packageManager);

  await runner(
    executor.command,
    [...executor.prefix, ...args],
    cwd ? { cwd } : undefined,
  );
};

export { createNextProject };
