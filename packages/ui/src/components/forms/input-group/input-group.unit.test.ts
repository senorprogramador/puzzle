import { describe, expect, it } from "vitest";

import { resolveInputGroupAddonAlign } from "./input-group.utils";

describe("resolveInputGroupAddonAlign", () => {
  it("defaults to start", () => {
    expect(resolveInputGroupAddonAlign()).toBe("start");
  });

  it("preserves the start alignment", () => {
    expect(resolveInputGroupAddonAlign("start")).toBe("start");
  });

  it("preserves the end alignment", () => {
    expect(resolveInputGroupAddonAlign("end")).toBe("end");
  });
});
