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
});
