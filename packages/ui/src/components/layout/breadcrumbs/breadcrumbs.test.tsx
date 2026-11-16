import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "./index";

describe("Breadcrumbs", () => {
  it("renders ancestor links and marks the final item as the current page", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Library", href: "/library" },
          { label: "Current page" },
        ]}
      />,
    );

    const navigation = screen.getByRole("navigation", { name: "Breadcrumbs" });
    expect(within(navigation).getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      within(navigation).getByRole("link", { name: "Library" }),
    ).toHaveAttribute("href", "/library");
    expect(
      within(navigation).getByText("Current page").closest("li"),
    ).toHaveAttribute("aria-current", "page");
    expect(within(navigation).queryByRole("link", { name: "Current page" }))
      .not.toBeInTheDocument();
  });

  it("supports a custom accessible name, icons, classes, and navigation props", () => {
    render(
      <Breadcrumbs
        aria-label="Account path"
        className="custom-breadcrumbs"
        data-testid="breadcrumbs"
        items={[
          { label: "Account", href: "/account", leadingIcon: <span>Icon</span> },
          { label: "Settings" },
        ]}
      />,
    );

    const navigation = screen.getByRole("navigation", { name: "Account path" });
    expect(navigation).toHaveClass("puzzle-breadcrumbs", "custom-breadcrumbs");
    expect(navigation).toHaveAttribute("data-testid", "breadcrumbs");
    expect(within(navigation).getByText("Icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
