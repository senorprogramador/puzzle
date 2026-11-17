import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";

import { DashboardNavigation } from "./navigation";
import { ProjectCard, ProjectGrid } from "./project";

afterEach(() => {
  cleanup();
});

describe("dashboard composition browser behavior", () => {
  it("supports keyboard navigation through router callbacks", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(
      <DashboardNavigation
        items={[
          { id: "overview", label: "Overview", href: "/workspace" },
          { id: "projects", label: "Projects", href: "/workspace/projects" },
        ]}
        onNavigate={onNavigate}
      />,
    );

    const overview = screen.getByRole("link", { name: "Overview" });
    overview.focus();
    expect(overview).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onNavigate).toHaveBeenCalledWith("/workspace");
  });
});

describe("project collection responsive behavior", () => {
  it("adapts the grid from one to three columns", async () => {
    render(
      <ProjectGrid label="Projects">
        <ProjectCard title="Alpha" />
        <ProjectCard title="Beta" />
        <ProjectCard title="Gamma" />
      </ProjectGrid>,
    );

    const grid = screen.getByRole("region", { name: "Projects" });

    for (const [width, columns] of [
      [390, 1],
      [800, 2],
      [1280, 3],
    ] as const) {
      await page.viewport(width, 800);
      expect(getComputedStyle(grid).gridTemplateColumns.split(" ")).toHaveLength(
        columns,
      );
    }
  });
});
