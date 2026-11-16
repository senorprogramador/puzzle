import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AuthDatabase, Framework } from "../types";
import { prependVitePlugin } from "../utils/vite-config";

const getTranspiledPackages = (auth: boolean) => [
  "@puzzle-ui/ui",
  "@puzzle-ui/theme",
  ...(auth ? ["@puzzle-ui/fullstack"] : []),
];

const cloudflareVitePlugin = `cloudflare({ viteEnvironment: { name: "ssr" } })`;

const configureNext = async (
  directory: string,
  auth: boolean,
  database?: AuthDatabase,
) => {
  const configPath = path.join(directory, "next.config.ts");
  const packages = getTranspiledPackages(auth);
  const d1 = auth && database === "d1";

  const config = `import type { NextConfig } from "next";
${d1 ? 'import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";\n' : ""}
const nextConfig: NextConfig = {
  transpilePackages: [
${packages.map((name) => `    "${name}",`).join("\n")}
  ],
};

export default nextConfig;
${d1 ? "\n// Exposes local Cloudflare bindings, such as D1, to `next dev`.\ninitOpenNextCloudflareForDev();\n" : ""}`;

  await writeFile(configPath, config, "utf8");
};

const addCloudflarePlugin = (config: string) => {
  if (config.includes("@cloudflare/vite-plugin")) {
    return config;
  }

  return `import { cloudflare } from "@cloudflare/vite-plugin";\n${prependVitePlugin(
    config,
    cloudflareVitePlugin,
  )}`;
};

// Nitro builds a deployable Node.js server and caches the downloaded fonts.
const nitroVitePlugin = "nitro({ routeRules: createFontRouteRules() })";

const addNitroPlugin = (config: string) => {
  if (config.includes("nitro/vite")) {
    return config;
  }

  const withPlugin = config.replace(
    /tanstackStart\(([^)]*)\)/,
    (match) => `${match}, ${nitroVitePlugin}`,
  );

  return `import { nitro } from "nitro/vite";
import { createFontRouteRules } from "@puzzle-ui/theme/nitro";
${withPlugin}`;
};

const addNodeStartScript = async (directory: string) => {
  const packageJsonPath = path.join(directory, "package.json");

  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
    scripts?: Record<string, string>;
    [key: string]: unknown;
  };

  packageJson.scripts = {
    ...packageJson.scripts,
    start: "node .output/server/index.mjs",
  };

  await writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );
};

const configureTanStack = async (
  directory: string,
  auth: boolean,
  database?: AuthDatabase,
) => {
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

  const d1 = auth && database === "d1";

  config = d1 ? addCloudflarePlugin(config) : addNitroPlugin(config);

  await writeFile(configPath, config, "utf8");

  if (!d1) {
    await addNodeStartScript(directory);
  }
};

const configureReactRouter = async (
  directory: string,
  auth: boolean,
  database?: AuthDatabase,
) => {
  const d1 = auth && database === "d1";

  const config = `import { reactRouter } from "@react-router/dev/vite";
${d1 ? 'import { cloudflare } from "@cloudflare/vite-plugin";\n' : ""}import { defineConfig } from "vite";

export default defineConfig({
  ssr: {
    noExternal: ${JSON.stringify(getTranspiledPackages(auth))},
  },
  plugins: [${d1 ? `\n    ${cloudflareVitePlugin},` : ""}
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
`;

  await writeFile(path.join(directory, "vite.config.ts"), config, "utf8");

  // The React Router template ships with Tailwind CSS. Tailwind is installed
  // separately when the user opts in, so remove the template's copy here.
  const packageJsonPath = path.join(directory, "package.json");

  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
    devDependencies?: Record<string, string>;
    [key: string]: unknown;
  };

  if (packageJson.devDependencies) {
    delete packageJson.devDependencies.tailwindcss;
    delete packageJson.devDependencies["@tailwindcss/vite"];
  }

  await writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );
};

const configureFramework = async (
  directory: string,
  framework: Framework,
  auth = false,
  database?: AuthDatabase,
) => {
  if (framework === "next") {
    await configureNext(directory, auth, database);
    return;
  }

  if (framework === "tanstack") {
    await configureTanStack(directory, auth, database);
    return;
  }

  if (framework === "react-router") {
    await configureReactRouter(directory, auth, database);
  }
};

export { configureFramework };
