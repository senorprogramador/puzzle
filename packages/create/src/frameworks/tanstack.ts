import type { FrameworkGenerator } from "../types";

import { runCommand } from "../utils/execute";

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

  const command = packageManager === "bun" ? "bunx" : "npx";
  const commandArgs = packageManager === "bun" ? args : ["--yes", ...args];

  if (cwd) {
    await runner(command, commandArgs, { cwd });
    return;
  }

  await runner(command, commandArgs);
};

export { createTanStackProject };
