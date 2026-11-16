import { act, createElement } from "react";
import { create } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useKeyboardKeys } from "./use-keyboard-keys";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let renderer;
let windowTarget;
let documentTarget;

class EventTargetWithTracking {
  added = [];
  removed = [];
  listeners = new Map();

  addEventListener(type, listener, options) {
    this.added.push(type);
    const listeners = this.listeners.get(type) ?? [];
    listeners.push({ listener, capture: options === true });
    this.listeners.set(type, listeners);
  }

  removeEventListener(type, listener, options) {
    this.removed.push(type);
    const listeners = this.listeners.get(type) ?? [];
    this.listeners.set(
      type,
      listeners.filter(
        (entry) =>
          entry.listener !== listener || entry.capture !== (options === true),
      ),
    );
  }

  dispatchEvent(event) {
    for (const { listener } of this.listeners.get(event.type) ?? []) {
      listener.call(this, event);
    }
    return !event.defaultPrevented;
  }
}

const Harness = (options) => {
  useKeyboardKeys(options);
  return createElement("div");
};

const mount = (options) => {
  windowTarget = new EventTargetWithTracking();
  documentTarget = new EventTargetWithTracking();
  documentTarget.visibilityState = "visible";
  globalThis.window = windowTarget;
  globalThis.document = documentTarget;
  act(() => {
    renderer = create(createElement(Harness, options));
  });
};

const dispatchKey = (target, type, options) => {
  const event = new Event(type, { cancelable: true });
  Object.assign(event, {
    key: options.key,
    shiftKey: options.shiftKey ?? false,
    ctrlKey: options.ctrlKey ?? false,
    metaKey: options.metaKey ?? false,
    altKey: options.altKey ?? false,
    repeat: options.repeat ?? false,
  });
  target.dispatchEvent(event);
  return event;
};

afterEach(() => {
  if (renderer) {
    act(() => renderer.unmount());
    renderer = undefined;
  }
  delete globalThis.window;
  delete globalThis.document;
});

describe("useKeyboardKeys", () => {
  it("reports modifiers, repeat state, keydown and keyup", () => {
    const downs = [];
    const ups = [];
    mount({
      keys: ["a"],
      onKeyDown: (event) => downs.push(event),
      onKeyUp: (event) => ups.push(event),
    });

    dispatchKey(windowTarget, "keydown", { key: "Shift" });
    dispatchKey(windowTarget, "keydown", { key: "a", repeat: true });
    dispatchKey(windowTarget, "keyup", { key: "a" });

    expect(downs).toHaveLength(1);
    expect(downs[0]).toMatchObject({
      key: "a",
      type: "keydown",
      shiftKey: true,
      ctrlKey: false,
      repeat: true,
    });
    expect(downs[0].nativeEvent.type).toBe("keydown");
    expect(ups).toHaveLength(1);
    expect(ups[0]).toMatchObject({ key: "a", type: "keyup", shiftKey: true });
  });

  it("normalizes Space aliases and applies configured event controls", () => {
    const received = [];
    mount({
      keys: ["Spacebar"],
      preventDefault: true,
      stopPropagation: true,
      onKeyDown: (event) => received.push(event),
    });

    const event = dispatchKey(windowTarget, "keydown", { key: " " });

    expect(received).toHaveLength(1);
    expect(event.defaultPrevented).toBe(true);
    expect(event.cancelBubble).toBe(true);
  });

  it("removes all global listeners and ignores events after unmount", () => {
    const received = [];
    mount({
      keys: ["Escape"],
      onKeyDown: (event) => received.push(event),
      onKeyUp: (event) => received.push(event),
    });

    expect(windowTarget.added).toEqual(["keydown", "keyup", "blur"]);
    expect(documentTarget.added).toEqual(["visibilitychange"]);

    dispatchKey(windowTarget, "keydown", { key: "Escape" });
    expect(received).toHaveLength(1);

    act(() => renderer.unmount());
    renderer = undefined;

    expect(windowTarget.removed).toEqual(["keydown", "keyup", "blur"]);
    expect(documentTarget.removed).toEqual(["visibilitychange"]);
    dispatchKey(windowTarget, "keyup", { key: "Escape" });
    expect(received).toHaveLength(1);
  });

  it("does not subscribe or invoke callbacks while disabled", () => {
    const onKeyDown = vi.fn();
    mount({ keys: ["Escape"], enabled: false, onKeyDown });

    dispatchKey(windowTarget, "keydown", { key: "Escape" });

    expect(onKeyDown).not.toHaveBeenCalled();
    expect(windowTarget.added).toEqual([]);
    expect(documentTarget.added).toEqual([]);
  });
});
