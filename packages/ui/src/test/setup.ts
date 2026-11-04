import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

class ResizeObserverMock implements ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  Object.defineProperty(globalThis, "ResizeObserver", {
    configurable: true,
    writable: true,
    value: ResizeObserverMock,
  });
}

afterEach(() => {
  cleanup();
});

if (typeof window.CSS === "undefined") {
  Object.defineProperty(window, "CSS", {
    configurable: true,
    writable: true,
    value: {},
  });
}

if (typeof window.CSS.supports !== "function") {
  window.CSS.supports = () => false;
}

if (typeof Element.prototype.scrollIntoView !== "function") {
  Element.prototype.scrollIntoView = () => {};
}

if (typeof globalThis.PointerEvent === "undefined") {
  class PointerEventMock extends MouseEvent {
    pointerType: string;

    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerType = init.pointerType ?? "";
    }
  }

  Object.defineProperty(globalThis, "PointerEvent", {
    configurable: true,
    writable: true,
    value: PointerEventMock,
  });
}
