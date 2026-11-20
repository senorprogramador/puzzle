import IntlMessageFormat from "intl-messageformat";

import type { MessageCatalog, MessageEntry } from "../runtime";

export interface CatalogValidationIssue {
  code:
    | "invalid-locale"
    | "invalid-catalog"
    | "missing-key"
    | "unused-key"
    | "invalid-message"
    | "placeholder-mismatch";
  locale: string;
  key?: string;
  message: string;
}

export interface ValidateCatalogsOptions {
  catalogs: Readonly<Record<string, unknown>>;
  defaultLocale: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const flattenCatalog = (
  value: unknown,
  prefix = "",
  entries: Record<string, string> = Object.create(null) as Record<
    string,
    string
  >,
  ancestors = new WeakSet<object>(),
): Record<string, string> => {
  if (!isRecord(value)) {
    throw new Error(`Catalog value at "${prefix || "<root>"}" must be an object.`);
  }

  if (ancestors.has(value)) {
    throw new Error(
      `Catalog value at "${prefix || "<root>"}" contains a circular reference.`,
    );
  }

  ancestors.add(value);

  for (const [key, entry] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (!key || key.includes(".")) {
      throw new Error(
        `Catalog key "${key}" at "${prefix || "<root>"}" is empty or contains ".", which is reserved for nested paths.`,
      );
    }

    if (typeof entry === "string") {
      entries[path] = entry;
    } else if (isRecord(entry)) {
      flattenCatalog(entry, path, entries, ancestors);
    } else {
      throw new Error(`Catalog value at "${path}" must be a string or object.`);
    }
  }

  ancestors.delete(value);
  return entries;
};

const canonicalLocale = (locale: string): string | undefined => {
  try {
    return Intl.getCanonicalLocales(locale)[0];
  } catch {
    return undefined;
  }
};

const getVariables = (message: string): string[] =>
  [...message.matchAll(/\{\s*([A-Za-z_][\w.-]*)/g)]
    .map((match) => match[1])
    .filter((name): name is string => name !== undefined)
    .sort();

const placeholdersMatch = (left: string, right: string): boolean => {
  const leftVariables = getVariables(left);
  const rightVariables = getVariables(right);

  return (
    leftVariables.length === rightVariables.length &&
    leftVariables.every((variable, index) => variable === rightVariables[index])
  );
};

export const validateCatalogs = (
  options: ValidateCatalogsOptions,
): CatalogValidationIssue[] => {
  const issues: CatalogValidationIssue[] = [];
  const catalogs = new Map<string, Record<string, string>>();

  for (const [inputLocale, catalog] of Object.entries(options.catalogs)) {
    const locale = canonicalLocale(inputLocale);

    if (!locale) {
      issues.push({
        code: "invalid-locale",
        locale: inputLocale,
        message: `Invalid BCP 47 locale "${inputLocale}".`,
      });
      continue;
    }

    if (catalogs.has(locale)) {
      issues.push({
        code: "invalid-locale",
        locale,
        message: `More than one catalog resolves to "${locale}".`,
      });
      continue;
    }

    try {
      catalogs.set(locale, flattenCatalog(catalog));
    } catch (error) {
      issues.push({
        code: "invalid-catalog",
        locale,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const defaultLocale = canonicalLocale(options.defaultLocale);

  if (!defaultLocale) {
    issues.push({
      code: "invalid-locale",
      locale: options.defaultLocale,
      message: `Invalid default BCP 47 locale "${options.defaultLocale}".`,
    });
    return issues;
  }

  const referenceCatalog = catalogs.get(defaultLocale);

  if (!referenceCatalog) {
    issues.push({
      code: "invalid-catalog",
      locale: defaultLocale,
      message: `The default locale "${defaultLocale}" has no valid catalog.`,
    });
    return issues;
  }

  for (const [locale, catalog] of catalogs) {
    for (const [key, message] of Object.entries(catalog)) {
      try {
        new IntlMessageFormat(message, locale);
      } catch (error) {
        issues.push({
          code: "invalid-message",
          locale,
          key,
          message: error instanceof Error ? error.message : String(error),
        });
      }

      const referenceMessage = referenceCatalog[key];

      if (
        referenceMessage !== undefined &&
        !placeholdersMatch(referenceMessage, message)
      ) {
        issues.push({
          code: "placeholder-mismatch",
          locale,
          key,
          message: `Placeholder names in "${key}" do not match "${defaultLocale}".`,
        });
      }

      if (referenceMessage === undefined) {
        issues.push({
          code: "unused-key",
          locale,
          key,
          message: `Key "${key}" is not present in the default locale "${defaultLocale}".`,
        });
      }
    }

    for (const key of Object.keys(referenceCatalog)) {
      if (catalog[key] === undefined) {
        issues.push({
          code: "missing-key",
          locale,
          key,
          message: `Key "${key}" is missing from locale "${locale}".`,
        });
      }
    }
  }

  return issues;
};

export const findUnusedTranslationKeys = (
  catalog: MessageCatalog,
  usedKeys: Iterable<string>,
): string[] => {
  const used = new Set(usedKeys);
  return Object.keys(flattenCatalog(catalog))
    .filter((key) => !used.has(key))
    .sort();
};

export const findMissingTranslationKeys = (
  catalog: MessageCatalog,
  usedKeys: Iterable<string>,
): string[] => {
  const available = new Set(Object.keys(flattenCatalog(catalog)));

  return [...new Set(usedKeys)]
    .filter((key) => !available.has(key))
    .sort();
};

export const optimizeCatalog = (
  catalog: MessageCatalog,
  usedKeys: Iterable<string>,
): MessageCatalog => {
  flattenCatalog(catalog);
  const used = new Set(usedKeys);
  const prune = (
    current: MessageCatalog,
    prefix = "",
  ): MessageCatalog | undefined => {
    const entries: [string, MessageEntry][] = [];

    for (const [key, value] of Object.entries(current)) {
      const path = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") {
        if (used.has(path)) {
          entries.push([key, value]);
        }
      } else {
        const nested = prune(value, path);

        if (nested && Object.keys(nested).length > 0) {
          entries.push([key, nested]);
        }
      }
    }

    return entries.length > 0
      ? Object.freeze(Object.fromEntries(entries))
      : undefined;
  };

  return prune(catalog) ?? Object.freeze({});
};

const renderInterface = (
  catalog: Readonly<Record<string, unknown>>,
  indent: number,
): string => {
  const padding = " ".repeat(indent);
  const lines: string[] = ["{"];

  for (const [key, value] of Object.entries(catalog).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    if (typeof value === "string") {
      lines.push(`${padding}  readonly ${JSON.stringify(key)}: ${JSON.stringify(value)};`);
    } else if (isRecord(value)) {
      lines.push(
        `${padding}  readonly ${JSON.stringify(key)}: ${renderInterface(value, indent + 2).trimStart()};`,
      );
    }
  }

  lines.push(`${padding}}`);
  return lines.join("\n");
};

export const generateCatalogTypes = (
  catalog: MessageCatalog,
  typeName = "Messages",
): string => {
  if (!/^[A-Za-z_$][\w$]*$/.test(typeName)) {
    throw new Error(`Invalid TypeScript type name "${typeName}".`);
  }

  flattenCatalog(catalog);

  return `export interface ${typeName} ${renderInterface(catalog, 0)}\n`;
};

export const generateLocaleCatalogTypes = (
  catalogs: Readonly<Record<string, MessageCatalog>>,
  typeName = "Messages",
): string => {
  if (!/^[A-Za-z_$][\w$]*$/.test(typeName)) {
    throw new Error(`Invalid TypeScript type name "${typeName}".`);
  }

  const flattened = new Map<string, Record<string, string>>();
  const localeCatalogs = new Map<string, MessageCatalog>();

  for (const [inputLocale, catalog] of Object.entries(catalogs)) {
    const locale = canonicalLocale(inputLocale);

    if (!locale) {
      throw new Error(`Invalid BCP 47 locale "${inputLocale}".`);
    }

    if (flattened.has(locale)) {
      throw new Error(`More than one catalog resolves to "${locale}".`);
    }

    flattened.set(locale, flattenCatalog(catalog));
    localeCatalogs.set(locale, catalog);
  }

  if (flattened.size === 0) {
    throw new Error("At least one locale catalog is required.");
  }

  const locales = [...flattened.keys()].sort((left, right) =>
    left.localeCompare(right),
  );
  const firstCatalog = flattened.get(locales[0] ?? "");
  const commonKeys = Object.keys(firstCatalog ?? {}).filter((key) =>
    locales.every((locale) => flattened.get(locale)?.[key] !== undefined),
  );
  const commonTree: Record<string, unknown> = Object.create(null) as Record<
    string,
    unknown
  >;

  for (const key of commonKeys) {
    const messages = [
      ...new Set(
        locales
          .map((locale) => flattened.get(locale)?.[key])
          .filter((message): message is string => message !== undefined),
      ),
    ].sort();
    const path = key.split(".");
    let current = commonTree;

    for (const segment of path.slice(0, -1)) {
      const child = current[segment];

      if (!isRecord(child)) {
        current[segment] = Object.create(null) as Record<string, unknown>;
      }

      current = current[segment] as Record<string, unknown>;
    }

    const leaf = path[path.length - 1];

    if (leaf !== undefined) {
      current[leaf] = messages;
    }
  }

  const renderTypeObject = (
    value: Readonly<Record<string, unknown>>,
    indent: number,
  ): string => {
    const padding = " ".repeat(indent);
    const lines = ["{"];

    for (const [key, entry] of Object.entries(value).sort(([left], [right]) =>
      left.localeCompare(right),
    )) {
      if (Array.isArray(entry) && entry.every((item) => typeof item === "string")) {
        lines.push(
          `${padding}  readonly ${JSON.stringify(key)}: ${entry.map((item) => JSON.stringify(item)).join(" | ")};`,
        );
      } else if (isRecord(entry)) {
        lines.push(
          `${padding}  readonly ${JSON.stringify(key)}: ${renderTypeObject(entry, indent + 2).trimStart()};`,
        );
      }
    }

    lines.push(`${padding}}`);
    return lines.join("\n");
  };

  const localizedTypes = locales.map((locale) => {
    const catalog = localeCatalogs.get(locale);

    if (!catalog) {
      throw new Error(`Missing catalog for locale "${locale}".`);
    }

    return `  readonly ${JSON.stringify(locale)}: ${renderInterface(catalog, 2).trimStart()};`;
  });
  const localizedTypeName = `${typeName}ByLocale`;
  const messagesType = renderTypeObject(commonTree, 0);

  return [
    `export type ${typeName} = ${messagesType};`,
    `export type ${localizedTypeName} = {`,
    ...localizedTypes,
    "};",
    "",
  ].join("\n");
};

export type { MessageCatalog, MessageEntry };
