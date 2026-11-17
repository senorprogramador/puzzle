import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  DashboardBreadcrumbs,
  DashboardMobileNavigation,
  DashboardNavigation,
  DashboardSidebar,
  DashboardTopbar,
  DashboardUserMenu,
} from ".";

const items = [
  { id: "overview", label: "Overview", href: "/workspace" },
  {
    id: "projects",
    label: "Projects",
    href: "/workspace/projects",
    children: [
      {
        id: "active-project",
        label: "Active project",
        href: "/workspace/projects/active",
      },
    ],
  },
];

describe("DashboardNavigation", () => {
  it("renders nested links and marks the current page", () => {
    render(
      <DashboardNavigation
        items={items}
        pathname="/workspace/projects/active"
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Dashboard navigation" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "data-active",
      "true",
    );
    expect(
      screen.getByRole("link", { name: "Active project" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("supports router callbacks for primary activation", () => {
    const onNavigate = vi.fn();
    render(<DashboardNavigation items={items} onNavigate={onNavigate} />);
    const link = screen.getByRole("link", { name: "Overview" });

    expect(fireEvent.click(link)).toBe(false);
    expect(onNavigate).toHaveBeenCalledWith("/workspace");
  });

  it("keeps collapsed icon links accessibly named", () => {
    render(
      <DashboardNavigation
        items={[{ ...items[0]!, icon: <span>O</span> }]}
        collapsed
      />,
    );

    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
  });
});

describe("DashboardSidebar", () => {
  it("renders a labelled navigation landmark", () => {
    render(<DashboardSidebar items={items} label="Workspace links" />);

    expect(
      screen.getByRole("navigation", { name: "Workspace links" }),
    ).toBeInTheDocument();
  });
});

describe("DashboardTopbar", () => {
  it("composes content and actions", () => {
    render(
      <DashboardTopbar actions={<button type="button">Invite</button>}>
        <span>Acme workspace</span>
      </DashboardTopbar>,
    );

    expect(screen.getByText("Acme workspace")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Invite" })).toBeInTheDocument();
  });
});

describe("DashboardUserMenu", () => {
  it("uses native disclosure behavior", () => {
    render(
      <DashboardUserMenu
        trigger={<span>Alex Morgan</span>}
        label="Account actions"
      >
        <a href="/profile">Profile</a>
      </DashboardUserMenu>,
    );

    fireEvent.click(screen.getByText("Alex Morgan"));
    expect(screen.getByRole("link", { name: "Profile" })).toBeVisible();
  });
});

describe("DashboardMobileNavigation", () => {
  it("provides a native disclosure and labelled navigation", () => {
    render(<DashboardMobileNavigation items={items} />);

    fireEvent.click(screen.getByText("Open navigation"));
    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeInTheDocument();
  });
});

describe("DashboardBreadcrumbs", () => {
  it("links ancestors and marks the current page", () => {
    render(
      <DashboardBreadcrumbs
        items={[
          { id: "workspace", label: "Workspace", href: "/workspace" },
          {
            id: "projects",
            label: "Projects",
            href: "/workspace/projects",
          },
          { id: "active", label: "Active project" },
        ]}
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Workspace" })).toHaveAttribute(
      "href",
      "/workspace",
    );
    expect(screen.getByText("Active project")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("calls the navigation callback", () => {
    const onNavigate = vi.fn();
    render(
      <DashboardBreadcrumbs
        items={[
          { id: "workspace", label: "Workspace", href: "/workspace" },
          { id: "current", label: "Current" },
        ]}
        onNavigate={onNavigate}
      />,
    );

    fireEvent.click(screen.getByRole("link", { name: "Workspace" }));
    expect(onNavigate).toHaveBeenCalledWith("/workspace");
  });
});
