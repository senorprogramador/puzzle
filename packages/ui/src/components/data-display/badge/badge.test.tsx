import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "./index";

describe("Badge markup", () => {
  it("keeps a standalone badge inside its paragraph through parsing and hydration", async () => {
    const content = (
      <p>
        <Badge content="Beta" color="info" /> <strong>API maturity: Beta.</strong>
      </p>
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(content);
    const paragraph = container.firstElementChild!;
    const badge = paragraph.querySelector(".puzzle-badge");
    expect(container.children).toHaveLength(1);
    expect(badge?.tagName).toBe("SPAN");
    expect(paragraph.querySelector("strong")).toHaveTextContent("API maturity: Beta.");
    expect(paragraph.querySelector("div")).toBeNull();

    const onRecoverableError = vi.fn();
    const root = hydrateRoot(container, content, { onRecoverableError });
    try {
      await act(async () => {});
      expect(container.firstElementChild).toBe(paragraph);
      expect(paragraph.querySelector(".puzzle-badge")).toBe(badge);
      expect(onRecoverableError).not.toHaveBeenCalled();
    } finally {
      act(() => root.unmount());
    }
  });

  it("preserves the div wrapper for badges containing block children", () => {
    render(
      <Badge content="4">
        <div data-testid="target">Target</div>
      </Badge>,
    );
    const wrapper = screen.getByTestId("target").parentElement!;
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper).toHaveClass("puzzle-badge", "top", "right");
    expect(wrapper).not.toHaveClass("puzzle-badge-standalone");
  });
});
