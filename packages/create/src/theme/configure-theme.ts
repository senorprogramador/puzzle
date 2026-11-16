import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

import path from "node:path";

import {
  getFontDownloadScript,
  getThemeTemplates,
  obsoleteTemplatePaths,
  type TemplateOptions,
} from "./templates";

const writeTemplates = async (
  directory: string,
  templates: Record<string, string>,
) => {
  await Promise.all(
    Object.entries(templates).map(async ([relativePath, content]) => {
      const filePath = path.join(directory, relativePath);

      await mkdir(path.dirname(filePath), {
        recursive: true,
      });

      await writeFile(filePath, content, "utf8");
    }),
  );
};

const addFontDownloadScript = async (
  directory: string,
  options: TemplateOptions,
) => {
  const packageJsonPath = path.join(directory, "package.json");

  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
    scripts?: Record<string, string>;
    [key: string]: unknown;
  };

  packageJson.scripts = {
    ...packageJson.scripts,
    "fonts:download": getFontDownloadScript(options.framework),
  };

  await writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );
};

/**
 * Lets TypeScript type the imported puzzle-fonts.json. The TanStack Start
 * template's tsconfig.json contains comments, so it is edited as text.
 */
const enableJsonModules = async (directory: string) => {
  const tsconfigPath = path.join(directory, "tsconfig.json");
  const tsconfig = await readFile(tsconfigPath, "utf8").catch(() => null);

  if (tsconfig === null || tsconfig.includes('"resolveJsonModule"')) {
    return;
  }

  await writeFile(
    tsconfigPath,
    tsconfig.replace(
      /("compilerOptions"\s*:\s*\{)(\s*)/,
      (_match, start: string, whitespace: string) =>
        `${start}${whitespace}"resolveJsonModule": true,${whitespace}`,
    ),
    "utf8",
  );
};

const configureTheme = async (
  directory: string,
  options: TemplateOptions,
): Promise<void> => {
  await Promise.all(
    (obsoleteTemplatePaths[options.framework] ?? []).map((relativePath) =>
      rm(path.join(directory, relativePath), {
        recursive: true,
        force: true,
      }),
    ),
  );

  await writeTemplates(directory, getThemeTemplates(options));
  await addFontDownloadScript(directory, options);

  if (options.framework === "tanstack") {
    await enableJsonModules(directory);
  }
};

export { configureTheme, writeTemplates };
