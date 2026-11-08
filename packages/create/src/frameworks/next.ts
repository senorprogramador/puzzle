import type { FrameworkGenerator } from "../types";

import { runCommand } from "../utils/execute";

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
    packageManager === "bun" ? "--use-bun" : "--use-npm",
  ];

  const command = packageManager === "bun" ? "bunx" : "npx";
  const commandArgs = packageManager === "bun" ? args : ["--yes", ...args];

  if (cwd) {
    await runner(command, commandArgs, { cwd });
    return;
  }

  await runner(command, commandArgs);
};

export { createNextProject };
