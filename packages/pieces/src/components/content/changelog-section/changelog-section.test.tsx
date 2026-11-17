import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ChangelogSection } from "./changelog-section";
import type {
  ChangelogRelease,
  ChangelogSectionVariant,
} from "./changelog-section.types";

const variants: ChangelogSectionVariant[] = [
  "timeline",
  "list",
  "cards",
  "grouped",
  "versioned",
  "featured",
  "compact",
  "release-notes",
  "categories",
  "split",
  "vertical",
  "horizontal",
];

const releases: ChangelogRelease[] = [
  {
    id: "v2",
    version: "2.0.0",
    date: "2025-05-12",
    type: "Major",
    description: "A new foundation for thoughtful collaboration.",
    categories: [
      {
        name: "Features",
        changes: ["Added shared editorial workspaces."],
      },
    ],
    href: "/releases/2",
    group: "Spring 2025",
    featured: true,
  },
  {
    id: "v1-4",
    version: "1.4.0",
    date: "2025-03-07",
    type: "Minor",
    categories: [{ name: "Improvements" }],
    group: "Spring 2025",
  },
  {
    id: "v1-3",
    version: "1.3.2",
    date: "2024-12-19",
    type: "Patch",
    categories: [{ name: "Fixes" }],
  },
];

afterEach(cleanup);

describe("ChangelogSection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <ChangelogSection variant={variant} items={releases} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByText("2.0.0")).toBeVisible();
  });

  it("formats dates and renders version links and categorized changes", () => {
    render(<ChangelogSection items={releases} title="Release notes" />);

    expect(screen.getByText("May 12, 2025")).toBeVisible();
    expect(screen.getByRole("link", { name: "2.0.0" })).toHaveAttribute(
      "href",
      "/releases/2",
    );
    expect(screen.getByText("Added shared editorial workspaces.")).toBeVisible();
  });

  it("groups releases by explicit group or year", () => {
    render(<ChangelogSection variant="grouped" items={releases} />);

    expect(screen.getByRole("heading", { name: "Spring 2025" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "2024" })).toBeVisible();
    expect(screen.getAllByRole("list").length).toBeGreaterThanOrEqual(2);
  });

  it("handles empty, single, and large release collections", () => {
    const { container, rerender } = render(<ChangelogSection items={[]} />);
    expect(container.querySelector(".puzzle-changelog-section__items")).toBeNull();

    rerender(<ChangelogSection items={[releases[0]!]} />);
    expect(container.querySelectorAll(".puzzle-changelog-section__items > li")).toHaveLength(1);

    const manyReleases = Array.from({ length: 60 }, (_, index) => ({
      id: `release-${index}`,
      version: `1.0.${index}`,
    }));
    rerender(<ChangelogSection variant="list" items={manyReleases} />);
    expect(
      container.querySelectorAll(".puzzle-changelog-section__items > li"),
    ).toHaveLength(60);
  });
});
