import { readFile, realpath } from "node:fs/promises";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

import type { CatalogSource } from "./index";
import { CatalogSourceError, parseJsonCatalog } from "./index";

const canonicalize = (locale: string): string => {
  try {
    const [canonical] = Intl.getCanonicalLocales(locale);

    if (!canonical) {
      throw new Error();
    }

    return canonical;
  } catch {
    throw new CatalogSourceError(`Invalid BCP 47 catalog locale "${locale}".`);
  }
};

const namespaceSegments = (namespace: string | undefined): string[] => {
  if (!namespace) {
    return [];
  }

  const segments = namespace.split(".");

  if (
    segments.some(
      (segment) =>
        !segment || !/^[A-Za-z0-9_-]+$/.test(segment) || segment === "." || segment === "..",
    )
  ) {
    throw new CatalogSourceError(
      `Invalid catalog namespace "${namespace}".`,
    );
  }

  return segments;
};

export interface FileCatalogSourceOptions {
  rootDir: string;
}

export const createFileCatalogSource = (
  options: FileCatalogSourceOptions,
): CatalogSource => {
  if (!isAbsolute(options.rootDir)) {
    throw new CatalogSourceError("File catalog rootDir must be an absolute path.");
  }

  const rootDir = resolve(options.rootDir);

  return Object.freeze({
    async load(
      inputLocale: string,
      namespace?: string,
      signal?: AbortSignal,
    ) {
      const locale = canonicalize(inputLocale);
      const segments = namespaceSegments(namespace);
      const filePath = segments.length
        ? join(rootDir, locale, ...segments.slice(0, -1), `${segments.at(-1)}.json`)
        : join(rootDir, `${locale}.json`);

      let realRoot: string;
      let realFile: string;
      let contents: string;

      try {
        realRoot = await realpath(rootDir);
        realFile = await realpath(filePath);
        const relativePath = relative(realRoot, realFile);

        if (
          relativePath === ".." ||
          relativePath.startsWith(`..${sep}`) ||
          isAbsolute(relativePath)
        ) {
          throw new CatalogSourceError(
            `Catalog path for "${locale}" escapes its configured root.`,
          );
        }

        contents = await readFile(realFile, {
          encoding: "utf8",
          signal,
        });
      } catch (error) {
        if (error instanceof CatalogSourceError) {
          throw error;
        }

        if (signal?.aborted) {
          throw signal.reason ?? error;
        }

        throw new CatalogSourceError(
          `Could not read the catalog for "${locale}"${namespace ? ` namespace "${namespace}"` : ""}.`,
          { cause: error },
        );
      }

      const catalog = parseJsonCatalog(contents, locale);
      return catalog;
    },
  });
};
