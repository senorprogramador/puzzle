import { mkdir, rm, writeFile } from "node:fs/promises";

import path from "node:path";

import {
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
};

export { configureTheme, writeTemplates };
