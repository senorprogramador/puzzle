import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: [
    "@puzzle-ui/ui",
    "@puzzle-ui/theme",
    "@puzzle-ui/fullstack",
    "@puzzle-ui/pieces",
    "@puzzle-ui/workspace-ui",
  ],
};

export default nextConfig;
