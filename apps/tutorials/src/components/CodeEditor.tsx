import { useCurrentFrame } from "remotion";

type CodeEditorProps = {
  code: string;
  filename?: string;
  language?: string;
  highlightedLines?: readonly number[];
  portrait: boolean;
};

const tokens =
  /(\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:async|await|const|export|from|function|import|return|throw|type|useRef)\b|\b[A-Z][A-Za-z0-9_]*\b)/g;

const tokenColor = (token: string) => {
  if (token.startsWith("//")) return "#8192a8";
  if (/^["'`]/.test(token)) return "#b7e4c7";
  if (/^[A-Z]/.test(token)) return "#84c5ff";
  return "#c4a7ff";
};

export const CodeEditor = ({
  code,
  filename = "example.tsx",
  language = "TypeScript",
  highlightedLines = [],
  portrait,
}: CodeEditorProps) => {
  const frame = useCurrentFrame();
  const lines = code.split("\n");
  const visibleLineCount = Math.min(lines.length, 1 + Math.floor(frame / 3));
  const highlightSet = new Set(highlightedLines);

  return (
    <div
      style={{
        background: "#0b1220",
        border: "1px solid #263449",
        borderRadius: 18,
        boxShadow: "0 24px 64px rgba(0,0,0,.28)",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "#111c2c",
          borderBottom: "1px solid #263449",
          color: "#b7c5d8",
          display: "flex",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          fontSize: portrait ? 20 : 16,
          gap: 12,
          height: portrait ? 58 : 48,
          padding: "0 20px",
        }}
      >
        <span style={{ color: "#7dd3fc" }}>●</span>
        <span>{filename}</span>
        <span style={{ color: "#718096", marginLeft: "auto" }}>{language}</span>
      </div>
      <pre
        style={{
          color: "#d8e2ef",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: portrait ? 19 : 21,
          lineHeight: 1.55,
          margin: 0,
          minHeight: portrait ? 250 : 330,
          overflow: "hidden",
          padding: portrait ? "22px 14px" : "26px 18px",
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }}
      >
        {lines.slice(0, visibleLineCount).map((line, index) => {
          const parts = line.split(tokens);
          const lineNumber = index + 1;
          return (
            <span
              key={lineNumber}
              style={{
                background: highlightSet.has(lineNumber)
                  ? "rgba(37, 99, 235, .16)"
                  : "transparent",
                borderLeft: highlightSet.has(lineNumber)
                  ? "2px solid #60a5fa"
                  : "2px solid transparent",
                display: "block",
                marginLeft: -18,
                paddingLeft: 16,
              }}
            >
              <span
                style={{
                  color: "#64748b",
                  display: "inline-block",
                  marginRight: portrait ? 15 : 18,
                  textAlign: "right",
                  userSelect: "none",
                  width: portrait ? 28 : 32,
                }}
              >
                {lineNumber}
              </span>
              {parts.map((part, partIndex) => {
                if (!part) return null;
                const isToken = tokens.test(part);
                tokens.lastIndex = 0;
                return (
                  <span
                    key={`${lineNumber}-${partIndex}`}
                    style={isToken ? { color: tokenColor(part) } : undefined}
                  >
                    {part}
                  </span>
                );
              })}
            </span>
          );
        })}
      </pre>
    </div>
  );
};
