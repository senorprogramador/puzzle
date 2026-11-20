import { useState } from "react";

import { Button } from "@puzzle-ui/ui";

type ThemeStudioCodePanelProps = {
  title: string;
  description: string;
  code: string | undefined;
  emptyMessage?: string;
};

const ThemeStudioCodePanel = ({
  title,
  description,
  code,
  emptyMessage,
}: ThemeStudioCodePanelProps) => {
  const [copyMessage, setCopyMessage] = useState("");

  const copyCode = async () => {
    if (!code) return;

    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard access is unavailable in this browser.");
      }

      await navigator.clipboard.writeText(code);
      setCopyMessage("Copied to clipboard.");
    } catch {
      setCopyMessage(
        "Could not copy automatically. Select the code and copy it manually.",
      );
    }
  };

  return (
    <section className="theme-studio__panel theme-studio__code-panel">
      <div className="theme-studio__panel-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {code ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void copyCode()}
            aria-label={`Copy ${title}`}
          >
            Copy
          </Button>
        ) : null}
      </div>
      {code ? (
        <pre>
          <code>{code}</code>
        </pre>
      ) : (
        <p className="theme-studio__code-empty">{emptyMessage}</p>
      )}
      {copyMessage ? (
        <p
          className="theme-studio__copy-status"
          role={copyMessage.startsWith("Could not") ? "alert" : "status"}
        >
          {copyMessage}
        </p>
      ) : null}
    </section>
  );
};

export { ThemeStudioCodePanel, type ThemeStudioCodePanelProps };
