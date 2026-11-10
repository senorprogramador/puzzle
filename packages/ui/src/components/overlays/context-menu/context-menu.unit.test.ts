import { describe, expect, it } from "vitest";

import {
  findMenuItemIndexByText,
  findNextMenuItemIndex,
  normalizeMenuText,
} from "./context-menu.utils";

describe("ContextMenu utilities", () => {
  describe("normalizeMenuText", () => {
    it("normalizes case, whitespace and diacritics", () => {
      expect(normalizeMenuText("  Édit Project ")).toBe("edit project");
    });
  });

  describe("findNextMenuItemIndex", () => {
    const items = [
      { disabled: false },
      { disabled: true },
      { disabled: false },
    ];

    it("skips disabled items when moving forward", () => {
      expect(findNextMenuItemIndex(items, 0, 1)).toBe(2);
    });

    it("skips disabled items when moving backward", () => {
      expect(findNextMenuItemIndex(items, 2, -1)).toBe(0);
    });

    it("wraps around the ends", () => {
      expect(findNextMenuItemIndex(items, 2, 1)).toBe(0);
      expect(findNextMenuItemIndex(items, 0, -1)).toBe(2);
    });

    it("does not wrap when loop is disabled", () => {
      expect(findNextMenuItemIndex(items, 2, 1, false)).toBe(-1);
      expect(findNextMenuItemIndex(items, 0, -1, false)).toBe(-1);
    });

    it("returns -1 when all items are disabled", () => {
      expect(
        findNextMenuItemIndex([{ disabled: true }, { disabled: true }], 0, 1),
      ).toBe(-1);
    });
  });

  describe("findMenuItemIndexByText", () => {
    const items = [
      { text: "Open file" },
      { text: "Rename" },
      { text: "Delete", disabled: true },
      { text: "Duplicate" },
    ];

    it("finds a matching item from the current position", () => {
      expect(findMenuItemIndexByText(items, "du", 0)).toBe(3);
    });

    it("matches without case or diacritic differences", () => {
      expect(findMenuItemIndexByText([{ text: "Édit project" }], "edit")).toBe(
        0,
      );
    });

    it("skips disabled items", () => {
      expect(findMenuItemIndexByText(items, "del")).toBe(-1);
    });

    it("returns -1 for an empty query", () => {
      expect(findMenuItemIndexByText(items, "")).toBe(-1);
    });
  });
});
