import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Preview } from "./index";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Preview", () => {
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

    frameRoot.id = "puzzle-preview-root";
    frameDocument.body.appendChild(frameRoot);

    render(
      <Preview code="<Button>Save</Button>">
        <button type="button">Preview action</button>
      </Preview>,
    );

    const frame = screen.getByTitle("Mobile component preview");

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
