import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as ts from "typescript";
import { describe, expect, it } from "vitest";

import {
  findMissingTranslationKeys,
  findUnusedTranslationKeys,
  generateCatalogTypes,
  generateLocaleCatalogTypes,
  optimizeCatalog,
  validateCatalogs,
} from "../compiler";
import {
  extractTranslationKeys,
  transformTranslationKeys,
} from "../compiler/typescript";

const decodeVlq = (value: string, start: number): [number, number] => {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = 0;
  let shift = 0;
  let position = start;
  let digit: number;

  do {
    digit = alphabet.indexOf(value[position] ?? "");
    result |= (digit & 31) << shift;
    shift += 5;
    position += 1;
  } while ((digit & 32) !== 0);

  const negative = (result & 1) === 1;
  result >>>= 1;
  return [negative ? -result : result, position];
};

const decodeSourceMapLine = (line: string) => {
  let generatedColumn = 0;
  let source = 0;
  let originalLine = 0;
  let originalColumn = 0;

  return line.split(",").filter(Boolean).map((segment) => {
    let position = 0;
    let decoded: number;
    [decoded, position] = decodeVlq(segment, position);
    generatedColumn += decoded;
    [decoded, position] = decodeVlq(segment, position);
    source += decoded;
    [decoded, position] = decodeVlq(segment, position);
    originalLine += decoded;
    [decoded] = decodeVlq(segment, position);
    originalColumn += decoded;

    return { generatedColumn, source, originalLine, originalColumn };
  });
};

describe("catalog compiler utilities", () => {
  it("reports missing, extra, malformed, and placeholder-inconsistent messages", () => {
    const issues = validateCatalogs({
      defaultLocale: "en",
      catalogs: {
        en: {
          greeting: "Hello {name}",
          count: "{count, plural, one {# item} other {# items}}",
          broken: "Hello {name",
        },
        nl: {
          greeting: "Hallo {user}",
          extra: "Extra",
        },
      },
    });

    expect(issues.map((issue) => issue.code)).toContain("invalid-message");
    expect(issues.map((issue) => issue.code)).toContain("placeholder-mismatch");
    expect(issues.map((issue) => issue.code)).toContain("missing-key");
    expect(issues.map((issue) => issue.code)).toContain("unused-key");
  });

  it("generates stable nested types and identifies unused keys", () => {
    const catalog = {
      common: { greeting: "Hello {name}" },
      title: "Welcome",
    } as const;

    expect(generateCatalogTypes(catalog, "EnglishMessages")).toContain(
      'readonly "greeting": "Hello {name}"',
    );
    expect(findUnusedTranslationKeys(catalog, ["common.greeting"])).toEqual([
      "title",
    ]);
    expect(
      findMissingTranslationKeys(catalog, ["common.greeting", "missing"]),
    ).toEqual(["missing"]);
    expect(optimizeCatalog(catalog, ["common.greeting"])).toEqual({
      common: { greeting: "Hello {name}" },
    });
  });

  it("extracts static translation calls from TypeScript and flags dynamic keys", () => {
    const result = extractTranslationKeys(
      [
        'const greeting = t("common.greeting");',
        'const action = i18n.t("actions.save");',
        "const cancel = t(`actions.cancel`);",
        "const dynamic = t(key);",
      ].join("\n"),
      { fileName: "component.tsx" },
    );

    expect(result.keys).toEqual([
      "actions.cancel",
      "actions.save",
      "common.greeting",
    ]);
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: "dynamic-key",
        file: "component.tsx",
        line: 4,
      }),
    ]);
  });

  it("rewrites only static translation-key AST nodes and safely quotes replacements", () => {
    const source = [
      'const first = i18n.t(/* retained */ "legacy.key", values);',
      "const second = translate(`legacy.key`);",
      "const dynamic = t(dynamicKey);",
      'const unrelated = log("legacy.key");',
    ].join("\n");
    const result = transformTranslationKeys(source, {
      fileName: "component.ts",
      replacements: {
        "legacy.key": 'next"); globalThis.compromised = true; //',
      },
    });

    expect(result.code).toContain(
      'i18n.t(/* retained */ "next\\"); globalThis.compromised = true; //", values)',
    );
    expect(result.code).toContain(
      'translate("next\\"); globalThis.compromised = true; //")',
    );
    expect(result.code).toContain("t(dynamicKey)");
    expect(result.code).toContain('log("legacy.key")');
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: "dynamic-key",
        file: "component.ts",
        line: 3,
      }),
    ]);
  });

  it("preserves source-map positions around edits and can omit maps", () => {
    const source = 'const value = t("legacy.key");\nconst next = t("stable");';
    const result = transformTranslationKeys(source, {
      fileName: "component.ts",
      replacements: { "legacy.key": "localized.key" },
    });
    const map = JSON.parse(result.map ?? "null") as {
      version: number;
      file: string;
      sources: string[];
      sourcesContent: string[];
      mappings: string;
    };
    const generatedColumn = result.code.indexOf(");");
    const mappedEnd = decodeSourceMapLine(map.mappings.split(";")[0] ?? "").find(
      (segment) => segment.generatedColumn === generatedColumn,
    );

    expect(map).toMatchObject({
      version: 3,
      file: "component.ts",
      sources: ["component.ts"],
      sourcesContent: [source],
    });
    expect(mappedEnd).toMatchObject({
      source: 0,
      originalLine: 0,
      originalColumn: source.indexOf(");"),
    });
    expect(result.code.split("\n")).toHaveLength(source.split("\n").length);
    expect(
      transformTranslationKeys(source, {
        replacements: { "legacy.key": "localized.key" },
        sourceMap: false,
      }).map,
    ).toBeNull();
  });

  it("reports syntax errors and leaves malformed source untouched", () => {
    const source = 'const greeting = t("hello");\nconst broken = (';
    const result = transformTranslationKeys(source, {
      replacements: { hello: "bonjour" },
    });

    expect(result.code).toBe(source);
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "syntax-error",
          line: 2,
        }),
      ]),
    );
  });

  it("generates locale-aware common and per-locale declaration types", () => {
    const catalogs = {
      en: {
        common: { greeting: "Hello {name}", stable: "Same" },
        englishOnly: "English only",
      },
      fr: {
        common: { greeting: "Bonjour {prenom}", stable: "Identique" },
        frenchOnly: "Français seulement",
      },
    } as const;
    const declaration = generateLocaleCatalogTypes(catalogs);
    const fixturePath = fileURLToPath(
      new URL("./fixtures/generated-catalog-consumer.fixture", import.meta.url),
    );
    const consumerFile = fixturePath.replace(/\.fixture$/, ".ts");
    const generatedFile = resolve(dirname(consumerFile), "generated-catalogs.d.ts");
    const compilerOptions: ts.CompilerOptions = {
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      target: ts.ScriptTarget.ES2022,
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      jsx: ts.JsxEmit.ReactJSX,
    };
    const host = ts.createCompilerHost(compilerOptions);
    const consumerText = readFileSync(fixturePath, "utf8");
    const originalFileExists = host.fileExists.bind(host);
    const originalReadFile = host.readFile.bind(host);
    const originalGetSourceFile = host.getSourceFile.bind(host);
    const normalizePath = (path: string) => resolve(path);

    host.fileExists = (path) =>
      [consumerFile, generatedFile].includes(normalizePath(path)) ||
      originalFileExists(path);
    host.readFile = (path) => {
      const normalized = normalizePath(path);

      if (normalized === consumerFile) {
        return consumerText;
      }

      if (normalized === generatedFile) {
        return declaration;
      }

      return originalReadFile(path);
    };
    host.getSourceFile = (
      path,
      languageVersion,
      onError,
      shouldCreateNewSourceFile,
    ) => {
      const normalized = normalizePath(path);

      if (normalized === consumerFile) {
        return ts.createSourceFile(path, consumerText, languageVersion);
      }

      if (normalized === generatedFile) {
        return ts.createSourceFile(path, declaration, languageVersion);
      }

      return originalGetSourceFile(
        path,
        languageVersion,
        onError,
        shouldCreateNewSourceFile,
      );
    };

    const program = ts.createProgram(
      [consumerFile, generatedFile],
      compilerOptions,
      host,
    );
    const diagnostics = ts.getPreEmitDiagnostics(program);

    expect(diagnostics.map((diagnostic) =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
    )).toEqual([]);
    expect(declaration).toContain('readonly "englishOnly": "English only";');
    expect(declaration).toContain(
      'readonly "greeting": "Bonjour {prenom}" | "Hello {name}";',
    );
    expect(() => generateLocaleCatalogTypes({}, "EmptyCatalogs")).toThrow(
      /At least one locale catalog/,
    );
    expect(() =>
      generateLocaleCatalogTypes({
        "en-us": { title: "Hi" },
        "EN-US": { title: "Hello" },
      }),
    ).toThrow(/More than one catalog resolves/);
  });

  it("rejects unsafe type names and malformed catalog structures", () => {
    expect(() => generateCatalogTypes({ title: "Hi" }, "Bad Type")).toThrow(
      /Invalid TypeScript type name/,
    );
    expect(
      validateCatalogs({
        defaultLocale: "en",
        catalogs: { en: { nested: ["not", "a", "catalog"] } },
      }),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-catalog" }),
      ]),
    );

    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(
      validateCatalogs({
        defaultLocale: "en",
        catalogs: { en: cyclic },
      }).map((issue) => issue.code),
    ).toContain("invalid-catalog");
  });
});
