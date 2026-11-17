import { cleanup, waitFor } from "@testing-library/react";
import { act, type CSSProperties, type ReactNode } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppBar } from "./index";
import { PageLayout } from "../page-layout";

const frames: HTMLIFrameElement[] = [];

afterEach(() => {
  cleanup();
  frames.splice(0).forEach((frame) => frame.remove());
  vi.restoreAllMocks();
});

const renderServerFrame = async (content: ReactNode, width = 1200) => {
  const frame = document.createElement("iframe");
  frame.style.width = `${width}px`;
  frame.style.height = "800px";
  frames.push(frame);

  const styles = Array.from(
    document.querySelectorAll('style, link[rel="stylesheet"]'),
    (element) => element.outerHTML,
  ).join("");
  const loaded = new Promise<void>((resolve) => {
    frame.onload = () => resolve();
  });
  frame.srcdoc = `<!doctype html><html><head>${styles}</head><body>${renderToString(content)}</body></html>`;
  document.body.append(frame);
  await loaded;
  return frame.contentDocument!;
};

const navigationItems = [{ label: "Docs", href: "/docs" }];

const example = (actionHeight?: number) => (
  <PageLayout>
    <PageLayout.Header>
      <AppBar
        title="Puzzle"
        navigationItems={navigationItems}
        sticky
        trailingComponents={
          actionHeight === undefined ? undefined : (
            <div style={{ height: actionHeight }}>Actions</div>
          )
        }
      />
    </PageLayout.Header>
    <PageLayout.Main>
      <div
        data-offset-consumer=""
        style={{ paddingTop: "var(--puzzle-sticky-offset, 0px)" }}
      >
        Content
      </div>
    </PageLayout.Main>
  </PageLayout>
);

const expectInitialOffset = (doc: Document, layout: Element) => {
  const appBar = layout.querySelector(".puzzle-app-bar")!;
  const height = appBar.getBoundingClientRect().height;
  const offset = parseFloat(
    doc.defaultView!.getComputedStyle(layout).getPropertyValue("--puzzle-sticky-offset"),
  );
  expect(height).toBeGreaterThan(0);
  expect(offset).toBeCloseTo(height, 4);
  expect(layout.getAttribute("style") ?? "").not.toContain("--puzzle-sticky-offset");
};

describe("AppBar server-rendered sticky offset", () => {
  it.each([390, 800, 1200])(
    "measures natural content at %i pixels before hydration",
    async (width) => {
      const doc = await renderServerFrame(
        <div style={{ "--puzzle-space-4": "23px" } as CSSProperties}>
          {example()}
          {example(96)}
        </div>,
        width,
      );
      const layouts = doc.querySelectorAll("[data-puzzle-page-layout]");

      expectInitialOffset(doc, layouts[0]!);
      expectInitialOffset(doc, layouts[1]!);
      expect(
        doc.defaultView!.getComputedStyle(layouts[0]!).getPropertyValue("--puzzle-sticky-offset"),
      ).not.toBe(
        doc.defaultView!.getComputedStyle(layouts[1]!).getPropertyValue("--puzzle-sticky-offset"),
      );
    },
  );

  it("initializes a standalone bar on the document root", async () => {
    const doc = await renderServerFrame(
      <AppBar title="Standalone" sticky />,
    );

    expectInitialOffset(doc, doc.documentElement);
  });

  it("supports a bar directly inside a page layout", async () => {
    const doc = await renderServerFrame(
      <div data-puzzle-page-layout="" className="puzzle-page-layout">
        <AppBar title="Direct header" sticky />
      </div>,
    );

    expectInitialOffset(doc, doc.querySelector("[data-puzzle-page-layout]")!);
  });

  it("does not let content examples or nested layouts change the page offset", async () => {
    const doc = await renderServerFrame(
      <PageLayout>
        <PageLayout.Header>
          <AppBar title="Page header" sticky />
        </PageLayout.Header>
        <PageLayout.Main>
          <AppBar title="Content example" sticky trailingComponents={<div style={{ height: 150 }} />} />
          {example(96)}
          <PageLayout>
            <PageLayout.Main>Without a sticky header</PageLayout.Main>
          </PageLayout>
        </PageLayout.Main>
      </PageLayout>,
    );
    const layouts = doc.querySelectorAll("[data-puzzle-page-layout]");

    expectInitialOffset(doc, layouts[0]!);
    expectInitialOffset(doc, layouts[1]!);
    expect(
      doc.defaultView!.getComputedStyle(layouts[2]!).getPropertyValue("--puzzle-sticky-offset"),
    ).toBe("0px");
    expect(
      doc.defaultView!.getComputedStyle(doc.documentElement).getPropertyValue("--puzzle-sticky-offset"),
    ).toBe("");
  });

  it("hydrates without shifting offset consumers, then tracks resizes and cleans up", async () => {
    const container = document.createElement("div");
    const content = example(96);
    container.innerHTML = renderToString(content);
    document.body.append(container);
    let root: Root | undefined;
    const onRecoverableError = vi.fn();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      // innerHTML leaves scripts inert; execute the emitted script before hydration.
      const inertScript = container.querySelector("script")!;
      const script = document.createElement("script");
      script.textContent = inertScript.textContent;
      inertScript.replaceWith(script);

      const layout = container.querySelector<HTMLElement>("[data-puzzle-page-layout]")!;
      const consumer = container.querySelector<HTMLElement>("[data-offset-consumer]")!;
      expectInitialOffset(document, layout);
      const initialHeight = consumer.getBoundingClientRect().height;
      const initialOffset = getComputedStyle(consumer).paddingTop;

      await act(async () => {
        root = hydrateRoot(container, content, { onRecoverableError });
      });

      expect(consumer.getBoundingClientRect().height).toBe(initialHeight);
      expect(getComputedStyle(consumer).paddingTop).toBe(initialOffset);
      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();

      await act(async () => {
        root!.render(example(144));
      });
      await waitFor(() => {
        expect(parseFloat(getComputedStyle(consumer).paddingTop)).toBeCloseTo(
          container.querySelector(".puzzle-app-bar")!.getBoundingClientRect().height,
          4,
        );
      });
      expect(consumer.getBoundingClientRect().height).toBeGreaterThan(initialHeight);

      await act(async () => {
        root!.render(
          <PageLayout>
            <PageLayout.Main>Without a sticky header</PageLayout.Main>
          </PageLayout>,
        );
      });
      expect(layout.style.getPropertyValue("--puzzle-sticky-offset")).toBe("");
      expect(getComputedStyle(layout).getPropertyValue("--puzzle-sticky-offset")).toBe("0px");
    } finally {
      await act(async () => root?.unmount());
      container.remove();
    }
  });
});
