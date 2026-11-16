import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sidebar } from "./index";

describe("Sidebar", () => {
  it("renders an aside by default with its children", () => {
    render(<Sidebar>Supporting content</Sidebar>);

    expect(screen.getByText("Supporting content").tagName).toBe("ASIDE");
  });

  it("supports a custom semantic element and forwards props", () => {
    render(
      <Sidebar
        as="nav"
        aria-label="Related links"
        className="custom-sidebar"
        data-testid="sidebar"
      >
        <a href="/related">Related</a>
      </Sidebar>,
    );

    const sidebar = screen.getByRole("navigation", { name: "Related links" });
    expect(sidebar.tagName).toBe("NAV");
    expect(sidebar).toHaveClass("puzzle-sidebar", "custom-sidebar");
    expect(sidebar).toHaveAttribute("data-testid", "sidebar");
    expect(screen.getByRole("link", { name: "Related" })).toBeInTheDocument();
  });
});
