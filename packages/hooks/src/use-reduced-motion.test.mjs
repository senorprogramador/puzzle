import { act, createElement } from "react";
import { create } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useReducedMotion } from "./use-reduced-motion";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let renderer;
let currentValue;
let originalWindow;

const Harness = () => {
  currentValue = useReducedMotion();
  return createElement("span", null, String(currentValue));
};

afterEach(() => {
  if (renderer) {
    act(() => renderer.unmount());
    renderer = undefined;
  }

  if (originalWindow === undefined) {
    delete globalThis.window;
  } else {
    globalThis.window = originalWindow;
  }

  originalWindow = undefined;
  currentValue = undefined;
});

describe("useReducedMotion", () => {
  it("uses the conservative reduced-motion snapshot without a browser", () => {
    originalWindow = globalThis.window;
    delete globalThis.window;

    act(() => {
      renderer = create(createElement(Harness));
    });

    expect(currentValue).toBe(true);
  });

  it("tracks preference changes and removes its media query listener", () => {
    originalWindow = globalThis.window;
    const listeners = new Set();
    const removeEventListener = vi.fn((_type, listener) =>
      listeners.delete(listener),
    );
    let matches = true;
    const mediaQuery = {
      get matches() {
        return matches;
      },
      addEventListener: (_type, listener) => listeners.add(listener),
      removeEventListener,
    };

    globalThis.window = {
      matchMedia: vi.fn(() => mediaQuery),
    };

    act(() => {
      renderer = create(createElement(Harness));
    });
    expect(currentValue).toBe(true);

    matches = false;
    act(() => {
      for (const listener of listeners) listener();
    });
    expect(currentValue).toBe(false);

    act(() => renderer.unmount());
    renderer = undefined;
    expect(removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });
});
