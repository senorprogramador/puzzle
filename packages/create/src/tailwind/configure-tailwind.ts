import { mkdir, readFile, writeFile } from "node:fs/promises";

import path from "node:path";

import type { Framework } from "../types";
import { prependVitePlugin } from "../utils/vite-config";

const readIfExists = async (filePath: string) => {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }

    throw error;
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

const configureCss = async (filePath: string) => {
  const importStatement = '@import "tailwindcss";';
  const breakpointMarker = "/* Puzzle responsive breakpoints */";
  const breakpointTheme = `${breakpointMarker}
@theme {
  --breakpoint-compact: 30rem;
  --breakpoint-tablet: 48rem;
  --breakpoint-desktop: 64rem;
  --breakpoint-hd: 90rem;
}`;
  const colorMarker = "/* Puzzle semantic colors */";
  const colorRoles = [
    "background",
    "surface",
    "surface-elevated",
    "surface-sunken",
    "text",
    "text-muted",
    "text-subtle",
    "border",
    "border-strong",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "accent",
    "accent-foreground",
    "ring",
    "success",
    "success-foreground",
    "warning",
    "warning-foreground",
    "danger",
    "danger-foreground",
    "info",
    "info-foreground",
  ];
  const colorTheme = `${colorMarker}
@theme inline {
${colorRoles.map((role) => `  --color-puzzle-${role}: var(--puzzle-color-${role});`).join("\n")}
}`;
  const existing = await readIfExists(filePath);
  let current = existing;

  if (current === null) {
    await mkdir(path.dirname(filePath), {
      recursive: true,
    });

    current = "";
  }

  if (!current.includes(importStatement)) {
    current = `${importStatement}\n\n${current}`;
  }

  if (!current.includes(breakpointMarker)) {
    current += `${current.endsWith("\n") ? "\n" : "\n\n"}${breakpointTheme}\n`;
  }

  if (!current.includes(colorMarker)) {
    current += `${current.endsWith("\n") ? "\n" : "\n\n"}${colorTheme}\n`;
  }

  if (current !== existing) {
    await writeFile(filePath, current, "utf8");
  }
};

const configureNextTailwind = async (directory: string) => {
  const cssPath = path.join(directory, "src", "app", "globals.css");

  await configureCss(cssPath);

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

  await configureCss(cssPath);

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
    viteConfig = prependVitePlugin(viteConfig, "tailwindcss()");
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

const configureViteTailwind = async (directory: string, cssPath: string) => {
  await configureCss(cssPath);

  const viteConfigPath = path.join(directory, "vite.config.ts");

  let viteConfig = await readFile(viteConfigPath, "utf8");

  if (!viteConfig.includes("@tailwindcss/vite")) {
    viteConfig = `import tailwindcss from "@tailwindcss/vite";\n` + viteConfig;
  }

  if (!viteConfig.includes("tailwindcss()")) {
    viteConfig = prependVitePlugin(viteConfig, "tailwindcss()");
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

  if (framework === "react-router") {
    await configureViteTailwind(directory, path.join(directory, "app", "app.css"));
    return;
  }

  await configureViteTailwind(directory, path.join(directory, "src", "index.css"));
};

export { configureTailwind };
