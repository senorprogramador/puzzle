import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ActivityTimeline,
  EmptyStatePanel,
  MetricComparison,
  ProgressOverview,
  StatCard,
  StatGroup,
} from ".";

describe("data display compositions", () => {
  it("exports the shared stat and activity compositions without duplicating them", () => {
    render(
      <>
        <StatGroup label="Metrics">
          <StatCard label="Projects" value="8" />
        </StatGroup>
        <ActivityTimeline items={[]} emptyState="No events." />
        <ProgressOverview title="Delivery" value={50} />
      </>,
    );

    expect(screen.getByRole("region", { name: "Metrics" })).toBeVisible();
    expect(screen.getByText("No events.")).toBeVisible();
    expect(
      screen.getByRole("progressbar", { name: "Delivery" }),
    ).toHaveAttribute("aria-valuenow", "50");
  });

  it("renders a semantic comparison", () => {
    render(
      <MetricComparison
        title="Monthly signups"
        primaryLabel="This month"
        primaryValue="128"
        comparisonLabel="Last month"
        comparisonValue="104"
      />,
    );

    expect(
      screen.getByRole("region", { name: "Monthly signups" }),
    ).toBeInTheDocument();
    expect(screen.getByText("This month")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByText("104")).toBeInTheDocument();
  });

  it("renders optional empty state content", () => {
    render(
      <EmptyStatePanel
        title="No projects yet"
        description="Create a project to get started."
        illustration={<span aria-hidden="true">+</span>}
        action={<button type="button">Create project</button>}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "No projects yet" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Create project" }),
    ).toBeVisible();
  });
});
