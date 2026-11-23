import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Sidebar } from "./index";

afterEach(() => {
  cleanup();
  document.documentElement.style.removeProperty("--puzzle-sticky-offset");
});

describe("Sidebar browser behavior", () => {
  it("uses the sticky offset and keeps tall content natively scrollable", () => {
    document.documentElement.style.setProperty(
      "--puzzle-sticky-offset",
      "48px",
    );

    render(
      <div style={{ height: "300px", overflow: "auto" }}>
        <Sidebar aria-label="Related resources">
          <div style={{ height: "900px", flexShrink: 0 }}>
            Long sidebar content
          </div>
        </Sidebar>
      </div>,
    );

    const sidebar = screen.getByRole("complementary", {
      name: "Related resources",
    });
    const styles = getComputedStyle(sidebar);

    expect(styles.position).toBe("sticky");
    expect(styles.top).toBe("48px");
    expect(styles.overflowY).toBe("auto");
    expect(sidebar.scrollHeight).toBeGreaterThan(sidebar.clientHeight);
  });
});
