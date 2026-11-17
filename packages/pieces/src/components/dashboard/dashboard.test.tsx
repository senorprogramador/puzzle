import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  DashboardActivityFeed,
  DashboardHeader,
  DashboardProgressCard,
  DashboardShell,
  DashboardStatCard,
  DashboardStatGroup,
} from ".";

describe("DashboardHeader", () => {
  it("renders title, description, eyebrow, and actions", () => {
    render(
      <DashboardHeader
        eyebrow="Workspace"
        title="Good morning"
        description="Here is your team overview."
        actions={<button type="button">Create project</button>}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Good morning", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(screen.getByText("Here is your team overview.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create project" }),
    ).toBeInTheDocument();
  });
});

describe("DashboardStatCard", () => {
  it("renders value, description, trend, and action", () => {
    const onClick = vi.fn();
    render(
      <DashboardStatCard
        label="Open tasks"
        value="12"
        description="Across all projects"
        trend={{ value: "+8%", label: "this month", direction: "positive" }}
        action={
          <button type="button" onClick={onClick}>
            View tasks
          </button>
        }
      />,
    );

    expect(screen.getByRole("heading", { name: "Open tasks" })).toBeVisible();
    expect(screen.getByText("12")).toBeVisible();
    expect(screen.getByText("Across all projects")).toBeVisible();
    expect(screen.getByText("+8%")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "View tasks" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("exposes loading state without exposing placeholder content", () => {
    render(<DashboardStatCard label="Open tasks" loading value="12" />);

    expect(screen.getByRole("article", { name: "Open tasks" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.queryByText("12")).not.toBeInTheDocument();
    expect(
      screen
        .getByRole("article", { name: "Open tasks" })
        .querySelector('[aria-hidden="true"]'),
    ).toBeInTheDocument();
  });
});

describe("DashboardStatGroup", () => {
  it("labels the group and supports the selected column count", () => {
    render(
      <DashboardStatGroup label="Team metrics" columns={4}>
        <DashboardStatCard label="Projects" value="5" />
      </DashboardStatGroup>,
    );

    expect(screen.getByRole("region", { name: "Team metrics" })).toHaveAttribute(
      "data-columns",
      "4",
    );
  });
});

describe("DashboardActivityFeed", () => {
  it("renders an empty state", () => {
    render(
      <DashboardActivityFeed
        items={[]}
        title="Recent changes"
        emptyState="Nothing to show yet."
      />,
    );

    expect(
      screen.getByRole("region", { name: "Recent changes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Nothing to show yet.")).toBeVisible();
  });

  it("renders linked activity, avatar, and semantic time", () => {
    render(
      <DashboardActivityFeed
        items={[
          {
            id: "activity-1",
            description: "updated the launch plan",
            timestamp: "Today",
            dateTime: "2026-11-16",
            avatar: <img alt="Alex Morgan" src="/alex.png" />,
            href: "/projects/launch",
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("link", { name: "updated the launch plan" }),
    ).toHaveAttribute("href", "/projects/launch");
    expect(screen.getByRole("img", { name: "Alex Morgan" })).toBeInTheDocument();
    expect(screen.getByText("Today").closest("time")).toHaveAttribute(
      "dateTime",
      "2026-11-16",
    );
  });

  it("supports custom item rendering", () => {
    render(
      <DashboardActivityFeed
        items={[
          {
            id: "activity-1",
            description: "created a project",
            timestamp: "Just now",
          },
        ]}
        renderItem={(item) => <strong>{item.description}</strong>}
      />,
    );

    expect(screen.getByText("created a project").tagName).toBe("STRONG");
  });
});

describe("DashboardProgressCard", () => {
  it("renders progress, status, description, and action", () => {
    render(
      <DashboardProgressCard
        title="Website refresh"
        description="Target launch: November 30"
        value={72}
        status="On track"
        action={<button type="button">View project</button>}
      />,
    );

    expect(
      screen.getByRole("progressbar", { name: "Website refresh" }),
    ).toHaveAttribute("aria-valuenow", "72");
    expect(screen.getByText("72%")).toBeVisible();
    expect(screen.getByText("On track")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "View project" }),
    ).toBeInTheDocument();
  });
});

describe("DashboardShell", () => {
  it("composes topbar, labelled sidebar, and main content", () => {
    render(
      <DashboardShell
        topbar={<div>Top bar</div>}
        sidebar={<nav>Workspace links</nav>}
        sidebarLabel="Workspace navigation"
      >
        <h1>Overview</h1>
      </DashboardShell>,
    );

    expect(screen.getByText("Top bar")).toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: "Workspace navigation" }),
    ).toContainElement(screen.getByRole("navigation"));
    expect(screen.getByRole("main")).toContainElement(
      screen.getByRole("heading", { name: "Overview" }),
    );
  });
});
