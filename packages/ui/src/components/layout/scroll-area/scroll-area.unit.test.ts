import { describe, expect, it } from "vitest";
import { getScrollAreaOverflow } from "./scroll-area.utils";

describe("getScrollAreaOverflow", () => {
  it("enables vertical scrolling by default", () => {
    expect(getScrollAreaOverflow("vertical")).toEqual({
      overflowX: "hidden",
      overflowY: "auto",
    });
  });

  it("enables horizontal scrolling only", () => {
    expect(getScrollAreaOverflow("horizontal")).toEqual({
      overflowX: "auto",
      overflowY: "hidden",
    });
  });

  it("enables scrolling on both axes", () => {
    expect(getScrollAreaOverflow("both")).toEqual({
      overflowX: "auto",
      overflowY: "auto",
    });
  });
});
