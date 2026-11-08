import { mkdir, writeFile } from "node:fs/promises";

import path from "node:path";

import type { Framework } from "../types";

import { themeTemplates } from "./templates";

const configureTheme = async (
  directory: string,
  framework: Framework,
): Promise<void> => {
  const templates = themeTemplates[framework];

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

export { configureTheme };
