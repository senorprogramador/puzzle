import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Preview, PreviewProvider } from "./index";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn((media: string) => ({
    matches: true,
    media,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const loadTestFrame = (frame: HTMLIFrameElement) => {
  const frameDocument = document.implementation.createHTMLDocument();
  const frameRoot = frameDocument.createElement("div");
  const rootId = frame.getAttribute("srcdoc")?.match(/<div id="([^"]+)"/)?.[1];
  if (!rootId) throw new Error("Missing preview root ID.");
  frameRoot.id = rootId;
  frameDocument.body.appendChild(frameRoot);
  Object.defineProperty(frame, "contentDocument", { configurable: true, value: frameDocument });
  fireEvent.load(frame);
  return frameDocument;
};

describe("Preview", () => {
  it("waits for the current stylesheets even when a pending link is replaced", async () => {
    const source = document.createElement("link");
    source.rel = "stylesheet";
    source.href = "/preview-theme.css";
    document.head.appendChild(source);
    try {
      render(<Preview height={200}>Styled preview</Preview>);
      const frameDocument = loadTestFrame(screen.getByTitle<HTMLIFrameElement>("Desktop component preview"));
      await waitFor(() => expect(frameDocument.body.textContent).toContain("Styled preview"));
      expect(screen.getByRole("progressbar", { name: "Loading preview" })).toBeVisible();
      source.href = "/updated-preview-theme.css";
      await waitFor(() => expect(frameDocument.querySelector("link")?.getAttribute("href")).toBe("/updated-preview-theme.css"));

      const clone = frameDocument.querySelector("link")!;
      Object.defineProperty(clone, "sheet", { value: new CSSStyleSheet() });
      fireEvent(clone, new Event("load"));
      await waitFor(() => expect(screen.queryByRole("progressbar", { name: "Loading preview" })).toBeNull());

      const meta = document.createElement("meta");
      document.head.appendChild(meta);
      await new Promise((resolve) => setTimeout(resolve, 30));
      expect(frameDocument.querySelector("link")).toBe(clone);
      meta.remove();
    } finally {
      source.remove();
    }
  });

  it("reports stylesheet errors instead of leaving a spinner indefinitely", async () => {
    const source = document.createElement("link");
    source.rel = "stylesheet";
    source.href = "/missing-preview-theme.css";
    document.head.appendChild(source);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      render(<Preview height={200}>Preview content</Preview>);
      const frameDocument = loadTestFrame(screen.getByTitle<HTMLIFrameElement>("Desktop component preview"));
      await waitFor(() => expect(frameDocument.body.textContent).toContain("Preview content"));
      fireEvent(frameDocument.querySelector("link")!, new Event("error"));
      expect(await screen.findByRole("alert")).toHaveTextContent("Unable to load preview.");
      expect(error).toHaveBeenCalledWith("Unable to load component preview.", expect.any(Error));
    } finally {
      source.remove();
      error.mockRestore();
    }
  });

  it("server-renders lazy loading UI and MDX text without mounting the example or iframe", () => {
    const Example = vi.fn(() => <button>Expensive example</button>);
    const markup = renderToString(
      <PreviewProvider loading="lazy">
        <h2>Server-rendered documentation</h2>
        <p>Text remains available without JavaScript.</p>
        <Preview><Example /></Preview>
      </PreviewProvider>,
    );
    const container = document.createElement("div");
    container.innerHTML = markup;

    expect(container).toHaveTextContent("Server-rendered documentation");
    expect(container).toHaveTextContent("Text remains available without JavaScript.");
    expect(container.querySelector("iframe")).toBeNull();
    expect(container.querySelector("[data-preview-placeholder]")).toBeNull();
    expect(container.querySelector("[role='progressbar']")).toHaveAttribute("aria-label", "Loading preview");
    expect(container.querySelector("[role='tabpanel']")).toHaveAttribute("aria-busy", "true");
    expect(Example).not.toHaveBeenCalled();
  });

  it("lets a preview override the provider's loading default", () => {
    const markup = renderToString(
      <PreviewProvider loading="lazy">
        <Preview loading="eager">Immediate example</Preview>
      </PreviewProvider>,
    );
    expect(markup).toContain("<iframe");
    expect(markup).toContain("Immediate example");
  });

  it("waits for visibility, page load and an idle task, and cancels pending work", () => {
    let notifyIntersection: (entries: { isIntersecting: boolean }[]) => void = () => {};
    let idleCallback: IdleRequestCallback | undefined;
    const disconnect = vi.fn();
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: typeof notifyIntersection) {
        notifyIntersection = callback;
      }
      observe() {}
      disconnect = disconnect;
    });
    const requestIdle = vi.fn((callback: IdleRequestCallback) => {
      idleCallback = callback;
      return 1;
    });
    const cancelIdle = vi.fn();
    vi.stubGlobal("requestIdleCallback", requestIdle);
    vi.stubGlobal("cancelIdleCallback", cancelIdle);
    const readyState = vi.spyOn(document, "readyState", "get").mockReturnValue("loading");
    const { container, unmount } = render(<Preview loading="lazy">Deferred</Preview>);

    act(() => notifyIntersection([{ isIntersecting: true }]));
    expect(requestIdle).not.toHaveBeenCalled();
    expect(container.querySelector("iframe")).toBeNull();

    readyState.mockReturnValue("complete");
    fireEvent.load(window);
    expect(requestIdle).toHaveBeenCalledOnce();
    expect(container.querySelector("iframe")).toBeNull();

    act(() => notifyIntersection([{ isIntersecting: false }]));
    expect(cancelIdle).toHaveBeenCalledWith(1);
    act(() => notifyIntersection([{ isIntersecting: true }]));
    act(() => idleCallback?.({ didTimeout: false, timeRemaining: () => 50 }));
    expect(container.querySelector("iframe")).not.toBeNull();
    expect(disconnect).toHaveBeenCalled();
    unmount();
    readyState.mockRestore();
  });

  it("cancels a queued lazy mount on unmount", () => {
    vi.spyOn(document, "readyState", "get").mockReturnValue("complete");
    vi.stubGlobal("IntersectionObserver", undefined);
    vi.stubGlobal("requestIdleCallback", vi.fn(() => 7));
    const cancelIdle = vi.fn();
    vi.stubGlobal("cancelIdleCallback", cancelIdle);
    const { unmount } = render(<Preview loading="lazy">Deferred</Preview>);
    unmount();
    expect(cancelIdle).toHaveBeenCalledWith(7);
  });

  it("server-renders an inert content placeholder instead of a device-height frame", () => {
    const markup = renderToString(<Preview>Server content</Preview>);
    const container = document.createElement("div");
    container.innerHTML = markup;

    const placeholder = container.querySelector("[data-preview-placeholder]");
    const viewport = container.querySelector<HTMLElement>(".puzzle-preview__viewport");

    expect(placeholder).toHaveTextContent("Server content");
    expect(placeholder).toHaveAttribute("aria-hidden", "true");
    expect(placeholder).toHaveAttribute("inert");
    expect(viewport?.style.height).toBe("");
    expect(container.querySelector("iframe")?.style.visibility).toBe("hidden");
  });

  it("does not render a placeholder when the frame height is known", () => {
    for (const element of [
      <Preview fit="device">Content</Preview>,
      <Preview height={200}>Content</Preview>,
    ]) {
      const container = document.createElement("div");
      container.innerHTML = renderToString(element);
      expect(container.querySelector("[data-preview-placeholder]")).toBeNull();
    }
  });

  it("uses unique tab and panel IDs across instances", () => {
    render(
      <>
        <Preview code="<Button>First</Button>">First preview</Preview>
        <Preview code="<Button>Second</Button>">Second preview</Preview>
      </>,
    );

    const tabs = screen.getAllByRole("tab", { name: "Preview" });
    const panels = screen.getAllByRole("tabpanel");

    expect(tabs).toHaveLength(2);
    expect(panels).toHaveLength(2);
    expect(new Set(tabs.map((tab) => tab.id)).size).toBe(2);
    expect(new Set(panels.map((panel) => panel.id)).size).toBe(2);

    tabs.forEach((tab) => {
      const panel = document.getElementById(
        tab.getAttribute("aria-controls") ?? "",
      );

      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    });
  });

  it("preserves preview children when switching to code and back", async () => {
    const user = userEvent.setup();
    const frameDocument = document.implementation.createHTMLDocument();
    const frameRoot = frameDocument.createElement("div");

    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );

    render(
      <Preview defaultDevice="mobile" code="<Button>Save</Button>">
        <button type="button">Preview action</button>
      </Preview>,
    );

    const frame = screen.getByTitle("Mobile component preview");
    const rootId = frame
      .getAttribute("srcdoc")
      ?.match(/<div id="([^"]+)"/)?.[1];

    expect(rootId).toBeDefined();
    frameRoot.id = rootId!;
    frameDocument.body.appendChild(frameRoot);

    Object.defineProperty(frame, "contentDocument", {
      configurable: true,
      value: frameDocument,
    });
    fireEvent.load(frame);

    await waitFor(() => {
      expect(frameRoot.textContent).toContain("Preview action");
    });

    await user.click(screen.getByRole("tab", { name: "Code" }));
    await user.click(screen.getByRole("tab", { name: "Preview" }));

    expect(screen.getByTitle("Mobile component preview")).toBe(frame);
    expect(frameRoot.textContent).toContain("Preview action");
  });

  describe("keyboard navigation", () => {
    it("keeps only the selected tab in the tab order", () => {
      render(<Preview code="<Button />">Demo</Preview>);

      expect(screen.getByRole("tab", { name: "Preview" })).toHaveAttribute(
        "tabindex",
        "0",
      );
      expect(screen.getByRole("tab", { name: "Code" })).toHaveAttribute(
        "tabindex",
        "-1",
      );
    });

    it("moves focus and selection with the arrow keys", async () => {
      const user = userEvent.setup();

      render(<Preview code="<Button />">Demo</Preview>);

      await user.tab();
      expect(screen.getByRole("tab", { name: "Preview" })).toHaveFocus();

      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "Code" })).toHaveFocus();
      expect(screen.getByRole("tab", { name: "Code" })).toHaveAttribute(
        "aria-selected",
        "true",
      );

      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "Preview" })).toHaveFocus();
    });

    it("supports Home and End", async () => {
      const user = userEvent.setup();

      render(<Preview code="<Button />">Demo</Preview>);

      await user.tab();
      await user.keyboard("{End}");
      expect(screen.getByRole("tab", { name: "Code" })).toHaveFocus();

      await user.keyboard("{Home}");
      expect(screen.getByRole("tab", { name: "Preview" })).toHaveFocus();
    });

    it("mirrors the arrow keys in right-to-left contexts", async () => {
      const user = userEvent.setup();

      render(
        <div dir="rtl">
          <Preview code="<Button />">Demo</Preview>
        </div>,
      );

      await user.tab();
      await user.keyboard("{ArrowLeft}");

      expect(screen.getByRole("tab", { name: "Code" })).toHaveFocus();
    });
  });

  describe("device keyboard navigation", () => {
    const getDevice = (name: string) => screen.getByRole("button", { name });

    it("keeps only the selected device in the tab order", () => {
      render(<Preview defaultDevice="tablet">Demo</Preview>);

      expect(getDevice("Mobile")).toHaveAttribute("tabindex", "-1");
      expect(getDevice("Tablet")).toHaveAttribute("tabindex", "0");
      expect(getDevice("Desktop")).toHaveAttribute("tabindex", "-1");
    });

    it("moves focus with the arrow keys without changing the selection", async () => {
      const user = userEvent.setup();

      render(<Preview defaultDevice="mobile">Demo</Preview>);

      getDevice("Mobile").focus();
      await user.keyboard("{ArrowRight}");

      expect(getDevice("Tablet")).toHaveFocus();
      expect(getDevice("Mobile")).toHaveAttribute("aria-pressed", "true");
      expect(getDevice("Tablet")).toHaveAttribute("aria-pressed", "false");

      await user.keyboard("{End}");
      expect(getDevice("Desktop")).toHaveFocus();

      await user.keyboard("{ArrowRight}");
      expect(getDevice("Mobile")).toHaveFocus();
    });

    it("selects the focused device with Enter or Space", async () => {
      const user = userEvent.setup();

      render(<Preview defaultDevice="mobile">Demo</Preview>);

      getDevice("Mobile").focus();
      await user.keyboard("{ArrowRight}{Enter}");
      expect(getDevice("Tablet")).toHaveAttribute("aria-pressed", "true");

      await user.keyboard("{ArrowRight} ");
      expect(getDevice("Desktop")).toHaveAttribute("aria-pressed", "true");
      expect(getDevice("Tablet")).toHaveAttribute("aria-pressed", "false");
    });

    it("mirrors the arrow keys in right-to-left contexts", async () => {
      const user = userEvent.setup();

      render(
        <div dir="rtl">
          <Preview defaultDevice="mobile">Demo</Preview>
        </div>,
      );

      getDevice("Mobile").focus();
      await user.keyboard("{ArrowLeft}");

      expect(getDevice("Tablet")).toHaveFocus();
    });
  });
});
