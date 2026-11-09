import { describe, expect, it } from "vitest";

import { getPaginationItems, normalizePage } from "./pagination.utils";

describe("getPaginationItems", () => {
  it("returns an empty array when there are no pages", () => {
    expect(getPaginationItems(0, 1)).toEqual([]);
  });

  it("returns every page when the total is small", () => {
    expect(getPaginationItems(5, 3)).toEqual([
      { type: "page", page: 1 },
      { type: "page", page: 2 },
      { type: "page", page: 3 },
      { type: "page", page: 4 },
      { type: "page", page: 5 },
    ]);
  });

  it("shows boundary pages and sibling pages", () => {
    expect(getPaginationItems(10, 5)).toEqual([
      { type: "page", page: 1 },
      { type: "ellipsis", position: "start" },
      { type: "page", page: 4 },
      { type: "page", page: 5 },
      { type: "page", page: 6 },
      { type: "ellipsis", position: "end" },
      { type: "page", page: 10 },
    ]);
  });

  it("does not render an ellipsis for a single missing page", () => {
    expect(getPaginationItems(5, 3)).toEqual([
      { type: "page", page: 1 },
      { type: "page", page: 2 },
      { type: "page", page: 3 },
      { type: "page", page: 4 },
      { type: "page", page: 5 },
    ]);
  });

  it("supports zero siblings", () => {
    expect(getPaginationItems(10, 5, 1, 0)).toEqual([
      { type: "page", page: 1 },
      { type: "ellipsis", position: "start" },
      { type: "page", page: 5 },
      { type: "ellipsis", position: "end" },
      { type: "page", page: 10 },
    ]);
  });

  it("supports zero boundary pages", () => {
    expect(getPaginationItems(10, 5, 0, 1)).toEqual([
      { type: "page", page: 4 },
      { type: "page", page: 5 },
      { type: "page", page: 6 },
    ]);
  });

  it("supports a large boundary count", () => {
    expect(getPaginationItems(5, 3, 10, 1)).toEqual([
      { type: "page", page: 1 },
      { type: "page", page: 2 },
      { type: "page", page: 3 },
      { type: "page", page: 4 },
      { type: "page", page: 5 },
    ]);
  });

  it("clamps an out-of-range current page", () => {
    expect(getPaginationItems(10, 20)).toEqual(getPaginationItems(10, 10));

    expect(getPaginationItems(10, 0)).toEqual(getPaginationItems(10, 1));
  });

  it("normalizes invalid counts", () => {
    expect(getPaginationItems(-5, 1)).toEqual([]);
    expect(getPaginationItems(Number.NaN, 1)).toEqual([]);
    expect(getPaginationItems(5, 3, -1, -1)).toEqual([
      { type: "page", page: 3 },
    ]);
  });
});

describe("normalizePage", () => {
  it("returns zero when there are no pages", () => {
    expect(normalizePage(1, 0)).toBe(0);
  });

  it("clamps pages to the valid range", () => {
    expect(normalizePage(0, 10)).toBe(1);
    expect(normalizePage(11, 10)).toBe(10);
  });

  it("floors decimal page numbers", () => {
    expect(normalizePage(3.8, 10)).toBe(3);
  });

  it("handles non-finite page numbers", () => {
    expect(normalizePage(Number.NaN, 10)).toBe(1);
    expect(normalizePage(Number.POSITIVE_INFINITY, 10)).toBe(1);
  });
});
