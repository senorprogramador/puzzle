import { mkdir, readFile, writeFile } from "node:fs/promises";

import path from "node:path";

import type { Framework } from "../types";

const readIfExists = async (filePath: string) => {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
};

const writeIfMissingImport = async (
  filePath: string,
  importStatement: string,
) => {
  const current = await readIfExists(filePath);

  if (current === null) {
    await mkdir(path.dirname(filePath), {
      recursive: true,
    });

    await writeFile(filePath, `${importStatement}\n`, "utf8");

    return;
  }

  if (current.includes(importStatement)) {
    return;
  }

  await writeFile(filePath, `${importStatement}\n\n${current}`, "utf8");
};

const prependCssImport = async (filePath: string) => {
  const importStatement = '@import "tailwindcss";';
  const current = await readIfExists(filePath);

  if (current === null) {
    await mkdir(path.dirname(filePath), {
      recursive: true,
    });

    await writeFile(filePath, `${importStatement}\n`, "utf8");

    return;
  }

  if (current.includes(importStatement)) {
    return;
  }

  await writeFile(filePath, `${importStatement}\n\n${current}`, "utf8");
};

const configureNextTailwind = async (directory: string) => {
  const cssPath = path.join(directory, "src", "app", "globals.css");

  await prependCssImport(cssPath);

  const postcssConfigPath = path.join(directory, "postcss.config.mjs");

  await writeFile(
    postcssConfigPath,
    `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`,
    "utf8",
  );
};

const findTanStackCssPath = async (directory: string) => {
  const rootRoutePath = path.join(directory, "src", "routes", "__root.tsx");

  const rootRoute = await readFile(rootRoutePath, "utf8");

  const cssImportPattern =
    /import\s+(?:[\w{}\s,*]+\s+from\s+)?["']([^"']+\.css(?:\?url)?)["']/g;

  const matches = [...rootRoute.matchAll(cssImportPattern)];

  for (const match of matches) {
    const importedPath = match[1];

    if (!importedPath?.startsWith(".")) {
      continue;
    }

    const cleanPath = importedPath.replace(/\?[^/]*$/, "");

    return path.resolve(path.dirname(rootRoutePath), cleanPath);
  }

  // Default stylesheet location used by TanStack Start templates.
  return path.join(directory, "src", "styles.css");
};

const configureTanStackTailwind = async (directory: string) => {
  const cssPath = await findTanStackCssPath(directory);

  await prependCssImport(cssPath);

  const rootRoutePath = path.join(directory, "src", "routes", "__root.tsx");

  const rootRoute = await readFile(rootRoutePath, "utf8");

  if (!rootRoute.includes(".css")) {
    await writeFile(
      rootRoutePath,
      `import "../styles.css";\n${rootRoute}`,
      "utf8",
    );
  }

  const viteConfigPath = path.join(directory, "vite.config.ts");

  let viteConfig = await readFile(viteConfigPath, "utf8");

  if (!viteConfig.includes("@tailwindcss/vite")) {
    viteConfig = `import tailwindcss from "@tailwindcss/vite";\n` + viteConfig;
  }

  if (!viteConfig.includes("tailwindcss()")) {
    viteConfig = viteConfig.replace(
      /plugins:\s*\[/,
      "plugins: [\n    tailwindcss(),",
    );
  }

  if (!viteConfig.includes("noExternal")) {
    viteConfig = viteConfig.replace(
      /defineConfig\(\s*\{/,
      `defineConfig({
  ssr: {
    noExternal: ["@puzzle-ui/ui", "@puzzle-ui/theme"],
  },`,
    );
  }

  await writeFile(viteConfigPath, viteConfig, "utf8");
};

const configureReactTailwind = async (directory: string) => {
  const cssPath = path.join(directory, "src", "index.css");

  await prependCssImport(cssPath);

  const viteConfigPath = path.join(directory, "vite.config.ts");

  let viteConfig = await readFile(viteConfigPath, "utf8");

  if (!viteConfig.includes("@tailwindcss/vite")) {
    viteConfig = `import tailwindcss from "@tailwindcss/vite";\n` + viteConfig;
  }

  if (!viteConfig.includes("tailwindcss()")) {
    viteConfig = viteConfig.replace(
      /plugins:\s*\[/,
      "plugins: [\n    tailwindcss(),",
    );
  }

  await writeFile(viteConfigPath, viteConfig, "utf8");
};

const configureTailwind = async (directory: string, framework: Framework) => {
  if (framework === "next") {
    await configureNextTailwind(directory);
    return;
  }

  if (framework === "tanstack") {
    await configureTanStackTailwind(directory);
    return;
  }

  await configureReactTailwind(directory);
};

export { configureTailwind };
