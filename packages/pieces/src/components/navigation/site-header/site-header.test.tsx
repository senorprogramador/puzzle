import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { SiteHeader } from "./index";

afterEach(cleanup);

describe("SiteHeader", () => {
  it("renders semantic navigation and active links", () => {
    render(
      <SiteHeader
        logo={<a href="/">Willow & Tide</a>}
        items={[
          { id: "home", label: "Home", href: "/", active: true },
          { id: "stay", label: "Stay", href: "/stay" },
          {
            id: "more",
            label: "More",
            children: [{ id: "contact", label: "Contact", href: "/contact" }],
          },
        ]}
      />,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
  });

  it("opens the mobile menu and closes it after following a link", async () => {
    const user = userEvent.setup();
    render(
      <SiteHeader
        logo="Logo"
        items={[{ id: "contact", label: "Contact", href: "#contact" }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("dialog", { name: "Website navigation" })).toBeInTheDocument();
    await user.click(
      within(screen.getByRole("dialog", { name: "Website navigation" })).getByRole(
        "link",
        { name: "Contact" },
      ),
    );
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Website navigation" })).not.toBeInTheDocument();
    });
  });
});
