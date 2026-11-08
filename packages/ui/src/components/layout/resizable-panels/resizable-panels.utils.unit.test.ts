import { describe, expect, it } from "vitest";

import {
  getPanelPairBounds,
  normalizePanelSizes,
  resizePanelPair,
} from "./resizable-panels.utils";

describe("normalizePanelSizes", () => {
  it("distributes sizes equally when no sizes are provided", () => {
    expect(normalizePanelSizes(undefined, [{}, {}])).toEqual([50, 50]);
  });

  it("normalizes sizes to 100 percent", () => {
    expect(normalizePanelSizes([20, 20], [{}, {}])).toEqual([50, 50]);
  });

  it("respects minimum panel sizes", () => {
    expect(
      normalizePanelSizes(
        [10, 90],
        [{ minSize: 25 }, { minSize: 20, maxSize: 80 }],
      ),
    ).toEqual([25, 75]);
  });

  it("redistributes remaining space after reaching maximum sizes", () => {
    expect(
      normalizePanelSizes(
        [90, 10, 0],
        [{ maxSize: 50 }, { minSize: 20 }, { minSize: 10 }],
      ),
    ).toEqual([50, 40, 10]);
  });

  it("supports zero weights by distributing the remaining space equally", () => {
    expect(normalizePanelSizes([0, 0, 0], [{}, {}, {}])).toEqual([
      100 / 3,
      100 / 3,
      100 / 3,
    ]);
  });

  it("throws when the number of sizes does not match the panels", () => {
    expect(() => normalizePanelSizes([50, 50, 0], [{}, {}])).toThrow(
      "The number of panel sizes must match the number of panels.",
    );
  });

  it("throws when fewer than two panels are provided", () => {
    expect(() => normalizePanelSizes([100], [{}])).toThrow(
      "ResizablePanels requires at least two panels.",
    );
  });

  it("throws when minimum sizes exceed the available space", () => {
    expect(() =>
      normalizePanelSizes([50, 50], [{ minSize: 60 }, { minSize: 50 }]),
    ).toThrow(RangeError);
  });

  it("throws when maximum sizes cannot fill the available space", () => {
    expect(() =>
      normalizePanelSizes([50, 50], [{ maxSize: 40 }, { maxSize: 50 }]),
    ).toThrow(RangeError);
  });

  it("throws for invalid panel constraints", () => {
    expect(() =>
      normalizePanelSizes([50, 50], [{ minSize: 70, maxSize: 60 }, {}]),
    ).toThrow(RangeError);
  });
});

describe("getPanelPairBounds", () => {
  it("calculates bounds while preserving the combined panel size", () => {
    expect(
      getPanelPairBounds(
        [40, 60],
        [
          { minSize: 20, maxSize: 60 },
          { minSize: 30, maxSize: 80 },
        ],
        0,
      ),
    ).toEqual({
      minSize: 20,
      maxSize: 60,
    });
  });

  it("takes the adjacent panel maximum into account", () => {
    expect(
      getPanelPairBounds(
        [50, 50],
        [
          { minSize: 10, maxSize: 90 },
          { minSize: 20, maxSize: 50 },
        ],
        0,
      ),
    ).toEqual({
      minSize: 50,
      maxSize: 80,
    });
  });

  it("throws for an invalid panel index", () => {
    expect(() => getPanelPairBounds([50, 50], [{}, {}], 1)).toThrow(
      "Invalid panel resize index.",
    );
  });
});

describe("resizePanelPair", () => {
  it("increases the first panel and decreases the second", () => {
    expect(resizePanelPair([40, 60], [{}, {}], 0, 10)).toEqual([50, 50]);
  });

  it("keeps the combined size of the adjacent panels unchanged", () => {
    const result = resizePanelPair([20, 30, 50], [{}, {}, {}], 0, 15);

    expect(result).toEqual([35, 15, 50]);
    expect(result.reduce((total, size) => total + size, 0)).toBe(100);
  });

  it("does not change non-adjacent panels", () => {
    const result = resizePanelPair([20, 30, 50], [{}, {}, {}], 1, 10);

    expect(result).toEqual([20, 40, 40]);
    expect(result[0]).toBe(20);
  });

  it("clamps the first panel to its maximum size", () => {
    expect(
      resizePanelPair(
        [25, 75],
        [
          { minSize: 20, maxSize: 40 },
          { minSize: 30, maxSize: 80 },
        ],
        0,
        100,
      ),
    ).toEqual([40, 60]);
  });

  it("clamps the first panel to its minimum size", () => {
    expect(
      resizePanelPair(
        [25, 75],
        [
          { minSize: 20, maxSize: 40 },
          { minSize: 30, maxSize: 80 },
        ],
        0,
        -100,
      ),
    ).toEqual([20, 80]);
  });

  it("throws when the resize delta is not finite", () => {
    expect(() => resizePanelPair([50, 50], [{}, {}], 0, Number.NaN)).toThrow(
      "Resize delta must be a finite number.",
    );
  });
});
