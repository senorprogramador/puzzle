export type Framework = "next" | "tanstack" | "react";

export type PackageManager = "bun" | "npm";

export type ProjectOptions = {
  name: string;
  directory: string;
  framework: Framework;
  packageManager: PackageManager;
  tailwind: boolean;
};

export type CommandOptions = {
  cwd?: string;
  stdio?: "inherit" | "pipe";
};

export type CommandRunner = (
  command: string,
  args: string[],
  options?: CommandOptions,
) => Promise<void>;

export type FrameworkGenerator = (
  directory: string,
  packageManager: PackageManager,
  runner?: CommandRunner,
  cwd?: string,
) => Promise<void>;
