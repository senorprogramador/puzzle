import type { FrameworkGenerator } from "../types";

import { runCommand } from "../utils/execute";
import { getPackageExecutor } from "../utils/package-executor";

const createReactRouterProject: FrameworkGenerator = async (
  directory,
  packageManager,
  runner = runCommand,
  cwd,
) => {
  const args = [
    "create-react-router@latest",
    directory,
    "--no-install",
    "--no-git-init",
    "--yes",
  ];

  const executor = getPackageExecutor(packageManager);

  await runner(
    executor.command,
    [...executor.prefix, ...args],
    cwd ? { cwd } : undefined,
  );
};

export { createReactRouterProject };
