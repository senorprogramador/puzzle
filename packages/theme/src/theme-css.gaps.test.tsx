import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { createThemeCss } from "./create-theme-css";
import { createThemeVariables } from "./create-theme-variables";
import { Theme } from "./theme";

describe("theme CSS generation", () => {
  it("renders dark-scheme and custom token overrides into the stylesheet", () => {
    const markup = renderToStaticMarkup(
      <Theme
        theme="dark"
        tokens={{
          colorSchemes: {
            dark: { background: "#123456" },
          },
          typography: {
            fontSize: { base: "1.125rem" },
          },
        }}
      >
        <span>Dark theme</span>
      </Theme>,
    );

    expect(markup).toContain('data-theme="dark"');
    expect(markup).toContain("--puzzle-color-scheme-dark-background: #123456;");
    expect(markup).toContain("--puzzle-color-scheme-light-background:");
    expect(markup).toContain("--puzzle-font-size-base: 1.125rem;");
    expect(markup).toContain("Dark theme");
  });

  it("escapes quotes and backslashes in font family values before CSS output", () => {
    const variables = createThemeVariables({
      body: { family: 'A "Quoted"\\Font' as never },
    });
    const css = createThemeCss(variables);

    expect(variables["--puzzle-font-body"]).toContain('\\"Quoted\\"');
    expect(variables["--puzzle-font-body"]).toContain("\\\\Font");
    expect(css).toContain('--puzzle-font-body: "A \\"Quoted\\"\\\\Font"');
  });

  it("rejects unsafe custom token overrides before generating CSS", () => {
    expect(() =>
      createThemeVariables(undefined, {
        colorSchemes: {
          dark: { background: "red; --injected: value" },
        },
      }),
    ).toThrow(TypeError);

    expect(() =>
      createThemeVariables(
        undefined,
        undefined,
        "system",
        undefined,
        { "--puzzle-custom": "safe; --injected: value" },
      ),
    ).toThrow(TypeError);
  });
});
