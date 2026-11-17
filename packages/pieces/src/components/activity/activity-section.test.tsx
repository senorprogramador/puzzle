import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ActivitySection } from "./activity-section";

const items = [
  {
    id: "activity-1",
    actor: "Alex Morgan",
    action: "updated the launch plan",
    description: "Moved the target date to November 30.",
    timestamp: "10 minutes ago",
    dateTime: "2026-11-17T17:20:00",
    group: "today",
    groupLabel: "Today",
    category: "projects",
    href: "/projects/launch",
    metadata: <span>Launch project</span>,
  },
  {
    id: "activity-2",
    actor: "Riley Chen",
    action: "completed a checklist",
    timestamp: "Yesterday",
    group: "yesterday",
    groupLabel: "Yesterday",
    category: "tasks",
  },
];

describe("ActivitySection", () => {
  it("renders actors, actions, timestamps, descriptions, metadata, and links", () => {
    render(<ActivitySection title="Team activity" items={items} />);

    expect(screen.getByRole("region", { name: "Team activity" })).toHaveAttribute(
      "data-variant",
      "feed",
    );
    expect(
      screen.getByRole("link", { name: "updated the launch plan" }),
    ).toHaveAttribute("href", "/projects/launch");
    expect(screen.getByText("Alex Morgan")).toBeVisible();
    expect(screen.getByText("Moved the target date to November 30.")).toBeVisible();
    expect(screen.getByText("10 minutes ago").closest("time")).toHaveAttribute(
      "dateTime",
      "2026-11-17T17:20:00",
    );
    expect(screen.getByText("Launch project")).toBeVisible();
  });

  it("groups activity and renders the shared empty-state composition", () => {
    const { rerender } = render(
      <ActivitySection title="Grouped activity" items={items} variant="grouped" />,
    );
    expect(screen.getByRole("heading", { name: "Today", level: 3 })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Yesterday", level: 3 })).toBeVisible();

    rerender(
      <ActivitySection
        title="No activity"
        items={[]}
        emptyState={<p>Invite a teammate to see activity.</p>}
      />,
    );
    expect(screen.getByRole("heading", { name: "No activity yet" })).toBeVisible();
    expect(screen.getByText("Invite a teammate to see activity.")).toBeVisible();
  });

  it("uses an icon column only for items that provide an icon", () => {
    const { container } = render(
      <ActivitySection
        items={[
          {
            id: "without-icon",
            actor: "Alex Morgan",
            action: "updated a project",
            timestamp: "10 minutes ago",
          },
          {
            id: "with-icon",
            icon: <span aria-hidden="true">•</span>,
            actor: "Riley Chen",
            action: "completed a task",
            timestamp: "5 minutes ago",
          },
        ]}
      />,
    );
    const entries = container.querySelectorAll(".puzzle-activity-section__entry");

    expect(entries[0]).not.toHaveClass("puzzle-activity-section__entry--has-icon");
    expect(entries[1]).toHaveClass("puzzle-activity-section__entry--has-icon");
  });

  it("renders large data sets without dropping events", () => {
    const manyItems = Array.from({ length: 250 }, (_, index) => ({
      id: `event-${index}`,
      action: `Updated record ${index}`,
      timestamp: "Today",
    }));

    const { container } = render(<ActivitySection items={manyItems} />);
    expect(container.querySelectorAll(".puzzle-activity-section__item")).toHaveLength(
      250,
    );
  });
});
