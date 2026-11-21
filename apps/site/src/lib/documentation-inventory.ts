import { readFileSync, readdirSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const docsDirectory = fileURLToPath(
  new URL("../../content/docs/", import.meta.url),
);

export const getDocumentationFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory()
      ? getDocumentationFiles(path)
      : /\.mdx?$/.test(path)
        ? [path]
        : [];
  });

export const getDocumentationInventory = () =>
  getDocumentationFiles(docsDirectory)
    .map((file) => {
      const path = relative(docsDirectory, file).replaceAll("\\", "/");
      const content = readFileSync(file, "utf8");
      const title = content
        .match(/^title:\s*(.+)$/m)?.[1]
        ?.replace(/^["']|["']$/g, "");
      if (!title) throw new Error(`Missing documentation title: ${path}`);

      const slug = path.replace(/\.mdx?$/, "").replace(/(^|\/)index$/, "");
      return {
        path,
        url: `/docs/${slug}`.replace(/\/$/, ""),
        title,
      };
    })
    .sort((left, right) => left.url.localeCompare(right.url));
