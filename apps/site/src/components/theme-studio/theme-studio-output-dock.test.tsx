import { describe, expect, it } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { INITIAL_THEME_STUDIO_STATE } from "./theme-studio-model";
import { copyThemeStudioCode } from "./code-panel";
import { ThemeStudioOutputDock } from "./theme-studio-output-dock";

describe("Theme Studio output dock", () => {
  it("renders both configuration panels and accessible copy actions", () => {
    const markup = renderToStaticMarkup(
      createElement(ThemeStudioOutputDock, {
        state: INITIAL_THEME_STUDIO_STATE,
      }),
    );

    expect(markup).toContain("Theme implementation");
    expect(markup).toContain("puzzle-fonts.json");
    expect(markup).toContain('aria-label="Copy Theme implementation"');
    expect(markup).toContain('aria-label="Copy puzzle-fonts.json"');
    expect(markup).toContain("&quot;family&quot;: &quot;Geist&quot;");
    expect(markup).toContain('role="status"');
  });

  it("provides an independent collapsed code toggle for each panel", () => {
    const markup = renderToStaticMarkup(
      createElement(ThemeStudioOutputDock, {
        state: INITIAL_THEME_STUDIO_STATE,
      }),
    );

    expect(markup).toContain('aria-label="Show code for Theme implementation"');
    expect(markup).toContain('aria-label="Show code for puzzle-fonts.json"');
    expect(markup.match(/aria-expanded="false"/g)).toHaveLength(2);
    expect(markup.match(/data-collapsed="true"/g)).toHaveLength(2);
  });

  it("copies the complete source string rather than the visible code preview", async () => {
    const completeCode = `line one\n${"hidden configuration\n".repeat(200)}last line`;
    let copiedText = "";
    const clipboard = {
      writeText: async (text: string) => {
        copiedText = text;
      },
    };

    await copyThemeStudioCode(completeCode, clipboard);

    expect(copiedText).toBe(completeCode);
  });

  it("reports clipboard unavailability as a rejected copy operation", async () => {
    await expect(
      copyThemeStudioCode("configuration", {
        writeText: async () => {
          throw new Error("Permission denied.");
        },
      }),
    ).rejects.toThrow("Permission denied.");
  });
});
