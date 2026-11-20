import { afterEach, describe, expect, it, vi } from "vitest";
import { VisibilityObserverManager } from "./observer-manager";

let observers = [];
let manager;

const installObserver = () => {
  observers = [];

  class IntersectionObserverMock {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.targets = new Set();
      this.observe = vi.fn((target) => this.targets.add(target));
      this.unobserve = vi.fn((target) => this.targets.delete(target));
      this.disconnect = vi.fn(() => this.targets.clear());
      observers.push(this);
    }

    emit(
      target,
      isIntersecting,
      time,
      intersectionRatio = Number(isIntersecting),
      geometry = {},
    ) {
      this.callback(
        [{
          target,
          isIntersecting,
          intersectionRatio,
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

afterEach(() => {
  manager?.disconnect();
  manager = undefined;
  vi.unstubAllGlobals();
});

describe("VisibilityObserverManager", () => {
  it("reuses compatible observers and cleans them up after the last target", () => {
    installObserver();
    manager = new VisibilityObserverManager();
    const firstTarget = {};
    const secondTarget = {};
    const firstUpdates = [];
    const first = manager.observeVisibility(firstTarget, {}, (state) =>
      firstUpdates.push(state),
    );
    const second = manager.observeVisibility(secondTarget, {}, () => {});

    expect(manager.observerCount).toBe(2);
    expect(observers).toHaveLength(2);
    expect(observers[0].observe).toHaveBeenCalledWith(firstTarget);
    expect(observers[0].observe).toHaveBeenCalledWith(secondTarget);

    const viewportObserver = observers.find(
      (observer) => observer.options.rootMargin === "0px",
    );
    viewportObserver.emit(firstTarget, true, 1);
    expect(firstUpdates).toEqual(["visible"]);

    first.unsubscribe();
    expect(manager.observerCount).toBe(2);
    expect(observers.every((observer) => observer.disconnect.mock.calls.length === 0)).toBe(true);

    second.unsubscribe();
    expect(manager.observerCount).toBe(0);
    expect(
      observers.every(
        (observer) => observer.disconnect.mock.calls.length === 1,
      ),
    ).toBe(true);
  });

  it("uses separate pools for roots, proximity margins, and thresholds", () => {
    installObserver();
    manager = new VisibilityObserverManager();
    const firstRoot = {};
    const secondRoot = {};

    manager.observeVisibility({}, {
      root: firstRoot,
      rootMargin: "150px 0px",
      threshold: [0, 0.5],
    }, () => {});
    manager.observeVisibility({}, {
      root: secondRoot,
      rootMargin: "150px 0px",
      threshold: [0, 0.5],
    }, () => {});
    manager.observeVisibility({}, {
      root: firstRoot,
      rootMargin: "300px 0px",
      threshold: [0],
    }, () => {});

    expect(manager.observerCount).toBe(6);
  });

  it("uses priority margins unless a boundary supplies its own margin", () => {
    installObserver();
    manager = new VisibilityObserverManager();
    manager.observeVisibility({}, { priority: "high" }, () => {});
    manager.observeVisibility(
      {},
      { priority: "low", rootMargin: "75px 0px" },
      () => {},
    );

    expect(observers.map((observer) => observer.options.rootMargin)).toContain(
      "600px 0px",
    );
    expect(observers.map((observer) => observer.options.rootMargin)).toContain(
      "75px 0px",
    );
  });

  it("rejects invalid thresholds and empty root margins", () => {
    manager = new VisibilityObserverManager();

    expect(() =>
      manager.observeVisibility({}, { threshold: [0, 1.1] }, () => {}),
    ).toThrow(RangeError);
    expect(() =>
      manager.observeVisibility({}, { rootMargin: " " }, () => {}),
    ).toThrow(TypeError);
    expect(() =>
      manager.observeVisibility({}, { rootMargin: "invalid" }, () => {}),
    ).toThrow(TypeError);
    expect(() =>
      manager.observeVisibility({}, { rootMargin: "1px 2px 3px 4px 5px" }, () => {}),
    ).toThrow(TypeError);
  });

  it("ignores stale callbacks while tracking proximity, viewport entry, and re-entry", () => {
    installObserver();
    manager = new VisibilityObserverManager();
    const target = {};
    const states = [];
    manager.observeVisibility(target, {}, (state) => states.push(state));
    const viewportObserver = observers.find(
      (observer) => observer.options.rootMargin === "0px",
    );
    const proximityObserver = observers.find(
      (observer) => observer.options.rootMargin === "400px 0px",
    );

    proximityObserver.emit(target, true, 10);
    viewportObserver.emit(target, true, 11);
    proximityObserver.emit(target, false, 9);
    viewportObserver.emit(target, false, 12);
    proximityObserver.emit(target, false, 13);
    viewportObserver.emit(target, true, 14);

    expect(states).toEqual([
      "nearby",
      "visible",
      "nearby",
      "outside",
      "visible",
    ]);
  });

  it("publishes observer geometry for client confirmation and layout shifts", () => {
    installObserver();
    manager = new VisibilityObserverManager();
    const target = {};
    const updates = [];
    manager.observeVisibility(target, {}, (state, measurement) =>
      updates.push({ state, measurement }),
    );
    const viewportObserver = observers.find(
      (observer) => observer.options.rootMargin === "0px",
    );
    const geometry = (top, rootBottom = 800) => ({
      boundingClientRect: {
        top,
        right: 100,
        bottom: top + 50,
        left: 0,
        width: 100,
        height: 50,
      },
      rootBounds: {
        top: 0,
        right: 100,
        bottom: rootBottom,
        left: 0,
        width: 100,
        height: rootBottom,
      },
    });

    viewportObserver.emit(target, true, 1, 0.8, geometry(120));
    viewportObserver.emit(target, true, 2, 0.5, geometry(160));
    const proximityObserver = observers.find(
      (observer) => observer.options.rootMargin === "400px 0px",
    );
    proximityObserver.emit(target, true, 3, 0.5, geometry(200, 1_600));

    expect(updates[0]).toMatchObject({
      state: "visible",
      measurement: {
        channel: "viewport",
        intersectionRatio: 0.8,
        element: { top: 120, bottom: 170 },
        root: { height: 800 },
      },
    });
    expect(updates.at(-1)).toMatchObject({
      state: "visible",
      measurement: {
        intersectionRatio: 0.5,
        element: { top: 200, bottom: 250 },
        root: { height: 800 },
      },
    });
  });

  it("reports unsupported observation without accessing browser APIs", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    manager = new VisibilityObserverManager();
    const onChange = vi.fn();
    const subscription = manager.observeVisibility({}, {}, onChange);

    expect(subscription.supported).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
    subscription.unsubscribe();
    expect(manager.observerCount).toBe(0);
  });
});
