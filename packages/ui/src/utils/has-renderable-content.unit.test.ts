import { createElement, Fragment } from "react";
import { describe, expect, it } from "vitest";

import { hasRenderableContent } from "./has-renderable-content";

describe("hasRenderableContent", () => {
  it("omits boolean-only content, including nested fragments", () => {
    expect(hasRenderableContent(false)).toBe(false);
    expect(
      hasRenderableContent(
        createElement(Fragment, null, createElement(Fragment, null, false)),
      ),
    ).toBe(false);
  });

  it("preserves renderable values and fragments", () => {
    expect(hasRenderableContent(0)).toBe(true);
    expect(hasRenderableContent("Label")).toBe(true);
    expect(
      hasRenderableContent(
        createElement(Fragment, null, createElement("span", null, "Label")),
      ),
    ).toBe(true);
  });
});
