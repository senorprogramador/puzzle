import { describe, expect, it } from "vitest";

import { cn } from "./class-names";

describe("cn", () => {
  it("joins strings and one-level arrays while omitting falsy values", () => {
    expect(
      cn(
        "alpha beta",
        ["gamma", "delta epsilon"],
        ["zeta", "eta"],
        false,
        null,
        undefined,
        "",
      ),
    ).toBe("alpha beta gamma delta epsilon zeta eta");
  });

  it("preserves duplicate class names and trims empty segments", () => {
    expect(cn(" alpha  beta ", ["alpha", "", "beta"])).toBe(
      "alpha beta alpha beta",
    );
  });
});
