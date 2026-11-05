import type { ReactNode } from "react";

type TokenType = "comment" | "string" | "keyword" | "number" | "type";

const KEYWORDS = [
  "as",
  "async",
  "await",
  "break",
  "case",
  "class",
  "const",
  "continue",
  "default",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "interface",
  "let",
  "new",
  "null",
  "of",
  "return",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "type",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
];

// Order matters: earlier groups win at the same position.
const TOKEN_PATTERN = new RegExp(
  [
    "(?<comment>\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)",
    "(?<string>\"(?:[^\"\\\\\\n]|\\\\.)*\"|'(?:[^'\\\\\\n]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`)",
    `(?<keyword>\\b(?:${KEYWORDS.join("|")})\\b)`,
    "(?<number>\\b\\d+(?:\\.\\d+)?\\b)",
    "(?<type>\\b[A-Z][A-Za-z0-9_]*\\b)",
  ].join("|"),
  "g",
);

const TOKEN_TYPES: TokenType[] = [
  "comment",
  "string",
  "keyword",
  "number",
  "type",
];

/**
 * Splits TypeScript/TSX source into plain text and highlighted spans.
 * This is a lightweight lexical pass, not a parser.
 */
const highlightCode = (code: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const type = TOKEN_TYPES.find((name) => match.groups?.[name] !== undefined);

    if (!type) continue;

    if (match.index > lastIndex) {
      nodes.push(code.slice(lastIndex, match.index));
    }

    nodes.push(
      <span key={match.index} className={`puzzle-preview__token--${type}`}>
        {match[0]}
      </span>,
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < code.length) {
    nodes.push(code.slice(lastIndex));
  }

  return nodes;
};

export { highlightCode };
