import { describe, expect, it } from "vitest";
import * as core from "../index";
import * as rendering from "./index";

describe("rendering package exports", () => {
  it("re-exports the rendering API from the core root and subpath", () => {
    expect(core.resolveOptimizationDecision).toBe(
      rendering.resolveOptimizationDecision,
    );
    expect(core.DEFAULT_FOLD_CONFIGURATION).toBe(
      rendering.DEFAULT_FOLD_CONFIGURATION,
    );
    expect(core.DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES).toBe(
      rendering.DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES,
    );
    expect(core.classifyComponent).toBe(rendering.classifyComponent);
    expect(core.predictFoldPosition).toBe(rendering.predictFoldPosition);
  });
});
