import type { FrameworkGenerator } from "../types";

import { runCommand } from "../utils/execute";
import { getPackageExecutor } from "../utils/package-executor";

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

  const executor = getPackageExecutor(packageManager);

  await runner(
    executor.command,
    [...executor.prefix, ...args],
    cwd ? { cwd } : undefined,
  );
};

export { createTanStackProject };
