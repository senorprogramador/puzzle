import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import {
  DashboardActivityFeed,
  DashboardHeader,
  DashboardOverviewSection,
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

describe("DashboardOverviewSection", () => {
  it("composes summary data, metrics, charts, date range, and custom widgets", () => {
    render(
      <DashboardOverviewSection
        title="Workspace overview"
        description="A clear view of this week's work."
        variant="analytics"
        dateRange={<button type="button">Last 30 days</button>}
        actions={<button type="button">Export report</button>}
        summary={<p>12 projects are active across 3 teams.</p>}
        metrics={
          <DashboardStatGroup label="Workspace metrics" columns={3}>
            <DashboardStatCard
              label="Projects"
              value="12"
              trend={{ value: "+2", label: "this month", direction: "positive" }}
            />
          </DashboardStatGroup>
        }
        charts={<div aria-label="Monthly revenue chart supplied by the app" />}
      >
        <aside aria-label="Custom dashboard widget">Upcoming launches</aside>
      </DashboardOverviewSection>,
    );

    expect(
      screen.getByRole("region", { name: "Workspace overview" }),
    ).toHaveAttribute("data-variant", "analytics");
    expect(screen.getByText("12 projects are active across 3 teams.")).toBeVisible();
    expect(screen.getByRole("region", { name: "Workspace metrics" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Last 30 days" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Export report" })).toBeVisible();
    expect(screen.getByLabelText("Monthly revenue chart supplied by the app")).toBeInTheDocument();
    expect(screen.getByLabelText("Custom dashboard widget")).toBeVisible();
  });

  it("announces loading and error states and supports empty data", () => {
    const { rerender } = render(
      <DashboardOverviewSection title="Empty overview" />,
    );

    expect(
      screen.getByRole("region", { name: "Empty overview" }),
    ).toBeInTheDocument();

    rerender(<DashboardOverviewSection title="Loading overview" loading />);
    expect(
      screen.getByRole("region", { name: "Loading overview" }),
    ).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveAccessibleName(
      "Loading dashboard overview",
    );

    rerender(
      <DashboardOverviewSection title="Failed overview" error="Unable to load metrics." />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load metrics.",
    );
  });

  it("renders a large metrics collection and supports server rendering", () => {
    const metrics = Array.from({ length: 60 }, (_, index) => (
      <DashboardStatCard
        key={index}
        label={`Metric ${index + 1}`}
        value={index}
      />
    ));

    render(
      <DashboardOverviewSection
        title="Large overview"
        metrics={<DashboardStatGroup>{metrics}</DashboardStatGroup>}
      />,
    );
    expect(screen.getAllByRole("article")).toHaveLength(60);
    expect(
      renderToString(
        <DashboardOverviewSection title="Server overview" summary="Ready" />,
      ),
    ).toContain("Server overview");
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
