import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

import {
  findMissingTranslationKeys,
  findUnusedTranslationKeys,
  generateCatalogTypes,
  validateCatalogs,
} from "../compiler";
import { parseJsonCatalog } from "../sources";

interface CliOutput {
  stdout(message: string): void;
  stderr(message: string): void;
  cwd: string;
}

class CliUsageError extends Error {
  readonly exitCode = 2;
}

const defaultOutput: CliOutput = {
  stdout: (message) => process.stdout.write(`${message}\n`),
  stderr: (message) => process.stderr.write(`${message}\n`),
  cwd: process.cwd(),
};

const usage = `Puzzle Multilingual CLI

Usage:
  puzzle-i18n init [directory] [--default-locale <locale>] [--locales <list>]
  puzzle-i18n validate [catalog-directory] [--default-locale <locale>] [--config <file>]
  puzzle-i18n generate-types [catalog-file] [--out <file>] [--locale <locale>] [--config <file>]
  puzzle-i18n scan [source-directory] [--catalog <file>] [--callees <names>] [--config <file>]
  puzzle-i18n --help
  puzzle-i18n --version

Catalog validation reads one <locale>.json file per locale from the directory.
Without overrides, validate, generate-types, and scan read puzzle-i18n.config.json.
Source scanning checks static t("key") and translate("key") calls.`;

const parseOption = (
  args: readonly string[],
  option: string,
): string | undefined => {
  const index = args.indexOf(option);

  if (index < 0) {
    return undefined;
  }

  const value = args[index + 1];

  if (!value || value.startsWith("--")) {
    throw new CliUsageError(`Expected a value after ${option}.`);
  }

  if (args.lastIndexOf(option) !== index) {
    throw new CliUsageError(`Option ${option} can only be provided once.`);
  }

  return value;
};

const rejectUnknownOptions = (
  args: readonly string[],
  allowed: readonly string[],
): void => {
  for (const arg of args) {
    if (arg.startsWith("--") && !allowed.includes(arg)) {
      throw new CliUsageError(`Unknown option "${arg}".`);
    }
  }
};

const getPositionals = (
  args: readonly string[],
  valueOptions: readonly string[],
): string[] => {
  const positionals: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (!arg) {
      continue;
    }

    if (arg.startsWith("--")) {
      if (!valueOptions.includes(arg)) {
        throw new CliUsageError(`Unknown option "${arg}".`);
      }

      const value = args[index + 1];

      if (!value || value.startsWith("--")) {
        throw new CliUsageError(`Expected a value after ${arg}.`);
      }

      index += 1;
    } else {
      positionals.push(arg);
    }
  }

  return positionals;
};

const readPackageVersion = async (): Promise<string> => {
  const packageJsonUrl = new URL("../../package.json", import.meta.url);
  const contents = await readFile(packageJsonUrl, "utf8");
  const parsed: unknown = JSON.parse(contents);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("version" in parsed) ||
    typeof parsed.version !== "string"
  ) {
    throw new Error("Package metadata does not contain a string version.");
  }

  return parsed.version;
};

const validateCommand = async (
  args: readonly string[],
  output: CliOutput,
): Promise<number> => {
  const config = await readProjectConfig(args, output);
  const positionals = getPositionals(args, ["--default-locale", "--config"]);
  const [directory, ...extraPositionals] = positionals;
  const catalogDirectory =
    directory ?? config?.catalogDirectory;
  const defaultLocale =
    parseOption(args, "--default-locale") ?? config?.defaultLocale;

  if (
    !catalogDirectory ||
    extraPositionals.length > 0 ||
    !defaultLocale
  ) {
    throw new CliUsageError(
      "validate requires a catalog directory and defaultLocale from config or --default-locale.",
    );
  }

  const absoluteDirectory = resolve(output.cwd, catalogDirectory);
  const files = (await readdir(absoluteDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .sort((left, right) => left.name.localeCompare(right.name));

  if (files.length === 0) {
    throw new Error(`No JSON catalogs were found in "${absoluteDirectory}".`);
  }

  const foundLocales = new Set(
    files.map((file) => basename(file.name, ".json")),
  );
  const missingLocales =
    config?.locales.filter((locale) => !foundLocales.has(locale)) ?? [];

  if (missingLocales.length > 0) {
    missingLocales.forEach((locale) =>
      output.stderr(
        `[missing-locale] ${locale}: expected catalog "${locale}.json" in "${absoluteDirectory}".`,
      ),
    );
    return 1;
  }

  const catalogs: Record<string, ReturnType<typeof parseJsonCatalog>> = {};

  for (const file of files) {
    const locale = basename(file.name, ".json");
    const content = await readFile(resolve(absoluteDirectory, file.name), "utf8");
    catalogs[locale] = parseJsonCatalog(content, locale);
  }

  const issues = validateCatalogs({ catalogs, defaultLocale });

  if (issues.length > 0) {
    for (const issue of issues) {
      const location = issue.key ? ` ${issue.key}` : "";
      output.stderr(`[${issue.code}] ${issue.locale}${location}: ${issue.message}`);
    }

    return 1;
  }

  output.stdout(`Catalogs are valid (${files.length} locales).`);
  return 0;
};

const generateTypesCommand = async (
  args: readonly string[],
  output: CliOutput,
): Promise<number> => {
  const config = await readProjectConfig(args, output);
  const positionals = getPositionals(args, [
    "--out",
    "--type-name",
    "--locale",
    "--config",
  ]);
  const [file, ...extraPositionals] = positionals;
  const outputFile = parseOption(args, "--out");
  const typeName = parseOption(args, "--type-name") ?? "Messages";
  const localeArg = parseOption(args, "--locale");
  const locale = localeArg
    ? canonicalizeLocale(localeArg)
    : config?.defaultLocale;
  const catalogFile = file ??
    (config && locale
      ? resolve(output.cwd, config.catalogDirectory, `${locale}.json`)
      : undefined);
  const declarationFile = outputFile ?? (config ? "messages.d.ts" : undefined);

  if (!catalogFile || extraPositionals.length > 0 || !declarationFile) {
    throw new CliUsageError(
      "generate-types requires a catalog file and --out, or a valid project config.",
    );
  }

  const inputPath = resolve(output.cwd, catalogFile);
  const outputPath = resolve(output.cwd, declarationFile);
  const catalogLocale = canonicalizeLocale(
    basename(inputPath).replace(/\.json$/, ""),
  );
  const catalog = parseJsonCatalog(
    await readFile(inputPath, "utf8"),
    catalogLocale,
  );
  const declarations = generateCatalogTypes(catalog, typeName);

  await writeFile(outputPath, declarations, "utf8");
  output.stdout(`Generated ${outputPath}.`);
  return 0;
};

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

const scanCommand = async (
  args: readonly string[],
  output: CliOutput,
): Promise<number> => {
  const config = await readProjectConfig(args, output);
  const positionals = getPositionals(args, [
    "--catalog",
    "--callees",
    "--config",
  ]);
  const [directory, ...extraPositionals] = positionals;
  const configuredDirectories = directory
    ? [directory]
    : config?.sourceDirectories;
  const catalogFile =
    parseOption(args, "--catalog") ??
    (config
      ? resolve(
          output.cwd,
          config.catalogDirectory,
          `${config.defaultLocale}.json`,
        )
      : undefined);
  const callees = parseOption(args, "--callees")
    ?.split(",")
    .map((callee) => callee.trim())
    .filter(Boolean);

  if (
    !configuredDirectories ||
    configuredDirectories.length === 0 ||
    extraPositionals.length > 0 ||
    !catalogFile
  ) {
    throw new CliUsageError(
      "scan requires a source directory and catalog file, or a valid project config.",
    );
  }

  const sourceFiles = [
    ...new Set(
      (
        await Promise.all(
          configuredDirectories.map((sourceDirectory) =>
            collectSourceFiles(resolve(output.cwd, sourceDirectory)),
          ),
        )
      ).flat(),
    ),
  ];

  if (sourceFiles.length === 0) {
    throw new Error(
      `No supported source files were found in "${configuredDirectories.join(", ")}".`,
    );
  }

  const absoluteCatalogFile = resolve(output.cwd, catalogFile);
  const catalog = parseJsonCatalog(
    await readFile(absoluteCatalogFile, "utf8"),
    basename(absoluteCatalogFile).replace(/\.json$/, ""),
  );
  const { extractTranslationKeys } = await import("../compiler/typescript");
  const usedKeys = new Set<string>();
  const diagnostics: string[] = [];

  for (const file of sourceFiles) {
    const result = extractTranslationKeys(await readFile(file, "utf8"), {
      fileName: file,
      callees,
    });

    result.keys.forEach((key) => usedKeys.add(key));
    diagnostics.push(
      ...result.diagnostics.map(
        (diagnostic) =>
          `[${diagnostic.code}] ${diagnostic.file}:${diagnostic.line}:${diagnostic.column}: ${diagnostic.message}`,
      ),
    );
  }

  const missing = findMissingTranslationKeys(catalog, usedKeys);
  const unused = findUnusedTranslationKeys(catalog, usedKeys);
  diagnostics.push(
    ...missing.map((key) => `[missing-key] ${key}: referenced but absent from catalog.`),
    ...unused.map((key) => `[unused-key] ${key}: catalog key is not referenced in source.`),
  );

  if (diagnostics.length > 0) {
    diagnostics.forEach(output.stderr);
    return 1;
  }

  output.stdout(
    `Source scan passed (${sourceFiles.length} files, ${usedKeys.size} translation keys).`,
  );
  return 0;
};

const canonicalizeLocale = (locale: string): string => {
  try {
    const [canonical] = Intl.getCanonicalLocales(locale);

    if (!canonical) {
      throw new Error();
    }

    return canonical;
  } catch {
    throw new CliUsageError(`Invalid BCP 47 locale "${locale}".`);
  }
};

const isObjectRecord = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

interface I18nCliConfig {
  defaultLocale: string;
  locales: readonly string[];
  catalogDirectory: string;
  sourceDirectories: readonly string[];
}

const readProjectConfig = async (
  args: readonly string[],
  output: CliOutput,
): Promise<I18nCliConfig | undefined> => {
  const configArg = parseOption(args, "--config");
  const configPath = resolve(
    output.cwd,
    configArg ?? "puzzle-i18n.config.json",
  );
  let contents: string;

  try {
    contents = await readFile(configPath, "utf8");
  } catch (error) {
    if (
      configArg === undefined &&
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return undefined;
    }

    throw error;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(contents);
  } catch (error) {
    throw new Error(
      `Could not parse i18n config "${configPath}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (!isObjectRecord(parsed)) {
    throw new Error(`i18n config "${configPath}" must contain a JSON object.`);
  }

  const defaultLocale =
    typeof parsed.defaultLocale === "string"
      ? canonicalizeLocale(parsed.defaultLocale)
      : undefined;
  const locales = Array.isArray(parsed.locales) &&
      parsed.locales.every((locale) => typeof locale === "string")
    ? parsed.locales.map(canonicalizeLocale)
    : undefined;
  const catalogDirectory =
    typeof parsed.catalogDirectory === "string" &&
      parsed.catalogDirectory.trim()
      ? parsed.catalogDirectory
      : undefined;
  const sourceDirectories =
    Array.isArray(parsed.sourceDirectories) &&
        parsed.sourceDirectories.length > 0 &&
        parsed.sourceDirectories.every(
          (directory) => typeof directory === "string" && directory.trim(),
        )
      ? parsed.sourceDirectories as string[]
      : undefined;

  if (
    !defaultLocale ||
    !locales ||
    new Set(locales).size !== locales.length ||
    !locales.includes(defaultLocale) ||
    !catalogDirectory ||
    !sourceDirectories
  ) {
    throw new Error(
      `i18n config "${configPath}" must define a defaultLocale included in locales, catalogDirectory, and non-empty sourceDirectories.`,
    );
  }

  return Object.freeze({
    defaultLocale,
    locales: Object.freeze(locales),
    catalogDirectory,
    sourceDirectories: Object.freeze(sourceDirectories),
  });
};

const detectFramework = async (directory: string): Promise<string> => {
  let contents: string;

  try {
    contents = await readFile(resolve(directory, "package.json"), "utf8");
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return "generic";
    }

    throw error;
  }

  const parsed: unknown = JSON.parse(contents);

  if (!isObjectRecord(parsed)) {
    throw new Error("package.json must contain a JSON object.");
  }

  const dependencies = [
    parsed.dependencies,
    parsed.devDependencies,
    parsed.optionalDependencies,
  ].filter(isObjectRecord);
  const hasDependency = (name: string): boolean =>
    dependencies.some((items) => Object.hasOwn(items, name));

  if (hasDependency("next")) {
    return "next";
  }

  if (
    hasDependency("@tanstack/react-start") ||
    hasDependency("@tanstack/react-router")
  ) {
    return "tanstack";
  }

  if (hasDependency("react-router")) {
    return "react-router";
  }

  return hasDependency("react") ? "react" : "generic";
};

const fileExists = async (path: string): Promise<boolean> => {
  try {
    await readFile(path);
    return true;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return false;
    }

    throw error;
  }
};

const initCommand = async (
  args: readonly string[],
  output: CliOutput,
): Promise<number> => {
  const positionals = getPositionals(args, [
    "--default-locale",
    "--locales",
  ]);
  const [directoryArg, ...extraPositionals] = positionals;
  const defaultLocale = canonicalizeLocale(
    parseOption(args, "--default-locale") ?? "en",
  );
  const localeOption = parseOption(args, "--locales");
  const localeInputs = localeOption === undefined
    ? [defaultLocale]
    : localeOption.split(",").map((locale) => locale.trim());

  if (extraPositionals.length > 0) {
    throw new CliUsageError("init accepts at most one target directory.");
  }

  if (localeInputs.length === 0 || localeInputs.some((locale) => !locale)) {
    throw new CliUsageError("--locales must be a comma-separated locale list.");
  }

  const locales = localeInputs.map(canonicalizeLocale);

  if (new Set(locales).size !== locales.length) {
    throw new CliUsageError("--locales must not contain duplicate locales.");
  }

  if (!locales.includes(defaultLocale)) {
    throw new CliUsageError(
      `The default locale "${defaultLocale}" must be included in --locales.`,
    );
  }

  const directory = resolve(output.cwd, directoryArg ?? ".");
  const localeDirectory = resolve(directory, "locales");
  const framework = await detectFramework(directory);
  const configPath = resolve(directory, "puzzle-i18n.config.json");
  const catalogPaths = locales.map((locale) =>
    resolve(localeDirectory, `${locale}.json`),
  );
  const existingFiles: string[] = [];

  for (const path of [configPath, ...catalogPaths]) {
    if (await fileExists(path)) {
      existingFiles.push(path);
    }
  }

  if (existingFiles.length > 0) {
    throw new Error(
      `Initialization would overwrite existing files: ${existingFiles.join(", ")}.`,
    );
  }

  const config = {
    framework,
    defaultLocale,
    locales,
    catalogDirectory: "./locales",
    sourceDirectories: ["./src"],
  };
  const catalog = {
    common: {
      greeting: "Hello {name}",
    },
  };

  await mkdir(localeDirectory, { recursive: true });
  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
  });

  for (const path of catalogPaths) {
    await writeFile(path, `${JSON.stringify(catalog, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx",
    });
  }

  output.stdout(
    `Initialized Puzzle Multilingual for ${framework} with ${locales.length} locale(s).`,
  );
  return 0;
};

export const runI18nCli = async (
  args: readonly string[],
  output: Partial<CliOutput> = {},
): Promise<number> => {
  const io: CliOutput = { ...defaultOutput, ...output };

  try {
    const [command, ...commandArgs] = args;

    if (!command || command === "--help" || command === "-h") {
      io.stdout(usage);
      return 0;
    }

    if (command === "--version" || command === "-v") {
      io.stdout(`@puzzle-ui/i18n ${await readPackageVersion()}`);
      return 0;
    }

    if (command === "validate") {
      return await validateCommand(commandArgs, io);
    }

    if (command === "generate-types") {
      return await generateTypesCommand(commandArgs, io);
    }

    if (command === "scan") {
      return await scanCommand(commandArgs, io);
    }

    if (command === "init") {
      return await initCommand(commandArgs, io);
    }

    throw new CliUsageError(`Unknown command "${command}".`);
  } catch (error) {
    io.stderr(error instanceof Error ? error.message : String(error));
    return error instanceof CliUsageError ? error.exitCode : 1;
  }
};
