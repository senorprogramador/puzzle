import { describe, expect, it } from "vitest";

import {
  findMenuItemIndexByText,
  findNextMenuItemIndex,
  normalizeMenuText,
} from "./dropdown-menu.utils";

describe("dropdown menu utilities", () => {
  it("normalizes case, whitespace and diacritics for typeahead", () => {
    expect(normalizeMenuText("  Crème Brûlée  ")).toBe("creme brulee");
  });

  it("moves to the next enabled item and wraps around", () => {
    const items = [
      { disabled: false },
      { disabled: true },
      { disabled: false },
    ];

    expect(findNextMenuItemIndex(items, 0, 1)).toBe(2);
    expect(findNextMenuItemIndex(items, 2, 1)).toBe(0);
    expect(findNextMenuItemIndex(items, 0, -1)).toBe(2);
  });

  it("does not wrap when looping is disabled", () => {
    const items = [{ disabled: false }, { disabled: true }];

    expect(findNextMenuItemIndex(items, 0, 1, false)).toBe(-1);
    expect(findNextMenuItemIndex(items, 0, -1, false)).toBe(-1);
  });

  it("returns -1 when there are no enabled items", () => {
    expect(
      findNextMenuItemIndex([{ disabled: true }, { disabled: true }], -1, 1),
    ).toBe(-1);
  });

  it("finds the next item by a normalized text prefix", () => {
    const items = [
      { text: "Apple" },
      { text: "Crème brûlée" },
      { text: "Cherry", disabled: true },
      { text: "Clementine" },
    ];

    expect(findMenuItemIndexByText(items, "creme", 0)).toBe(1);
    expect(findMenuItemIndexByText(items, "c", 1)).toBe(3);
    expect(findMenuItemIndexByText(items, "a", 3)).toBe(0);
    expect(findMenuItemIndexByText(items, "z", -1)).toBe(-1);
  });
});
