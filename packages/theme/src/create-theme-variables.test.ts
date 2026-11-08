import { describe, expect, it } from "vitest";

import { createThemeVariables } from "./create-theme-variables";

describe("createThemeVariables", () => {
  it("generates the base font-family aliases", () => {
    const variables = createThemeVariables();

    expect(variables["--puzzle-font-family-body"]).toBe(
      variables["--puzzle-font-body"],
    );

    expect(variables["--puzzle-font-family-heading"]).toBe(
      variables["--puzzle-font-heading"],
    );

    expect(variables["--puzzle-font-family-accent"]).toBe(
      variables["--puzzle-font-accent"],
    );
  });

  it("uses custom font configuration for both variable names", () => {
    const variables = createThemeVariables({
      body: {
        family: "Inter",
      },
    });

    expect(variables["--puzzle-font-family-body"]).toBe(
      variables["--puzzle-font-body"],
    );

    expect(variables["--puzzle-font-family-body"]).toContain('"Inter"');
  });
  it("uses typography scale overrides in named roles", () => {
    const variables = createThemeVariables(undefined, {
      typography: {
        fontSize: {
          base: "1.125rem",
        },
      },
    });

    expect(variables["--puzzle-font-size-body1"]).toBe(
      "var(--puzzle-font-size-base)",
    );
    expect(variables["--puzzle-font-size-subtitle1"]).toBe(
      "var(--puzzle-font-size-base)",
    );
  });

  it("supports direct overrides of named typography roles", () => {
    const variables = createThemeVariables(undefined, {
      typography: {
        roles: {
          body1: {
            font: "accent",
            fontSize: "1.25rem",
            fontWeight: "650",
            lineHeight: "1.7",
            letterSpacing: "0.02em",
          },
        },
      },
    });

    expect(variables["--puzzle-font-family-body1"]).toBe(
      variables["--puzzle-font-family-accent"],
    );
    expect(variables["--puzzle-font-size-body1"]).toBe("1.25rem");
    expect(variables["--puzzle-font-weight-body1"]).toBe("650");
    expect(variables["--puzzle-font-line-height-body1"]).toBe("1.7");
    expect(variables["--puzzle-font-letter-spacing-body1"]).toBe("0.02em");
  });

  it("rejects unknown typography roles", () => {
    expect(() =>
      createThemeVariables(undefined, {
        typography: {
          roles: {
            unknown: {
              fontSize: "1rem",
            },
          },
        } as never,
      }),
    ).toThrow("Unknown theme token: tokens.typography.roles.unknown");
  });
});
