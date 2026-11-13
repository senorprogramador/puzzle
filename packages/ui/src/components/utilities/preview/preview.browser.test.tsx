import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";

import { Preview } from "./index";

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
    expect(getFrame().style.height).toBe(`${height}px`);
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
    });
    expect(getFrame().style.visibility).toBe("");
    expect(viewport.getBoundingClientRect().height).toBe(120);
    expectNoOverflow();
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
    await expectHeight(844);
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
    await expectHeight(120);
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
    await expectHeight(844);
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
