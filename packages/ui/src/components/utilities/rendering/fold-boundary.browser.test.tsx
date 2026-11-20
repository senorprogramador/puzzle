import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { FoldBoundary, FoldProvider } from "./fold";

let fixture: HTMLDivElement | undefined;

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

afterEach(() => {
  cleanup();
  fixture?.remove();
  fixture = undefined;
});

describe("FoldBoundary content visibility", () => {
  it("keeps offscreen content size stable when it becomes visible", async () => {
    await page.viewport(390, 800);

    const { container } = render(
      <main>
        <div aria-hidden="true" style={{ height: 1200 }} />
        <FoldBoundary
          id="content-visibility-stability"
          contentVisibility="auto"
          intrinsicSize="auto 700px"
        >
          <div style={{ height: 700 }}>Reserved content</div>
        </FoldBoundary>
        <div data-layout-anchor style={{ height: 1 }} />
      </main>,
    );
    await nextFrame();

    const boundary = container.querySelector<HTMLDivElement>(
      "#content-visibility-stability",
    )!;
    const anchor = container.querySelector<HTMLElement>("[data-layout-anchor]")!;
    const initialBoundaryHeight = boundary.getBoundingClientRect().height;
    const initialAnchorTop = anchor.offsetTop;

    expect(getComputedStyle(boundary).contentVisibility).toBe("auto");
    expect(getComputedStyle(boundary).containIntrinsicSize).toContain("700px");
    expect(initialBoundaryHeight).toBeCloseTo(700, 0);

    let cls = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Array<
        PerformanceEntry & { value: number; hadRecentInput: boolean }
      >) {
        if (!entry.hadRecentInput) cls += entry.value;
      }
    });
    observer.observe({ type: "layout-shift", buffered: false });

    window.scrollTo(0, 1000);
    await nextFrame();
    await nextFrame();

    const layoutShifts = observer.takeRecords() as Array<
      PerformanceEntry & { value: number; hadRecentInput: boolean }
    >;
    cls += layoutShifts.reduce(
      (total, entry) => total + (entry.hadRecentInput ? 0 : entry.value),
      0,
    );
    observer.disconnect();

    expect(boundary.getBoundingClientRect().height).toBeCloseTo(700, 0);
    expect(anchor.offsetTop).toBe(initialAnchorTop);
    expect(cls).toBeLessThanOrEqual(0.01);
  });

  it("keeps nested focused content keyboard-accessible in a custom scroll root", async () => {
    await page.viewport(390, 700);

    fixture = document.createElement("div");
    const before = document.createElement("button");
    before.textContent = "Before deferred content";
    const scrollRoot = document.createElement("div");
    scrollRoot.style.height = "180px";
    scrollRoot.style.overflowY = "auto";
    scrollRoot.style.width = "100%";
    const after = document.createElement("button");
    after.textContent = "After deferred content";
    fixture.append(before, scrollRoot, after);
    document.body.append(fixture);

    render(
      <FoldProvider visibility={{ root: scrollRoot }}>
        <div aria-hidden="true" style={{ height: 320 }} />
        <FoldBoundary
          id="browser-outer-boundary"
          strategy="visible"
          mode="deferred"
          once={false}
          fallback={<p role="status">Outer content is waiting</p>}
        >
          <div aria-hidden="true" style={{ height: 260 }} />
          <FoldBoundary
            id="browser-inner-boundary"
            strategy="visible"
            mode="deferred"
            once={false}
            fallback={<p role="status">Inner details are waiting</p>}
          >
            <button type="button">Open deferred details</button>
          </FoldBoundary>
          <div aria-hidden="true" style={{ height: 500 }} />
        </FoldBoundary>
      </FoldProvider>,
      { container: scrollRoot },
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Outer content is waiting",
    );
    expect(
      screen.queryByRole("button", { name: "Open deferred details" }),
    ).toBeNull();

    scrollRoot.scrollTop = 280;
    await screen.findByText("Inner details are waiting");

    scrollRoot.scrollTop = 500;
    const details = await screen.findByRole("button", {
      name: "Open deferred details",
    });
    await page.viewport(320, 600);
    await nextFrame();
    const user = userEvent.setup();
    before.focus();
    await user.tab();
    expect(details).toHaveFocus();

    scrollRoot.scrollTop = 0;
    await nextFrame();
    await nextFrame();
    expect(details).toBeInTheDocument();
    expect(details).toHaveFocus();

    await user.tab();
    expect(after).toHaveFocus();
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Outer content is waiting",
      );
    });
    expect(
      screen.queryByRole("button", { name: "Open deferred details" }),
    ).toBeNull();
  });
});
