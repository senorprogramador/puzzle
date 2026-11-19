import { act, createElement } from "react";
import { create } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FoldProvider, useResourcePrefetch } from "../index";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const resource = Object.freeze({
  id: "test-component-chunk",
  type: "component-chunk",
  priority: "low",
});
const sharedEnvironmentResources = [
  Object.freeze({
    id: "shared-environment-first",
    type: "component-chunk",
    priority: "low",
  }),
  Object.freeze({
    id: "shared-environment-second",
    type: "component-chunk",
    priority: "low",
  }),
];

let renderer;
let result;

const Harness = ({
  load,
  strategy = "idle",
  enabled = true,
  resource: resourceDescriptor = resource,
}) => {
  result = useResourcePrefetch({
    resource: resourceDescriptor,
    load,
    strategy,
    enabled,
  });
  return createElement("span", null, result.state);
};

const MultiHarness = ({ load }) => {
  const first = useResourcePrefetch({
    resource: sharedEnvironmentResources[0],
    load,
    strategy: "idle",
  });
  const second = useResourcePrefetch({
    resource: sharedEnvironmentResources[1],
    load,
    strategy: "idle",
  });
  result = [first, second];
  return createElement("span", null, first.state, second.state);
};

const ProfileHarness = ({ load, resource: resourceDescriptor }) => {
  result = useResourcePrefetch({
    resource: resourceDescriptor,
    load,
  });
  return createElement("span", null, result.state);
};

const mount = (props, providerProps = {}) =>
  act(() => {
    renderer = create(
      createElement(
        FoldProvider,
        providerProps,
        createElement(Harness, props),
      ),
    );
  });

const flushMicrotasks = async () => {
  for (let index = 0; index < 5; index += 1) {
    await Promise.resolve();
  }
};

afterEach(() => {
  if (renderer) {
    act(() => renderer.unmount());
    renderer = undefined;
  }
  vi.unstubAllGlobals();
  result = undefined;
});

describe("useResourcePrefetch", () => {
  it("uses requestIdleCallback and prefetches without mounting the component", async () => {
    const idleCallbacks = [];
    let timeoutId = 0;
    const requestIdleCallback = vi.fn((callback) => {
      idleCallbacks.push(callback);
      return idleCallbacks.length;
    });
    const windowMock = {
      requestIdleCallback,
      cancelIdleCallback: vi.fn(),
      setTimeout: vi.fn((_callback, _delay) => ++timeoutId),
      clearTimeout: vi.fn(),
    };
    vi.stubGlobal("window", windowMock);
    vi.stubGlobal("navigator", {});
    let mounts = 0;
    const load = vi.fn(async () => ({
      default: () => {
        mounts += 1;
        return null;
      },
    }));

    mount({ load });
    expect(result.available).toBe(true);
    expect(requestIdleCallback).toHaveBeenCalledOnce();
    expect(load).not.toHaveBeenCalled();

    await act(async () => {
      idleCallbacks[0]();
      await flushMicrotasks();
    });

    expect(load).toHaveBeenCalledOnce();
    expect(result.state).toBe("loaded");
    expect(mounts).toBe(0);
  });

  it("reports opted-in prefetch start and completion with resource state", async () => {
    const idleCallbacks = [];
    const requestIdleCallback = vi.fn((callback) => {
      idleCallbacks.push(callback);
      return idleCallbacks.length;
    });
    vi.stubGlobal("window", {
      requestIdleCallback,
      cancelIdleCallback: vi.fn(),
      setTimeout: vi.fn(() => 1),
      clearTimeout: vi.fn(),
    });
    vi.stubGlobal("navigator", {});
    const events = [];
    const load = vi.fn(async () => "prepared");

    mount(
      { load, strategy: "idle" },
      { onDiagnosticEvent: (event) => events.push(event) },
    );

    await act(async () => {
      idleCallbacks[0]();
      await flushMicrotasks();
    });

    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "prefetch-started",
          context: expect.objectContaining({
            contextType: "resource-prefetch",
            profile: "balanced",
            strategy: "idle",
          }),
          resource: expect.objectContaining({ id: "test-component-chunk" }),
        }),
        expect.objectContaining({
          type: "resource-loaded",
          source: "prefetch",
          state: "loaded",
          durationMs: expect.any(Number),
        }),
      ]),
    );
    expect(result.state).toBe("loaded");
  });

  it("reports when an automatic prefetch is skipped by network policy", () => {
    const idleCallbacks = [];
    const requestIdleCallback = vi.fn((callback) => {
      idleCallbacks.push(callback);
      return idleCallbacks.length;
    });
    vi.stubGlobal("window", {
      requestIdleCallback,
      cancelIdleCallback: vi.fn(),
      setTimeout: vi.fn(() => 1),
      clearTimeout: vi.fn(),
    });
    vi.stubGlobal("navigator", { connection: { saveData: true } });
    const events = [];
    const load = vi.fn(async () => "should not load");

    mount(
      { load, strategy: "idle" },
      { onDiagnosticEvent: (event) => events.push(event) },
    );

    act(() => idleCallbacks[0]());

    expect(load).not.toHaveBeenCalled();
    expect(events).toContainEqual(
      expect.objectContaining({
        type: "prefetch-skipped",
        reason: "network-policy",
        context: expect.objectContaining({
          contextType: "resource-prefetch",
          boundaryId: expect.stringContaining("resource-prefetch-"),
        }),
      }),
    );
  });

  it("uses conservative prefetch defaults but keeps explicit prefetch available", async () => {
    const requestIdleCallback = vi.fn(() => 1);
    vi.stubGlobal("window", {
      requestIdleCallback,
      cancelIdleCallback: vi.fn(),
      setTimeout: vi.fn(() => 1),
      clearTimeout: vi.fn(),
    });
    vi.stubGlobal("navigator", {});
    const load = vi.fn(async () => "explicitly loaded");
    const profileResource = Object.freeze({
      ...resource,
      prefetchStrategy: "idle",
    });

    act(() => {
      renderer = create(
        createElement(
          FoldProvider,
          { config: { profile: "conservative" } },
          createElement(ProfileHarness, {
            load,
            resource: profileResource,
          }),
        ),
      );
    });

    expect(result.available).toBe(true);
    expect(requestIdleCallback).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();

    await act(async () => {
      await result.prefetch();
      await flushMicrotasks();
    });

    expect(load).toHaveBeenCalledOnce();
    expect(result.state).toBe("loaded");
  });

  it("falls back to a bounded timer when browser idle and frame APIs are absent", async () => {
    const timeoutCallbacks = new Map();
    let timeoutId = 0;
    const windowMock = {
      setTimeout: vi.fn((callback) => {
        const handle = ++timeoutId;
        timeoutCallbacks.set(handle, callback);
        return handle;
      }),
      clearTimeout: vi.fn((handle) => timeoutCallbacks.delete(handle)),
    };
    vi.stubGlobal("window", windowMock);
    vi.stubGlobal("navigator", {});
    const load = vi.fn(async () => "prepared");

    mount({ load });
    expect(load).not.toHaveBeenCalled();
    expect(timeoutCallbacks.size).toBeGreaterThan(0);

    await act(async () => {
      timeoutCallbacks.values().next().value();
      await flushMicrotasks();
    });

    expect(load).toHaveBeenCalledOnce();
    expect(result.state).toBe("loaded");
  });

  it("waits while the page is hidden and resumes on visibilitychange", async () => {
    const idleCallbacks = [];
    const listeners = new Map();
    const documentMock = {
      visibilityState: "hidden",
      addEventListener: vi.fn((type, callback) => {
        listeners.set(type, callback);
      }),
      removeEventListener: vi.fn((type) => listeners.delete(type)),
    };
    let timeoutId = 0;
    vi.stubGlobal("document", documentMock);
    vi.stubGlobal("navigator", {});
    vi.stubGlobal("window", {
      requestIdleCallback: (callback) => {
        idleCallbacks.push(callback);
        return idleCallbacks.length;
      },
      cancelIdleCallback: vi.fn(),
      setTimeout: () => ++timeoutId,
      clearTimeout: vi.fn(),
    });
    const load = vi.fn(async () => "visible");

    mount({ load });
    expect(idleCallbacks).toHaveLength(0);
    expect(load).not.toHaveBeenCalled();

    documentMock.visibilityState = "visible";
    await act(async () => {
      listeners.get("visibilitychange")();
      idleCallbacks[0]();
      await flushMicrotasks();
    });

    expect(load).toHaveBeenCalledOnce();
    expect(result.state).toBe("loaded");
  });

  it("shares page and network listeners and pauses idle work during page lifecycle suspension", () => {
    const documentListeners = new Map();
    const windowListeners = new Map();
    const connectionListeners = new Map();
    const idleCallbacks = [];
    let timeoutId = 0;
    const documentMock = {
      visibilityState: "visible",
      addEventListener: vi.fn((type, callback) =>
        documentListeners.set(type, callback),
      ),
      removeEventListener: vi.fn((type) => documentListeners.delete(type)),
    };
    const windowMock = {
      addEventListener: vi.fn((type, callback) =>
        windowListeners.set(type, callback),
      ),
      removeEventListener: vi.fn((type) => windowListeners.delete(type)),
      requestIdleCallback: vi.fn((callback) => {
        idleCallbacks.push(callback);
        return idleCallbacks.length;
      }),
      cancelIdleCallback: vi.fn(),
      setTimeout: vi.fn(() => ++timeoutId),
      clearTimeout: vi.fn(),
    };
    const connection = {
      addEventListener: vi.fn((type, callback) =>
        connectionListeners.set(type, callback),
      ),
      removeEventListener: vi.fn((type) => connectionListeners.delete(type)),
    };
    vi.stubGlobal("document", documentMock);
    vi.stubGlobal("window", windowMock);
    vi.stubGlobal("navigator", { connection });

    act(() => {
      renderer = create(
        createElement(
          FoldProvider,
          null,
          createElement(MultiHarness, { load: vi.fn(async () => "unused") }),
        ),
      );
    });

    expect(
      documentMock.addEventListener.mock.calls.filter(
        ([type]) => type === "visibilitychange",
      ),
    ).toHaveLength(1);
    expect(windowMock.addEventListener).toHaveBeenCalledTimes(2);
    expect(connection.addEventListener).toHaveBeenCalledOnce();
    expect(idleCallbacks).toHaveLength(2);

    windowListeners.get("pagehide")();
    expect(windowMock.cancelIdleCallback).toHaveBeenCalledTimes(2);
    windowListeners.get("pageshow")();
    expect(idleCallbacks).toHaveLength(4);

    act(() => renderer.unmount());
    renderer = undefined;

    expect(
      documentMock.removeEventListener.mock.calls.filter(
        ([type]) => type === "visibilitychange",
      ),
    ).toHaveLength(1);
    expect(windowMock.removeEventListener).toHaveBeenCalledTimes(2);
    expect(connection.removeEventListener).toHaveBeenCalledOnce();
  });

  it("respects Save-Data and retries automatic scheduling when network hints change", async () => {
    const idleCallbacks = [];
    const listeners = new Map();
    const connection = {
      saveData: true,
      addEventListener: vi.fn((type, callback) => {
        listeners.set(type, callback);
      }),
      removeEventListener: vi.fn((type) => listeners.delete(type)),
    };
    let timeoutId = 0;
    vi.stubGlobal("navigator", { connection });
    vi.stubGlobal("window", {
      requestIdleCallback: (callback) => {
        idleCallbacks.push(callback);
        return idleCallbacks.length;
      },
      cancelIdleCallback: vi.fn(),
      setTimeout: () => ++timeoutId,
      clearTimeout: vi.fn(),
    });
    const load = vi.fn(async () => "network-ready");

    mount({ load });
    await act(async () => {
      idleCallbacks[0]();
      await flushMicrotasks();
    });
    expect(load).not.toHaveBeenCalled();

    connection.saveData = false;
    await act(async () => {
      listeners.get("change")();
      idleCallbacks[1]();
      await flushMicrotasks();
    });

    expect(load).toHaveBeenCalledOnce();
    expect(result.state).toBe("loaded");
  });

  it("uses the visibility registry for proximity activation", async () => {
    const observers = [];
    const frames = [];
    const target = {};
    class IntersectionObserverMock {
      constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        this.observe = vi.fn();
        this.unobserve = vi.fn();
        this.disconnect = vi.fn();
        observers.push(this);
      }

      emit(element) {
        this.callback(
          [
            {
              target: element,
              isIntersecting: true,
              intersectionRatio: 1,
              time: 1,
            },
          ],
          this,
        );
      }
    }
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    vi.stubGlobal("navigator", {});
    vi.stubGlobal("window", {
      requestAnimationFrame: (callback) => {
        frames.push(callback);
        return frames.length;
      },
      cancelAnimationFrame: vi.fn(),
      setTimeout: (callback) => {
        callback();
        return 1;
      },
      clearTimeout: vi.fn(),
    });
    const load = vi.fn(async () => "nearby");

    mount({ load, strategy: "proximity" });
    act(() => result.ref(target));
    expect(observers).toHaveLength(2);
    expect(observers[0].observe).toHaveBeenCalledWith(target);

    act(() => observers[0].emit(target));
    await act(async () => {
      frames[0](0);
      await flushMicrotasks();
    });

    expect(load).toHaveBeenCalledOnce();
    expect(result.state).toBe("loaded");
  });

  it("exposes loader failures and allows an explicit retry", async () => {
    const failure = new Error("module unavailable");
    const load = vi
      .fn()
      .mockRejectedValueOnce(failure)
      .mockResolvedValueOnce("recovered");

    mount({ load, strategy: "explicit" });
    await act(async () => {
      await expect(result.prefetch()).rejects.toBe(failure);
      await flushMicrotasks();
    });
    expect(result.state).toBe("failed");
    expect(result.error).toBe(failure);

    await act(async () => {
      await expect(result.retry()).resolves.toBe("recovered");
    });
    expect(result.state).toBe("loaded");
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("aborts pending work when the hook unmounts", async () => {
    let signal;
    const load = vi.fn(
      (loadSignal) =>
        new Promise(() => {
          signal = loadSignal;
        }),
    );

    mount({ load, strategy: "explicit" });
    let request;
    act(() => {
      request = result.prefetch();
    });
    await flushMicrotasks();
    expect(signal.aborted).toBe(false);

    act(() => renderer.unmount());
    renderer = undefined;

    await expect(request).rejects.toMatchObject({ name: "AbortError" });
    expect(signal.aborted).toBe(true);
  });

  it("reports missing provider use explicitly while remaining provider-free safe", async () => {
    const load = vi.fn(async () => "unused");
    act(() => {
      renderer = create(createElement(Harness, { load, strategy: "explicit" }));
    });

    expect(result.available).toBe(false);
    await expect(result.prefetch()).rejects.toThrow("requires a FoldProvider");
    expect(load).not.toHaveBeenCalled();
  });
});
