import type { PackageManager } from "../types";

/**
 * Returns the command used to run a package binary without installing it.
 */
const getPackageExecutor = (packageManager: PackageManager) => {
  if (packageManager === "bun") {
    return {
      command: "bunx",
      prefix: [] as string[],
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

export { getPackageExecutor };
