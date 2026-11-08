import type { PackageManager } from "../types";

const detectPackageManager = (
  userAgent = process.env.npm_config_user_agent ?? "",
): PackageManager => {
  if (userAgent.startsWith("bun/")) {
    return "bun";
  }

  return "npm";
};

export { detectPackageManager };
