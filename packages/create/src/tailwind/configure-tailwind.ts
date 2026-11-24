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
  const tokenMarker = "/* Puzzle design tokens */";
  const spacingTokens = [
    "0",
    "px",
    "0.5",
    "1",
    "1.5",
    "2",
    "3",
    "4",
    "5",
    "6",
    "8",
    "10",
    "12",
    "16",
    "20",
    "24",
  ];
  const fontSizes = [
    "xs",
    "sm",
    "base",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
  ];
  const typographyRoles = [
    "display1",
    "display2",
    "headline1",
    "headline2",
    "headline3",
    "headline4",
    "subtitle1",
    "subtitle2",
    "body1",
    "body2",
    "button",
    "caption",
    "overline",
  ];
  const fontWeights = ["normal", "medium", "semibold", "bold", "extrabold"];
  const lineHeights = ["none", "tight", "snug", "normal", "relaxed", "loose"];
  const letterSpacings = [
    "tighter",
    "tight",
    "normal",
    "wide",
    "wider",
    "widest",
  ];
  const fontGaps = [
    "heading-stack-gap",
    "heading-paragraph-gap",
    "paragraph-gap",
    "section-gap",
  ];
  const radii = ["none", "sm", "md", "lg", "xl", "2xl", "3xl", "full"];
  const shadows = ["none", "xs", "sm", "md", "lg", "xl"];
  const elevations = ["1", "2", "3", "4", "6", "8", "12", "16", "24"];
  const containerSizes = ["container", "content", "prose"];
  const motionDurations = ["fast", "normal", "slow"];
  const motionEasings = ["standard", "in", "out"];
  const zIndexes = [
    "base",
    "dropdown",
    "sticky",
    "navigation",
    "overlay",
    "modal",
    "popover",
    "toast",
    "tooltip",
  ];
  const tokenAliases = [
    ...spacingTokens.map(
      (token) =>
        `  --spacing-puzzle-${token}: var(--puzzle-space-${token});`,
    ),
    `  --spacing-puzzle-container-gutter: var(--puzzle-container-gutter);`,
    ...fontGaps.map(
      (token) =>
        `  --spacing-puzzle-font-gap-${token}: var(--puzzle-font-gap-${token});`,
    ),
    ...radii.map(
      (token) =>
        `  --radius-puzzle-${token}: var(--puzzle-radius-${token});`,
    ),
    ...shadows.map(
      (token) =>
        `  --shadow-puzzle-${token}: var(--puzzle-shadow-${token});`,
    ),
    ...elevations.map(
      (token) =>
        `  --shadow-puzzle-elevation-${token}: var(--puzzle-elevation-${token});`,
    ),
    ...fontSizes.map(
      (token) =>
        `  --text-puzzle-${token}: var(--puzzle-font-size-${token});`,
    ),
    ...typographyRoles.map(
      (token) =>
        `  --text-puzzle-${token}: var(--puzzle-font-size-${token});`,
    ),
    ...["body", "heading", "accent", ...typographyRoles].map(
      (token) =>
        `  --font-puzzle-${token}: var(--puzzle-font-family-${token});`,
    ),
    ...fontWeights.map(
      (token) =>
        `  --font-weight-puzzle-${token}: var(--puzzle-font-weight-${token});`,
    ),
    ...lineHeights.map(
      (token) =>
        `  --leading-puzzle-${token}: var(--puzzle-font-line-height-${token});`,
    ),
    ...letterSpacings.map(
      (token) =>
        `  --tracking-puzzle-${token}: var(--puzzle-font-letter-spacing-${token});`,
    ),
    ...containerSizes.map(
      (token) =>
        `  --container-puzzle-${token}: var(--puzzle-${token}-width);`,
    ),
    `  --color-puzzle-overlay-backdrop: var(--puzzle-overlay-backdrop);`,
    `  --blur-puzzle-overlay-backdrop: var(--puzzle-overlay-backdrop-blur);`,
    ...motionEasings.map(
      (token) =>
        `  --ease-puzzle-${token}: var(--puzzle-easing-${token});`,
    ),
  ];
  const tokenUtilities = [
    ...zIndexes.map(
      (token) => `@utility z-puzzle-${token} {
  z-index: var(--puzzle-z-index-${token});
}`,
    ),
    ...motionDurations.map(
      (token) => `@utility duration-puzzle-${token} {
  transition-duration: var(--puzzle-duration-${token});
}`,
    ),
    `@utility border-width-puzzle {
  border-width: var(--puzzle-border-width);
}`,
    `@utility border-width-puzzle-strong {
  border-width: var(--puzzle-border-width-strong);
}`,
    `@utility border-style-puzzle {
  border-style: var(--puzzle-border-style);
}`,
  ].join("\n\n");
  const tokenTheme = `${tokenMarker}
@theme inline {
${tokenAliases.join("\n")}
}

${tokenUtilities}`;
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

  if (!current.includes(tokenMarker)) {
    current += `${current.endsWith("\n") ? "\n" : "\n\n"}${tokenTheme}\n`;
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
