import { describe, expect, it } from "vitest";
import {
  DEFAULT_GLOBAL_RENDERING_CONFIGURATION,
  normalizeGlobalRenderingConfiguration,
  resolveOptimizationDecision,
} from "./index";

describe("SSR-safe rendering foundation", () => {
  it("initializes and resolves the same configuration without browser globals", () => {
    expect(Reflect.has(globalThis, "window")).toBe(false);
    expect(Reflect.has(globalThis, "document")).toBe(false);

    const first = resolveOptimizationDecision();
    const second = resolveOptimizationDecision(
      { global: normalizeGlobalRenderingConfiguration() },
    );

    expect(first.strategy).toBe(second.strategy);
    expect(first.renderMode).toBe(second.renderMode);
    expect(first.priority).toBe(second.priority);
    expect(first.idleTimeoutMs).toBe(second.idleTimeoutMs);
    expect(first.supported).toBe(second.supported);
    expect(first.renderMode).toBe(
      DEFAULT_GLOBAL_RENDERING_CONFIGURATION.configuration.renderMode,
    );
  });
});
