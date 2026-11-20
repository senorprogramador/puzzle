import { describe, expect, it } from "vitest";
import {
  compareFoldPriority,
  FOLD_PRIORITY_ORDER,
  getFoldPriorityRank,
  type FoldPriority,
} from "./index";

describe("fold priorities", () => {
  it("defines priority order from highest to lowest", () => {
    expect(FOLD_PRIORITY_ORDER).toEqual([
      "critical",
      "high",
      "normal",
      "low",
    ]);
    expect(getFoldPriorityRank("critical")).toBe(0);
    expect(getFoldPriorityRank("low")).toBe(3);
  });

  it("compares priority values consistently", () => {
    expect(compareFoldPriority("critical", "normal")).toBe(-1);
    expect(compareFoldPriority("normal", "normal")).toBe(0);
    expect(compareFoldPriority("low", "high")).toBe(1);
  });

  it("rejects unknown runtime priority values", () => {
    expect(() => getFoldPriorityRank("urgent" as FoldPriority)).toThrow(
      TypeError,
    );
  });
});
