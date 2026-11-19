import { afterEach, describe, expect, it, vi } from "vitest";
import {
  VisibilityObserverManager,
} from "./observer-manager";
import { VisibilityRegistry } from "./registry";

let registry;
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

    emit(target, isIntersecting, time) {
      this.callback(
        [{ target, isIntersecting, intersectionRatio: Number(isIntersecting), time }],
        this,
      );
    }
  }

  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
};

afterEach(() => {
  registry?.disposeAll();
  registry = undefined;
  vi.unstubAllGlobals();
});

describe("VisibilityRegistry", () => {
  it("rejects duplicate IDs and notifies only subscribers of the changed boundary", () => {
    installObserver();
    registry = new VisibilityRegistry(new VisibilityObserverManager());
    const target = {};
    const firstListener = vi.fn();
    const secondListener = vi.fn();
    const stopFirst = registry.subscribe("first", firstListener);
    const stopSecond = registry.subscribe("second", secondListener);
    const unregister = registry.register("first", target, {
      rootMargin: "0px",
    });

    firstListener.mockClear();
    secondListener.mockClear();
    expect(() => registry.register("first", target, {})).toThrow(
      'Visibility boundary "first" is already registered.',
    );

    observers[0].emit(target, true, 1);

    expect(firstListener).toHaveBeenCalled();
    expect(secondListener).not.toHaveBeenCalled();
    expect(registry.getSnapshot("first")).toMatchObject({
      state: "visible",
      visibility: "visible",
      isVisible: true,
    });

    stopFirst();
    stopSecond();
    unregister();
    expect(registry.getSnapshot("first").state).toBe("unknown");
  });

  it("supports one-shot and persistent activation across leave and re-entry", () => {
    installObserver();
    registry = new VisibilityRegistry(new VisibilityObserverManager());
    const oneShotTarget = {};
    const persistentTarget = {};
    const unregisterOneShot = registry.register("one-shot", oneShotTarget, {
      rootMargin: "0px",
      activationTrigger: "visible",
      activationMode: "one-shot",
    });
    const unregisterPersistent = registry.register(
      "persistent",
      persistentTarget,
      {
        rootMargin: "0px",
        activationTrigger: "visible",
        activationMode: "persistent",
      },
    );
    const observer = observers[0];

    observer.emit(oneShotTarget, true, 1);
    observer.emit(persistentTarget, true, 1);
    expect(registry.getSnapshot("one-shot").isActivated).toBe(true);
    expect(registry.getSnapshot("persistent").isActivated).toBe(true);

    observer.emit(oneShotTarget, false, 2);
    observer.emit(persistentTarget, false, 2);
    expect(registry.getSnapshot("one-shot")).toMatchObject({
      state: "activated",
      visibility: "outside",
      isActivated: true,
    });
    expect(registry.getSnapshot("persistent").isActivated).toBe(false);
    expect(registry.activate("one-shot")).toBe(false);

    observer.emit(persistentTarget, true, 3);
    expect(registry.getSnapshot("persistent").isActivated).toBe(true);
    expect(registry.deactivate("persistent")).toBe(true);

    unregisterOneShot();
    unregisterPersistent();
  });

  it("tracks nested boundaries and detaches children when a parent is removed", () => {
    registry = new VisibilityRegistry();
    const unregisterParent = registry.register("parent", {}, {
      observe: false,
    });
    const unregisterChild = registry.register("child", {}, {
      parentId: "parent",
      observe: false,
    });

    expect(registry.getChildren("parent")).toEqual(["child"]);
    expect(registry.getParentId("child")).toBe("parent");

    unregisterParent();
    expect(registry.getParentId("child")).toBeUndefined();
    expect(registry.getChildren("parent")).toEqual([]);
    expect(registry.getSnapshot("child").state).toBe("unknown");

    unregisterChild();
  });

  it("implements the framework-neutral observation contract", () => {
    registry = new VisibilityRegistry();
    const observedStates = [];
    const stop = registry.observe("missing", (state) =>
      observedStates.push(state),
    );

    expect(observedStates).toEqual(["unknown"]);
    stop();
    registry.unobserve("missing");
    registry.disconnect();
  });
});
