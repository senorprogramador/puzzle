import { resolve } from "node:path";
import workspaceConfig from "../../next.config.ts";

const workspaceRoot = resolve(process.cwd(), "../../..");
const cmsEntry = resolve(workspaceRoot, "packages/cms/dist/index.js");

export default {
  ...workspaceConfig,
  transpilePackages: [
    ...new Set([
      ...(workspaceConfig.transpilePackages ?? []),
      "@puzzle-ui/cms",
    ]),
  ],
  turbopack: {
    ...workspaceConfig.turbopack,
    resolveAlias: {
      ...workspaceConfig.turbopack?.resolveAlias,
      "@puzzle-ui/cms": cmsEntry,
    },
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@puzzle-ui/cms": cmsEntry,
    };
    return config;
  },
  allowedDevOrigins: ["127.0.0.1"],
};
