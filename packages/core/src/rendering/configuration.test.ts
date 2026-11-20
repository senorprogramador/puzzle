import { describe, expect, it } from "vitest";
import {
  DEFAULT_FOLD_CONFIGURATION,
  DEFAULT_GLOBAL_RENDERING_CONFIGURATION,
  DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES,
  normalizeFoldConfiguration,
  normalizeGlobalRenderingConfiguration,
  resolveFoldConfiguration,
  resolveOptimizationProfile,
} from "./index";

describe("rendering configuration", () => {
  it("uses the balanced profile as its recommended default", () => {
    expect(normalizeFoldConfiguration()).toEqual(DEFAULT_FOLD_CONFIGURATION);
    expect(DEFAULT_GLOBAL_RENDERING_CONFIGURATION).toMatchObject({
      profile: "balanced",
      configuration: {
        strategy: "auto",
        renderMode: "ssr",
        priority: "normal",
      },
      optimization: {
        rootMargin: "400px 0px",
        prefetch: true,
        adaptiveScheduling: true,
        contentVisibility: true,
      },
    });
  });

  it.each([
    ["conservative", "eager", "ssr", false, false, "on-activation"],
    ["balanced", "auto", "ssr", true, true, "proximity"],
    ["aggressive", "nearby", "deferred", true, true, "proximity"],
    ["custom", "eager", "ssr", false, false, "on-activation"],
  ] as const)(
    "normalizes the %s profile defaults",
    (profile, strategy, renderMode, prefetch, contentVisibility, behavior) => {
      expect(normalizeGlobalRenderingConfiguration({ profile })).toMatchObject({
        profile,
        configuration: { strategy, renderMode },
        optimization: {
          prefetch,
          contentVisibility,
          deferredLoadingBehavior: behavior,
        },
      });
    },
  );

  it("accepts and freezes native visibility threshold arrays", () => {
    const configuration = normalizeGlobalRenderingConfiguration({
      optimization: { proximityThreshold: [0, 0.5, 1] },
    });

    expect(configuration.optimization.proximityThreshold).toEqual([0, 0.5, 1]);
    expect(
      Object.isFrozen(configuration.optimization.proximityThreshold),
    ).toBe(true);
  });

  it("normalizes custom settings without mutating input", () => {
    const input = {
      profile: "custom",
      optimization: {
        prefetch: true,
        contentVisibility: true,
        adaptiveScheduling: false,
        resourceConcurrency: 1,
      },
    } as const;

    expect(normalizeGlobalRenderingConfiguration(input)).toMatchObject({
      profile: "custom",
      configuration: { strategy: "eager", renderMode: "ssr" },
      optimization: {
        prefetch: true,
        contentVisibility: true,
        adaptiveScheduling: false,
        resourceConcurrency: 1,
        maxConcurrentPrefetch: 1,
      },
    });
    expect(input).toEqual({
      profile: "custom",
      optimization: {
        prefetch: true,
        contentVisibility: true,
        adaptiveScheduling: false,
        resourceConcurrency: 1,
      },
    });
  });

  it("applies profile, custom, application, legacy, and route layers in order", () => {
    const resolved = resolveOptimizationProfile({
      profile: "aggressive",
      optimization: { priority: "low", prefetch: false },
      application: { priority: "normal", rootMargin: "300px 0px" },
      configuration: { priority: "high" },
      route: { priority: "critical", rootMargin: "500px 0px" },
    });

    expect(resolved.configuration).toMatchObject({
      strategy: "nearby",
      renderMode: "deferred",
      priority: "critical",
    });
    expect(resolved.optimization).toMatchObject({
      rootMargin: "500px 0px",
      prefetch: false,
      prefetchBudget: 20,
      maxConcurrentPrefetch: 1,
    });
  });

  it("reports selected profile, overrides, and unsupported framework features", () => {
    const resolved = resolveOptimizationProfile(
      {
        profile: "aggressive",
        application: { prefetch: false },
        route: { rootMargin: "250px 0px" },
      },
      {
        capabilities: DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES,
        diagnostics: true,
      },
    );

    expect(resolved.diagnostics).toEqual({
      selectedProfile: "aggressive",
      appliedOverrides: ["application", "route"],
      disabledOptimizations: ["prefetch"],
      frameworkRestrictions: ["visibility-strategy", "deferred-rendering"],
    });
  });

  it("inherits global, component, boundary, and explicit fold configuration", () => {
    const resolved = resolveFoldConfiguration({
      global: normalizeGlobalRenderingConfiguration({
        profile: "balanced",
        configuration: { priority: "low" },
      }),
      boundary: {
        id: "hero",
        configuration: { strategy: "nearby", idleTimeoutMs: 500 },
      },
      component: { configuration: { priority: "high" } },
      override: { strategy: "eager" },
    });

    expect(resolved).toEqual({
      strategy: "eager",
      renderMode: "ssr",
      priority: "high",
      idleTimeoutMs: 500,
    });
  });

  it.each([
    ["null", null],
    ["an array", []],
    ["a class instance", new Date()],
    [
      "an object with inherited options",
      Object.setPrototypeOf({}, { strategy: "visible" }),
    ],
    ["an unsupported strategy", { strategy: "instant" }],
    ["an unsupported render mode", { renderMode: "client" }],
    ["an unsupported priority", { priority: "urgent" }],
    ["a negative idle timeout", { idleTimeoutMs: -1 }],
    ["a fractional idle timeout", { idleTimeoutMs: 1.5 }],
    ["an unknown option", { fallback: "skeleton" }],
  ])("rejects %s", (_description, configuration) => {
    expect(() => normalizeFoldConfiguration(configuration)).toThrow(TypeError);
  });

  it.each([
    ["invalid profile", { profile: "maximum" }],
    ["invalid fold strategy", { optimization: { strategy: "instant" } }],
    ["invalid root margin", { optimization: { rootMargin: "2em" } }],
    ["invalid proximity threshold", { optimization: { proximityThreshold: 2 } }],
    ["empty proximity threshold array", { optimization: { proximityThreshold: [] } }],
    [
      "out-of-range proximity threshold",
      { optimization: { proximityThreshold: [0, 1.1] } },
    ],
    ["negative prefetch budget", { optimization: { prefetchBudget: -1 } }],
    ["zero resource concurrency", { optimization: { resourceConcurrency: 0 } }],
    [
      "excessive prefetch concurrency",
      { optimization: { resourceConcurrency: 1, maxConcurrentPrefetch: 2 } },
    ],
    [
      "invalid priority queue limit",
      { optimization: { priorityQueueLimits: { critical: -1 } } },
    ],
    [
      "invalid intrinsic size",
      { optimization: { intrinsicSize: "100px; color:red" } },
    ],
    ["unknown option", { optimization: { fallback: "skeleton" } }],
    [
      "invalid legacy fold configuration",
      { profile: "balanced", configuration: { idleTimeoutMs: Number.NaN } },
    ],
  ])("rejects %s", (_description, configuration) => {
    expect(() => normalizeGlobalRenderingConfiguration(configuration)).toThrow(
      TypeError,
    );
  });
});
