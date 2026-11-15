import { describe, expect, it } from "vitest";
import {
  getDataTablePageCount,
  getDataTableRange,
  getSortedDataTableItems,
  normalizeDataTableSearch,
} from "./data-table.utils";

describe("data table utilities", () => {
  it("calculates page counts and exclusive request ranges", () => {
    expect(getDataTablePageCount(25, 10)).toBe(3);
    expect(getDataTableRange(25, 10, 1)).toEqual({ start: 0, end: 10 });
    expect(getDataTableRange(25, 10, 2)).toEqual({ start: 10, end: 20 });
    expect(getDataTableRange(25, 10, 3)).toEqual({ start: 20, end: 25 });
    expect(getDataTableRange(4, undefined, 1)).toEqual({
      start: 0,
      end: 4,
    });
  });

  it("trims and normalizes search text", () => {
    expect(normalizeDataTableSearch("  North WIND ")).toBe("north wind");
    expect(normalizeDataTableSearch("   ")).toBe("");
  });

  it("sorts strings and numbers stably, keeping null values last", () => {
    const items = [
      { name: "same", score: 2 },
      { name: "same", score: null },
      { name: "Alpha", score: 1 },
      { name: "alpha", score: 2 },
    ];

    expect(
      getSortedDataTableItems(items, { columnIndex: 0, direction: "asc" }, (item) => item.name).map(
        (item) => item.score,
      ),
    ).toEqual([1, 2, 2, null]);
    expect(
      getSortedDataTableItems(items, { columnIndex: 1, direction: "desc" }, (item) => item.score).map(
        (item) => item.score,
      ),
    ).toEqual([2, 2, 1, null]);
    expect(getSortedDataTableItems(items, null, undefined)).toBe(items);
  });

  it("sorts a larger locally loaded dataset", () => {
    const items = Array.from({ length: 10_000 }, (_, index) => ({
      value: 10_000 - index,
    }));

    const sorted = getSortedDataTableItems(
      items,
      { columnIndex: 0, direction: "asc" },
      (item) => item.value,
    );

    expect(sorted).toHaveLength(10_000);
    expect(sorted[0]?.value).toBe(1);
    expect(sorted.at(-1)?.value).toBe(10_000);
  });
});
