import { Tabs, Heading, TextAreaInput, Label } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import { useId, useState } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type {
  CodeShowcaseSectionProps,
  CodeShowcaseVariant,
  CodeSnippet,
} from "./code-showcase.types";
import "./code-showcase.css";

type CopyStatus = "idle" | "copied" | "error";

const validateSnippets = (
  variant: CodeShowcaseVariant,
  items: readonly CodeSnippet[],
) => {
  if (variant === "single" && items.length > 1) {
    throw new RangeError(
      'The "single" code showcase variant accepts exactly one snippet.',
    );
  }
};

const CodePanel = ({
  snippet,
  copyable,
  lineNumbers,
  editable,
  variant,
  onCopy,
  onCopyError,
}: {
  snippet: CodeSnippet;
  copyable: boolean;
  lineNumbers: boolean;
  editable: boolean;
  variant: CodeShowcaseVariant;
  onCopy?: (code: string) => void;
  onCopyError?: (error: unknown) => void;
}) => {
  const [code, setCode] = useState(snippet.code);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const editorId = useId();
  const lines = code.split("\n");
  const highlightedLines = new Set(snippet.highlightedLines ?? []);

  const copyCode = async () => {
    setCopyStatus("idle");

    if (
      typeof navigator === "undefined" ||
      typeof navigator.clipboard?.writeText !== "function"
    ) {
      const error = new Error("The Clipboard API is unavailable.");
      setCopyStatus("error");
      onCopyError?.(error);
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      setCopyStatus("error");
      onCopyError?.(error);
      return;
    }

    setCopyStatus("copied");
    onCopy?.(code);
  };

  return (
    <div
      className="puzzle-code-showcase__panel"
      data-layout={variant}
      data-language={snippet.language}
    >
      <div className="puzzle-code-showcase__toolbar">
        <div className="puzzle-code-showcase__labels">
          {snippet.title ? (
            <span className="puzzle-code-showcase__title">{snippet.title}</span>
          ) : null}
          <span className="puzzle-code-showcase__language">
            {snippet.language}
          </span>
          {snippet.filename ? (
            <span className="puzzle-code-showcase__filename">
              {snippet.filename}
            </span>
          ) : null}
        </div>
        {copyable ? (
          <button
            type="button"
            className="puzzle-code-showcase__copy"
            aria-label={`Copy ${snippet.title ?? snippet.language} code`}
            onClick={copyCode}
          >
            {copyStatus === "copied"
              ? "Copied"
              : copyStatus === "error"
                ? "Copy failed"
                : "Copy"}
          </button>
        ) : null}
      </div>
      {editable ? (
        <>
          <Label className="puzzle-code-showcase__visually-hidden" htmlFor={editorId}>
            Edit {snippet.title ?? snippet.language} code
          </Label>
          <TextAreaInput
            id={editorId}
            className="puzzle-code-showcase__editor"
            value={code}
            onChange={(event) => {
              setCode(event.currentTarget.value);
              setCopyStatus("idle");
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
          />
        </>
      ) : (
        <pre className="puzzle-code-showcase__pre">
          <code>
            {lines.map((line, index) => (
              <span
                key={`${snippet.id}-line-${index}`}
                className="puzzle-code-showcase__line"
                data-highlighted={highlightedLines.has(index + 1) || undefined}
              >
                {lineNumbers ? (
                  <span
                    className="puzzle-code-showcase__line-number"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                ) : null}
                <span>{line || " "}</span>
              </span>
            ))}
          </code>
        </pre>
      )}
      <span className="puzzle-code-showcase__status" role="status" aria-live="polite">
        {copyStatus === "copied"
          ? "Code copied to clipboard."
          : copyStatus === "error"
            ? "Could not copy. Select and copy the code manually."
            : ""}
      </span>
    </div>
  );
};

const CodeShowcaseSection = <C extends ElementType = "section">({
  variant = "single",
  items,
  copyable = true,
  showLineNumbers,
  editable,
  onCopy,
  onCopyError,
  children,
  className,
  ...sectionProps
}: CodeShowcaseSectionProps<C>) => {
  validateSnippets(variant, items);
  const lineNumbers = showLineNumbers ?? variant === "numbered";
  const isEditable = editable ?? variant === "playground";

  const panel = (snippet: CodeSnippet) => (
    <CodePanel
      key={snippet.id}
      snippet={snippet}
      copyable={copyable}
      lineNumbers={lineNumbers}
      editable={isEditable}
      variant={variant}
      onCopy={onCopy}
      onCopyError={onCopyError}
    />
  );

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-code-showcase ${className ?? ""}`.trim()}
      family="code-showcase"
      variant={variant}
    >
      {items.length &&
      (variant === "tabs" || variant === "multi-language") ? (
        <Tabs className="puzzle-code-showcase__tabs">
          {items.map((snippet) => (
            <Tabs.Tab
              key={snippet.id}
              id={snippet.id}
              tab={variant === "multi-language" ? snippet.language : snippet.title ?? snippet.language}
            >
              {panel(snippet)}
            </Tabs.Tab>
          ))}
        </Tabs>
      ) : items.length && variant === "single" ? (
        <div className="puzzle-code-showcase__single">
          {panel(items[0]!)}
        </div>
      ) : items.length && variant === "comparison" ? (
        <div className="puzzle-code-showcase__comparison">
          {items.map(panel)}
        </div>
      ) : items.length && variant === "installation" ? (
        <ol className="puzzle-code-showcase__installation">
          {items.map((snippet) => (
            <li key={snippet.id}>
              {snippet.title ? <Heading level="headline3" as="h3">{snippet.title}</Heading> : null}
              {panel(snippet)}
            </li>
          ))}
        </ol>
      ) : items.length && variant === "featured" ? (
        <div className="puzzle-code-showcase__featured">
          {panel(items[0]!)}
          {items.length > 1 ? (
            <ul className="puzzle-code-showcase__supporting">
              {items.slice(1).map((snippet) => (
                <li key={snippet.id}>{panel(snippet)}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : items.length ? (
        <div className="puzzle-code-showcase__list">
          {items.map(panel)}
        </div>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { CodeShowcaseSection };
