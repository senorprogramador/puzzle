import { useId, useState } from "react";

import { Button } from "@puzzle-ui/ui";

type ThemeStudioCodePanelProps = {
  title: string;
  description: string;
  code: string;
  language: "tsx" | "json";
};

export const copyThemeStudioCode = async (
  text: string,
  clipboard?: Pick<Clipboard, "writeText">,
): Promise<void> => {
  const targetClipboard =
    clipboard ??
    (typeof navigator === "undefined" ? undefined : navigator.clipboard);

  if (!targetClipboard?.writeText) {
    throw new Error("Clipboard access is unavailable in this browser.");
  }

  await targetClipboard.writeText(text);
};

const ThemeStudioCodePanel = ({
  title,
  description,
  code,
  language,
}: ThemeStudioCodePanelProps) => {
  const [copyMessage, setCopyMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();

  const copyCode = async () => {
    try {
      await copyThemeStudioCode(code);
      setCopyMessage("Copied to clipboard.");
    } catch {
      setCopyMessage(
        "Could not copy automatically. Select the code and copy it manually.",
      );
    }
  };

  return (
    <section className="theme-studio-output-panel" aria-label={title}>
      <div className="theme-studio-output-panel__heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="theme-studio-output-panel__actions">
          <Button
            className="theme-studio-output-panel__toggle"
            variant="ghost"
            size="sm"
            aria-controls={contentId}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? "Hide" : "Show"} code for ${title}`}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            {isExpanded ? "Hide code" : "Show code"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void copyCode()}
            aria-label={`Copy ${title}`}
          >
            Copy
          </Button>
        </div>
      </div>
      <div
        className="theme-studio-output-panel__content"
        id={contentId}
        data-collapsed={!isExpanded}
      >
        <pre className="theme-studio-output-panel__code">
          <code data-language={language}>{code}</code>
        </pre>
        <p className="theme-studio-output-panel__status" role="status" aria-live="polite">
          {copyMessage}
        </p>
      </div>
    </section>
  );
};

export { ThemeStudioCodePanel, type ThemeStudioCodePanelProps };
