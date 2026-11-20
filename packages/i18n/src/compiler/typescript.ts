import * as ts from "typescript";

export interface ExtractTranslationKeysOptions {
  fileName?: string;
  callees?: readonly string[];
}

export interface TranslationSourceDiagnostic {
  code:
    | "dynamic-key"
    | "syntax-error"
    | "invalid-replacement"
    | "overlapping-replacement";
  file: string;
  line: number;
  column: number;
  key?: string;
  message: string;
}

export interface ExtractedTranslationKeys {
  keys: readonly string[];
  diagnostics: readonly TranslationSourceDiagnostic[];
}

export interface TransformTranslationKeysOptions
  extends ExtractTranslationKeysOptions {
  replacements: Readonly<Record<string, string>>;
  sourceMap?: boolean;
}

export interface TransformTranslationKeysResult {
  code: string;
  map: string | null;
  diagnostics: readonly TranslationSourceDiagnostic[];
}

interface TranslationCall {
  key: string;
  keyExpression: ts.Expression;
}

interface SourceAnalysis extends ExtractedTranslationKeys {
  sourceFile: ts.SourceFile;
  calls: readonly TranslationCall[];
}

interface TextEdit {
  start: number;
  end: number;
  replacement: string;
}

interface AppliedEdit extends TextEdit {
  outputStart: number;
  outputEnd: number;
}

const getCalleeName = (expression: ts.Expression): string | undefined => {
  if (ts.isIdentifier(expression)) {
    return expression.text;
  }

  if (ts.isPropertyAccessExpression(expression)) {
    return expression.name.text;
  }

  if (
    ts.isElementAccessExpression(expression) &&
    expression.argumentExpression &&
    ts.isStringLiteralLike(expression.argumentExpression)
  ) {
    return expression.argumentExpression.text;
  }

  return undefined;
};

const getStaticKey = (expression: ts.Expression | undefined): string | undefined => {
  if (
    expression &&
    (ts.isStringLiteralLike(expression) ||
      ts.isNoSubstitutionTemplateLiteral(expression))
  ) {
    return expression.text;
  }

  return undefined;
};

const getScriptKind = (fileName: string): ts.ScriptKind =>
  fileName.endsWith(".tsx")
    ? ts.ScriptKind.TSX
    : fileName.endsWith(".jsx")
      ? ts.ScriptKind.JSX
      : ts.ScriptKind.TS;

const analyzeSource = (
  source: string,
  options: ExtractTranslationKeysOptions,
): SourceAnalysis => {
  const fileName = options.fileName ?? "source.ts";
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    getScriptKind(fileName),
  );
  const callees = new Set(options.callees ?? ["t", "translate"]);
  const keys = new Set<string>();
  const calls: TranslationCall[] = [];
  const diagnostics: TranslationSourceDiagnostic[] = [];
  const parseDiagnostics = (
    sourceFile as ts.SourceFile & { parseDiagnostics?: readonly ts.Diagnostic[] }
  ).parseDiagnostics ?? [];

  for (const diagnostic of parseDiagnostics) {
    const position = diagnostic.start ?? 0;
    const { line, character } =
      sourceFile.getLineAndCharacterOfPosition(position);

    diagnostics.push({
      code: "syntax-error",
      file: fileName,
      line: line + 1,
      column: character + 1,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
    });
  }

  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      callees.has(getCalleeName(node.expression) ?? "")
    ) {
      const keyExpression = node.arguments[0];
      const key = getStaticKey(keyExpression);

      if (key !== undefined && keyExpression) {
        keys.add(key);
        calls.push({ key, keyExpression });
      } else if (keyExpression) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(
          keyExpression.getStart(sourceFile),
        );
        diagnostics.push({
          code: "dynamic-key",
          file: fileName,
          line: line + 1,
          column: character + 1,
          message:
            "Translation keys must be string literals for reliable catalog scanning.",
        });
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return {
    sourceFile,
    keys: Object.freeze([...keys].sort()),
    calls: Object.freeze(calls),
    diagnostics: Object.freeze(diagnostics),
  };
};

const encodeVlq = (value: number): string => {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let encoded = "";
  let vlq = value < 0 ? ((-value) << 1) | 1 : value << 1;

  do {
    let digit = vlq & 31;
    vlq >>>= 5;

    if (vlq > 0) {
      digit |= 32;
    }

    encoded += alphabet[digit];
  } while (vlq > 0);

  return encoded;
};

const getLineStarts = (source: string): number[] => {
  const starts = [0];

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (character === "\r") {
      if (source[index + 1] === "\n") {
        index += 1;
      }

      starts.push(index + 1);
    } else if (
      character === "\n" ||
      character === "\u2028" ||
      character === "\u2029"
    ) {
      starts.push(index + 1);
    }
  }

  return starts;
};

const getLineAndColumn = (
  lineStarts: readonly number[],
  position: number,
): { line: number; column: number } => {
  let low = 0;
  let high = lineStarts.length;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);

    if ((lineStarts[middle] ?? 0) <= position) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  const line = Math.max(0, low - 1);
  return {
    line,
    column: position - (lineStarts[line] ?? 0),
  };
};

const createSourceMap = (
  fileName: string,
  source: string,
  code: string,
  edits: readonly AppliedEdit[],
): string => {
  const sourceLineStarts = getLineStarts(source);
  const outputLineStarts = getLineStarts(code);
  const segmentsByLine = new Map<
    number,
    Map<number, { source: number; originalLine: number; originalColumn: number }>
  >();

  const addAnchor = (generatedPosition: number, originalPosition: number): void => {
    const generated = getLineAndColumn(outputLineStarts, generatedPosition);
    const original = getLineAndColumn(sourceLineStarts, originalPosition);
    let segments = segmentsByLine.get(generated.line);

    if (!segments) {
      segments = new Map();
      segmentsByLine.set(generated.line, segments);
    }

    segments.set(generated.column, {
      source: 0,
      originalLine: original.line,
      originalColumn: original.column,
    });
  };

  for (let line = 0; line < outputLineStarts.length; line += 1) {
    addAnchor(
      outputLineStarts[line] ?? code.length,
      sourceLineStarts[line] ?? source.length,
    );
  }

  for (const edit of edits) {
    addAnchor(edit.outputStart, edit.start);
    addAnchor(edit.outputEnd, edit.end);
  }

  const mapOutputPosition = (position: number): number => {
    let offset = 0;

    for (const edit of edits) {
      if (position < edit.outputStart) {
        return position - offset;
      }

      if (position <= edit.outputEnd) {
        return position === edit.outputEnd ? edit.end : edit.start;
      }

      offset += edit.replacement.length - (edit.end - edit.start);
    }

    return position - offset;
  };
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    fileName.endsWith(".tsx") || fileName.endsWith(".jsx")
      ? ts.LanguageVariant.JSX
      : ts.LanguageVariant.Standard,
    code,
  );
  let token = scanner.scan();

  while (token !== ts.SyntaxKind.EndOfFileToken) {
    addAnchor(scanner.getTokenPos(), mapOutputPosition(scanner.getTokenPos()));
    addAnchor(scanner.getTextPos(), mapOutputPosition(scanner.getTextPos()));
    token = scanner.scan();
  }

  let previousSource = 0;
  let previousOriginalLine = 0;
  let previousOriginalColumn = 0;
  const mappings = outputLineStarts.map((_, line) => {
    const segments = [...(segmentsByLine.get(line)?.entries() ?? [])].sort(
      ([left], [right]) => left - right,
    );
    let previousGeneratedColumn = 0;

    return segments
      .map(([generatedColumn, mapping]) => {
        const encoded = [
          encodeVlq(generatedColumn - previousGeneratedColumn),
          encodeVlq(mapping.source - previousSource),
          encodeVlq(mapping.originalLine - previousOriginalLine),
          encodeVlq(mapping.originalColumn - previousOriginalColumn),
        ].join("");

        previousGeneratedColumn = generatedColumn;
        previousSource = mapping.source;
        previousOriginalLine = mapping.originalLine;
        previousOriginalColumn = mapping.originalColumn;
        return encoded;
      })
      .join(",");
  });

  return JSON.stringify({
    version: 3,
    file: fileName,
    sources: [fileName],
    sourcesContent: [source],
    names: [],
    mappings: mappings.join(";"),
  });
};

const toStringLiteral = (value: string): string =>
  JSON.stringify(value).replace(/[\u2028\u2029]/g, (character) => {
    const code = character.charCodeAt(0).toString(16);
    return `\\u${code}`;
  });

export const extractTranslationKeys = (
  source: string,
  options: ExtractTranslationKeysOptions = {},
): ExtractedTranslationKeys => {
  const result = analyzeSource(source, options);

  return {
    keys: result.keys,
    diagnostics: result.diagnostics,
  };
};

export const transformTranslationKeys = (
  source: string,
  options: TransformTranslationKeysOptions,
): TransformTranslationKeysResult => {
  const fileName = options.fileName ?? "source.ts";
  const analysis = analyzeSource(source, options);
  const diagnostics = [...analysis.diagnostics];
  const edits: TextEdit[] = [];

  if (!diagnostics.some((diagnostic) => diagnostic.code === "syntax-error")) {
    for (const { key, keyExpression } of analysis.calls) {
      if (!Object.hasOwn(options.replacements, key)) {
        continue;
      }

      const replacement: unknown = options.replacements[key];

      if (typeof replacement !== "string") {
        const { line, character } =
          analysis.sourceFile.getLineAndCharacterOfPosition(
            keyExpression.getStart(analysis.sourceFile),
          );
        diagnostics.push({
          code: "invalid-replacement",
          file: fileName,
          line: line + 1,
          column: character + 1,
          key,
          message: `Replacement for "${key}" must be a string.`,
        });
        continue;
      }

      if (replacement !== key) {
        edits.push({
          start: keyExpression.getStart(analysis.sourceFile),
          end: keyExpression.getEnd(),
          replacement: toStringLiteral(replacement),
        });
      }
    }
  }

  edits.sort((left, right) => left.start - right.start || left.end - right.end);

  for (let index = 1; index < edits.length; index += 1) {
    const previous = edits[index - 1];
    const current = edits[index];

    if (previous && current && current.start < previous.end) {
      const { line, character } =
        analysis.sourceFile.getLineAndCharacterOfPosition(current.start);
      diagnostics.push({
        code: "overlapping-replacement",
        file: fileName,
        line: line + 1,
        column: character + 1,
        message:
          "Overlapping translation-key replacements were rejected; source was left unchanged.",
      });
      return {
        code: source,
        map: options.sourceMap === false
          ? null
          : createSourceMap(fileName, source, source, []),
        diagnostics: Object.freeze(diagnostics),
      };
    }
  }

  let code = "";
  let sourceOffset = 0;
  const appliedEdits: AppliedEdit[] = [];

  for (const edit of edits) {
    code += source.slice(sourceOffset, edit.start);
    const outputStart = code.length;
    code += edit.replacement;
    const outputEnd = code.length;
    appliedEdits.push({ ...edit, outputStart, outputEnd });
    sourceOffset = edit.end;
  }

  code += source.slice(sourceOffset);

  return {
    code,
    map:
      options.sourceMap === false
        ? null
        : createSourceMap(fileName, source, code, appliedEdits),
    diagnostics: Object.freeze(diagnostics),
  };
};
