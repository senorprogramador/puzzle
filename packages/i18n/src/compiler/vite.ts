import { readdir, readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

import type { Plugin } from "vite";
import {
  findMissingTranslationKeys,
  findUnusedTranslationKeys,
  validateCatalogs,
} from ".";
import { extractTranslationKeys } from "./typescript";
import { parseJsonCatalog } from "../sources";

export interface I18nVitePluginOptions {
  catalogDirectory: string;
  sourceDirectories: readonly string[];
  defaultLocale: string;
  callees?: readonly string[];
}

export interface I18nViteValidationResult {
  diagnostics: readonly string[];
  watchedFiles: readonly string[];
}

const SOURCE_EXTENSION = /\.(?:tsx?|jsx?|mts|cts|mjs|cjs)$/;
const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".turbo",
  "build",
  "coverage",
  "dist",
  "node_modules",
]);

const canonicalLocale = (locale: string): string | undefined => {
  try {
    return Intl.getCanonicalLocales(locale)[0];
  } catch {
    return undefined;
  }
};

const collectSourceFiles = async (directory: string): Promise<string[]> => {
  const files: string[] = [];

  const visit = async (currentDirectory: string): Promise<void> => {
    const entries = await readdir(currentDirectory, { withFileTypes: true });

    for (const entry of entries.sort((left, right) =>
      left.name.localeCompare(right.name),
    )) {
      const path = resolve(currentDirectory, entry.name);

      if (entry.isDirectory()) {
        if (!IGNORED_DIRECTORIES.has(entry.name)) {
          await visit(path);
        }
      } else if (entry.isFile() && SOURCE_EXTENSION.test(entry.name)) {
        files.push(path);
      }
    }
  };

  await visit(directory);
  return files;
};

export const validateI18nProject = async (
  options: I18nVitePluginOptions,
  root = process.cwd(),
): Promise<I18nViteValidationResult> => {
  if (options.sourceDirectories.length === 0) {
    throw new Error("At least one source directory must be configured.");
  }

  const catalogPath = resolve(root, options.catalogDirectory);
  const catalogFiles = (await readdir(catalogPath, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .sort((left, right) => left.name.localeCompare(right.name));

  if (catalogFiles.length === 0) {
    throw new Error(`No JSON catalogs were found in "${catalogPath}".`);
  }

  const catalogs: Record<string, ReturnType<typeof parseJsonCatalog>> = {};
  const watchedFiles = [catalogPath];

  for (const file of catalogFiles) {
    const path = resolve(catalogPath, file.name);
    const locale = basename(file.name, ".json");
    catalogs[locale] = parseJsonCatalog(await readFile(path, "utf8"), locale);
    watchedFiles.push(path);
  }

  const diagnostics = validateCatalogs({
    catalogs,
    defaultLocale: options.defaultLocale,
  }).map(
    (issue) =>
      `[${issue.code}] ${issue.locale}${issue.key ? ` ${issue.key}` : ""}: ${issue.message}`,
  );
  const sourceFiles = (
    await Promise.all(
      options.sourceDirectories.map((directory) =>
        collectSourceFiles(resolve(root, directory)),
      ),
    )
  )
    .flat()
    .sort();
  const usedKeys = new Set<string>();

  for (const file of sourceFiles) {
    const result = extractTranslationKeys(await readFile(file, "utf8"), {
      fileName: file,
      callees: options.callees,
    });

    result.keys.forEach((key) => usedKeys.add(key));
    diagnostics.push(
      ...result.diagnostics.map(
        (diagnostic) =>
          `[${diagnostic.code}] ${diagnostic.file}:${diagnostic.line}:${diagnostic.column}: ${diagnostic.message}`,
      ),
    );
  }

  watchedFiles.push(...options.sourceDirectories.map((directory) => resolve(root, directory)));
  watchedFiles.push(...sourceFiles);

  const resolvedDefaultLocale = canonicalLocale(options.defaultLocale);
  const defaultCatalog = resolvedDefaultLocale
    ? Object.entries(catalogs).find(
        ([locale]) => canonicalLocale(locale) === resolvedDefaultLocale,
      )?.[1]
    : undefined;

  if (defaultCatalog) {
    diagnostics.push(
      ...findMissingTranslationKeys(defaultCatalog, usedKeys).map(
        (key) =>
          `[missing-key] ${key}: referenced in source but absent from the default catalog.`,
      ),
      ...findUnusedTranslationKeys(defaultCatalog, usedKeys).map(
        (key) =>
          `[unused-key] ${key}: present in the default catalog but not referenced in source.`,
      ),
    );
  }

  return {
    diagnostics: Object.freeze(diagnostics),
    watchedFiles: Object.freeze([...new Set(watchedFiles)]),
  };
};

export const puzzleI18n = (options: I18nVitePluginOptions): Plugin => {
  let root = process.cwd();

  return {
    name: "@puzzle-ui/i18n",
    enforce: "pre",
    configResolved(config) {
      root = config.root;
    },
    async buildStart() {
      const result = await validateI18nProject(options, root);

      result.watchedFiles.forEach((file) => this.addWatchFile(file));

      if (result.diagnostics.length > 0) {
        this.error(
          `Puzzle i18n validation failed:\n${result.diagnostics.join("\n")}`,
        );
      }
    },
  };
};
