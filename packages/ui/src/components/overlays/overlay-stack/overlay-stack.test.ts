// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { registerOverlay } from "./index";

const originalInertDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "inert",
);

describe("OverlayStack", () => {
  let cleanups: Array<() => void> = [];

  const register = (
    onEscape: () => void,
    priority = 0,
    options: Parameters<typeof registerOverlay>[3] = {},
  ) => {
    const unregister = registerOverlay(document, onEscape, priority, options);

    cleanups.push(unregister);

    return unregister;
  };

  const createModal = () => {
    const modal = document.createElement("div");

    modal.innerHTML = `
      <button type="button" data-testid="first">
        First
      </button>

      <button type="button" data-testid="last">
        Last
      </button>
    `;

    document.body.append(modal);

    return modal;
  };

  const dispatchKey = (key: string, options: KeyboardEventInit = {}) => {
    const event = new KeyboardEvent("keydown", {
      key,
      bubbles: true,
      cancelable: true,
      ...options,
    });

    document.dispatchEvent(event);

    return event;
  };

  beforeEach(() => {
    cleanups = [];

    document.body.innerHTML = "";
    Object.defineProperty(HTMLElement.prototype, "inert", {
      configurable: true,
      enumerable: true,
      get() {
        return this.hasAttribute("inert");
      },
      set(value: boolean) {
        this.toggleAttribute("inert", Boolean(value));
      },
    });
  });

  afterEach(() => {
    if (originalInertDescriptor) {
      Object.defineProperty(
        HTMLElement.prototype,
        "inert",
        originalInertDescriptor,
      );
    } else {
      // @ts-expect-error inert may not exist on HTMLElement
      delete (HTMLElement.prototype as HTMLElement & { inert?: boolean }).inert;
    }

    for (const cleanup of cleanups.reverse()) {
      cleanup();
    }

    cleanups = [];

    document.body.innerHTML = "";
  });

  it("registers an overlay and handles Escape", () => {
    const onEscape = vi.fn();

    register(onEscape);

    dispatchKey("Escape");

    expect(onEscape).toHaveBeenCalledOnce();
  });

  it("only handles Escape on the topmost overlay", () => {
    const lowerEscape = vi.fn();
    const upperEscape = vi.fn();

    register(lowerEscape);
    register(upperEscape);

    dispatchKey("Escape");

    expect(upperEscape).toHaveBeenCalledOnce();
    expect(lowerEscape).not.toHaveBeenCalled();
  });

  it("uses priority to determine the topmost overlay", () => {
    const lowerEscape = vi.fn();
    const upperEscape = vi.fn();

    register(upperEscape, 10);
    register(lowerEscape, 0);

    dispatchKey("Escape");

    expect(upperEscape).toHaveBeenCalledOnce();
    expect(lowerEscape).not.toHaveBeenCalled();
  });

  it("does not handle Escape when the event was already prevented", () => {
    const onEscape = vi.fn();

    register(onEscape);

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });

    event.preventDefault();

    document.dispatchEvent(event);

    expect(onEscape).not.toHaveBeenCalled();
  });

  it("moves focus into a modal when it opens", () => {
    const opener = document.createElement("button");

    opener.textContent = "Open modal";

    document.body.append(opener);

    opener.focus();

    const modal = createModal();

    register(vi.fn(), 0, {
      modal: true,
      getContent: () => modal,
      getLayer: () => modal,
    });

    const first = modal.querySelector<HTMLElement>('[data-testid="first"]');

    expect(document.activeElement).toBe(first);
  });

  it("wraps Shift+Tab from the first element to the last element", () => {
    const modal = createModal();

    register(vi.fn(), 0, {
      modal: true,
      getContent: () => modal,
      getLayer: () => modal,
    });

    const first = modal.querySelector<HTMLElement>('[data-testid="first"]');

    const last = modal.querySelector<HTMLElement>('[data-testid="last"]');

    first?.focus();

    const event = dispatchKey("Tab", {
      shiftKey: true,
    });

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it("wraps Tab from the last element to the first element", () => {
    const modal = createModal();

    register(vi.fn(), 0, {
      modal: true,
      getContent: () => modal,
      getLayer: () => modal,
    });

    const first = modal.querySelector<HTMLElement>('[data-testid="first"]');

    const last = modal.querySelector<HTMLElement>('[data-testid="last"]');

    last?.focus();

    const event = dispatchKey("Tab");

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it("keeps focus inside the active modal", () => {
    const outside = document.createElement("button");

    outside.textContent = "Outside";

    document.body.append(outside);

    const modal = createModal();

    register(vi.fn(), 0, {
      modal: true,
      getContent: () => modal,
      getLayer: () => modal,
    });

    const first = modal.querySelector<HTMLElement>('[data-testid="first"]');

    outside.focus();

    expect(document.activeElement).toBe(first);
  });

  it("isolates content outside the active modal", () => {
    const outside = document.createElement("div");

    outside.id = "outside-content";

    document.body.append(outside);

    const modal = createModal();

    const unregister = register(vi.fn(), 0, {
      modal: true,
      getContent: () => modal,
      getLayer: () => modal,
    });

    expect(outside.inert).toBe(true);
    expect(outside.getAttribute("aria-hidden")).toBe("true");

    unregister();

    expect(outside.inert).toBe(false);
    expect(outside.hasAttribute("aria-hidden")).toBe(false);
  });

  it("restores the original inert and aria-hidden values", () => {
    const outside = document.createElement("div");

    outside.inert = true;
    outside.setAttribute("aria-hidden", "false");

    document.body.append(outside);

    const modal = createModal();

    const unregister = register(vi.fn(), 0, {
      modal: true,
      getContent: () => modal,
      getLayer: () => modal,
    });

    expect(outside.inert).toBe(true);
    expect(outside.getAttribute("aria-hidden")).toBe("true");

    unregister();

    expect(outside.inert).toBe(true);
    expect(outside.getAttribute("aria-hidden")).toBe("false");
  });

  it("restores focus to the element that opened the modal", async () => {
    const opener = document.createElement("button");

    opener.textContent = "Open modal";

    document.body.append(opener);

    opener.focus();

    const modal = createModal();

    const unregister = register(vi.fn(), 0, {
      modal: true,
      getContent: () => modal,
      getLayer: () => modal,
    });

    expect(document.activeElement).not.toBe(opener);

    unregister();

    await Promise.resolve();

    expect(document.activeElement).toBe(opener);
  });

  it("does not let a lower overlay handle Escape after the upper overlay closes", () => {
    const lowerEscape = vi.fn();
    const upperEscape = vi.fn();

    register(lowerEscape);

    const unregisterUpper = register(upperEscape);

    dispatchKey("Escape");

    expect(upperEscape).toHaveBeenCalledOnce();
    expect(lowerEscape).not.toHaveBeenCalled();

    unregisterUpper();

    dispatchKey("Escape");

    expect(lowerEscape).toHaveBeenCalledOnce();
  });
});
