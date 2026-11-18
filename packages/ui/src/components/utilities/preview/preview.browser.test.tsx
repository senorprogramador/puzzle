import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { lazy, useState } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";

import { Preview, type PreviewDevice } from "./index";

beforeEach(async () => {
  await page.viewport(1200, 1000);
});

afterEach(cleanup);

const getFrame = () => {
  const frame = document.querySelector("iframe");
  if (!frame) throw new Error("Missing preview frame.");
  return frame;
};

const expectHeight = async (height: number) => {
  await waitFor(() => {
    expect(getComputedStyle(getFrame()).height).toBe(`${height}px`);
    expect(getFrame().contentDocument?.querySelector("[data-content]")).not.toBeNull();
  });
};

const expectNoOverflow = () => {
  const root = getFrame().contentDocument!.documentElement;
  expect(root.scrollHeight).toBe(root.clientHeight);
  expect(root.scrollWidth).toBe(root.clientWidth);
  const stage = document.querySelector(".puzzle-preview__stage")!;
  expect(stage.scrollHeight).toBe(stage.clientHeight);
  expect(stage.scrollWidth).toBe(stage.clientWidth);
};

describe("Preview sizing", () => {
  it("titles the frame document and makes its scroll root keyboard focusable", async () => {
    render(
      <Preview defaultDevice="mobile" height={80}>
        <div data-content style={{ height: 240 }}>Preview content</div>
      </Preview>,
    );

    await expectHeight(80);
    const frameDocument = getFrame().contentDocument!;

    expect(frameDocument.title).toBe("Mobile component preview");
    expect(frameDocument.documentElement).toHaveAttribute("tabindex", "0");
  });

  it("keeps lazy previews stable while loading styles and suspended content", async () => {
    let resolveExample: (value: { default: () => React.ReactNode }) => void = () => {};
    const Example = lazy(() => new Promise<{ default: () => React.ReactNode }>((resolve) => {
      resolveExample = resolve;
    }));
    render(
      <Preview loading="lazy" padding={0} defaultDevice="mobile" height={240}>
        <Example />
      </Preview>,
    );
    const viewport = document.querySelector<HTMLElement>(".puzzle-preview__viewport")!;
    const initialHeight = viewport.getBoundingClientRect().height;
    expect(screen.getByRole("progressbar", { name: "Loading preview" })).toBeVisible();
    expect(document.querySelector("[data-preview-placeholder]")).toBeNull();

    await waitFor(() => expect(getFrame().contentDocument?.querySelector("[id$='-root']")).not.toBeNull());
    expect(screen.getByRole("progressbar", { name: "Loading preview" })).toBeVisible();
    await act(async () => resolveExample({ default: () => <div data-content>Loaded example</div> }));
    await waitFor(() => expect(screen.queryByRole("progressbar", { name: "Loading preview" })).toBeNull());
    expect(getFrame().style.visibility).toBe("");
    expect(viewport.getBoundingClientRect().height).toBe(initialHeight);
    expect(getFrame().contentDocument?.body).toHaveTextContent("Loaded example");
  });

  it("does not mount offscreen lazy children until approached, and preserves their state across tabs", async () => {
    let mounts = 0;
    const Example = () => {
      const [count, setCount] = useState(() => {
        mounts++;
        return 0;
      });
      return <button onClick={() => setCount(count + 1)}>Count {count}</button>;
    };
    const { container } = render(
      <>
        <div style={{ height: 3000 }} />
        <Preview loading="lazy" height={240} code="<Example />"><Example /></Preview>
      </>,
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(container.querySelector("iframe")).toBeNull();
    expect(mounts).toBe(0);
    container.querySelector(".puzzle-preview")!.scrollIntoView();
    await waitFor(() => expect(getFrame().contentDocument?.querySelector("button")).not.toBeNull());
    fireEvent.click(getFrame().contentDocument!.querySelector("button")!);
    fireEvent.click(screen.getByRole("tab", { name: "Code" }));
    fireEvent.click(screen.getByRole("tab", { name: "Preview" }));
    expect(getFrame().contentDocument?.body).toHaveTextContent("Count 1");
    expect(mounts).toBe(1);
  });

  it("replaces the inline placeholder with the measured frame", async () => {
    render(
      <Preview padding={0}>
        <div data-content style={{ height: 120 }}>Content</div>
      </Preview>,
    );
    const viewport = document.querySelector<HTMLElement>(".puzzle-preview__viewport")!;
    await expectHeight(120);
    await waitFor(() => {
      expect(document.querySelector("[data-preview-placeholder]")).toBeNull();
      expect(getFrame().style.visibility).toBe("");
    });
    expect(viewport.getBoundingClientRect().height).toBe(120);
    expectNoOverflow();
  });

  it("uses smaller default padding on mobile and tablet previews", async () => {
    render(
      <Preview defaultDevice="mobile">
        <div data-content style={{ height: 64 }}>Content</div>
      </Preview>,
    );
    expect(getComputedStyle(document.querySelector(".puzzle-preview__placeholder")!).padding).toBe("8px");
    const expectPadding = async (padding: number) => {
      await expectHeight(64 + 2 * padding);
      const content = getFrame().contentDocument!.querySelector("[data-content]")!.parentElement!;
      expect(getComputedStyle(content).padding).toBe(`${padding}px`);
    };
    await expectPadding(8);
    fireEvent.click(screen.getByRole("button", { name: "Tablet" }));
    await expectPadding(16);
    fireEvent.click(screen.getByRole("button", { name: "Desktop" }));
    await expectPadding(32);
  });

  it("applies padding inside the frame and includes it in the content height", async () => {
    const example = (padding?: number | string) => (
      <Preview padding={padding}>
        <div data-content style={{ height: 64 }}>Content</div>
      </Preview>
    );
    const getPadding = () => {
      const content = getFrame().contentDocument!.querySelector("[data-content]")!.parentElement!;
      return getComputedStyle(content).padding;
    };
    const { rerender } = render(example());
    await expectHeight(128);
    expect(getPadding()).toBe("32px");
    rerender(example(12));
    await expectHeight(88);
    expect(getPadding()).toBe("12px");
    rerender(example("8px 16px"));
    await expectHeight(80);
    expect(getPadding()).toBe("8px 16px");
    rerender(example(0));
    await expectHeight(64);
    expect(getPadding()).toBe("0px");
    expectNoOverflow();
  });

  it("server placeholder uses the same padding as the frame content", () => {
    render(
      <Preview padding={20}>
        <div style={{ height: 64 }}>Content</div>
      </Preview>,
    );
    const placeholder = document.querySelector<HTMLElement>("[data-preview-placeholder]");
    expect(placeholder).not.toBeNull();
    expect(getComputedStyle(placeholder!).padding).toBe("20px");
  });

  it("hides device controls at mobile and tablet viewport boundaries", async () => {
    render(
      <Preview padding={0}>
        <div data-content style={{ height: 64 }}>Content</div>
      </Preview>,
    );
    await expectHeight(64);
    for (const [width, mobile, desktop] of [
      [390, false, false],
      [767, false, false],
      [768, true, false],
      [1023, true, false],
      [1024, true, true],
    ] as const) {
      await page.viewport(width, 1000);
      await waitFor(() => {
        expect(screen.queryByRole("button", { name: "Mobile" }) !== null).toBe(mobile);
        expect(screen.queryByRole("button", { name: "Tablet" }) !== null).toBe(mobile);
        expect(screen.queryByRole("button", { name: "Desktop" }) !== null).toBe(desktop);
      });
      expectNoOverflow();
    }
  });

  it.each([
    [390, "Mobile", 844],
    [800, "Tablet", 1024],
    [1200, "Desktop", 768],
  ] as const)(
    "matches the %s preview at %i pixels",
    async (width, device, height) => {
      await page.viewport(width, 1000);
      render(
        <Preview padding={0} fit="device">
          <div data-content>Content</div>
        </Preview>,
      );

      await expectHeight(height);
      expect(getFrame().title).toBe(`${device} component preview`);
    },
  );

  it("matches the viewport device until the user chooses a device", async () => {
    render(
      <Preview padding={0} fit="device">
        <div data-content>Content</div>
      </Preview>,
    );

    await expectHeight(768);
    expect(getFrame().title).toBe("Desktop component preview");

    await page.viewport(800, 1000);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Tablet" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });
    await expectHeight(1024);
    fireEvent.click(screen.getByRole("button", { name: "Mobile" }));
    await expectHeight(844);

    await page.viewport(1200, 1000);
    expect(screen.getByRole("button", { name: "Mobile" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expectHeight(844);
  });

  const hydrationCases: {
    browserWidth: number;
    containerWidth: number;
    defaultDevice?: PreviewDevice;
    device: PreviewDevice;
    deviceWidth: number;
    deviceHeight: number;
  }[] = [
    { browserWidth: 390, containerWidth: 280, device: "mobile", deviceWidth: 390, deviceHeight: 844 },
    { browserWidth: 800, containerWidth: 400, device: "tablet", deviceWidth: 768, deviceHeight: 1024 },
    { browserWidth: 1440, containerWidth: 640, device: "desktop", deviceWidth: 1024, deviceHeight: 768 },
    { browserWidth: 1440, containerWidth: 240, device: "desktop", deviceWidth: 1024, deviceHeight: 768 },
    { browserWidth: 1440, containerWidth: 640, defaultDevice: "mobile", device: "mobile", deviceWidth: 390, deviceHeight: 844 },
    { browserWidth: 800, containerWidth: 400, defaultDevice: "desktop", device: "desktop", deviceWidth: 1024, deviceHeight: 768 },
  ];

  for (const sizing of ["content", "device", "height"] as const) {
    it.each(hydrationCases)(
      `preserves ${sizing} geometry throughout hydration at $browserWidth/$containerWidth with $defaultDevice`,
      async ({ browserWidth, containerWidth, defaultDevice, device, deviceWidth, deviceHeight }) => {
        await page.viewport(browserWidth, 1000);
        const example = (
          <Preview
            padding={12}
            defaultDevice={defaultDevice}
            fit={sizing === "device" ? "device" : "content"}
            height={sizing === "height" ? 300 : undefined}
          >
            <div data-content style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <p>A longer example wraps at the selected device width, not the documentation column width.</p>
              <p>Server rendering and the loaded iframe must reserve the same amount of space.</p>
            </div>
          </Preview>
        );
        const container = document.createElement("div");
        container.style.width = `${containerWidth}px`;
        container.innerHTML = renderToString(example);
        document.body.append(container);
        const viewport = container.querySelector<HTMLElement>(".puzzle-preview__viewport")!;
        const preview = container.querySelector<HTMLElement>(".puzzle-preview")!;
        const before = viewport.getBoundingClientRect();
        const scale = Math.min(1, (containerWidth - 2 - (browserWidth <= 480 ? 32 : 48)) / deviceWidth);
        expect(before.width).toBeCloseTo(deviceWidth * scale, 0);
        if (sizing !== "content") {
          expect(before.height).toBeCloseTo((sizing === "height" ? 300 : deviceHeight) * scale, 0);
        }
        const initialPreviewHeight = preview.getBoundingClientRect().height;
        const heights: number[] = [];
        const observer = new ResizeObserver(() => {
          heights.push(preview.getBoundingClientRect().height);
        });
        observer.observe(preview);
        const hydrationErrors: unknown[] = [];
        let root: Root | undefined;
        try {
          await act(async () => {
            root = hydrateRoot(container, example, {
              onRecoverableError: (error) => hydrationErrors.push(error),
            });
          });
          await waitFor(() => {
            const frame = container.querySelector("iframe")!;
            expect(frame.title.toLowerCase()).toBe(`${device} component preview`);
            expect(frame.contentDocument?.querySelector("[data-content]")).not.toBeNull();
            expect(container.querySelector("[data-preview-placeholder]")).toBeNull();
          });
          await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
          expect(viewport.getBoundingClientRect().width).toBeCloseTo(before.width, 0);
          expect(viewport.getBoundingClientRect().height).toBeCloseTo(before.height, 0);
          expect(Math.max(...heights.map((value) => Math.abs(value - initialPreviewHeight)))).toBeLessThanOrEqual(1);
          expect(hydrationErrors).toEqual([]);
        } finally {
          observer.disconnect();
          await act(async () => root?.unmount());
          container.remove();
        }
      },
    );
  }

  it("skips the hidden Desktop button during tablet keyboard navigation", async () => {
    await page.viewport(800, 1000);
    render(<Preview padding={0} defaultDevice="desktop">Content</Preview>);
    const mobile = screen.getByRole("button", { name: "Mobile" });
    const tablet = screen.getByRole("button", { name: "Tablet" });
    await waitFor(() => expect(mobile.tabIndex).toBe(0));
    mobile.focus();
    fireEvent.keyDown(mobile, { key: "End" });
    expect(tablet).toHaveFocus();
    fireEvent.keyDown(tablet, { key: "ArrowRight" });
    expect(mobile).toHaveFocus();
  });

  it("fits content by default without unnecessary scrolling or minimum stage height", async () => {
    render(
      <Preview padding={0}>
        <div data-content style={{ height: 64 }}>Content</div>
      </Preview>,
    );

    await expectHeight(64);
    expectNoOverflow();
    const stage = document.querySelector(".puzzle-preview__stage")!;
    expect(stage.getBoundingClientRect().height).toBeLessThan(150);
  });

  it("grows and shrinks with content", async () => {
    const example = (height: number) => (
      <Preview padding={0}><div data-content style={{ height }}>Content</div></Preview>
    );
    const { rerender } = render(example(64));
    await expectHeight(64);
    rerender(example(320));
    await expectHeight(320);
    rerender(example(48));
    await expectHeight(48);
    expectNoOverflow();
  });

  it("caps content at mobile height, including on tablet", async () => {
    render(
      <Preview padding={0} defaultDevice="tablet">
        <div data-content style={{ height: 1200 }}>Tall content</div>
      </Preview>,
    );

    await expectHeight(844);
    const root = getFrame().contentDocument!.documentElement;
    expect(root.scrollHeight).toBeGreaterThan(root.clientHeight);
    const stage = document.querySelector(".puzzle-preview__stage")!;
    expect(stage.scrollHeight).toBe(stage.clientHeight);
  });

  it("does not collapse empty content to a zero-height scrolling frame", async () => {
    render(<Preview padding={0}><div data-content /></Preview>);
    await expectHeight(1);
    expectNoOverflow();
  });

  it("uses the current device height with device fit", async () => {
    render(
      <Preview padding={0} fit="device">
        <div data-content>Content</div>
      </Preview>,
    );
    await expectHeight(768);
    fireEvent.click(screen.getByRole("button", { name: "Tablet" }));
    await expectHeight(1024);
    fireEvent.click(screen.getByRole("button", { name: "Desktop" }));
    await expectHeight(768);
    expectNoOverflow();
  });

  for (const fit of ["content", "device"] as const) {
    it(`lets an explicit height override ${fit} fit and the content cap`, async () => {
      render(
        <Preview padding={0} fit={fit} height={900}>
          <div data-content style={{ height: 64 }}>Content</div>
        </Preview>,
      );
      await expectHeight(900);
      fireEvent.click(screen.getByRole("button", { name: "Tablet" }));
      await expectHeight(900);
      expectNoOverflow();
    });
  }

  it("remeasures responsive content when switching devices", async () => {
    render(
      <Preview padding={0}>
        <style>{`
          [data-content] { height: 120px; }
          @media (min-width: 768px) { [data-content] { height: 60px; } }
        `}</style>
        <div data-content>Responsive content</div>
      </Preview>,
    );
    await expectHeight(60);
    fireEvent.click(screen.getByRole("button", { name: "Tablet" }));
    await expectHeight(60);
    fireEvent.click(screen.getByRole("button", { name: "Mobile" }));
    await expectHeight(120);
    expectNoOverflow();
  });

  it("preserves sizing when switching code tabs and fitting modes", async () => {
    const example = (fit: "content" | "device") => (
      <Preview padding={0} fit={fit} code="<div>Content</div>">
        <div data-content style={{ height: 64 }}>Content</div>
      </Preview>
    );
    const { rerender } = render(example("content"));
    await expectHeight(64);
    fireEvent.click(screen.getByRole("tab", { name: "Code" }));
    fireEvent.click(screen.getByRole("tab", { name: "Preview" }));
    await expectHeight(64);
    rerender(example("device"));
    await expectHeight(768);
    rerender(example("content"));
    await expectHeight(64);
    expectNoOverflow();
  });

  it("scales to narrow containers without introducing host scrolling", async () => {
    render(
      <div style={{ width: 240 }}>
        <Preview padding={0}>
          <div data-content style={{ height: 200 }}>Content</div>
        </Preview>
      </div>,
    );
    await expectHeight(200);
    await waitFor(() => {
      const viewport = document.querySelector(".puzzle-preview__viewport")!;
      expect(viewport.getBoundingClientRect().width).toBeLessThanOrEqual(240);
      expect(viewport.getBoundingClientRect().height).toBeGreaterThan(0);
      expect(viewport.getBoundingClientRect().height).toBeLessThan(200);
    });
    expectNoOverflow();
  });
});
