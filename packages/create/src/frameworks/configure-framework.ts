import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const configureNext = async (directory: string) => {
  const configPath = path.join(directory, "next.config.ts");

  const config = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@puzzle-ui/ui",
    "@puzzle-ui/theme",
  ],
};

export default nextConfig;
`;

  await writeFile(configPath, config, "utf8");
};

const configureTanStack = async (directory: string) => {
  const configPath = path.join(directory, "vite.config.ts");

  let config = await readFile(configPath, "utf8");

  if (!config.includes("noExternal")) {
    config = config.replace(
      /defineConfig\(\s*\{/,
      `defineConfig({
  ssr: {
    noExternal: ["@puzzle-ui/ui", "@puzzle-ui/theme"],
  },`,
    );
  }

  await writeFile(configPath, config, "utf8");
};

const configureFramework = async (
  directory: string,
  framework: "next" | "tanstack" | "react",
) => {
  if (framework === "next") {
    await configureNext(directory);
    return;
  }

  if (framework === "tanstack") {
    await configureTanStack(directory);
  }
};

export { configureFramework };
