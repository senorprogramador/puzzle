import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Preview } from "./index";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Preview", () => {
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
      <Preview code="<Button>Save</Button>">
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

      render(<Preview>Demo</Preview>);

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

      render(<Preview>Demo</Preview>);

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
          <Preview>Demo</Preview>
        </div>,
      );

      getDevice("Mobile").focus();
      await user.keyboard("{ArrowLeft}");

      expect(getDevice("Tablet")).toHaveFocus();
    });
  });
});
