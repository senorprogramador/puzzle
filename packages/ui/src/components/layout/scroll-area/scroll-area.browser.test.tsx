import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { ScrollArea } from "./index";

afterEach(cleanup);

describe("ScrollArea browser behavior", () => {
  it("scrolls content with native pointer and keyboard interactions", async () => {
    const { getByRole } = render(
      <ScrollArea
        aria-label="Scrollable messages"
        style={{ height: 120, width: 240 }}
      >
        <div style={{ height: 600 }}>Long content</div>
      </ScrollArea>,
    );

    const viewport = getByRole("region", {
      name: "Scrollable messages",
    });

    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);

    await userEvent.click(viewport);

    expect(viewport).toHaveFocus();

    await userEvent.keyboard("{PageDown}");

    await expect.poll(() => viewport.scrollTop).toBeGreaterThan(0);
  });

  it("supports horizontal native scrolling", () => {
    const { getByRole } = render(
      <ScrollArea
        orientation="horizontal"
        aria-label="Scrollable cards"
        style={{ height: 100, width: 160 }}
      >
        <div style={{ width: 600, height: 80 }}>Wide content</div>
      </ScrollArea>,
    );

    const viewport = getByRole("region", {
      name: "Scrollable cards",
    });

    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);

    viewport.scrollLeft = 100;

    expect(viewport.scrollLeft).toBe(100);
  });
});
