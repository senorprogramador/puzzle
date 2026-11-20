import { act, createElement } from "react";
import { create } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FoldProvider } from "./fold-provider";
import { useFold } from "./use-fold";
import { visibilityRegistry } from "./visibility/registry";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let renderer;
let fold;
let observers = [];

const installObserver = () => {
  observers = [];

  class IntersectionObserverMock {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.observe = vi.fn();
      this.unobserve = vi.fn();
      this.disconnect = vi.fn();
      observers.push(this);
    }

    emit(target, isIntersecting, time, geometry = {}) {
      this.callback(
        [{
          target,
          isIntersecting,
          intersectionRatio: Number(isIntersecting),
          time,
          boundingClientRect: geometry.boundingClientRect,
          rootBounds: geometry.rootBounds ?? null,
        }],
        this,
      );
    }
  }

  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
};

const Harness = (options) => {
  fold = useFold(options);
  return createElement("span", null, fold.state);
};

const mount = (options) => {
  act(() => {
    renderer = create(createElement(Harness, options));
  });
};

const mountWithProvider = (providerProps, options) => {
  act(() => {
    renderer = create(
      createElement(
        FoldProvider,
        providerProps,
        createElement(Harness, options),
      ),
    );
  });
};

afterEach(() => {
  if (renderer) {
    act(() => renderer.unmount());
    renderer = undefined;
  }
  visibilityRegistry.disposeAll();
  vi.unstubAllGlobals();
  fold = undefined;
});

describe("useFold", () => {
  it("activates once on visibility while continuing to track re-entry", () => {
    installObserver();
    mount({
      id: "fold-once",
      configuration: { strategy: "visible" },
      rootMargin: "0px",
    });
    const target = {};

    act(() => fold.ref(target));
    act(() => observers[0].emit(target, true, 1));
    expect(fold).toMatchObject({
      state: "activated",
      visibility: "visible",
      isVisible: true,
      isActivated: true,
    });

    act(() => observers[0].emit(target, false, 2));
    expect(fold).toMatchObject({
      state: "activated",
      visibility: "outside",
      isVisible: false,
      isActivated: true,
    });
    expect(fold.activate()).toBe(false);

    act(() => observers[0].emit(target, true, 3));
    expect(fold.visibility).toBe("visible");
    expect(fold.isActivated).toBe(true);
  });

  it("supports persistent activation across leave and re-entry", () => {
    installObserver();
    mount({
      id: "fold-persistent",
      configuration: { strategy: "visible" },
      activationMode: "persistent",
      rootMargin: "0px",
    });
    const target = {};

    act(() => fold.ref(target));
    act(() => observers[0].emit(target, true, 1));
    expect(fold.isActivated).toBe(true);

    act(() => observers[0].emit(target, false, 2));
    expect(fold).toMatchObject({
      state: "outside",
      isVisible: false,
      isActivated: false,
    });

    act(() => observers[0].emit(target, true, 3));
    expect(fold.isActivated).toBe(true);
  });

  it("keeps eager rendering active without creating an observer", () => {
    installObserver();
    mount({ id: "fold-eager", configuration: { strategy: "eager" } });

    expect(fold.isActivated).toBe(true);
    act(() => fold.ref({}));
    expect(observers).toHaveLength(0);
    expect(visibilityRegistry.observerCount).toBe(0);
  });

  it("keeps unknown components safe under the automatic provider profile", () => {
    installObserver();
    mountWithProvider(
      {
        configuration: {
          profile: "balanced",
          configuration: { priority: "high" },
        },
      },
      {
        id: "fold-provider",
      },
    );

    expect(fold.decision).toMatchObject({
      strategy: "eager",
      renderMode: "ssr",
      priority: "high",
    });
    act(() => fold.ref({}));
    expect(observers).toHaveLength(2);
    expect(observers.map((observer) => observer.options.rootMargin)).toEqual([
      "0px",
      "400px 0px",
    ]);
  });

  it("uses the config prop for profiles, custom settings, and route overrides", () => {
    mountWithProvider(
      {
        config: {
          profile: "custom",
          optimization: {
            prefetch: true,
            adaptiveScheduling: false,
            resourceConcurrency: 1,
          },
          route: { prefetchBudget: 7 },
        },
      },
      { id: "fold-custom-profile" },
    );

    expect(fold.decision).toMatchObject({
      strategy: "eager",
      renderMode: "ssr",
    });
    expect(fold.optimization).toMatchObject({
      prefetch: true,
      adaptiveScheduling: false,
      resourceConcurrency: 1,
      maxConcurrentPrefetch: 1,
      prefetchBudget: 7,
    });
  });

  it("emits opted-in boundary diagnostics with effective profile and visibility", () => {
    installObserver();
    const events = [];
    mountWithProvider(
      {
        config: {
          profile: "custom",
          optimization: {
            rootMargin: "250px 0px",
            resourceConcurrency: 1,
          },
        },
        onDiagnosticEvent: (event) => events.push(event),
      },
      {
        id: "fold-diagnostics",
        configuration: { strategy: "visible" },
        rootMargin: "0px",
        component: { role: "gallery" },
      },
    );

    expect(events[0]).toMatchObject({
      type: "boundary-registered",
      context: {
        contextType: "boundary",
        boundaryId: "fold-diagnostics",
        profile: "custom",
        strategy: "visible",
        renderMode: "ssr",
        effectiveConfiguration: {
          optimization: {
            rootMargin: "250px 0px",
            resourceConcurrency: 1,
          },
        },
      },
    });

    const target = {};
    act(() => fold.ref(target));
    const viewportObserver = observers.find(
      (observer) => observer.options.rootMargin === "0px",
    );
    act(() => viewportObserver.emit(target, true, 1));

    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "boundary-visibility-changed",
          context: expect.objectContaining({
            boundaryId: "fold-diagnostics",
            visibility: "visible",
            isVisible: true,
          }),
        }),
        expect.objectContaining({
          type: "component-activated",
          context: expect.objectContaining({
            boundaryId: "fold-diagnostics",
          }),
          activationLatencyMs: expect.any(Number),
        }),
      ]),
    );
    expect(fold.decision.diagnostics).toBeDefined();
  });

  it("allows nested providers to disable inherited diagnostic events", () => {
    const events = [];
    act(() => {
      renderer = create(
        createElement(
          FoldProvider,
          { onDiagnosticEvent: (event) => events.push(event) },
          createElement(
            FoldProvider,
            { diagnostics: false },
            createElement(Harness, { id: "fold-diagnostics-disabled" }),
          ),
        ),
      );
    });

    expect(events).toHaveLength(0);
    expect(fold.decision.diagnostics).toBeUndefined();
  });

  it("updates dynamic profiles while retaining stable configuration references", () => {
    const balancedConfig = { profile: "balanced" };
    const aggressiveConfig = { profile: "aggressive" };
    mountWithProvider({ config: balancedConfig }, { id: "fold-profile-change" });
    const balancedOptimization = fold.optimization;
    const balancedScheduler = fold.scheduler;

    act(() => {
      renderer.update(
        createElement(
          FoldProvider,
          { config: balancedConfig },
          createElement(Harness, { id: "fold-profile-change" }),
        ),
      );
    });
    expect(fold.optimization).toBe(balancedOptimization);

    act(() => {
      renderer.update(
        createElement(
          FoldProvider,
          { config: aggressiveConfig },
          createElement(Harness, { id: "fold-profile-change" }),
        ),
      );
    });
    expect(fold.optimization.rootMargin).toBe("800px 0px");
    expect(fold.scheduler).not.toBe(balancedScheduler);
    expect(fold.decision).toMatchObject({
      strategy: "eager",
      renderMode: "ssr",
    });
  });

  it("updates automatic strategy after client visibility confirmation", () => {
    installObserver();
    mount({
      id: "fold-auto-map",
      component: { role: "interactive-map" },
      prediction: { positionHint: "below-fold" },
      diagnostics: true,
    });
    const target = {};

    expect(fold.decision).toMatchObject({
      strategy: "idle",
      renderMode: "ssr",
      prediction: {
        result: "predicted-below-fold",
        confidence: 0.75,
      },
    });
    expect(fold.isActivated).toBe(false);

    act(() => fold.ref(target));
    const viewportObserver = observers.find(
      (observer) => observer.options.rootMargin === "0px",
    );
    act(() =>
      viewportObserver.emit(target, true, 1, {
        boundingClientRect: {
          top: 0,
          right: 100,
          bottom: 80,
          left: 0,
          width: 100,
          height: 80,
        },
        rootBounds: {
          top: 0,
          right: 100,
          bottom: 100,
          left: 0,
          width: 100,
          height: 100,
        },
      }),
    );

    expect(fold.decision.strategy).toBe("eager");
    expect(fold.decision.diagnostics.reason).toContain(
      "client confirmed that the component is visible",
    );
    expect(fold.measurement).toMatchObject({
      channel: "viewport",
      element: { top: 0, bottom: 80 },
      root: { height: 100 },
    });
    expect(fold.isActivated).toBe(true);
  });

  it("initializes the provider safely when browser APIs are absent", () => {
    vi.stubGlobal("window", undefined);
    vi.stubGlobal("document", undefined);
    vi.stubGlobal("navigator", undefined);
    vi.stubGlobal("IntersectionObserver", undefined);
    mountWithProvider({}, { id: "fold-provider-server" });

    expect(fold.decision).toMatchObject({
      strategy: "eager",
      renderMode: "ssr",
      supported: true,
    });
    expect(fold.isActivated).toBe(true);
  });

  it("inherits nested provider defaults while applying local observer options", () => {
    installObserver();
    const root = {};
    const childRoot = {};
    act(() => {
      renderer = create(
        createElement(
          FoldProvider,
          {
            configuration: {
              profile: "balanced",
              configuration: { priority: "high" },
            },
            visibility: { root, rootMargin: "50px" },
          },
          createElement(
            FoldProvider,
            {
              configuration: { configuration: { strategy: "visible" } },
              visibility: { root: childRoot },
            },
            createElement(Harness, { id: "fold-provider-nested-options" }),
          ),
        ),
      );
    });

    expect(fold.decision).toMatchObject({
      strategy: "visible",
      renderMode: "ssr",
      priority: "high",
    });
    act(() => fold.ref({}));
    expect(observers.map((observer) => observer.options)).toEqual([
      expect.objectContaining({ root: childRoot, rootMargin: "0px" }),
      expect.objectContaining({ root: childRoot, rootMargin: "50px" }),
    ]);
  });

  it("allows a route profile override to replace inherited application visibility", () => {
    act(() => {
      renderer = create(
        createElement(
          FoldProvider,
          {
            config: { profile: "balanced" },
            visibility: { rootMargin: "50px" },
          },
          createElement(
            FoldProvider,
            { config: { route: { rootMargin: "700px" } } },
            createElement(Harness, { id: "fold-route-profile" }),
          ),
        ),
      );
    });

    expect(fold.optimization.rootMargin).toBe("700px");
  });

  it("inherits and overrides component classification defaults in nested providers", () => {
    act(() => {
      renderer = create(
        createElement(
          FoldProvider,
          {
            classification: {
              roleDefaults: { gallery: { priority: "high" } },
            },
          },
          createElement(
            FoldProvider,
            {
              classification: {
                roleDefaults: {
                  gallery: { expectedInteractionCost: "high" },
                },
              },
            },
            createElement(Harness, {
              id: "fold-classification-provider",
              component: { role: "gallery" },
            }),
          ),
        ),
      );
    });

    expect(fold.decision).toMatchObject({
      priority: "high",
      classification: {
        role: "gallery",
        metadata: {
          priority: "high",
          expectedInteractionCost: "high",
        },
      },
    });
  });

  it("activates on idle without creating an observer", () => {
    installObserver();
    let idleCallback;
    const requestIdleCallback = vi.fn((callback) => {
      idleCallback = callback;
      return 1;
    });
    const cancelIdleCallback = vi.fn();
    vi.stubGlobal("window", { requestIdleCallback, cancelIdleCallback });

    mount({ id: "fold-idle", configuration: { strategy: "idle" } });
    act(() => fold.ref({}));

    expect(fold.isActivated).toBe(false);
    expect(observers).toHaveLength(0);
    expect(requestIdleCallback).toHaveBeenCalledOnce();

    act(() => idleCallback());

    expect(fold.isActivated).toBe(true);
    expect(visibilityRegistry.observerCount).toBe(0);
  });

  it("uses a timeout fallback and cancels idle work on unmount", () => {
    installObserver();
    let timeoutCallback;
    const setTimeout = vi.fn((callback) => {
      timeoutCallback = callback;
      return 2;
    });
    const clearTimeout = vi.fn();
    vi.stubGlobal("window", { setTimeout, clearTimeout });

    mount({ id: "fold-idle-fallback", configuration: { strategy: "idle" } });
    act(() => fold.ref({}));

    expect(setTimeout).toHaveBeenCalledOnce();
    act(() => timeoutCallback());
    expect(fold.isActivated).toBe(true);

    act(() => renderer.unmount());
    renderer = undefined;

    expect(clearTimeout).toHaveBeenCalledWith(2);
    expect(visibilityRegistry.observerCount).toBe(0);
  });

  it("does not override an explicit eager policy", () => {
    installObserver();
    mount({
      id: "fold-explicit-eager",
      component: { preferredStrategy: "visible" },
      override: { strategy: "eager" },
    });

    expect(fold.decision.strategy).toBe("eager");
    expect(fold.isActivated).toBe(true);
    act(() => fold.ref({}));
    expect(observers).toHaveLength(0);
  });

  it("uses a visible fallback when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    mount({
      id: "fold-fallback",
      configuration: { strategy: "visible" },
    });

    act(() => fold.ref({}));
    expect(fold).toMatchObject({
      state: "activated",
      visibility: "visible",
      isVisible: true,
      isActivated: true,
    });
  });

  it("cleans up shared observers when the boundary unmounts", () => {
    installObserver();
    mount({
      id: "fold-cleanup",
      configuration: { strategy: "visible" },
      rootMargin: "0px",
    });
    act(() => fold.ref({}));
    expect(visibilityRegistry.observerCount).toBe(1);

    act(() => renderer.unmount());
    renderer = undefined;

    expect(visibilityRegistry.observerCount).toBe(0);
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
  });
});
