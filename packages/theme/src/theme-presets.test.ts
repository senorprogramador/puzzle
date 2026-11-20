import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  COLOR_THEMES,
  DEFAULT_COLOR_SCHEME,
  Theme,
  type ColorThemes,
} from "./index";
import {
  createThemeVariables,
  resolveThemeTokens,
} from "./create-theme-variables";

describe("public color theme registry", () => {
  it("exposes unique identifiers for every built-in color theme", () => {
    const identifiers = Object.keys(COLOR_THEMES);

    expect(identifiers.length).toBeGreaterThan(0);
    expect(new Set(identifiers).size).toBe(identifiers.length);
  });

  it("exposes the actual colors applied by the Theme provider", () => {
    for (const identifier of Object.keys(COLOR_THEMES) as ColorThemes[]) {
      const preset = COLOR_THEMES[identifier];
      const resolved = resolveThemeTokens(undefined, identifier);
      const variables = createThemeVariables(
        undefined,
        undefined,
        "light",
        identifier,
      );

      expect(resolved.colorSchemes.light).toEqual(preset.light);
      expect(resolved.colorSchemes.dark).toEqual({
        ...preset.light,
        ...preset.dark,
      });
      expect(variables["--puzzle-color-scheme-light-primary"]).toBe(
        preset.light.primary,
      );
    }
  });

  it("applies a selected preset and token override in a local Theme scope", () => {
    const rawIdentifier = Object.keys(COLOR_THEMES)[0];

    if (rawIdentifier === undefined) {
      throw new Error("The Theme package has no color presets.");
    }

    const identifier = rawIdentifier as ColorThemes;
    const markup = renderToStaticMarkup(
      createElement(
        Theme,
        {
          scope: "local",
          theme: "light",
          colorTheme: identifier,
          tokens: {
            colorSchemes: {
              light: {
                primary: "#123456",
              },
            },
          },
        },
        createElement("span", null, "Preview"),
      ),
    );

    expect(markup).toContain(
      "--puzzle-color-scheme-light-primary: #123456;",
    );
    expect(markup).toContain("Preview");
    expect(markup).not.toContain('data-puzzle-theme="true"');
  });

  it("exposes the package color schemes used when no preset is selected", () => {
    const resolved = resolveThemeTokens();

    expect(resolved.colorSchemes.light).toEqual(DEFAULT_COLOR_SCHEME.light);
    expect(resolved.colorSchemes.dark).toEqual(DEFAULT_COLOR_SCHEME.dark);
  });
});
