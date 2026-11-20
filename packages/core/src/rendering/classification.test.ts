import { describe, expect, it } from "vitest";
import {
  classifyComponent,
  mergeComponentClassificationConfigurations,
  selectAutomaticFoldStrategy,
} from "./classification";
import { predictFoldPosition } from "./prediction";

describe("component classification", () => {
  it("uses explicit semantic roles rather than component names", () => {
    expect(classifyComponent({ role: "navigation" })).toMatchObject({
      role: "navigation",
      priority: "critical",
      metadata: {
        defaultFoldStrategy: "eager",
        defaultRenderMode: "ssr",
        componentKind: "dynamic",
      },
    });
    expect(classifyComponent({ role: "hero" }).priority).toBe("critical");
    expect(classifyComponent({ role: "main-content" }).priority).toBe("high");
    expect(classifyComponent({ role: "gallery" }).priority).toBe("normal");
    expect(classifyComponent({ role: "testimonials" }).priority).toBe("low");
    expect(classifyComponent({ role: "interactive-map" }).priority).toBe("low");
    expect(classifyComponent({ role: "footer" }).priority).toBe("low");
    expect(classifyComponent().priority).toBe("normal");
  });

  it("inherits metadata, merges resource hints, and honors child values", () => {
    const parent = classifyComponent({
      role: "main-content",
      priority: "high",
      configuration: { idleTimeoutMs: 250 },
      criticalResourceHints: [{ id: "hero-image", type: "image" }],
    }).metadata;
    const child = classifyComponent(
      {
        role: "gallery",
        configuration: { priority: "low" },
        criticalResourceHints: [{ id: "gallery-module", type: "module" }],
      },
      undefined,
      parent,
    );

    expect(child.priority).toBe("low");
    expect(child.metadata.configuration).toEqual({
      idleTimeoutMs: 250,
      priority: "low",
    });
    expect(child.metadata.criticalResourceHints).toEqual([
      { id: "hero-image", type: "image" },
      { id: "gallery-module", type: "module" },
    ]);
  });

  it("allows nested classification defaults to be configured", () => {
    const configuration = mergeComponentClassificationConfigurations(
      { roleDefaults: { gallery: { priority: "high" } } },
      { roleDefaults: { gallery: { defaultFoldStrategy: "visible" } } },
    );

    expect(classifyComponent({ role: "gallery" }, configuration)).toMatchObject({
      priority: "high",
      metadata: {
        defaultFoldStrategy: "visible",
      },
    });
  });

  it("selects conservative strategies when position is unknown", () => {
    const unknown = classifyComponent();
    const prediction = predictFoldPosition({}, unknown);

    expect(
      selectAutomaticFoldStrategy({
        classification: unknown,
        prediction,
        supportsVisibility: true,
        supportsIdleScheduling: true,
      }).strategy,
    ).toBe("eager");
  });

  it("uses position, cost, and client confirmation for automatic selection", () => {
    const map = classifyComponent({ role: "interactive-map" });
    const belowFold = predictFoldPosition(
      { positionHint: "below-fold" },
      map,
    );

    expect(
      selectAutomaticFoldStrategy({
        classification: map,
        prediction: belowFold,
        supportsVisibility: true,
        supportsIdleScheduling: true,
      }),
    ).toMatchObject({ strategy: "idle" });
    expect(
      selectAutomaticFoldStrategy({
        classification: map,
        prediction: belowFold,
        visibility: "nearby",
        supportsVisibility: true,
        supportsIdleScheduling: true,
      }).strategy,
    ).toBe("nearby");
    expect(
      selectAutomaticFoldStrategy({
        classification: map,
        prediction: belowFold,
        visibility: "visible",
        supportsVisibility: true,
        supportsIdleScheduling: true,
      }).strategy,
    ).toBe("eager");
  });

  it("does not choose visibility strategies when the adapter lacks observers", () => {
    const gallery = classifyComponent({ role: "gallery" });
    const belowFold = predictFoldPosition(
      { positionHint: "below-fold" },
      gallery,
    );

    expect(
      selectAutomaticFoldStrategy({
        classification: gallery,
        prediction: belowFold,
        supportsVisibility: false,
        supportsIdleScheduling: false,
      }).strategy,
    ).toBe("eager");
  });
});
