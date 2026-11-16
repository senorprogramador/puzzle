import { act, createElement } from "react";
import { create } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useZoomPanPinch } from "./use-zoom-pan-pinch";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const originalWheelEvent = globalThis.WheelEvent;

let renderer;
let api;
let viewport;

const createViewport = () => {
  const listeners = new Map();
  const viewportNode = {
    style: { touchAction: "pan-x", userSelect: "text" },
    listeners,
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    removeEventListener(type, listener) {
      if (listeners.get(type) === listener) listeners.delete(type);
    },
    getBoundingClientRect: () => ({
      left: 10,
      top: 20,
      width: 200,
      height: 100,
    }),
    setPointerCapture() {},
    hasPointerCapture: () => false,
    releasePointerCapture() {},
  };
  return viewportNode;
};

const Harness = (options) => {
  api = useZoomPanPinch(options);
  return createElement("div", {
    ref: api.ref,
    style: api.contentStyle,
  });
};

const mount = (options = {}) => {
  viewport = createViewport();
  act(() => {
    renderer = create(createElement(Harness, options), {
      createNodeMock: () => viewport,
    });
  });
};

const fire = (type, event) => viewport.listeners.get(type)?.(event);

afterEach(() => {
  if (renderer) {
    act(() => renderer.unmount());
    renderer = undefined;
  }
  vi.restoreAllMocks();
  if (originalWheelEvent === undefined) {
    delete globalThis.WheelEvent;
  } else {
    globalThis.WheelEvent = originalWheelEvent;
  }
});

describe("useZoomPanPinch", () => {
  it("zooms around the wheel focal point and clamps the scale", () => {
    globalThis.WheelEvent = {
      DOM_DELTA_LINE: 1,
      DOM_DELTA_PAGE: 2,
    };
    const onTransformChange = vi.fn();
    mount({
      initialTransform: { x: 10, y: 15 },
      maxScale: 2,
      wheelSensitivity: Math.log(2) / 100,
      onTransformChange,
    });

    let prevented = false;
    act(() =>
      fire("wheel", {
        deltaY: -100,
        deltaMode: 0,
        clientX: 60,
        clientY: 60,
        preventDefault: () => {
          prevented = true;
        },
      }),
    );

    expect(prevented).toBe(true);
    expect(api.transform).toEqual({ x: -30, y: -10, scale: 2 });
    expect(onTransformChange).toHaveBeenCalledWith(
      { x: -30, y: -10, scale: 2 },
      "wheel",
    );

    act(() =>
      fire("wheel", {
        deltaY: -1000,
        deltaMode: 0,
        clientX: 60,
        clientY: 60,
        preventDefault() {},
      }),
    );
    expect(api.transform.scale).toBe(2);
  });

  it("pans with the middle pointer and ends the gesture on pointerup", () => {
    const onTransformChange = vi.fn();
    mount({ onTransformChange });

    act(() =>
      fire("pointerdown", {
        pointerType: "mouse",
        pointerId: 1,
        button: 1,
        clientX: 5,
        clientY: 8,
        preventDefault() {},
      }),
    );
    expect(api.isPanning).toBe(true);

    act(() =>
      fire("pointermove", {
        pointerType: "mouse",
        pointerId: 1,
        clientX: 15,
        clientY: 20,
        preventDefault() {},
      }),
    );
    expect(api.transform).toEqual({ x: 10, y: 12, scale: 1 });
    expect(onTransformChange).toHaveBeenLastCalledWith(
      { x: 10, y: 12, scale: 1 },
      "pan",
    );

    act(() =>
      fire("pointerup", {
        pointerType: "mouse",
        pointerId: 1,
      }),
    );
    expect(api.isPanning).toBe(false);
  });

  it("pinches with touch pointers while preserving the previous focal point", () => {
    mount({ minScale: 0.5, maxScale: 3 });
    const touch = (pointerId, clientX, clientY) => ({
      pointerType: "touch",
      pointerId,
      clientX,
      clientY,
      preventDefault() {},
    });

    act(() => {
      fire("pointerdown", touch(1, 20, 20));
      fire("pointerdown", touch(2, 40, 20));
    });
    expect(api.isPanning).toBe(true);

    act(() => fire("pointermove", touch(2, 50, 20)));
    expect(api.transform).toEqual({ x: -10, y: -10, scale: 1.5 });

    act(() => {
      fire("pointerup", touch(1, 20, 20));
      fire("pointerup", touch(2, 50, 20));
    });
    expect(api.isPanning).toBe(false);
  });

  it("clamps programmatic transforms and resets with callbacks", () => {
    const onTransformChange = vi.fn();
    mount({
      initialTransform: { x: 2, y: 3, scale: 2 },
      minScale: 1,
      maxScale: 4,
      onTransformChange,
    });

    act(() => api.setTransform({ x: 5, y: 6, scale: 99 }));
    expect(api.transform).toEqual({ x: 5, y: 6, scale: 4 });

    act(() => api.reset());
    expect(api.transform).toEqual({ x: 2, y: 3, scale: 2 });
    expect(onTransformChange).toHaveBeenLastCalledWith(
      { x: 2, y: 3, scale: 2 },
      "programmatic",
    );
  });

  it("restores viewport styles and removes input listeners on unmount", () => {
    mount();

    expect(viewport.style.touchAction).toBe("none");
    expect(viewport.style.userSelect).toBe("none");
    expect([...viewport.listeners.keys()]).toEqual([
      "pointerdown",
      "pointermove",
      "pointerup",
      "pointercancel",
      "lostpointercapture",
      "wheel",
    ]);

    act(() => renderer.unmount());
    renderer = undefined;

    expect(viewport.style.touchAction).toBe("pan-x");
    expect(viewport.style.userSelect).toBe("text");
    expect(viewport.listeners.size).toBe(0);
  });
});
