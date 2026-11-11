import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Framework } from "../types";

const getTranspiledPackages = (auth: boolean) => [
  "@puzzle-ui/ui",
  "@puzzle-ui/theme",
  ...(auth ? ["@puzzle-ui/fullstack"] : []),
];

const configureNext = async (directory: string, auth: boolean) => {
  const configPath = path.join(directory, "next.config.ts");
  const packages = getTranspiledPackages(auth);

  const config = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ${JSON.stringify(packages, null, 4)},
};

export default nextConfig;
`;

  await writeFile(configPath, config, "utf8");
};

const configureTanStack = async (directory: string, auth: boolean) => {
  const configPath = path.join(directory, "vite.config.ts");

  let config = await readFile(configPath, "utf8");

  const packages = getTranspiledPackages(auth);

  if (!config.includes("noExternal")) {
    config = config.replace(
      /defineConfig\(\s*\{/,
      `defineConfig({
  ssr: {
    noExternal: ${JSON.stringify(packages)},
  },`,
    );
  } else if (auth && !config.includes('"@puzzle-ui/fullstack"')) {
    config = config.replace(
      /noExternal:\s*\[([^\]]*)\]/,
      `noExternal: [$1, "@puzzle-ui/fullstack"]`,
    );
  }

  await writeFile(configPath, config, "utf8");
};

const configureFramework = async (
  directory: string,
  framework: Framework,
  auth = false,
) => {
  if (framework === "next") {
    await configureNext(directory, auth);
    return;
  }

  if (framework === "tanstack") {
    await configureTanStack(directory, auth);
  }
};

export { configureFramework };
