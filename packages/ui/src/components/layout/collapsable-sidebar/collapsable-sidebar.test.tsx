import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CollapsableSidebar } from "./index";

afterEach(cleanup);

describe("CollapsableSidebar", () => {
  it("rejects a whitespace-only navigation landmark name", () => {
    expect(() =>
      render(<CollapsableSidebar items={[]} ariaLabel=" " />),
    ).toThrow("CollapsableSidebar: ariaLabel must not be empty.");
  });

  it("rejects empty item and group labels", () => {
    expect(() =>
      render(
        <CollapsableSidebar
          items={[{ id: "home", icon: "H", label: " ", href: "/" }]}
        />,
      ),
    ).toThrow("CollapsableSidebar: item labels must not be empty.");

    expect(() =>
      render(
        <CollapsableSidebar
          items={[
            {
              id: "group",
              label: " ",
              items: [{ id: "home", icon: "H", label: "Home", href: "/" }],
            },
          ]}
        />,
      ),
    ).toThrow("CollapsableSidebar: group labels must not be empty.");
  });

  it("rejects duplicate navigation IDs", () => {
    expect(() =>
      render(
        <CollapsableSidebar
          items={[
            {
              id: "work space",
              label: "Workspace",
              items: [{ id: "home", icon: "H", label: "Home", href: "/" }],
            },
          ]}
        />,
      ),
    ).toThrow("CollapsableSidebar: group IDs must not contain whitespace.");

    expect(() =>
      render(
        <CollapsableSidebar
          items={[
            { id: "same", icon: "H", label: "Home", href: "/" },
            { id: "same", icon: "W", label: "Workspace", href: "/work" },
          ]}
        />,
      ),
    ).toThrow(
      "CollapsableSidebar: top-level IDs must be unique and non-empty.",
    );

    expect(() =>
      render(
        <CollapsableSidebar
          items={[
            {
              id: "group",
              label: "Workspace",
              items: [
                { id: "same", icon: "H", label: "Home", href: "/" },
                { id: "same", icon: "W", label: "Workspace", href: "/work" },
              ],
            },
          ]}
        />,
      ),
    ).toThrow(
      "CollapsableSidebar: group item IDs must be unique and non-empty.",
    );
  });

  it("omits a false-only icon while keeping the item named", () => {
    const { container } = render(
      <CollapsableSidebar
        items={[{ id: "home", icon: false, label: "Home", href: "/" }]}
      />,
    );

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(
      container.querySelector(".puzzle-collapsable-sidebar__icon"),
    ).not.toBeInTheDocument();
  });
});
