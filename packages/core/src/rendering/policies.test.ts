import { describe, expect, it } from "vitest";
import {
  DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES,
  normalizeGlobalRenderingConfiguration,
  resolveOptimizationDecision,
  type FrameworkAdapterCapabilities,
} from "./index";

const fullCapabilities: FrameworkAdapterCapabilities = {
  supportsServerRendering: true,
  supportsDeferredRendering: true,
  supportsStaticRendering: true,
  supportsVisibility: true,
  supportsIdleScheduling: true,
};

describe("rendering policy", () => {
  it("uses a safe server-rendered eager decision by default", () => {
    expect(resolveOptimizationDecision()).toMatchObject({
      strategy: "eager",
      renderMode: "ssr",
      priority: "normal",
      idleTimeoutMs: 1_000,
      supported: true,
      classification: {
        role: "unknown",
        priority: "normal",
        confidence: 0.1,
      },
      prediction: {
        result: "unknown",
        confidence: 0.1,
      },
      sources: {
        strategy: "automatic-classification",
        renderMode: "safe-default",
        priority: "safe-default",
      },
    });
  });

  it("uses component position, priority, and cost for automatic selection", () => {
    const decision = resolveOptimizationDecision({
      component: { role: "interactive-map" },
      prediction: { positionHint: "below-fold" },
      capabilities: fullCapabilities,
      diagnostics: true,
    });

    expect(decision).toMatchObject({
      strategy: "idle",
      renderMode: "ssr",
      priority: "low",
      supported: true,
      sources: {
        strategy: "automatic-classification",
        renderMode: "component-metadata",
        priority: "component-metadata",
      },
      diagnostics: {
        reason: "A non-critical component has a high estimated client cost.",
      },
    });
  });

  it("lets client confirmation update the automatic decision", () => {
    const base = {
      component: { role: "gallery" as const },
      prediction: { positionHint: "below-fold" as const },
      capabilities: fullCapabilities,
    };

    expect(
      resolveOptimizationDecision(base).strategy,
    ).toBe("nearby");
    expect(
      resolveOptimizationDecision({
        ...base,
        clientVisibility: "nearby",
      }).strategy,
    ).toBe("nearby");
    expect(
      resolveOptimizationDecision({
        ...base,
        clientVisibility: "visible",
      }).strategy,
    ).toBe("eager");
  });

  it("does not automatically remove SSR or static content for unknown components", () => {
    expect(
      resolveOptimizationDecision({
        global: normalizeGlobalRenderingConfiguration({ profile: "balanced" }),
        capabilities: fullCapabilities,
      }),
    ).toMatchObject({
      strategy: "eager",
      renderMode: "ssr",
      prediction: { result: "unknown" },
    });
  });

  it("keeps unknown components, critical content, and SEO content SSR-safe", () => {
    const aggressive = normalizeGlobalRenderingConfiguration({
      profile: "aggressive",
    });

    expect(
      resolveOptimizationDecision({
        global: aggressive,
        component: { role: "gallery" },
        capabilities: fullCapabilities,
      }),
    ).toMatchObject({
      renderMode: "deferred",
    });

    expect(
      resolveOptimizationDecision({
        global: aggressive,
        capabilities: fullCapabilities,
      }),
    ).toMatchObject({
      strategy: "eager",
      renderMode: "ssr",
      priority: "normal",
    });

    expect(
      resolveOptimizationDecision({
        global: aggressive,
        boundary: {
          configuration: { strategy: "visible", renderMode: "deferred" },
        },
        capabilities: fullCapabilities,
      }),
    ).toMatchObject({
      strategy: "visible",
      renderMode: "deferred",
    });

    expect(
      resolveOptimizationDecision({
        global: aggressive,
        component: { role: "hero" },
        boundary: { configuration: { renderMode: "deferred" } },
        override: { strategy: "visible", priority: "low" },
        capabilities: fullCapabilities,
      }),
    ).toMatchObject({
      strategy: "eager",
      renderMode: "ssr",
      priority: "critical",
    });

    expect(
      resolveOptimizationDecision({
        global: aggressive,
        component: {
          role: "gallery",
          componentKind: "dynamic",
          seo: true,
        },
        capabilities: fullCapabilities,
      }),
    ).toMatchObject({
      renderMode: "ssr",
    });

    expect(
      resolveOptimizationDecision({
        global: aggressive,
        component: {
          role: "gallery",
          preferredRenderMode: "ssr",
        },
        capabilities: fullCapabilities,
      }),
    ).toMatchObject({
      renderMode: "ssr",
      sources: { renderMode: "component-metadata" },
    });
  });

  it("rejects static mode for declared interactive components", () => {
    expect(
      resolveOptimizationDecision({
        component: { role: "interactive-map" },
        boundary: { configuration: { renderMode: "static" } },
        capabilities: fullCapabilities,
      }),
    ).toMatchObject({
      renderMode: "ssr",
      supported: false,
      sources: { renderMode: "component-functionality" },
    });
  });

  it("keeps automatic strategies eager when component position is unknown", () => {
    const decision = resolveOptimizationDecision({
      global: normalizeGlobalRenderingConfiguration({ profile: "balanced" }),
      capabilities: fullCapabilities,
    });

    expect(decision.strategy).toBe("eager");
    expect(decision.sources.strategy).toBe("automatic-classification");
    expect(decision.supported).toBe(true);
  });

  it("falls back to safe rendering when a profile exceeds capabilities", () => {
    const decision = resolveOptimizationDecision({
      global: normalizeGlobalRenderingConfiguration({ profile: "aggressive" }),
      component: {
        preferredStrategy: "nearby",
        preferredRenderMode: "deferred",
      },
      capabilities: DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES,
    });

    expect(decision.strategy).toBe("eager");
    expect(decision.renderMode).toBe("ssr");
    expect(decision.sources).toEqual({
      strategy: "framework-capability",
      renderMode: "framework-capability",
      priority: "global-profile",
    });
    expect(decision.supported).toBe(true);
  });

  it("applies component metadata above the global profile", () => {
    const decision = resolveOptimizationDecision({
      global: normalizeGlobalRenderingConfiguration({ profile: "balanced" }),
      component: { preferredStrategy: "idle", priority: "high" },
      capabilities: fullCapabilities,
    });

    expect(decision.strategy).toBe("idle");
    expect(decision.priority).toBe("high");
    expect(decision.sources.strategy).toBe("component-metadata");
    expect(decision.sources.priority).toBe("component-metadata");
  });

  it("applies accessibility and functionality constraints above capabilities", () => {
    const decision = resolveOptimizationDecision({
      global: normalizeGlobalRenderingConfiguration({ profile: "aggressive" }),
      component: { preferredStrategy: "visible" },
      constraints: { requiresImmediateRendering: true },
      capabilities: {
        ...DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES,
        supportsServerRendering: false,
      },
    });

    expect(decision.strategy).toBe("eager");
    expect(decision.renderMode).toBe("ssr");
    expect(decision.sources.strategy).toBe("accessibility-functionality");
    expect(decision.sources.renderMode).toBe("accessibility-functionality");
    expect(decision.supported).toBe(false);
  });

  it("rejects an explicit override when immediate rendering is required", () => {
    const decision = resolveOptimizationDecision({
      override: { strategy: "visible", renderMode: "deferred" },
      constraints: { requiresImmediateRendering: true },
      capabilities: fullCapabilities,
    });

    expect(decision).toMatchObject({
      strategy: "eager",
      renderMode: "ssr",
      supported: true,
      sources: {
        strategy: "accessibility-functionality",
        renderMode: "accessibility-functionality",
      },
    });
  });

  it("preserves explicit eager and other developer overrides", () => {
    const decision = resolveOptimizationDecision({
      global: normalizeGlobalRenderingConfiguration({ profile: "aggressive" }),
      component: { preferredStrategy: "visible", priority: "low" },
      constraints: { requiresImmediateRendering: true },
      override: { strategy: "eager", priority: "critical" },
      capabilities: fullCapabilities,
    });

    expect(decision.strategy).toBe("eager");
    expect(decision.priority).toBe("critical");
    expect(decision.sources.strategy).toBe("developer-override");
    expect(decision.sources.priority).toBe("developer-override");
  });

  it("applies boundary props after component hints and explicit overrides last", () => {
    const global = normalizeGlobalRenderingConfiguration({
      profile: "aggressive",
    });
    const component = {
      preferredStrategy: "idle" as const,
      priority: "low" as const,
    };
    const boundary = {
      configuration: { strategy: "nearby" as const, priority: "high" as const },
    };

    expect(
      resolveOptimizationDecision({
        global,
        component,
        boundary,
        capabilities: fullCapabilities,
      }),
    ).toMatchObject({
      strategy: "nearby",
      renderMode: "deferred",
      priority: "high",
      sources: {
        strategy: "boundary-prop",
        renderMode: "global-profile",
        priority: "boundary-prop",
      },
    });

    expect(
      resolveOptimizationDecision({
        global,
        component,
        boundary,
        override: { strategy: "eager", priority: "critical" },
        capabilities: fullCapabilities,
      }),
    ).toMatchObject({
      strategy: "eager",
      priority: "critical",
      sources: {
        strategy: "developer-override",
        priority: "developer-override",
      },
    });
  });

  it("reports unsupported explicit strategies instead of silently changing them", () => {
    const decision = resolveOptimizationDecision({
      override: { strategy: "visible" },
      capabilities: DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES,
    });

    expect(decision.strategy).toBe("visible");
    expect(decision.supported).toBe(false);
    expect(decision.sources.strategy).toBe("developer-override");
  });
});
