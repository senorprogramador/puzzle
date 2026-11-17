import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RoadmapSection } from "./roadmap";
import type {
  RoadmapItem,
  RoadmapVariant,
} from "./roadmap.types";

const variants: RoadmapVariant[] = [
  "timeline",
  "quarters",
  "columns",
  "cards",
  "list",
  "progress",
  "horizontal",
  "vertical",
  "grouped",
  "kanban",
  "milestones",
  "release",
];

const items: RoadmapItem[] = [
  {
    id: "sso",
    title: "Single sign-on",
    description: "Connect identity providers for team access.",
    status: "in-progress",
    statusLabel: "In development",
    date: "Q1 2027",
    group: "Q1 2027",
    release: "Spring release",
    progress: 40,
  },
  {
    id: "audit",
    title: "Audit export",
    status: "planned",
    date: "Q2 2027",
    group: "Q2 2027",
    release: "Summer release",
  },
];

afterEach(cleanup);

describe("RoadmapSection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <RoadmapSection variant={variant} items={items} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Single sign-on" })).toBeVisible();
  });

  it("presents accessible status labels and optional progress", () => {
    render(<RoadmapSection variant="progress" items={items} />);

    expect(screen.getByText("In development")).toBeVisible();
    expect(screen.getByText("Planned")).toBeVisible();
    expect(
      screen.getByRole("progressbar", { name: "Single sign-on progress" }),
    ).toHaveAttribute("value", "40");
    expect(
      screen.queryByRole("region", { name: "Roadmap board" }),
    ).toBeNull();
  });

  it("groups milestones into accessible kanban columns", () => {
    render(<RoadmapSection variant="kanban" items={items} />);

    expect(
      screen.getByRole("region", { name: "Roadmap board" }),
    ).toBeVisible();
    expect(screen.getByRole("region", { name: "In progress" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Planned" })).toBeVisible();
  });

  it("omits empty collections, supports large roadmaps, and rejects invalid progress", () => {
    const { container, rerender } = render(<RoadmapSection items={[]} />);
    expect(container.querySelector(".puzzle-roadmap__list")).toBeNull();

    const manyItems = Array.from({ length: 60 }, (_, index) => ({
      id: `milestone-${index}`,
      title: `Milestone ${index}`,
      status: "planned" as const,
    }));
    rerender(<RoadmapSection items={manyItems} />);
    expect(
      container.querySelectorAll(".puzzle-roadmap__list > li"),
    ).toHaveLength(60);

    expect(() =>
      render(
        <RoadmapSection
          items={[{ id: "bad", title: "Bad progress", status: "planned", progress: 120 }]}
        />,
      ),
    ).toThrow('Progress for roadmap item "bad" must be between 0 and 100.');
  });
});
