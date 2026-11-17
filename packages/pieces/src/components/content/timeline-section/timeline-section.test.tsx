import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TimelineSection } from "./timeline-section";
import type {
  TimelineEvent,
  TimelineSectionVariant,
} from "./timeline-section.types";

const variants: TimelineSectionVariant[] = [
  "vertical",
  "horizontal",
  "alternating",
  "centered",
  "cards",
  "milestones",
  "history",
  "editorial",
  "compact",
  "numbered",
  "connected",
  "split",
];

const events: TimelineEvent[] = [
  {
    id: "first",
    title: "The first sketch",
    date: "2024-02-01",
    description: "A small idea becomes a shared direction.",
    image: { src: "", alt: "A sketchbook on a worktable" },
    action: <a href="/story">Read the story</a>,
  },
  {
    id: "second",
    title: "Opening the studio",
    date: "2024-06-18",
    icon: <span>*</span>,
  },
];

afterEach(cleanup);

describe("TimelineSection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <TimelineSection variant={variant} items={events} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(container.querySelector("ol")).not.toBeNull();
    expect(screen.getByText("The first sketch")).toBeVisible();
  });

  it("preserves ordered-list semantics, dates, images, and optional actions", () => {
    render(<TimelineSection items={events} title="Studio history" />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Feb 1, 2024")).toBeVisible();
    expect(
      screen.getByRole("img", { name: "A sketchbook on a worktable image unavailable" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Read the story" })).toHaveAttribute(
      "href",
      "/story",
    );
  });

  it("handles empty, single, and large event collections", () => {
    const { container, rerender } = render(<TimelineSection items={[]} />);
    expect(container.querySelector("ol")).toBeNull();

    rerender(<TimelineSection items={[events[0]!]} />);
    expect(container.querySelectorAll("ol > li")).toHaveLength(1);

    const manyEvents = Array.from({ length: 80 }, (_, index) => ({
      id: `event-${index}`,
      title: `Event ${index}`,
    }));
    rerender(<TimelineSection items={manyEvents} />);
    expect(container.querySelectorAll("ol > li")).toHaveLength(80);
  });
});
