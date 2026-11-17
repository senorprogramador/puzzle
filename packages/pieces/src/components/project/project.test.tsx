import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ProjectCard,
  ProjectGrid,
  ProjectHeader,
  ProjectList,
  ProjectMembers,
  ProjectProgress,
  ProjectStatusBadge,
} from ".";

describe("ProjectStatusBadge", () => {
  it("applies a semantic status tone", () => {
    render(<ProjectStatusBadge label="On track" tone="success" />);

    expect(screen.getByText("On track")).toHaveAttribute("data-tone", "success");
  });
});

describe("ProjectProgress", () => {
  it("renders a labelled progress indicator", () => {
    render(<ProjectProgress label="Delivery" value={64} />);

    expect(screen.getByRole("progressbar", { name: "Delivery" })).toHaveAttribute(
      "aria-valuenow",
      "64",
    );
    expect(screen.getByText("64%")).toBeInTheDocument();
  });
});

describe("ProjectMembers", () => {
  it("renders an empty collection and member names accessibly", () => {
    const { rerender } = render(<ProjectMembers members={[]} />);

    expect(screen.getByRole("list", { name: "Project members" })).toBeEmptyDOMElement();

    rerender(
      <ProjectMembers
        members={[
          {
            id: "member-1",
            name: "Jordan Lee",
            avatar: <img alt="" src="/jordan.png" />,
          },
        ]}
      />,
    );

    expect(screen.getByText("Jordan Lee")).toBeVisible();
  });
});

describe("ProjectCard", () => {
  it("composes project details, linked title, status, progress, and actions", () => {
    render(
      <ProjectCard
        title="Website refresh"
        href="/projects/website"
        description="A redesign for the marketing site."
        status={<ProjectStatusBadge label="In progress" tone="info" />}
        progress={72}
        members={[{ id: "member-1", name: "Jordan Lee" }]}
        actions={<button type="button">Edit project</button>}
      />,
    );

    expect(screen.getByRole("link", { name: "Website refresh" })).toHaveAttribute(
      "href",
      "/projects/website",
    );
    expect(screen.getByText("A redesign for the marketing site.")).toBeVisible();
    expect(screen.getByText("In progress")).toBeVisible();
    expect(screen.getByRole("progressbar", { name: "Progress" })).toHaveAttribute(
      "aria-valuenow",
      "72",
    );
    expect(screen.getByText("Jordan Lee")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Edit project" }),
    ).toBeInTheDocument();
  });
});

describe("Project collections and header", () => {
  it("provides labelled grid and list regions", () => {
    render(
      <>
        <ProjectGrid label="Project grid">
          <ProjectCard title="Alpha" />
        </ProjectGrid>
        <ProjectList label="Project list">
          <ProjectCard title="Beta" />
        </ProjectList>
      </>,
    );

    expect(screen.getByRole("region", { name: "Project grid" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Project list" })).toBeVisible();
  });

  it("renders heading, description, metadata, status, and actions", () => {
    render(
      <ProjectHeader
        title="Website refresh"
        description="A redesign for the marketing site."
        meta={<span>Updated today</span>}
        status={<ProjectStatusBadge label="Active" />}
        actions={<button type="button">Edit</button>}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Website refresh", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Updated today")).toBeVisible();
    expect(screen.getByRole("button", { name: "Edit" })).toBeVisible();
  });
});
