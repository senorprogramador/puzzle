import { describe, expect, it } from "vitest";
import { getImageBoxLayout } from "./image-box.utils";

describe("getImageBoxLayout", () => {
  it.each([
    [0, "empty", 0, 0, 0, 0],
    [1, "single", 1, 1, 1, 0],
    [2, "split", 2, 2, 1, 0],
    [3, "stacked", 3, 1, 2, 0],
    [4, "stacked", 4, 1, 3, 0],
    [5, "grid", 5, 2, 2, 0],
    [6, "grid", 5, 2, 2, 1],
    [7, "grid", 5, 2, 2, 2],
    [8, "grid", 5, 2, 2, 3],
    [9, "grid", 5, 2, 2, 4],
    [10, "grid", 5, 2, 2, 5],
    [25, "grid", 5, 2, 2, 20],
    [50, "grid", 5, 2, 2, 45],
    [100, "grid", 5, 2, 2, 95],
  ] as const)(
    "selects the %s-image layout",
    (count, type, visibleCount, columns, rows, overflowCount) => {
      expect(getImageBoxLayout(count)).toEqual({
        type,
        visibleCount,
        columns,
        rows,
        hasOverflow: overflowCount > 0,
        overflowCount,
        totalCount: count,
      });
    },
  );

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid image counts (%s)",
    (count) => {
      expect(() => getImageBoxLayout(count)).toThrow(RangeError);
    },
  );
});
