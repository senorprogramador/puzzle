import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentPropsWithRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Theme } from "@puzzle/theme";
import { AppBar } from "./index";

afterEach(() => {
  cleanup();
});

const navigationItems = [
  { label: "Home", href: "/", current: true },
  { label: "Docs", href: "/docs" },
  { label: "GitHub", href: "https://github.com", external: true },
];

describe("AppBar", () => {
  it("renders the brand as a link labelled by the title", () => {
    render(<AppBar title="Puzzle" logoHref="/home" />);

    expect(screen.getByRole("link", { name: "Puzzle" })).toHaveAttribute(
      "href",
      "/home",
    );
  });

  it("falls back to Home as the brand label for a logo-only brand", () => {
    render(<AppBar logo={<svg />} />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("marks only the current item with aria-current=page", () => {
    render(<AppBar title="Puzzle" navigationItems={navigationItems} />);

    const desktop = screen.getAllByRole("navigation")[0];

    expect(within(desktop).getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      within(desktop).getByRole("link", { name: "Docs" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("protects external links from reverse tabnabbing", () => {
    render(<AppBar title="Puzzle" navigationItems={navigationItems} />);

    const link = within(screen.getAllByRole("navigation")[0]).getByRole(
      "link",
      { name: "GitHub" },
    );

    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(link.getAttribute("rel")).toContain("noreferrer");
  });

  it("renders navigation links through the configured theme Link", () => {
    const RouterLink = ({
      to,
      ...props
    }: ComponentPropsWithRef<"a"> & { to: string }) => (
      <a href={to} data-router-link="true" {...props} />
    );

    render(
      <Theme components={{ link: { component: RouterLink, hrefProp: "to" } }}>
        <AppBar title="Puzzle" navigationItems={navigationItems} />
      </Theme>,
    );

    expect(
      screen.getAllByRole("link", { name: "Docs" })[0],
    ).toHaveAttribute("data-router-link", "true");
    expect(screen.getByRole("link", { name: "Puzzle" })).toHaveAttribute(
      "data-router-link",
      "true",
    );
  });

  it("omits the menu button without navigation", () => {
    render(<AppBar title="Puzzle" />);

    expect(
      screen.queryByRole("button", { name: "Open navigation" }),
    ).toBeNull();
  });

  it("links the menu button to the mobile navigation and reports its state", async () => {
    const user = userEvent.setup();

    render(<AppBar title="Puzzle" navigationItems={navigationItems} />);

    const button = screen.getByRole("button", { name: "Open navigation" });

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(button.getAttribute("aria-controls")!)).toBeTruthy();

    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("renders custom navigation items and trailing components", () => {
    render(
      <AppBar
        title="Puzzle"
        customNavigationItems={["One", "Two"]}
        renderCustomNavigationItems={(item) => <span>{item}</span>}
        trailingComponents={<button type="button">Sign in</button>}
      />,
    );

    expect(screen.getAllByText("One").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Sign in" })).toBeTruthy();
  });

  it("uses ariaLabel for the navigation landmark", () => {
    render(
      <AppBar
        title="Puzzle"
        navigationItems={navigationItems}
        ariaLabel="Site"
      />,
    );

    expect(screen.getAllByRole("navigation", { name: "Site" }).length).toBeGreaterThan(0);
  });
});
