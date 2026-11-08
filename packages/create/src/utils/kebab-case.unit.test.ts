import { describe, expect, it } from "vitest";

import { toKebabCase } from "./kebab-case";

describe("toKebabCase", () => {
  it.each([
    ["My Awesome App", "my-awesome-app"],
    ["myApp", "my-app"],
    ["MyApp", "my-app"],
    ["Puzzle Dashboard", "puzzle-dashboard"],
    ["MY_APP", "my-app"],
    ["my-app", "my-app"],
    ["  My App  ", "my-app"],
    ["Café App", "cafe-app"],
    ["App 123", "app-123"],
    ["My@Awesome#App", "my-awesome-app"],
  ])("converts %s to %s", (input, expected) => {
    expect(toKebabCase(input)).toBe(expected);
  });

  it("returns an empty string for invalid input", () => {
    expect(toKebabCase("!!!")).toBe("");
  });
});
