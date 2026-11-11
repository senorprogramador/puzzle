import type { PackageManager } from "../types";

const detectPackageManager = (
  userAgent = process.env.npm_config_user_agent ?? "",
): PackageManager => {
  const match = userAgent.match(/(?:^|\s)(bun|pnpm|yarn|npm)\/[^\s]+/);

  return (match?.[1] as PackageManager | undefined) ?? "npm";
};

export { detectPackageManager };
