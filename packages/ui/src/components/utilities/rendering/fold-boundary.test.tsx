import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ResourceDescriptor } from "@puzzle-ui/core/rendering";
import { visibilityRegistry } from "@puzzle-ui/hooks/rendering/visibility/registry";
import { FoldBoundary, FoldProvider } from "./fold";

type ObserverRecord = {
  callback: IntersectionObserverCallback;
  options: IntersectionObserverInit;
  targets: Set<Element>;
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  emit: (target: Element, isIntersecting: boolean) => void;
};

let observers: ObserverRecord[] = [];

const installObserver = () => {
  observers = [];

  class IntersectionObserverMock {
    readonly callback: IntersectionObserverCallback;
    readonly options: IntersectionObserverInit;
    readonly targets = new Set<Element>();
    readonly observe = vi.fn((target: Element) => this.targets.add(target));
    readonly unobserve = vi.fn((target: Element) => this.targets.delete(target));
    readonly disconnect = vi.fn(() => this.targets.clear());

    constructor(
      callback: IntersectionObserverCallback,
      options: IntersectionObserverInit = {},
    ) {
      this.callback = callback;
      this.options = options;
      observers.push(this as unknown as ObserverRecord);
    }

    emit(target: Element, isIntersecting: boolean) {
      const rect = target.getBoundingClientRect();
      const entry = {
        target,
        isIntersecting,
        intersectionRatio: Number(isIntersecting),
        time: 1,
        rootBounds: null,
        boundingClientRect: rect,
        intersectionRect: rect,
      } as IntersectionObserverEntry;
      this.callback([entry], this as unknown as IntersectionObserver);
    }
  }

  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
};

afterEach(() => {
  cleanup();
  visibilityRegistry.disposeAll();
  vi.unstubAllGlobals();
});

describe("FoldBoundary", () => {
  it("preserves default SSR output and hydrates without a markup mismatch", async () => {
    const element = (
      <FoldBoundary id="fold-ssr">
        <article>Server-rendered fold</article>
      </FoldBoundary>
    );
    const markup = renderToString(element);
    const container = document.createElement("div");
    container.innerHTML = markup;
    const originalMarkup = container.innerHTML;
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, element, { onRecoverableError });
    });

    expect(container.innerHTML).toBe(originalMarkup);
    expect(onRecoverableError).not.toHaveBeenCalled();
    await act(async () => root?.unmount());
  });

  it("keeps aggressive-profile unknown and critical content in server output", async () => {
    const element = (
      <FoldProvider config={{ profile: "aggressive" }}>
        <FoldBoundary id="profile-unknown">
          <article data-testid="profile-unknown-content">
            Unknown SSR content
          </article>
        </FoldBoundary>
        <FoldBoundary
          id="profile-hero"
          componentHints={{ role: "hero" }}
          fallback={<span>Hero fallback</span>}
        >
          <article data-testid="profile-hero-content">Critical hero</article>
        </FoldBoundary>
      </FoldProvider>
    );
    const markup = renderToString(element);
    const container = document.createElement("div");
    container.innerHTML = markup;
    const originalMarkup = container.innerHTML;
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;

    expect(markup).toContain('data-testid="profile-unknown-content"');
    expect(markup).toContain('data-testid="profile-hero-content"');
    expect(markup).not.toContain("Hero fallback");

    await act(async () => {
      root = hydrateRoot(container, element, { onRecoverableError });
    });

    expect(container.innerHTML).toBe(originalMarkup);
    expect(onRecoverableError).not.toHaveBeenCalled();
    await act(async () => root?.unmount());
  });

  it("applies profile content visibility only with a safe size reservation", () => {
    const { container } = render(
      <FoldProvider config={{ profile: "balanced" }}>
        <FoldBoundary
          id="profile-sized-content"
          componentHints={{
            role: "gallery",
            dimensions: { width: 640, height: 320 },
          }}
        >
          <article>Metadata-sized content</article>
        </FoldBoundary>
        <FoldBoundary
          id="profile-unsized-content"
          componentHints={{ role: "gallery" }}
        >
          <article>Unsized content</article>
        </FoldBoundary>
        <FoldBoundary
          id="profile-visible-override"
          componentHints={{
            role: "gallery",
            dimensions: { width: 640, height: 320 },
          }}
          contentVisibility="visible"
        >
          <article>Explicitly visible content</article>
        </FoldBoundary>
      </FoldProvider>,
    );

    const sized = container.querySelector<HTMLDivElement>(
      "#profile-sized-content",
    )!;
    const unsized = container.querySelector<HTMLDivElement>(
      "#profile-unsized-content",
    )!;
    const overridden = container.querySelector<HTMLDivElement>(
      "#profile-visible-override",
    )!;

    expect(sized.style.contentVisibility).toBe("auto");
    expect(sized.style.containIntrinsicSize).toBe("auto 320px");
    expect(unsized.style.contentVisibility).toBe("");
    expect(overridden.style.contentVisibility).toBe("visible");
  });

  it("inherits provider defaults and activates only after the shared observer reports visibility", () => {
    installObserver();
    const { container } = render(
      <FoldProvider
        defaultStrategy="visible"
        defaultMode="deferred"
        visibility={{ rootMargin: "120px 0px" }}
      >
        <FoldBoundary
          id="fold-visible"
          className="fold-content"
          aria-label="Deferred content"
          aspectRatio="4 / 3"
          intrinsicSize="20rem"
          fallback={<span>Waiting for visibility</span>}
        >
          <article>Visible content</article>
        </FoldBoundary>
      </FoldProvider>,
    );
    const boundary = container.firstElementChild as HTMLDivElement;

    expect(screen.getByText("Waiting for visibility")).toBeTruthy();
    expect(boundary).toHaveAttribute("aria-busy", "true");
    expect(boundary).toHaveAttribute("aria-label", "Deferred content");
    expect(boundary.className).toBe("fold-content");
    expect(boundary.style.aspectRatio).toBe("4 / 3");
    expect(boundary.style.containIntrinsicSize).toBe("20rem");
    expect(observers).toHaveLength(2);
    expect(
      observers.find((observer) => observer.options.rootMargin === "120px 0px"),
    ).toBeTruthy();

    act(() => observers[0]?.emit(boundary, true));

    expect(screen.getByText("Visible content")).toBeTruthy();
    expect(boundary).not.toHaveAttribute("aria-busy", "true");
  });

  it("reuses one observer for boundaries with matching configuration", () => {
    installObserver();
    const { container } = render(
      <FoldProvider defaultStrategy="visible" defaultMode="deferred">
        <FoldBoundary id="fold-shared-a">
          <span>First boundary</span>
        </FoldBoundary>
        <FoldBoundary id="fold-shared-b">
          <span>Second boundary</span>
        </FoldBoundary>
      </FoldProvider>,
    );

    expect(observers).toHaveLength(2);
    expect(observers.every((observer) => observer.targets.size === 2)).toBe(true);
    expect(container.querySelectorAll("[aria-busy=true]")).toHaveLength(2);
  });

  it("supports a custom observer root, margin, and threshold", () => {
    installObserver();
    const root = document.createElement("div");
    render(
      <FoldBoundary
        id="fold-custom-root"
        strategy="visible"
        mode="deferred"
        root={root}
        rootMargin="75px"
        threshold={0.5}
      >
        <span>Custom root content</span>
      </FoldBoundary>,
    );

    expect(observers).toHaveLength(2);
    expect(observers[0]?.options).toMatchObject({
      root,
      rootMargin: "0px",
      threshold: [0.5],
    });
    expect(observers[1]?.options).toMatchObject({
      root,
      rootMargin: "75px",
    });
  });

  it("applies boundary props over component hints and explicit overrides last", () => {
    installObserver();
    const { rerender } = render(
      <FoldProvider
        configuration={{
          profile: "aggressive",
          configuration: { priority: "normal" },
        }}
      >
        <FoldBoundary
          id="fold-boundary-props"
          strategy="visible"
          mode="deferred"
          priority="high"
          componentHints={{ priority: "normal" }}
          fallback={<span>Boundary fallback</span>}
        >
          <span>Boundary children</span>
        </FoldBoundary>
      </FoldProvider>,
    );
    expect(screen.getByText("Boundary fallback")).toBeTruthy();
    expect(
      observers.find((observer) => observer.options.rootMargin === "800px 0px"),
    ).toBeTruthy();

    rerender(
      <FoldProvider
        configuration={{
          profile: "aggressive",
          configuration: { priority: "normal" },
        }}
      >
        <FoldBoundary
          id="fold-explicit-override"
          strategy="visible"
          mode="deferred"
          override={{
            strategy: "eager",
            renderMode: "ssr",
            priority: "critical",
          }}
          fallback={<span>Unused fallback</span>}
        >
          <span>Immediate children</span>
        </FoldBoundary>
      </FoldProvider>,
    );

    expect(screen.getByText("Immediate children")).toBeTruthy();
    expect(screen.queryByText("Unused fallback")).toBeNull();
    expect(observers).toHaveLength(2);
  });

  it("renders immediately when disabled or static and creates no observer", () => {
    installObserver();
    const { rerender } = render(
      <FoldProvider defaultStrategy="visible" defaultMode="deferred">
        <FoldBoundary id="fold-disabled" disabled>
          <span>Disabled content</span>
        </FoldBoundary>
      </FoldProvider>,
    );

    expect(screen.getByText("Disabled content")).toBeTruthy();
    expect(observers).toHaveLength(0);

    rerender(
      <FoldBoundary id="fold-static" strategy="visible" mode="static">
        <span>Static content</span>
      </FoldBoundary>,
    );

    expect(screen.getByText("Static content")).toBeTruthy();
    expect(observers).toHaveLength(0);
  });

  it("applies content visibility independently and accepts remembered intrinsic sizes", () => {
    const { container, rerender } = render(
      <FoldBoundary
        id="fold-content-visibility"
        contentVisibility="auto"
        intrinsicSize="auto 32rem"
      >
        <article>Content visibility content</article>
      </FoldBoundary>,
    );
    const boundary = container.firstElementChild as HTMLDivElement;

    expect(boundary.style.contentVisibility).toBe("auto");
    expect(boundary.style.containIntrinsicSize).toBe("auto 32rem");

    rerender(
      <FoldBoundary
        id="fold-content-visibility"
        contentVisibility="visible"
        intrinsicSize="auto 32rem"
      >
        <article>Content visibility content</article>
      </FoldBoundary>,
    );

    expect(boundary.style.contentVisibility).toBe("visible");
    expect(boundary.style.containIntrinsicSize).toBe("auto 32rem");
  });

  it("uses automatic hints without removing SSR-preserved children", () => {
    installObserver();
    const { container } = render(
      <FoldBoundary
        id="fold-auto-gallery"
        componentHints={{ role: "gallery" }}
        prediction={{ positionHint: "below-fold" }}
        fallback={<span>Deferred fallback</span>}
      >
        <article>Server-rendered gallery</article>
      </FoldBoundary>,
    );
    const boundary = container.firstElementChild as HTMLDivElement;

    expect(screen.getByText("Server-rendered gallery")).toBeTruthy();
    expect(screen.queryByText("Deferred fallback")).toBeNull();
    expect(observers).toHaveLength(2);

    act(() => observers[0]?.emit(boundary, true));

    expect(screen.getByText("Server-rendered gallery")).toBeTruthy();
    expect(screen.queryByText("Deferred fallback")).toBeNull();
  });

  it("rejects static mode for interactive metadata and preserves content", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(
      <FoldBoundary
        id="fold-static-map"
        mode="static"
        componentHints={{ role: "interactive-map" }}
        fallback={<span>Unused fallback</span>}
      >
        <article>Interactive map content</article>
      </FoldBoundary>,
    );

    expect(screen.getByText("Interactive map content")).toBeTruthy();
    expect(screen.queryByText("Unused fallback")).toBeNull();
    expect(
      container.firstElementChild?.getAttribute("aria-busy"),
    ).toBeNull();
    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining("unsupported by the active adapter or component metadata"),
    );
  });

  it("warns and renders eagerly when adapter capabilities reject explicit settings", () => {
    installObserver();
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const capabilities = {
      supportsServerRendering: true,
      supportsDeferredRendering: false,
      supportsStaticRendering: true,
      supportsVisibility: false,
      supportsIdleScheduling: false,
    };

    render(
      <FoldProvider capabilities={capabilities}>
        <FoldBoundary
          id="fold-unsupported"
          strategy="visible"
          mode="deferred"
          fallback={<span>Unsupported fallback</span>}
        >
          <span>Safe eager content</span>
        </FoldBoundary>
      </FoldProvider>,
    );

    expect(screen.getByText("Safe eager content")).toBeTruthy();
    expect(screen.queryByText("Unsupported fallback")).toBeNull();
    expect(observers).toHaveLength(0);
    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining("unsupported by the active adapter"),
    );
  });

  it("schedules resources with the resolved priority and cancels pending work on unmount", () => {
    installObserver();
    let scheduledTask: { load: () => void } | undefined;
    const scheduler = {
      schedule: vi.fn((task: { resource: ResourceDescriptor; load: () => void }) => {
        scheduledTask = task;
        return "fold-resource";
      }),
      cancel: vi.fn(),
    };
    const resource: ResourceDescriptor = {
      type: "image",
      url: "/fold.webp",
      priority: "low",
    };
    const { container, unmount } = render(
      <FoldProvider
        defaultStrategy="visible"
        defaultMode="deferred"
        scheduler={scheduler}
      >
        <FoldBoundary
          id="fold-scheduled"
          priority="high"
          scheduledResource={resource}
          fallback={<span>Queued resource</span>}
        >
          <span>Scheduled content</span>
        </FoldBoundary>
      </FoldProvider>,
    );
    const boundary = container.firstElementChild as HTMLDivElement;

    act(() => observers[0]?.emit(boundary, true));

    expect(scheduler.schedule).toHaveBeenCalledOnce();
    expect(scheduler.schedule.mock.calls[0]?.[0].resource.priority).toBe("high");
    expect(screen.getByText("Queued resource")).toBeTruthy();

    unmount();
    expect(scheduler.cancel).toHaveBeenCalledWith("fold-resource");
  });

  it("mounts deferred children when the injected scheduler runs the task", () => {
    installObserver();
    const events: Array<{ type: string; source?: string }> = [];
    let loadTask: (() => void) | undefined;
    const scheduler = {
      schedule: vi.fn((task: { resource: ResourceDescriptor; load: () => void }) => {
        loadTask = task.load;
        return "fold-resource-ready";
      }),
      cancel: vi.fn(),
    };
    const resource: ResourceDescriptor = {
      type: "stylesheet",
      url: "/fold.css",
      priority: "normal",
    };
    const { container, unmount } = render(
      <FoldProvider
        defaultStrategy="visible"
        defaultMode="deferred"
        scheduler={scheduler}
        onDiagnosticEvent={(event) => events.push(event)}
      >
        <FoldBoundary
          id="fold-scheduler-ready"
          scheduledResource={resource}
          fallback={<span>Waiting for scheduler</span>}
        >
          <span>Scheduler-ready content</span>
        </FoldBoundary>
      </FoldProvider>,
    );
    const boundary = container.firstElementChild as HTMLDivElement;

    act(() => observers[0]?.emit(boundary, true));
    expect(screen.getByText("Waiting for scheduler")).toBeTruthy();

    act(() => loadTask?.());
    expect(screen.getByText("Scheduler-ready content")).toBeTruthy();
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "resource-scheduled",
          source: "fold-boundary",
          state: "scheduled",
        }),
        expect.objectContaining({
          type: "component-mounted",
          source: "fold-boundary",
        }),
      ]),
    );
    expect(events).not.toContainEqual(
      expect.objectContaining({
        type: "resource-loaded",
        source: "fold-boundary",
      }),
    );

    unmount();
    expect(scheduler.cancel).not.toHaveBeenCalled();
  });

  it("cancels a scheduled task when a persistent boundary deactivates", () => {
    installObserver();
    const scheduler = {
      schedule: vi.fn(() => "fold-deactivated"),
      cancel: vi.fn(),
    };
    const resource: ResourceDescriptor = {
      type: "font",
      url: "/fold.woff2",
      priority: "normal",
    };
    const { container } = render(
      <FoldProvider
        defaultStrategy="visible"
        defaultMode="deferred"
        scheduler={scheduler}
      >
        <FoldBoundary
          id="fold-deactivated"
          once={false}
          scheduledResource={resource}
          fallback={<span>Inactive fallback</span>}
        >
          <span>Inactive content</span>
        </FoldBoundary>
      </FoldProvider>,
    );
    const boundary = container.firstElementChild as HTMLDivElement;

    act(() => observers[0]?.emit(boundary, true));
    expect(scheduler.schedule).toHaveBeenCalledOnce();
    act(() => {
      for (const observer of observers) observer.emit(boundary, false);
    });

    expect(scheduler.cancel).toHaveBeenCalledWith("fold-deactivated");
    expect(screen.getByText("Inactive fallback")).toBeTruthy();
  });

  it("retains focused deferred content until focus leaves a persistent boundary", () => {
    installObserver();
    const { container } = render(
      <FoldBoundary
        id="fold-focus"
        strategy="visible"
        mode="deferred"
        once={false}
        fallback={<span>Waiting for focus test</span>}
      >
        <button type="button">Focused content</button>
      </FoldBoundary>,
    );
    const boundary = container.firstElementChild as HTMLDivElement;

    act(() => observers[0]?.emit(boundary, true));
    const button = screen.getByRole("button", { name: "Focused content" });
    act(() => button.focus());

    act(() => {
      for (const observer of observers) observer.emit(boundary, false);
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveFocus();

    fireEvent.blur(button, { relatedTarget: document.body });
    expect(screen.getByText("Waiting for focus test")).toBeTruthy();
  });

  it("keeps a focused fallback in place until the user moves focus away", () => {
    installObserver();
    const { container } = render(
      <FoldBoundary
        id="fold-focused-fallback"
        strategy="visible"
        mode="deferred"
        fallback={<button type="button">Fallback action</button>}
      >
        <span>Activated content</span>
      </FoldBoundary>,
    );
    const boundary = container.firstElementChild as HTMLDivElement;
    const fallback = screen.getByRole("button", { name: "Fallback action" });
    act(() => fallback.focus());

    act(() => observers[0]?.emit(boundary, true));
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveFocus();

    fireEvent.blur(fallback, { relatedTarget: document.body });
    expect(screen.getByText("Activated content")).toBeTruthy();
  });
});
