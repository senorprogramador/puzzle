import { act, createElement } from "react";
import { create } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useColorScheme } from "./use-color-scheme";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const globalNames = ["document", "getComputedStyle", "MutationObserver"];
const originalGlobals = new Map(
  globalNames.map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]),
);
const mutationObservers = [];
let renderer;
let currentValue;
let options = {};

class TestMutationObserver {
  constructor(callback) {
    this.callback = callback;
    this.observe = vi.fn();
    this.disconnect = vi.fn();
    mutationObservers.push(this);
  }

  notify() {
    this.callback([], this);
  }
}

const Harness = () => {
  currentValue = useColorScheme(options);
  return null;
};

const setGlobal = (name, value) => {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value,
  });
};

afterEach(() => {
  if (renderer) {
    act(() => renderer.unmount());
    renderer = undefined;
  }

  for (const [name, descriptor] of originalGlobals) {
    if (descriptor) {
      Object.defineProperty(globalThis, name, descriptor);
    } else {
      delete globalThis[name];
    }
  }

  mutationObservers.length = 0;
  currentValue = undefined;
  options = {};
});

describe("useColorScheme", () => {
  it("returns undefined when no document is available", () => {
    setGlobal("document", undefined);

    act(() => {
      renderer = create(createElement(Harness));
    });

    expect(currentValue).toBeUndefined();
  });

  it("reads the default color-scheme from the document root", () => {
    const root = {};
    const getPropertyValue = vi.fn(() => "  LIGHT  ");
    const getComputedStyle = vi.fn(() => ({ getPropertyValue }));
    setGlobal("document", { documentElement: root });
    setGlobal("getComputedStyle", getComputedStyle);
    setGlobal("MutationObserver", TestMutationObserver);

    act(() => {
      renderer = create(createElement(Harness));
    });

    expect(currentValue).toBe("light");
    expect(getComputedStyle).toHaveBeenCalledWith(root);
    expect(getPropertyValue).toHaveBeenCalledWith("color-scheme");
  });

  it("keeps the default observer attached when the scheme changes", () => {
    const root = {};
    let scheme = "light";
    setGlobal("document", { documentElement: root });
    setGlobal("getComputedStyle", () => ({
      getPropertyValue: () => scheme,
    }));
    setGlobal("MutationObserver", TestMutationObserver);

    act(() => {
      renderer = create(createElement(Harness));
    });

    const observer = mutationObservers[0];
    expect(mutationObservers).toHaveLength(1);

    scheme = "dark";
    act(() => observer.notify());

    expect(currentValue).toBe("dark");
    expect(mutationObservers).toHaveLength(1);
    expect(observer.disconnect).not.toHaveBeenCalled();

    act(() => renderer.unmount());
    renderer = undefined;
    expect(observer.disconnect).toHaveBeenCalledOnce();
  });

  it("uses a custom target and property, updates on observed mutations, and disconnects", () => {
    const element = {};
    let scheme = "only DARK";
    const getComputedStyle = vi.fn(() => ({
      getPropertyValue: vi.fn(() => scheme),
    }));
    options = {
      target: () => element,
      property: "--page-color-scheme",
    };
    setGlobal("getComputedStyle", getComputedStyle);
    setGlobal("MutationObserver", TestMutationObserver);

    act(() => {
      renderer = create(createElement(Harness));
    });

    expect(currentValue).toBe("dark");
    expect(getComputedStyle).toHaveBeenCalledWith(element);

    const observer = mutationObservers[0];
    expect(observer.observe).toHaveBeenCalledWith(element, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    scheme = " LIGHT ";
    act(() => observer.notify());
    expect(currentValue).toBe("light");

    act(() => renderer.unmount());
    renderer = undefined;
    expect(observer.disconnect).toHaveBeenCalledOnce();
  });

  it("does not read styles or create an observer when the target is missing", () => {
    const getComputedStyle = vi.fn();
    options = { target: () => null };
    setGlobal("getComputedStyle", getComputedStyle);

    act(() => {
      renderer = create(createElement(Harness));
    });

    expect(currentValue).toBeUndefined();
    expect(getComputedStyle).not.toHaveBeenCalled();
    expect(mutationObservers).toHaveLength(0);
  });
});
