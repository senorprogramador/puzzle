import { describe, expect, it, vi } from "vitest";
import { predictFoldPosition } from "./prediction";

describe("server fold prediction", () => {
  it("marks critical metadata without claiming viewport position", () => {
    expect(
      predictFoldPosition({ component: { role: "navigation" } }),
    ).toMatchObject({
      result: "known-critical",
      confidence: 1,
      source: "critical-metadata",
    });
  });

  it("treats explicit fold hints as uncertain predictions", () => {
    const prediction = predictFoldPosition({
      positionHint: "below-fold",
      dimensions: { height: 360 },
    });

    expect(prediction).toMatchObject({
      result: "predicted-below-fold",
      confidence: 0.75,
      source: "component-position-hint",
    });
    expect(prediction.confidence).toBeLessThan(1);
    expect(prediction.estimatedBottomOffset).toBeUndefined();
  });

  it("uses document order as weak evidence and stays unknown without evidence", () => {
    expect(predictFoldPosition({ documentOrder: 0 })).toMatchObject({
      result: "predicted-above-fold",
      confidence: 0.35,
      source: "document-order",
    });
    expect(predictFoldPosition({ documentOrder: 4 })).toMatchObject({
      result: "predicted-below-fold",
      confidence: 0.25,
    });
    expect(predictFoldPosition()).toMatchObject({
      result: "unknown",
      confidence: 0.1,
    });
  });

  it("uses page structure as a prediction rather than a viewport guarantee", () => {
    expect(
      predictFoldPosition({ pageStructure: { region: "footer" } }),
    ).toMatchObject({
      result: "predicted-below-fold",
      confidence: 0.65,
      source: "page-structure",
    });
    expect(
      predictFoldPosition({ pageStructure: { region: "header" } }),
    ).toMatchObject({
      result: "predicted-above-fold",
      confidence: 0.6,
      source: "page-structure",
    });
  });

  it("estimates document offsets from supplied dimensions and parent layout", () => {
    expect(
      predictFoldPosition({
        component: { role: "gallery" },
        positionHint: "below-fold",
        dimensions: { height: 120 },
        parentLayout: {
          documentOffset: 200,
          paddingTop: 10,
          precedingSiblingHeights: [100, 50],
          gap: 12,
        },
      }),
    ).toMatchObject({
      result: "predicted-below-fold",
      confidence: 0.85,
      estimatedDocumentOffset: 384,
      estimatedBottomOffset: 504,
    });
  });

  it("never introduces a viewport threshold for server predictions", () => {
    const prediction = predictFoldPosition({
      documentOrder: 8,
      parentLayout: { precedingContentHeight: 4_000 },
      dimensions: { height: 900 },
    });

    expect(prediction.result).toBe("predicted-below-fold");
    expect(prediction.confidence).toBeLessThan(0.5);
    expect(prediction.estimatedDocumentOffset).toBe(4_000);
    expect(prediction.estimatedBottomOffset).toBe(4_900);
  });

  it("runs without browser globals", () => {
    vi.stubGlobal("window", undefined);
    vi.stubGlobal("document", undefined);
    vi.stubGlobal("navigator", undefined);

    try {
      expect(predictFoldPosition({ documentOrder: 1 }).result).toBe(
        "predicted-below-fold",
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
