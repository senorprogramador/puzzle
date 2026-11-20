import { act, lazy, StrictMode, Suspense } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  DeferredBoundary,
  type DeferredComponentLoader,
  type DeferredComponentModule,
} from "./deferred";
import { FoldProvider } from "./fold";
import { SsrBoundary } from "./ssr";
import { StaticBoundary } from "./static";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const installObserver = () => {
  const observers: Array<{
    options: IntersectionObserverInit;
    emit: (target: Element, isIntersecting: boolean) => void;
  }> = [];

  class IntersectionObserverMock {
    readonly options: IntersectionObserverInit;

    constructor(
      private readonly callback: IntersectionObserverCallback,
      options: IntersectionObserverInit,
    ) {
      this.options = options;
      observers.push(this);
    }

    observe() {}

    unobserve() {}

    disconnect() {}

    emit(target: Element, isIntersecting: boolean) {
      const rect = target.getBoundingClientRect();
      this.callback(
        [
          {
            target,
            isIntersecting,
            intersectionRatio: Number(isIntersecting),
            time: 1,
            rootBounds: null,
            boundingClientRect: rect,
            intersectionRect: rect,
          } as IntersectionObserverEntry,
        ],
        this as unknown as IntersectionObserver,
      );
    }
  }

  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  return observers;
};

describe("rendering modes", () => {
  it("preserves SSR children and emits resource preload hints", () => {
    const markup = renderToString(
      <SsrBoundary
        resources={[
          { type: "image", url: "/hero.webp", priority: "critical" },
        ]}
      >
        <article>Server-rendered content</article>
      </SsrBoundary>,
    );

    expect(markup).toContain('href="/hero.webp"');
    expect(markup).toContain('fetchPriority="high"');
    expect(markup).toContain("<article>Server-rendered content</article>");
  });

  it("hydrates SSR-preserved content without changing its markup", async () => {
    const container = document.createElement("div");
    const element = (
      <SsrBoundary>
        <article>Hydrated content</article>
      </SsrBoundary>
    );
    container.innerHTML = renderToString(element);
    const initialMarkup = container.innerHTML;
    const root = hydrateRoot(container, element);

    await act(async () => {});

    expect(container.innerHTML).toBe(initialMarkup);
    await act(async () => root.unmount());
  });

  it("renders static output without adding wrappers or scripts", () => {
    const markup = renderToString(
      <StaticBoundary interactiveChildren="none">
        <article>Static content</article>
      </StaticBoundary>,
    );

    expect(markup).toBe("<article>Static content</article>");
    expect(markup).not.toContain("<script");
  });

  it("renders only the fallback on the server and does not call the loader", () => {
    const load = vi.fn(async () => ({
      default: () => <article>Deferred content</article>,
    }));
    const markup = renderToString(
      <DeferredBoundary
        strategy="manual"
        active
        load={load}
        componentProps={{}}
        fallback={<span>Deferred fallback</span>}
      />,
    );

    expect(markup).toContain("Deferred fallback");
    expect(markup).not.toContain("Deferred content");
    expect(load).not.toHaveBeenCalled();
  });

  it.each([
    ["conservative", "200px 0px", false],
    ["balanced", "400px 0px", true],
    ["aggressive", "800px 0px", true],
    ["custom", "200px 0px", false],
  ] as const)(
    "uses the %s profile's deferred loading behavior",
    async (profile, rootMargin, loadsOnProximity) => {
      const observers = installObserver();
      const load = vi.fn(async () => ({
        default: () => <article>Profile-loaded component</article>,
      }));
      const { container } = render(
        <FoldProvider config={{ profile }}>
          <DeferredBoundary
            load={load}
            componentProps={{}}
            fallback={<span>Deferred profile fallback</span>}
          />
        </FoldProvider>,
      );
      const boundary = container.firstElementChild as Element;
      const proximityObserver = observers.find(
        (observer) => observer.options.rootMargin === rootMargin,
      );

      expect(proximityObserver).toBeDefined();
      await act(async () => {
        proximityObserver?.emit(boundary, true);
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(load).toHaveBeenCalledTimes(loadsOnProximity ? 1 : 0);
    },
  );

  it("hydrates deferred fallback markup without loading before activation", async () => {
    const load = vi.fn(async () => ({
      default: () => <article>Deferred content</article>,
    }));
    const element = (
      <DeferredBoundary
        strategy="manual"
        active={false}
        load={load}
        componentProps={{}}
        fallback={<span>Deferred fallback</span>}
      />
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(element);
    const initialMarkup = container.innerHTML;
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, element, { onRecoverableError });
    });

    expect(container.innerHTML).toBe(initialMarkup);
    expect(load).not.toHaveBeenCalled();
    expect(onRecoverableError).not.toHaveBeenCalled();
    await act(async () => root?.unmount());
  });

  it("loads only after activation, keeps the fallback dimension, and reuses the loaded component", async () => {
    const load = vi.fn(async () => ({
      default: ({ label }: { label: string }) => <article>{label}</article>,
    }));
    const props = {
      strategy: "manual" as const,
      load,
      componentProps: { label: "Loaded once" },
      aspectRatio: "16 / 9",
      minBlockSize: "12rem",
      fallback: <span>Not yet loaded</span>,
    };
    const { container, rerender } = render(
      <DeferredBoundary {...props} active={false} />,
    );
    const boundary = container.firstElementChild as HTMLElement;

    expect(load).not.toHaveBeenCalled();
    expect(boundary.style.aspectRatio).toBe("16 / 9");

    rerender(<DeferredBoundary {...props} active />);
    expect(await screen.findByText("Loaded once")).toBeTruthy();
    expect(boundary.style.aspectRatio).toBe("16 / 9");
    expect(boundary.style.minBlockSize).toBe("12rem");
    expect(load).toHaveBeenCalledOnce();

    rerender(<DeferredBoundary {...props} active={false} />);
    rerender(<DeferredBoundary {...props} active />);

    expect(await screen.findByText("Loaded once")).toBeTruthy();
    expect(load).toHaveBeenCalledOnce();
  });

  it("reports deferred scheduling, activation, loading, mounting, and failure events", async () => {
    const events: Array<{ type: string; source?: string }> = [];
    const load = vi
      .fn()
      .mockRejectedValueOnce(new Error("Chunk unavailable"))
      .mockResolvedValue({
        default: () => <article>Diagnostic component mounted</article>,
      });
    const user = userEvent.setup();

    render(
      <FoldProvider onDiagnosticEvent={(event) => events.push(event)}>
        <DeferredBoundary
          id="diagnostic-deferred"
          strategy="manual"
          active
          load={load}
          componentProps={{}}
        />
      </FoldProvider>,
    );

    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "boundary-registered" }),
        expect.objectContaining({ type: "component-activated" }),
        expect.objectContaining({
          type: "resource-scheduled",
          source: "deferred-loader",
          resourceId: "diagnostic-deferred",
        }),
        expect.objectContaining({
          type: "loading-failed",
          source: "deferred-loader",
          resourceId: "diagnostic-deferred",
        }),
      ]),
    );

    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByText("Diagnostic component mounted")).toBeTruthy();
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "resource-loaded",
          source: "deferred-loader",
          resourceId: "diagnostic-deferred",
          state: "loaded",
        }),
        expect.objectContaining({
          type: "component-mounted",
          source: "deferred-boundary",
        }),
      ]),
    );
  });

  it("does not double-load when React replays effects in StrictMode", async () => {
    const load = vi.fn(async () => ({
      default: () => <article>Strict mode content</article>,
    }));

    render(
      <StrictMode>
        <DeferredBoundary
          strategy="manual"
          active
          load={load}
          componentProps={{}}
        />
      </StrictMode>,
    );

    expect(await screen.findByText("Strict mode content")).toBeTruthy();
    expect(load).toHaveBeenCalledOnce();
  });

  it("cancels a pending loader when its boundary unmounts", async () => {
    type EmptyProps = Readonly<Record<string, never>>;
    let signal: AbortSignal | undefined;
    let resolveLoad!: (module: DeferredComponentModule<EmptyProps>) => void;
    const load: DeferredComponentLoader<EmptyProps> = (abortSignal) => {
      signal = abortSignal;
      return new Promise<DeferredComponentModule<EmptyProps>>((resolve) => {
        resolveLoad = resolve;
      });
    };
    const loadSpy = vi.fn(load);
    const { unmount } = render(
      <DeferredBoundary
        strategy="manual"
        active
        load={loadSpy}
        componentProps={{}}
      />,
    );

    await waitFor(() => expect(loadSpy).toHaveBeenCalledOnce());
    unmount();
    await act(async () => {
      await Promise.resolve();
    });

    expect(signal?.aborted).toBe(true);
    resolveLoad({ default: () => <span>Late result</span> });
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByText("Late result")).toBeNull();
  });

  it("shows a recoverable error and retries failed dynamic imports", async () => {
    const load = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network failure"))
      .mockResolvedValue({
        default: () => <article>Recovered content</article>,
      });
    const user = userEvent.setup();

    render(
      <DeferredBoundary
        strategy="manual"
        active
        load={load}
        componentProps={{}}
      />,
    );

    expect(await screen.findByRole("alert")).toBeTruthy();
    const retryButton = screen.getByRole("button", { name: "Retry" });
    await user.tab();
    expect(retryButton).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(await screen.findByText("Recovered content")).toBeTruthy();
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("allows nested Suspense fallbacks to handle nested loading", async () => {
    let complete!: () => void;
    const suspended = new Promise<void>((resolve) => {
      complete = resolve;
    });
    const LazyContent = lazy(async () => {
      await suspended;
      return { default: () => <span>Nested content</span> };
    });
    const load = async () => ({
      default: () => (
        <Suspense fallback={<span>Nested fallback</span>}>
          <LazyContent />
        </Suspense>
      ),
    });

    render(
      <DeferredBoundary
        strategy="manual"
        active
        load={load}
        componentProps={{}}
        suspenseFallback={<span>Boundary fallback</span>}
      />,
    );

    expect(await screen.findByText("Nested fallback")).toBeTruthy();
    await act(async () => {
      complete();
      await suspended;
    });

    expect(await screen.findByText("Nested content")).toBeTruthy();
  });
});
