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
});
