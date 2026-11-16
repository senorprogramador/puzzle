export type Framework = "next" | "tanstack" | "react-router" | "react";

export type FullStackFramework = Exclude<Framework, "react">;

export type AuthDatabase = "mongodb" | "d1" | "custom";

export type PackageManager = "bun" | "npm" | "pnpm" | "yarn";

export type ProjectOptions = {
  name: string;
  directory: string;
  framework: Framework;
  packageManager: PackageManager;
  tailwind: boolean;
  auth: boolean;
  /**
   * Storage used by Puzzle Auth. Only applies to full-stack frameworks
   * when `auth` is enabled; defaults to "custom".
   */
  database?: AuthDatabase;
};

export type CommandOptions = {
  cwd?: string;
  stdio?: "inherit" | "pipe";
  input?: string;
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
