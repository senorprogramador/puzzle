import { act, createElement, Fragment } from "react";
import { create } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  useFoldState,
  useIsNearby,
  useIsVisible,
  useVisibility,
} from "./use-visibility";
import { visibilityRegistry } from "./visibility/registry";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let renderer;
let visibility;
let observedState;
let isVisible;
let isNearby;
let observedRenderCount = 0;
let unrelatedRenderCount = 0;
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

const VisibilityHarness = () => {
  visibility = useVisibility({ id: "observed", rootMargin: "0px" });
  return createElement("span", null, visibility.state);
};

const ObservedSubscriber = () => {
  observedRenderCount += 1;
  observedState = useFoldState("observed");
  isVisible = useIsVisible("observed");
  isNearby = useIsNearby("observed");
  return createElement("span", null, String(isVisible));
};

const UnrelatedSubscriber = () => {
  unrelatedRenderCount += 1;
  useFoldState("unrelated");
  return createElement("span");
};

afterEach(() => {
  if (renderer) {
    act(() => renderer.unmount());
    renderer = undefined;
  }
  visibilityRegistry.disposeAll();
  vi.unstubAllGlobals();
  visibility = undefined;
  observedState = undefined;
  isVisible = undefined;
  isNearby = undefined;
  observedRenderCount = 0;
  unrelatedRenderCount = 0;
});

describe("visibility hooks", () => {
  it("subscribes per boundary and avoids rerendering unrelated subscribers", () => {
    installObserver();
    act(() => {
      renderer = create(
        createElement(
          Fragment,
          null,
          createElement(VisibilityHarness),
          createElement(ObservedSubscriber),
          createElement(UnrelatedSubscriber),
        ),
      );
    });
    const target = {};
    act(() => visibility.ref(target));
    const previousUnrelatedRenderCount = unrelatedRenderCount;

    act(() =>
      observers[0].emit(target, true, 1, {
        boundingClientRect: {
          top: 24,
          right: 124,
          bottom: 124,
          left: 24,
          width: 100,
          height: 100,
        },
        rootBounds: {
          top: 0,
          right: 200,
          bottom: 800,
          left: 0,
          width: 200,
          height: 800,
        },
      }),
    );

    expect(visibility).toMatchObject({
      state: "visible",
      isVisible: true,
      isNearby: true,
      measurement: {
        channel: "viewport",
        element: { top: 24, bottom: 124 },
        root: { height: 800 },
      },
    });
    expect(observedState.visibility).toBe("visible");
    expect(isVisible).toBe(true);
    expect(isNearby).toBe(true);
    expect(unrelatedRenderCount).toBe(previousUnrelatedRenderCount);
    expect(observedRenderCount).toBeGreaterThan(1);
  });

  it("returns a deterministic visible fallback without browser APIs", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    act(() => {
      renderer = create(createElement(VisibilityHarness));
    });

    act(() => visibility.ref({}));

    expect(visibility).toMatchObject({
      state: "visible",
      isVisible: true,
      isNearby: true,
    });
  });

  it("unsubscribes observers when its target changes or unmounts", () => {
    installObserver();
    act(() => {
      renderer = create(createElement(VisibilityHarness));
    });
    const firstTarget = {};
    const secondTarget = {};

    act(() => visibility.ref(firstTarget));
    act(() => visibility.ref(secondTarget));

    expect(visibilityRegistry.observerCount).toBe(1);
    expect(observers[0].unobserve).toHaveBeenCalledWith(firstTarget);

    act(() => renderer.unmount());
    renderer = undefined;
    expect(visibilityRegistry.observerCount).toBe(0);
  });
});
